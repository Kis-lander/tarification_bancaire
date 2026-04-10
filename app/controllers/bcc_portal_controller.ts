import Bank from '#models/bank'
import BccUser from '#models/bcc_user'
import BankService from '#services/bank_service'
import { bccSignupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class BccPortalController {
  constructor(protected bankService: BankService) {}

  async accessPage({ view, auth }: HttpContext) {
    const bccAccount = await BccUser.query().where('role', 'BCC').first()
    const isBccAuthenticated = auth.use('bcc').isAuthenticated
    const bccUser = auth.use('bcc').user

    return view.render('pages/bcc/access', {
      hasBccAccount: !!bccAccount,
      isBccAuthenticated: isBccAuthenticated && bccUser?.role === 'BCC',
    })
  }

  async signupPage({ view }: HttpContext) {
    return view.render('pages/bcc/bccsignup')
  }

  async signup({ request, response, session }: HttpContext) {
    const existingBcc = await BccUser.query().where('role', 'BCC').first()

    if (existingBcc) {
      session.flash('error', 'Le compte BCC existe deja.')
      return response.redirect('/bcc')
    }

    const payload = await request.validateUsing(bccSignupValidator)

    await BccUser.create({
      email: payload.email,
      password: payload.password,
      role: 'BCC',
    })

    session.flash('success', 'Compte BCC cree avec succes.')
    return response.redirect('/bcc/login')
  }

  async loginPage({ view }: HttpContext) {
    return view.render('pages/bcc/bcclogin')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const bccUser = await BccUser.query().where('email', email).first()

    if (!bccUser || !(await hash.verify(bccUser.password, password))) {
      session.flash('error', 'Identifiants BCC incorrects.')
      return response.redirect().back()
    }

    await auth.use('bcc').login(bccUser)
    session.flash('success', "Bienvenue dans l'espace BCC.")

    return response.redirect('/')
  }

  async dashboard({ view }: HttpContext) {
    const banks = await Bank.query().orderBy('createdAt', 'desc')

    return view.render('pages/bcc/bccbanks', {
      banks,
      hideFlashAlerts: true,
    })
  }

  async storeBank({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'description'])

    await this.bankService.createBank(data)
    session.flash('success', 'Banque enregistree avec succes.')

    return response.redirect('/bcc/banks')
  }
}
