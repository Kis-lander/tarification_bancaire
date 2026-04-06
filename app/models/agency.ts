import { DateTime } from 'luxon'
import { AgencySchema } from '#database/schema'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'

export default class Agency extends AgencySchema {
  static table = 'agencies'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bankId: number | null

  @column()
  declare city: string

  @column()
  declare address: string

  @column()
  declare latitude: string

  @column()
  declare longitude: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Bank)
  declare bank: BelongsTo<typeof Bank>
}
