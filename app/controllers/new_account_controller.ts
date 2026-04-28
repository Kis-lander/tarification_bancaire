import BankSignupVerification from '#models/bank_signup_verification'
import PendingBankRegistration from '#models/pending_bank_registration'
import EmailService from '#services/email_service'
import { bankSignupOtpValidator, bankSignupValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'

@inject()
export default class NewAccountController {
  constructor(protected emailService: EmailService) {}

  private normalizeCountryAddress(address: string) {
    return (
      address
        .split(/[,;\n\r]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .pop() || ''
    )
  }

  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  async verifyPage({ view, session, response }: HttpContext) {
    const verificationEmail = session.get('pendingSignupVerificationEmail')

    if (!verificationEmail) {
      return response.redirect('/signup')
    }

    return view.render('pages/auth/verify_signup_otp', {
      verificationEmail,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(bankSignupValidator)
    const normalizedEmail = payload.email.trim().toLowerCase()
    const otp = String(randomInt(100000, 1000000))
    const normalizedAddresses = this.normalizeCountryAddress(payload.addresses)

    const verification = await BankSignupVerification.firstOrNew({ email: normalizedEmail })
    verification.email = normalizedEmail
    verification.bankName = payload.bankName
    verification.bankDescription = payload.bankDescription || null
    verification.addresses = normalizedAddresses
    verification.password = await hash.make(payload.password)
    verification.otpCode = await hash.make(otp)
    verification.otpExpiresAt = DateTime.now().plus({ minutes: 10 })
    await verification.save()

    await this.emailService.sendBankSignupOtp(normalizedEmail, otp)

    session.put('pendingSignupVerificationEmail', normalizedEmail)

    if (await auth.use('web').check()) {
      await auth.use('web').logout()
    }

    if (await auth.use('bcc').check()) {
      await auth.use('bcc').logout()
    }

    session.flash('success', 'Un code OTP de 6 chiffres vous a ete envoye par email.')
    return response.redirect('/signup/verify')
  }

  async verifyOtp({ request, response, session }: HttpContext) {
    const verificationEmail = session.get('pendingSignupVerificationEmail')

    if (!verificationEmail) {
      session.flash('error', 'Aucune verification OTP en cours.')
      return response.redirect('/signup')
    }

    const payload = await request.validateUsing(bankSignupOtpValidator)
    const verification = await BankSignupVerification.findBy('email', verificationEmail)

    if (!verification || verification.otpExpiresAt < DateTime.now()) {
      session.forget('pendingSignupVerificationEmail')
      session.flash('error', 'Votre code OTP a expire. Veuillez recommencer.')
      return response.redirect('/signup')
    }

    const isOtpValid = await hash.verify(verification.otpCode, payload.otp)

    if (!isOtpValid) {
      session.flash('error', 'Veuillez taper le vrai code.')
      return response.redirect().back()
    }

    await PendingBankRegistration.updateOrCreate(
      { email: verification.email },
      {
        email: verification.email,
        bankName: verification.bankName,
        bankDescription: verification.bankDescription,
        addresses: verification.addresses,
        password: verification.password,
      }
    )

    await verification.delete()
    session.forget('pendingSignupVerificationEmail')
    session.flash('success', 'Vos informations sont envoyees avec succes.')
    return response.redirect('/signup')
  }
}
