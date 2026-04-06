import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthService {
  async register(data: any) {
    try {
      return await User.create({
        email: data.email,
        password: data.password,
        rule: data.rule || 'BANK',
      })
    } catch (error) {
      throw new Exception('Erreur lors de la création du compte', { status: 400 })
    }
  }

  async login(data: any) {
    try {
      const user = await User.findBy('email', data.email)
      if (!user) return null

      const isValid = await hash.verify(user.password, data.password)
      if (!isValid) return null

      const token = await User.accessTokens.create(user)
      return {
        token: token.value!.release(),
        user: user,
      }
    } catch (error) {
      throw new Exception('Erreur lors de la tentative de connexion', { status: 500 })
    }
  }

  async logout(user: User) {
    try {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return true
    } catch (error) {
      throw new Exception('Erreur lors de la déconnexion', { status: 500 })
    }
  }
}