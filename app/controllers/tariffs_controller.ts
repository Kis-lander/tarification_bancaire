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

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.use('web').user!

      if (!user.bankId) {
        return response.badRequest({ message: 'Ce compte banque nest rattache a aucune banque.' })
      }

      const data = request.only(['serviceId', 'amount', 'currency'])
      const tariff = await this.tariffService.create({
        bankId: user.bankId,
        serviceId: Number(data.serviceId),
        amount: String(data.amount),
        currency: data.currency,
        submittedBy: user.id,
      })

      return response.created(tariff)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async history({ request, response }: HttpContext) {
    try {
      const { bankId, serviceId } = request.qs()

      if (!bankId || !serviceId) {
        return response.badRequest({ message: 'bankId et serviceId sont requis' })
      }

      const data = await this.tariffService.getHistory(Number(bankId), Number(serviceId))
      return response.ok(data)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({ message: err.message })
    }
  }
}
