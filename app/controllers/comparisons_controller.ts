import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ComparisonService from '#services/comparison_service'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class ComparisonsController {
  constructor(protected comparisonService: ComparisonService) {}

  async compare({ request, response }: HttpContext) {
    try {
      const bankIds = (request.input('bankIds', []) as Array<number | string>).map(Number)
      const serviceIds = (request.input('serviceIds', []) as Array<number | string>).map(Number)

      if (bankIds.length === 0 || serviceIds.length === 0) {
        return response.badRequest({
          message: 'bankIds et serviceIds sont requis',
        })
      }

      const comparison = await this.comparisonService.compare(bankIds, serviceIds)
      const best = this.comparisonService.findBest(comparison)

      return response.ok({ comparison, best })
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({
        message: err.message ?? 'Erreur lors de la comparaison',
      })
    }
  }
}
