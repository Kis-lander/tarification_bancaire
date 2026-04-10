import { DateTime } from 'luxon'
import { ServiceSchema } from '#database/schema'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import ServiceCategory from '#models/service_category'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tariff from '#models/tariff'

export default class Service extends ServiceSchema {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number | null

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare code: string | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ServiceCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ServiceCategory>

  @hasMany(() => Tariff)
  declare tariffs: HasMany<typeof Tariff>
}
