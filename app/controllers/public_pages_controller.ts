import Agency from '#models/agency'
import Bank from '#models/bank'
import Service from '#models/service'
import ServiceCategory from '#models/service_category'
import Tariff from '#models/tariff'
import type { HttpContext } from '@adonisjs/core/http'

export default class PublicPagesController {
  private async getServicesWithCategories() {
    const [services, categories] = await Promise.all([
      Service.query().where('isActive', true).orderBy('name', 'asc'),
      ServiceCategory.query(),
    ])

    const categoriesById = new Map(categories.map((category) => [category.id, category]))

    return services.map((service) => ({
      ...service.serialize(),
      category: service.categoryId ? categoriesById.get(service.categoryId) || null : null,
    }))
  }

  async home({ view }: HttpContext) {
    const [banksCount, agenciesCount, servicesCount, approvedTariffs, latestBanks] = await Promise.all([
      Bank.query().where('isActive', true).count('* as total'),
      Agency.query().count('* as total'),
      Service.query().where('isActive', true).count('* as total'),
      Tariff.query().where('status', 'APPROVED').count('* as total'),
      Bank.query().where('isActive', true).orderBy('createdAt', 'desc').limit(4),
    ])

    return view.render('pages/home', {
      stats: {
        banks: Number(banksCount[0].$extras.total || 0),
        agencies: Number(agenciesCount[0].$extras.total || 0),
        services: Number(servicesCount[0].$extras.total || 0),
        approvedTariffs: Number(approvedTariffs[0].$extras.total || 0),
      },
      latestBanks,
    })
  }

  async banks({ view }: HttpContext) {
    const banks = await Bank.query().where('isActive', true).preload('agencies').orderBy('name', 'asc')

    return view.render('pages/banks', { banks })
  }

  async compare({ view }: HttpContext) {
    const [banks, services] = await Promise.all([
      Bank.query().where('isActive', true).orderBy('name', 'asc'),
      this.getServicesWithCategories(),
    ])

    return view.render('pages/compare', { banks, services })
  }

  async map({ view }: HttpContext) {
    const banks = await Bank.query().where('isActive', true).orderBy('name', 'asc')

    return view.render('pages/map', { banks })
  }

  async history({ view }: HttpContext) {
    const [banks, services] = await Promise.all([
      Bank.query().where('isActive', true).orderBy('name', 'asc'),
      this.getServicesWithCategories(),
    ])

    return view.render('pages/history', { banks, services })
  }

  async analytics({ view }: HttpContext) {
    const [banks, services] = await Promise.all([
      Bank.query().where('isActive', true).orderBy('name', 'asc'),
      this.getServicesWithCategories(),
    ])

    return view.render('pages/analytics', { banks, services })
  }
}
