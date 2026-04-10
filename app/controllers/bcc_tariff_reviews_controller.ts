import Tariff from '#models/tariff'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class BccTariffReviewsController {
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
    const tariff = await Tariff.findOrFail(params.id)

    tariff.status = 'APPROVED'
    tariff.approvedBy = bccUser.id
    tariff.approvedAt = DateTime.utc()
    tariff.rejectionReason = null
    await tariff.save()

    session.flash('success', 'Tarif approuve avec succes.')
    return response.redirect('/bcc/tariff-reviews')
  }

  async reject({ params, request, response, session }: HttpContext) {
    const tariff = await Tariff.findOrFail(params.id)

    tariff.status = 'REJECTED'
    tariff.approvedBy = null
    tariff.approvedAt = null
    tariff.rejectionReason = request.input('rejectionReason') || 'Tarif rejete par la BCC.'
    await tariff.save()

    session.flash('success', 'Tarif rejete avec succes.')
    return response.redirect('/bcc/tariff-reviews')
  }
}
