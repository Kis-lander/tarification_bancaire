import { DateTime } from 'luxon'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { column } from '@adonisjs/lucid/orm'
import { UserSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'

const AuthFinderUser = withAuthFinder(hash, {
  uids: ['email'],
  passwordColumnName: 'password',
})(UserSchema)

export default class User extends AuthFinderUser {
  static table = 'users'
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare rule: string | null

  declare currentAccessToken?: AccessToken

  // relation
  @hasMany(() => Bank)
  declare banks: HasMany<typeof Bank>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
