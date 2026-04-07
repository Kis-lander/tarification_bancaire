import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tariffs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('bank_id')
        .unsigned()
        .references('id')
        .inTable('banks')
        .onDelete('CASCADE')

      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

      table.decimal('amount', 10, 2).notNullable()
      table.string('currency').defaultTo('USD')

      // 🔥 validation banque centrale
      table.enum('status', ['PENDING', 'APPROVED', 'REJECTED']).defaultTo('PENDING')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}