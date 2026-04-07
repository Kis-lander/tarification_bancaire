import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AnalyticsService from '#services/analytics_service'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class AnalyticController {
  constructor(protected analyticsService: AnalyticsService) {}

  async evolution({ request, response }: HttpContext) {
    try {
      const { bankId, serviceId } = request.qs()

      if (!bankId || !serviceId) {
        return response.badRequest({
          message: 'Les parametres bankId et serviceId sont requis dans la requete.',
        })
      }

      const data = await this.analyticsService.getEvolution(Number(bankId), Number(serviceId))

      return response.ok(data)
    } catch (error) {
      const err = error as HttpErrorLike

      return response.status(err.status ?? 500).send({
        message: err.message ?? 'Une erreur est survenue lors de la recuperation des statistiques.',
      })
    }
  }
}
