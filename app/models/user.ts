import { DateTime } from 'luxon'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { UserSchema } from '#database/schema'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'
import Tariff from '#models/tariff'

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
  @belongsTo(() => Bank)
  declare Bank: BelongsTo<typeof Bank>
  
  // Relation : tarifs soumis par cet utilisateur
  @hasMany(() => Tariff, { foreignKey: 'submittedBy' })
  declare submittedTariffs: HasMany<typeof Tariff>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
