import { ServiceSchema } from '#database/schema'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import ServiceCategory from '#models/service_category'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tariff from '#models/tariff'

export default class Service extends ServiceSchema {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare name: string

  @belongsTo(() => ServiceCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ServiceCategory>

  @hasMany(() => Tariff)
  declare tariffs: HasMany<typeof Tariff>
}
