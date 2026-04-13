import Tariff from '#models/tariff'
import EmailService from '#services/email_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class BccTariffReviewsController {
  constructor(protected emailService: EmailService) {}

  async index({ view }: HttpContext) {
    const [pendingTariffs, reviewedTariffs] = await Promise.all([
      Tariff.query()
        .where('status', 'PENDING')
        .preload('bank')
        .preload('service')
        .preload('author')
        .orderBy('createdAt', 'desc'),
      Tariff.query()
        .whereIn('status', ['APPROVED', 'REJECTED'])
        .preload('bank')
        .preload('service')
        .preload('author')
        .preload('validator')
        .orderBy('updatedAt', 'desc')
        .limit(20),
    ])

    return view.render('pages/bcc/tariff_reviews', {
      pendingTariffs,
      reviewedTariffs,
      hideFlashAlerts: true,
    })
  }

  async approve({ auth, params, response, session }: HttpContext) {
    const bccUser = auth.use('bcc').user!
    const tariff = await Tariff.query()
      .where('id', params.id)
      .preload('bank')
      .preload('service')
      .preload('author')
      .firstOrFail()

    tariff.status = 'APPROVED'
    tariff.approvedBy = bccUser.id
    tariff.approvedAt = DateTime.utc()
    tariff.rejectionReason = null
    await tariff.save()

    let successMessage = 'Tarif approuve avec succes.'

    if (tariff.author?.email) {
      try {
        await this.emailService.sendTariffReviewDecision(
          tariff.author.email,
          tariff.bank?.name || 'Banque inconnue',
          tariff.service?.name || 'Service inconnu',
          tariff.amount,
          tariff.currency,
          true
        )
        successMessage = 'Tarif approuve avec succes et email envoye a la banque.'
      } catch (error) {
        console.error('Unable to send tariff approval email', error)
        successMessage =
          'Tarif approuve avec succes, mais lemail na pas pu etre envoye a la banque.'
      }
    }

    session.flash('success', successMessage)
    return response.redirect('/bcc/tariff-reviews')
  }

  async reject({ params, request, response, session }: HttpContext) {
    const tariff = await Tariff.query()
      .where('id', params.id)
      .preload('bank')
      .preload('service')
      .preload('author')
      .firstOrFail()

    tariff.status = 'REJECTED'
    tariff.approvedBy = null
    tariff.approvedAt = null
    tariff.rejectionReason = request.input('rejectionReason') || 'Tarif rejete par la BCC.'
    await tariff.save()

    let successMessage = 'Tarif rejete avec succes.'

    if (tariff.author?.email) {
      try {
        await this.emailService.sendTariffReviewDecision(
          tariff.author.email,
          tariff.bank?.name || 'Banque inconnue',
          tariff.service?.name || 'Service inconnu',
          tariff.amount,
          tariff.currency,
          false,
          tariff.rejectionReason
        )
        successMessage = 'Tarif rejete avec succes et email envoye a la banque.'
      } catch (error) {
        console.error('Unable to send tariff rejection email', error)
        successMessage = 'Tarif rejete avec succes, mais lemail na pas pu etre envoye a la banque.'
      }
    }

    session.flash('success', successMessage)
    return response.redirect('/bcc/tariff-reviews')
  }
}
