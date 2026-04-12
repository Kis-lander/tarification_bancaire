import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const bankSignupValidator = vine.create({
  email: email()
    .unique({ table: 'users', column: 'email' })
    .unique({ table: 'pending_bank_registrations', column: 'email' }),
  bankName: vine.string().trim().minLength(2).maxLength(255),
  bankDescription: vine.string().trim().maxLength(2000).optional(),
  addresses: vine
    .string()
    .trim()
    .maxLength(200)
    .regex(/^[^,]+,\s*[^,]+$/),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const bankSignupOtpValidator = vine.create({
  otp: vine.string().trim().fixedLength(6),
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
