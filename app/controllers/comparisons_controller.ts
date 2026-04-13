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

  private normalizeIds(value: unknown): number[] {
    if (Array.isArray(value)) {
      return value.map(Number).filter((item) => Number.isFinite(item) && item > 0)
    }

    if (value === null || value === undefined || value === '') {
      return []
    }

    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) && parsedValue > 0 ? [parsedValue] : []
  }

  async compare({ request, response }: HttpContext) {
    try {
      const bankIds = this.normalizeIds(request.input('bankIds', request.input('bankIds[]', [])))
      const serviceIds = this.normalizeIds(
        request.input('serviceIds', request.input('serviceIds[]', []))
      )

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
