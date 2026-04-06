import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
    const user = auth.user

    if (!user || !roles.includes(user.role)) {
      return response.forbidden({ message: 'Accès interdit' })
    }

    await next()
  }
}