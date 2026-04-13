import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import BccUser from '#models/bcc_user'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
    const bccUser = auth.use('bcc').user
    const webUser = auth.use('web').user

    let userRole: string | undefined

    if (bccUser instanceof BccUser) {
      // On force la conversion de null vers undefined avec ??
      userRole = bccUser.role ?? undefined
    } else if (webUser instanceof User) {
      userRole = webUser.rule ?? undefined
    }

    // Vérification : si userRole est undefined, roles.includes renverra false
    if (!userRole || !roles.includes(userRole)) {
      return response.forbidden({ message: 'Accès interdit' })
    }

    await next()
  }
}
