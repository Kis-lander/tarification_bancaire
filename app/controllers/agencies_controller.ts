import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AgencyService from '#services/agency_service'
import Bank from '#models/bank'
import { bankAgencyCreateValidator } from '#validators/user'

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

  async store({ auth, request, response, session }: HttpContext) {
    try {
      const user = auth.use('web').user!
      const wantsJson = (request.header('accept') || '').includes('application/json')
      const normalizedUserBankId = Number(user.bankId)

      if (!Number.isFinite(normalizedUserBankId) || normalizedUserBankId <= 0) {
        if (wantsJson) {
          return response.badRequest({ message: 'Ce compte BANK nest rattache a aucune banque.' })
        }

        session.flash('error', 'Ce compte BANK nest rattache a aucune banque.')
        return response.redirect('/bank/account')
      }

      const payload = await request.validateUsing(bankAgencyCreateValidator)
      const agency = await this.agencyService.create(
        { ...payload, bankId: normalizedUserBankId },
        normalizedUserBankId
      )

      if (wantsJson) {
        return response.created(agency)
      }

      session.flash('success', 'Agence enregistree avec succes.')
      return response.redirect('/bank/account#bank-agencies')
    } catch (error) {
      const err = error as HttpErrorLike
      const wantsJson = (request.header('accept') || '').includes('application/json')

      if (wantsJson) {
        return response.status(err.status ?? 400).send({ message: err.message })
      }

      session.flash('error', err.message || "Erreur lors de l'enregistrement de l'agence.")
      return response.redirect().back()
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
    try {
      const { bankId, territorySearch } = request.qs()

      const normalizedBankId = Number(bankId)
      if (!normalizedBankId) {
        return response.badRequest({ message: 'Le parametre bankId est requis.' })
      }

      const bank = await Bank.find(normalizedBankId)
      if (!bank) {
        return response.notFound({ message: 'Banque introuvable.' })
      }

      const agencies = await this.agencyService.getByBank(normalizedBankId)
      const normalizedTerritory = String(territorySearch || '')
        .trim()
        .toLowerCase()

      const filteredAgencies = normalizedTerritory
        ? agencies.filter((agency) => {
            const haystack = [agency.city, agency.address].join(' ').toLowerCase()
            return haystack.includes(normalizedTerritory)
          })
        : agencies

      return response.ok({
        bank: {
          id: bank.id,
          bankId: bank.id,
          bank: bank.name,
        },
        agencies: filteredAgencies.map((agency) => ({
          id: agency.id,
          bankId: bank.id,
          bank: bank.name,
          city: agency.city,
          country: '',
          province: '',
          commune: '',
          district: '',
          address: agency.address,
          addressLines: [agency.address],
          lat: Number(agency.latitude),
          lng: Number(agency.longitude),
          sourceLabel: 'Agence enregistree',
        })),
      })
    } catch (error) {
      const err = error as HttpErrorLike
      return response
        .status(err.status ?? 500)
        .send({ message: err.message || 'Impossible de recuperer les agences de cette banque.' })
    }
  }
}
