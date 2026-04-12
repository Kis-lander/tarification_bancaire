import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import hash from '@adonisjs/core/services/hash'

type RegisterPayload = {
  email: string
  password: string
  rule?: string | null
}

type LoginPayload = {
  email: string
  password: string
}

export default class AuthService {
  async register(data: RegisterPayload) {
    try {
      return await User.create({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        rule: data.rule || 'BANK',
      })
    } catch {
      throw new Exception('Erreur lors de la creation du compte', { status: 400 })
    }
  }

  async login(data: LoginPayload) {
    try {
      const user = await User.findBy('email', data.email.trim().toLowerCase())
      if (!user) {
        return null
      }

      const isValid = await hash.verify(user.password, data.password)
      if (!isValid) {
        return null
      }

      const token = await User.accessTokens.create(user)

      return {
        token: token.value?.release(),
        user,
      }
    } catch {
      throw new Exception('Erreur lors de la tentative de connexion', { status: 500 })
    }
  }

  async logout(user: User) {
    try {
      if (user.currentAccessToken) {
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
        return true
      }

      await User.accessTokens.deleteAll(user)
      return true
    } catch {
      throw new Exception('Erreur lors de la deconnexion', { status: 500 })
    }
  } 
}
