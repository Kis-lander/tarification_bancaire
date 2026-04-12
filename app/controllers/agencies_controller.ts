import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AgencyService from '#services/agency_service'
import User from '#models/user'

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
      const user = auth.use('web').user!

      if (!user.bankId) {
        return response.badRequest({ message: 'Ce compte BANK nest rattache a aucune banque.' })
      }

      const data = request.only(['bankId', 'city', 'address', 'latitude', 'longitude'])
      const agency = await this.agencyService.create(
        { ...data, bankId: Number(data.bankId) },
        user.bankId
      )

      return response.created(agency)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.use('web').user!

      if (!user.bankId) {
        return response.badRequest({ message: 'Ce compte BANK nest rattache a aucune banque.' })
      }

      const data = request.only(['city', 'address', 'latitude', 'longitude'])
      const agency = await this.agencyService.update(Number(params.id), data, user.bankId)
      return response.ok(agency)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.use('web').user!

      if (!user.bankId) {
        return response.badRequest({ message: 'Ce compte BANK nest rattache a aucune banque.' })
      }

      await this.agencyService.delete(Number(params.id), user.bankId)
      return response.ok({ message: 'Agence supprimee avec succes' })
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async map({ request, response }: HttpContext) {
    const { bankId } = request.qs()

    let bankUsersQuery = User.query().where('rule', 'BANK').whereNotNull('addresses').preload('bank')

    if (bankId) {
      bankUsersQuery = bankUsersQuery.where('bank_id', bankId)
    }

    const bankUsers = await bankUsersQuery

    const uniqueBankLocations = new Map<string, {
      id: number
      bank: string
      city: string
      country: string
      address: string
      searchQuery: string
      sourceLabel: string
    }>()

    bankUsers.forEach((user) => {
      const rawAddress = (user.addresses || '').trim()
      if (!rawAddress) {
        return
      }

      const parts = rawAddress
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      if (parts.length < 2) {
        return
      }

      const city = parts[0]
      const country = parts.slice(1).join(', ')
      const bankName = user.bank?.name || 'Banque inconnue'
      const key = `${bankName.toLowerCase()}::${city.toLowerCase()}::${country.toLowerCase()}`

      if (!uniqueBankLocations.has(key)) {
        uniqueBankLocations.set(key, {
          id: user.id,
          bank: bankName,
          city,
          country,
          address: `${city}, ${country}`,
          searchQuery: `${bankName}, ${country}`,
          sourceLabel: 'Ville et pays declares par la banque',
        })
      }
    })

    return response.ok(Array.from(uniqueBankLocations.values()))
  }
}
