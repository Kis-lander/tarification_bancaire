import Service from '#models/service'
import Tariff from '#models/tariff'
import type { HttpContext } from '@adonisjs/core/http'

export default class BankTariffsController {
  async index({ auth, view, response, request, session }: HttpContext) {
    const user = auth.use('web').user!

    if (!user.bankId) {
      session.flash('error', 'Ce compte banque nest rattache a aucune banque.')
      return response.redirect('/')
    }

    const [services, tariffs] = await Promise.all([
      Service.query().where('isActive', true).orderBy('name', 'asc'),
      Tariff.query()
        .where('bankId', user.bankId)
        .preload('service')
        .orderBy('createdAt', 'desc'),
    ])

    const latestApprovedTariffs = tariffs.filter(
      (tariff, index, items) =>
        tariff.status === 'APPROVED' && items.findIndex((item) => item.serviceId === tariff.serviceId && item.status === 'APPROVED') === index
    )

    const latestPendingTariffs = tariffs.filter(
      (tariff, index, items) =>
        tariff.status === 'PENDING' && items.findIndex((item) => item.serviceId === tariff.serviceId && item.status === 'PENDING') === index
    )

    return view.render('pages/bank/tariffs', {
      services,
      tariffs,
      latestApprovedTariffs,
      latestPendingTariffs,
      draftTariff: {
        serviceId: String(request.input('serviceId', '')),
        amount: String(request.input('amount', '')),
        currency: String(request.input('currency', 'CDF')),
      },
      isEditingTariff: !!request.input('serviceId'),
      user,
      hideFlashAlerts: true,
    })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.use('web').user!

    if (!user.bankId) {
      session.flash('error', 'Ce compte banque nest rattache a aucune banque.')
      return response.redirect('/bank/tariffs')
    }

    const data = request.only(['serviceId', 'amount', 'currency'])
    const serviceId = Number(data.serviceId)

    const existingPendingTariff = await Tariff.query()
      .where('bankId', user.bankId)
      .where('serviceId', serviceId)
      .where('status', 'PENDING')
      .orderBy('updatedAt', 'desc')
      .first()

    if (existingPendingTariff) {
      existingPendingTariff.amount = String(data.amount)
      existingPendingTariff.currency = data.currency || existingPendingTariff.currency || 'CDF'
      await existingPendingTariff.save()

      session.flash('success', 'La demande de tarification en attente a ete mise a jour et reste soumise a la validation BCC.')
      return response.redirect('/bank/tariffs')
    }

    await Tariff.create({
      bankId: user.bankId,
      serviceId,
      amount: String(data.amount),
      currency: data.currency || 'CDF',
      status: 'PENDING',
      submittedBy: user.id,
    })

    session.flash('success', 'Tarif soumis a la validation BCC.')
    return response.redirect('/bank/tariffs')
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.use('web').user!
    const tariff = await Tariff.findOrFail(params.id)

    if (tariff.bankId !== user.bankId || tariff.status !== 'PENDING') {
      session.flash('error', 'Seuls vos tarifs en attente peuvent etre modifies.')
      return response.redirect('/bank/tariffs')
    }

    const data = request.only(['amount', 'currency'])
    tariff.amount = String(data.amount)
    tariff.currency = data.currency || tariff.currency
    await tariff.save()

    session.flash('success', 'Tarif mis a jour avec succes.')
    return response.redirect('/bank/tariffs')
  }
}

