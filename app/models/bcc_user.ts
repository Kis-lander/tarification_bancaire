import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Tariff from '#models/tariff'

export default class BccUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(user: BccUser) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
  // Relation : Un agent BCC peut avoir validé plusieurs tarifs
  @hasMany(() => Tariff, { foreignKey: 'approvedBy' })
  declare approvedTariffs: HasMany<typeof Tariff>
}