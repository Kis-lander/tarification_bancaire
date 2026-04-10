import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await Promise.allSettled([ctx.auth.use('web').check(), ctx.auth.use('bcc').check()])

    const webUser = ctx.auth.use('web').user
    const bccUser = ctx.auth.use('bcc').user

    ctx.view.share({
      currentUser: webUser,
      currentBccUser: bccUser,
      isBccAuthenticated: !!bccUser && bccUser.role === 'BCC',
    })

    return next()
  }
}
