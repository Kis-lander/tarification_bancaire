import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BccAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * 1. On force l'utilisation du guard 'bcc'
     * Cela permet à TypeScript de savoir que l'utilisateur est un BccUser
     */
    const authenticator = ctx.auth.use('bcc')

    // 2. Vérification de l'authentification
    if (!(await authenticator.check())) {
      ctx.session.flash('error', 'Accès restreint aux administrateurs BCC.')
      return ctx.response.redirect('/bcc/login')
    }

    /**
     * 3. Accès à la propriété 'role'
     * Puisque nous utilisons le guard 'bcc', authenticator.user est typé comme BccUser.
     * TS ne cherchera plus 'role' dans le modèle 'User'.
     */
    if (authenticator.user?.role !== 'BCC') {
      ctx.session.flash('error', 'Droits insuffisants.')
      return ctx.response.redirect('/bcc/login')
    }

    return next()
  }
}
