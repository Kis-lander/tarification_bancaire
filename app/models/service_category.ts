import { ServiceCategorySchema } from '#database/schema'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Service from '#models/service'

export default class ServiceCategory extends ServiceCategorySchema {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>
}
