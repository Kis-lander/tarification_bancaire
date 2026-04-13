import Bank from '#models/bank'
import MailboxMessage from '#models/mailbox_message'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const ALLOWED_ATTACHMENT_EXTENSIONS = ['pdf', 'docx']

export default class MailboxController {
  private getAttachmentPublicUrl(filePath: string | null) {
    if (!filePath) {
      return null
    }

    return `/${filePath.replace(/\\/g, '/')}`
  }

  private async getMailboxContext({ auth, request, response, session }: HttpContext) {
    const currentBccUser = auth.use('bcc').user
    const currentUser = auth.use('web').user
    const isBcc = !!currentBccUser && currentBccUser.role === 'BCC'
    const isBank = !!currentUser && currentUser.rule === 'BANK'

    if (!isBcc && !isBank) {
      session.flash('error', 'Acces reserve aux comptes BCC et BANK.')
      return response.redirect('/')
    }

    if (isBank && !currentUser.bankId) {
      session.flash('error', 'Ce compte BANK nest rattache a aucune banque.')
      return response.redirect('/')
    }

    const banks = isBcc
      ? await Bank.query().where('isActive', true).orderBy('name', 'asc')
      : []

    const selectedBankId = isBcc
      ? Number(request.input('bankId', request.qs().bankId || banks[0]?.id || 0))
      : Number(currentUser!.bankId)

    const selectedBank = selectedBankId ? await Bank.find(selectedBankId) : null

    if (!selectedBank) {
      return {
        isBcc,
        isBank,
        banks,
        selectedBank: null,
        selectedBankId: 0,
        currentBccUser,
        currentUser,
      }
    }

    return {
      isBcc,
      isBank,
      banks,
      selectedBank,
      selectedBankId,
      currentBccUser,
      currentUser,
    }
  }

  async index(ctx: HttpContext) {
    const mailbox = await this.getMailboxContext(ctx)
    if (!mailbox || 'redirected' in ctx.response) {
      return
    }

    const messages = mailbox.selectedBank
      ? await MailboxMessage.query()
          .where('bankId', mailbox.selectedBank.id)
          .preload('bccUser')
          .orderBy('createdAt', 'asc')
      : []

    const formattedMessages = messages.map((message) => ({
      ...message.serialize(),
      attachmentUrl: this.getAttachmentPublicUrl(message.attachmentPath),
      senderLabel:
        message.senderType === 'BCC'
          ? mailbox.currentBccUser?.email || message.bccUser?.email || 'BCC'
          : mailbox.selectedBank?.name || 'Banque',
      sentAt: DateTime.fromJSDate(message.createdAt.toJSDate()).toFormat('dd LLL yyyy - HH:mm'),
    }))

    return ctx.view.render('pages/mailbox', {
      ...mailbox,
      messages: formattedMessages,
      hideFlashAlerts: true,
    })
  }

  async store(ctx: HttpContext) {
    const mailbox = await this.getMailboxContext(ctx)
    if (!mailbox || 'redirected' in ctx.response) {
      return
    }

    if (!mailbox.selectedBank) {
      ctx.session.flash('error', 'Selectionnez une banque pour utiliser la messagerie.')
      return ctx.response.redirect('/mailbox')
    }

    const messageBody = String(ctx.request.input('message', '')).trim()
    const attachment = ctx.request.file('attachment', {
      size: '20mb',
      extnames: ALLOWED_ATTACHMENT_EXTENSIONS,
    })

    if (!messageBody && !attachment) {
      ctx.session.flash('error', 'Saisissez un message ou ajoutez un document PDF/DOCX.')
      return ctx.response.redirect().back()
    }

    if (attachment?.isValid === false) {
      ctx.session.flash('error', 'Le document doit etre un fichier PDF ou DOCX valide.')
      return ctx.response.redirect().back()
    }

    let attachmentPath: string | null = null
    let attachmentName: string | null = null
    let attachmentExt: string | null = null

    if (attachment) {
      const uploadDirectory = app.makePath('public', 'uploads', 'mailbox')
      await mkdir(uploadDirectory, { recursive: true })

      const generatedName = `${Date.now()}-${randomUUID()}.${attachment.extname}`
      await attachment.move(uploadDirectory, {
        name: generatedName,
      })

      attachmentPath = `uploads/mailbox/${generatedName}`
      attachmentName = attachment.clientName
      attachmentExt = attachment.extname || null
    }

    await MailboxMessage.create({
      bankId: mailbox.selectedBank.id,
      bccUserId: mailbox.isBcc ? mailbox.currentBccUser!.id : null,
      senderType: mailbox.isBcc ? 'BCC' : 'BANK',
      message: messageBody || null,
      attachmentPath,
      attachmentName,
      attachmentExt,
    })

    ctx.session.flash('success', 'Message envoye avec succes.')

    const redirectUrl = mailbox.isBcc
      ? `/mailbox?bankId=${mailbox.selectedBank.id}`
      : '/mailbox'

    return ctx.response.redirect(redirectUrl)
  }
}
