import Bank from '#models/bank'
import User from '#models/user'
import EmailService from '#services/email_service'
import { bankAccountUpdateValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class BankAccountController {
  constructor(protected emailService: EmailService) {}

  async edit({ auth, view, response, session }: HttpContext) {
    const user = auth.use('web').user!

    if (user.rule !== 'BANK' || !user.bankId) {
      session.flash('error', 'Ce compte BANK nest rattache a aucune banque.')
      return response.redirect('/')
    }

    const bank = await Bank.findOrFail(user.bankId)

    return view.render('pages/bank/account', {
      bank,
      account: user,
      hideFlashAlerts: true,
    })
  }

  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.use('web').user!

    if (user.rule !== 'BANK' || !user.bankId) {
      session.flash('error', 'Ce compte BANK nest rattache a aucune banque.')
      return response.redirect('/')
    }

    const payload = await request.validateUsing(bankAccountUpdateValidator)
    const oldPasswordValue = payload.oldPassword?.trim() || ''
    const newPasswordValue = payload.newPassword?.trim() || ''

    if ((oldPasswordValue && !newPasswordValue) || (!oldPasswordValue && newPasswordValue)) {
      session.flash(
        'error',
        'Pour modifier le mot de passe, renseignez a la fois l ancien et le nouveau mot de passe.'
      )
      return response.redirect().back()
    }

    const normalizedEmail = payload.email.trim().toLowerCase()
    const normalizedAddresses = payload.addresses
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(', ')

    const emailOwner = await User.query()
      .whereRaw('LOWER(email) = LOWER(?)', [normalizedEmail])
      .whereNot('id', user.id)
      .first()

    if (emailOwner) {
      session.flash('error', 'Cette adresse email est deja utilisee par un autre compte.')
      return response.redirect().back()
    }

    const bank = await Bank.findOrFail(user.bankId)
    const updatedFields: string[] = []

    if (oldPasswordValue && newPasswordValue) {
      let isOldPasswordValid = false

      try {
        isOldPasswordValid = await hash.verify(user.password, oldPasswordValue)
      } catch {
        isOldPasswordValid = user.password === oldPasswordValue
      }

      if (!isOldPasswordValid) {
        session.flash('error', 'L ancien mot de passe saisi est incorrect.')
        return response.redirect().back()
      }
    }

    if (user.email !== normalizedEmail) {
      updatedFields.push('Adresse email du compte')
    }

    if ((user.addresses || '') !== normalizedAddresses) {
      updatedFields.push('Ville et pays')
    }

    user.email = normalizedEmail
    user.addresses = normalizedAddresses

    if (oldPasswordValue && newPasswordValue) {
      user.password = newPasswordValue
      updatedFields.push('Mot de passe')
    }

    if (bank.name !== payload.bankName.trim()) {
      updatedFields.push('Nom de la banque')
    }
    bank.name = payload.bankName.trim()

    if ((bank.description || '') !== (payload.bankDescription?.trim() || '')) {
      updatedFields.push('Description de la banque')
    }
    bank.description = payload.bankDescription?.trim() || null

    await bank.save()
    await user.save()
    await this.emailService.sendBankAccountUpdated(
      normalizedEmail,
      bank.name,
      updatedFields.length ? updatedFields : ['Informations du compte']
    )

    session.flash('success', 'Les informations du compte banque ont ete mises a jour.')
    return response.redirect('/bank/account')
  }
}
