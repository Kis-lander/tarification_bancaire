import BankSignupVerification from '#models/bank_signup_verification'
import PendingBankRegistration from '#models/pending_bank_registration'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
  /**
   * Display the login page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login', {
      hideFlashAlerts: true,
    })
  }

  /**
   * Authenticate user credentials and create a new session
   */
  async store({ request, auth, response, session }: HttpContext) {
    const email = String(request.input('email', '')).trim().toLowerCase()
    const password = String(request.input('password', ''))
    let user: User

    try {
      user = await User.verifyCredentials(email, password)
    } catch {
      const existingUser = await User.findBy('email', email)

      if (!existingUser) {
        const [pendingRegistration, pendingVerification] = await Promise.all([
          PendingBankRegistration.findBy('email', email),
          BankSignupVerification.findBy('email', email),
        ])

        if (pendingVerification) {
          session.flash(
            'error',
            'Votre inscription est en cours de verification OTP. Consultez votre email puis validez le code recu.'
          )
          session.flash('email', email)
          return response.redirect('/signup/verify')
        }

        if (pendingRegistration) {
          session.flash(
            'error',
            'Votre demande de compte banque a bien ete recue et reste en attente de validation par la BCC.'
          )
          session.flash('email', email)
          return response.redirect().back()
        }

        session.flash('error', 'Identifiants incorrects.')
        session.flash('email', email)
        return response.redirect().back()
      }

      const isLegacyPasswordValid = existingUser.password === password

      if (!isLegacyPasswordValid) {
        session.flash('error', 'Identifiants incorrects.')
        session.flash('email', email)
        return response.redirect().back()
      }

      const hashedPassword = await hash.make(password)
      await db
        .from('users')
        .where('id', existingUser.id)
        .update({ password: hashedPassword, updated_at: DateTime.now().toSQL() })

      user = await User.findOrFail(existingUser.id)
    }

    if (await auth.use('bcc').check()) {
      await auth.use('bcc').logout()
    }

    if (await auth.use('web').check()) {
      await auth.use('web').logout()
    }

    await auth.use('web').login(user)

    if (user.rule === 'BANK' && !user.bankId) {
      session.flash(
        'error',
        'Votre compte BANK est connecte, mais il nest rattache a aucune banque. Veuillez demander a la BCC de vous affecter une banque.'
      )
      return response.redirect().toRoute('home')
    }

    return response.redirect().toRoute('home')
  }

  /**
   * Log out the current user and destroy their session
   */
  async destroy({ auth, response }: HttpContext) {
    if (await auth.use('bcc').check()) {
      await auth.use('bcc').logout()
    } else if (await auth.use('web').check()) {
      await auth.use('web').logout()
    }

    response.redirect('/login')
  }
}
