import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { BankSchema } from '#database/schema'

export default class Bank extends BankSchema {
    static table = 'banks'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare description: string | null

    @column()
    declare userId: number

    @column()
    declare isActive: boolean

    // relation
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}