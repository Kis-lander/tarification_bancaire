import { DateTime } from 'luxon'
import { TariffSchema } from '#database/schema'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'
import Service from '#models/service'

export default class Tariff extends TariffSchema {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bankId: number

  @column()
  declare serviceId: number

  @column()
  declare amount: string

  @column()
  declare currency: string

  @column()
  declare status: 'PENDING' | 'APPROVED' | 'REJECTED'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Bank)
  declare bank: BelongsTo<typeof Bank>

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>
}
