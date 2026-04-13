import Bank from '#models/bank'
import BccUser from '#models/bcc_user'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class MailboxMessage extends BaseModel {
  static table = 'mailbox_messages'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bankId: number

  @column()
  declare bccUserId: number | null

  @column()
  declare senderType: 'BANK' | 'BCC'

  @column()
  declare message: string | null

  @column()
  declare attachmentPath: string | null

  @column()
  declare attachmentName: string | null

  @column()
  declare attachmentExt: string | null

  @belongsTo(() => Bank)
  declare bank: BelongsTo<typeof Bank>

  @belongsTo(() => BccUser)
  declare bccUser: BelongsTo<typeof BccUser>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
