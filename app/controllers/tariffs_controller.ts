import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import TariffService from '#services/tariff_service'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class TariffsController {
  constructor(protected tariffService: TariffService) {}

  /**
   * ➕ Ajouter tarif
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      const data = request.only(['bankId', 'serviceId', 'amount'])
      const tariff = await this.tariffService.create(data, auth.user!.id)
      
      return response.created(tariff)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  /**
   * ✅ Validation (ADMIN)
   */
  async approve({ params, response }: HttpContext) {
    try {
      const tariff = await this.tariffService.updateStatus(params.id, 'APPROVED')
      return response.ok(tariff)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  /**
   * ❌ Rejet
   */
  async reject({ params, response }: HttpContext) {
    try {
      const tariff = await this.tariffService.updateStatus(params.id, 'REJECTED')
      return response.ok(tariff)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  /**
   * 📊 Historique
   */
  async history({ request, response }: HttpContext) {
    try {
      const { bankId, serviceId } = request.qs()
      
      if (!bankId || !serviceId) {
        return response.badRequest({ message: 'bankId et serviceId sont requis' })
      }

      const data = await this.tariffService.getHistory(bankId, serviceId)
      return response.ok(data)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({ message: err.message })
    }
  }
}
