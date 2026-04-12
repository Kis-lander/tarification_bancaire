import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PendingBankRegistration extends BaseModel {
  static table = 'pending_bank_registrations'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
