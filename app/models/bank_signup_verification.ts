import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BankSignupVerification extends BaseModel {
  static table = 'bank_signup_verifications'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare bankName: string

  @column()
  declare bankDescription: string | null

  @column()
  declare addresses: string | null

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare otpCode: string

  @column.dateTime()
  declare otpExpiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
