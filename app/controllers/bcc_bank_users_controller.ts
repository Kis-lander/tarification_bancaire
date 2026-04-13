import Bank from '#models/bank'
import PendingBankRegistration from '#models/pending_bank_registration'
import User from '#models/user'
import EmailService from '#services/email_service'
import { bccBankUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

@inject()
export default class BccBankUsersController {
  constructor(protected emailService: EmailService) {}

  async index({ view }: HttpContext) {
    const [banks, bankUsers, pendingRegistrations] = await Promise.all([
      Bank.query().where('isActive', true).orderBy('name', 'asc'),
      User.query().preload('bank').orderBy('createdAt', 'desc'),
      PendingBankRegistration.query().orderBy('createdAt', 'desc'),
    ])

    return view.render('pages/bcc/bank_users', {
      banks,
      bankUsers,
      pendingRegistrations,
      hideFlashAlerts: true,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(bccBankUserValidator)

    await User.create({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      rule: 'BANK',
      bankId: payload.bankId,
    })

    session.flash('success', 'Compte banque cree avec succes.')
    return response.redirect('/bcc/bank-users')
  }

  async approve({ params, response, session }: HttpContext) {
    const registration = await PendingBankRegistration.findOrFail(params.id)

    const existingBank = await Bank.query()
      .whereRaw('LOWER(name) = LOWER(?)', [registration.bankName])
      .first()

    const bank =
      existingBank ||
      (await Bank.create({
        name: registration.bankName,
        description: registration.bankDescription,
        isActive: true,
      }))

    if (
      existingBank &&
      registration.bankDescription &&
      existingBank.description !== registration.bankDescription
    ) {
      existingBank.description = registration.bankDescription
      await existingBank.save()
    }

    const now = DateTime.now().toSQL()

    // `User` hashes passwords automatically via withAuthFinder.
    // The pending registration already stores a hashed password, so we insert it as-is.
    await db.table('users').insert({
      email: registration.email.trim().toLowerCase(),
      password: registration.password,
      rule: 'BANK',
      bank_id: bank.id,
      addresses: registration.addresses,
      created_at: now,
      updated_at: now,
    })

    await registration.delete()
    await this.emailService.sendBankApprovalDecision(
      registration.email,
      registration.bankName,
      true
    )

    session.flash('success', 'Demande BANK approuvee avec succes.')
    return response.redirect('/bcc/bank-users')
  }

  async reject({ params, response, session }: HttpContext) {
    const registration = await PendingBankRegistration.findOrFail(params.id)
    await this.emailService.sendBankApprovalDecision(
      registration.email,
      registration.bankName,
      false
    )
    await registration.delete()

    session.flash('success', 'Demande BANK invalidee et supprimee.')
    return response.redirect('/bcc/bank-users')
  }
}
