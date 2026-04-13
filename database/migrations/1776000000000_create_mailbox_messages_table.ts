import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mailbox_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('bank_id')
        .unsigned()
        .references('id')
        .inTable('banks')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('bcc_user_id')
        .unsigned()
        .references('id')
        .inTable('bcc_users')
        .onDelete('SET NULL')
        .nullable()
      table.string('sender_type', 10).notNullable()
      table.text('message').nullable()
      table.string('attachment_path').nullable()
      table.string('attachment_name').nullable()
      table.string('attachment_ext', 10).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
