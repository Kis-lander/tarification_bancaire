import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import { UserSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'

export default class User extends UserSchema {
static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare rule: string

  // relation
  @hasMany(() => Bank)
  declare banks: HasMany<typeof Bank>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}