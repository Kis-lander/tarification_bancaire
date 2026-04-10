import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tariffs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.decimal('amount', 12, 2).notNullable()
      table.string('currency').defaultTo('CDF')
      table.enum('status', ['PENDING', 'APPROVED', 'REJECTED']).defaultTo('PENDING')
      
      // Relations
      table.integer('bank_id').unsigned().references('id').inTable('banks').onDelete('CASCADE')
      table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE')
      table.integer('submitted_by').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.integer('approved_by').unsigned().references('id').inTable('bcc_users').onDelete('SET NULL')

      table.timestamp('approved_at').nullable()
      table.text('rejection_reason').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}