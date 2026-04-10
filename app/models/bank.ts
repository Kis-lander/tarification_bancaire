import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Agency from '#models/agency'
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

    // relations
    @hasMany(() => User)
    declare users: HasMany<typeof User>

    @hasMany(() => Agency)
    declare agencies: HasMany<typeof Agency>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}