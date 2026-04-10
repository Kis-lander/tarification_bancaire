import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

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
    return view.render('pages/auth/login')
  }

  /**
   * Authenticate user credentials and create a new session
   */
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()
    let user: User

    try {
      user = await User.verifyCredentials(email, password)
    } catch {
      const existingUser = await User.findBy('email', email)

      if (!existingUser) {
        throw new Error('Invalid credentials')
      }

      const isLegacyPasswordValid = existingUser.password === password

      if (!isLegacyPasswordValid) {
        throw new Error('Invalid credentials')
      }

      existingUser.password = await hash.make(password)
      await existingUser.save()
      user = existingUser
    }

    await auth.use('web').login(user)

    if (user.rule === 'BCC') {
      return response.redirect('/bcc/banks')
    }

    response.redirect().toRoute('home')
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
