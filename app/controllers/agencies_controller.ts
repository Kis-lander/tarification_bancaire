import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AgencyService from '#services/agency_service'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class AgenciesController {
  constructor(protected agencyService: AgencyService) {}

  async index({ response }: HttpContext) {
    try {
      const agencies = await this.agencyService.getAll()
      return response.ok(agencies)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({ message: err.message })
    }
  }

  async byBank({ params, response }: HttpContext) {
    try {
      const agencies = await this.agencyService.getByBank(Number(params.bankId))
      return response.ok(agencies)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 404).send({ message: err.message })
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const data = request.only(['bankId', 'city', 'address', 'latitude', 'longitude'])
      const agency = await this.agencyService.create(data, user.id)
      return response.created(agency)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const data = request.only(['city', 'address', 'latitude', 'longitude'])
      const agency = await this.agencyService.update(Number(params.id), data, user.id)
      return response.ok(agency)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      await this.agencyService.delete(Number(params.id), user.id)
      return response.ok({ message: 'Agence supprimee avec succes' })
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }
}
