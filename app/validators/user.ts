import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const bankSignupValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  rule: vine.literal('BANK'),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const bccSignupValidator = vine.create({
  email: email().unique({ table: 'bcc_users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const bccBankUserValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  bankId: vine.number().positive(),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
