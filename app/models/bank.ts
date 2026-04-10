import { DateTime } from 'luxon'
import { column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Agency from '#models/agency'
import { BankSchema } from '#database/schema'
import Tariff from '#models/tariff'

export default class Bank extends BankSchema {
    static table = 'banks'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare description: string | null

    @column()
    declare isActive: boolean

    // relations
    @hasMany(() => User)
    declare users: HasMany<typeof User>

    @hasMany(() => Tariff)
    declare tariffs: HasMany<typeof Tariff>

    @hasMany(() => Agency)
    declare agencies: HasMany<typeof Agency>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
