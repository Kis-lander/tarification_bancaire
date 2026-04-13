import Service from '#models/service'
import type { HttpContext } from '@adonisjs/core/http'

export default class BccServicesController {
  async index({ view }: HttpContext) {
    const services = await Service.query().orderBy('createdAt', 'desc')

    return view.render('pages/bcc/services', {
      services,
      hideFlashAlerts: true,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'code', 'description'])

    await Service.create({
      name: data.name,
      code: data.code || null,
      description: data.description || null,
      isActive: true,
      categoryId: null,
    })

    session.flash('success', 'Service cree avec succes.')
    return response.redirect('/bcc/services')
  }
}
