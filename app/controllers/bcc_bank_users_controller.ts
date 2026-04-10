import Bank from '#models/bank'
import User from '#models/user'
import { bccBankUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class BccBankUsersController {
  async index({ view }: HttpContext) {
    const [banks, bankUsers] = await Promise.all([
      Bank.query().where('isActive', true).orderBy('name', 'asc'),
      User.query().preload('bank').orderBy('createdAt', 'desc'),
    ])

    return view.render('pages/bcc/bank_users', {
      banks,
      bankUsers,
      hideFlashAlerts: true,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(bccBankUserValidator)

    await User.create({
      email: payload.email,
      password: await hash.make(payload.password),
      rule: 'BANK',
      bankId: payload.bankId,
    })

    session.flash('success', 'Compte banque cree avec succes.')
    return response.redirect('/bcc/bank-users')
  }
}

