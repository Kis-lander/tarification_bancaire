import { DateTime } from 'luxon'
import { TariffSchema } from '#database/schema'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'
import Service from '#models/service'
import User from '#models/user'
import BccUser from '#models/bcc_user'

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

  @column()
  declare submittedBy: number | null

  @column()
  declare approvedBy: number | null

  @column()
  declare rejectionReason: string | null

  @column.dateTime()
  declare approvedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Bank)
  declare bank: BelongsTo<typeof Bank>

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @belongsTo(() => User, { foreignKey: 'submittedBy' })
  declare author: BelongsTo<typeof User>

  @belongsTo(() => BccUser, { foreignKey: 'approvedBy' })
  declare validator: BelongsTo<typeof BccUser>
}
