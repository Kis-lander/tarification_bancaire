import type { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
    const user = auth.user

    if (!user || !user.rule || !roles.includes(user.rule)) {
      return response.forbidden({ message: 'Acces interdit' })
    }

    await next()
  }
}
