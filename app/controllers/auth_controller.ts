import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import User from '#models/user'
import BccUser from '#models/bcc_user'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async register({ request, response }: HttpContext) {
    try {
      // On garde 'rule' ici car c'est pour la table users classique
      const data = request.only(['email', 'password', 'rule'])
      const user = await this.authService.register(data)
      return response.created(user)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({
        message: err.message ?? "Une erreur est survenue lors de l'inscription"
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const result = await this.authService.login(data)

      if (!result) {
        return response.unauthorized({ message: 'Identifiants invalides' })
      }

      /**
       * GESTION EXPLICITE DES DEUX TYPES D'UTILISATEURS
       */
      if (result instanceof User) {
        // Connexion pour un utilisateur standard (Banque, etc.)
        await auth.use('web').login(result)
      } 
      else if (result instanceof BccUser) {
        // Connexion pour l'admin BCC
        await auth.use('bcc').login(result)
      }

      return response.ok({
        message: 'Connexion réussie',
        user: result
      })

    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({
        message: err.message ?? 'Erreur de serveur'
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      // On vérifie quel guard est actuellement utilisé pour déconnecter correctement
      if (await auth.use('bcc').check()) {
        await auth.use('bcc').logout()
      } else if (await auth.use('web').check()) {
        await auth.use('web').logout()
      }

      return response.ok({ message: 'Déconnecté avec succès' })
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la déconnexion' })
    }
  }
}