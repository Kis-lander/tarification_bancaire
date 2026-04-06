import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async register({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password', 'rule'])
      const user = await this.authService.register(data)
      return response.created(user)
    } catch (error) {
      return response.status(error.status || 500).send({
        message: error.message || 'Une erreur est survenue lors de l\'inscription'
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const result = await this.authService.login(data)

      if (!result) {
        return response.unauthorized({ message: 'Identifiants invalides' })
      }

      return response.ok(result)
    } catch (error) {
      return response.status(error.status || 500).send({
        message: error.message || 'Erreur de serveur'
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await this.authService.logout(user)
      return response.ok({ message: 'Déconnecté avec succès' })
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la déconnexion' })
    }
  }
}