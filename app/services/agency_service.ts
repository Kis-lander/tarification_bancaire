import Agency from '#models/agency'
import Bank from '#models/bank'
import { Exception } from '@adonisjs/core/exceptions'

export default class AgencyService {
  async getAll() {
    try {
      return await Agency.query().preload('bank')
    } catch {
      throw new Exception('Impossible de recuperer les agences', { status: 500 })
    }
  }

  async create(data: any, bankId: number) {
    const normalizedBankId = Number(bankId)
    const normalizedPayloadBankId = Number(data?.bankId ?? bankId)

    if (!Number.isFinite(normalizedBankId) || normalizedBankId <= 0) {
      throw new Exception('Banque invalide pour cette operation', { status: 400 })
    }

    if (!Number.isFinite(normalizedPayloadBankId) || normalizedPayloadBankId <= 0) {
      throw new Exception("Impossible d'identifier la banque rattachee a cette agence", {
        status: 400,
      })
    }

    const bank = await Bank.findOrFail(normalizedPayloadBankId)

    if (bank.id !== normalizedBankId) {
      throw new Exception("Acces refuse : vous n'etes pas autorise a gerer cette banque", {
        status: 403,
      })
    }

    try {
      return await Agency.create({
        ...data,
        bankId: normalizedBankId,
      })
    } catch {
      throw new Exception("Erreur lors de la creation de l'agence", { status: 400 })
    }
  }

  async getByBank(bankId: number) {
    const normalizedBankId = Number(bankId)

    if (!Number.isFinite(normalizedBankId) || normalizedBankId <= 0) {
      throw new Exception('Banque non trouvee ou erreur de lecture', { status: 404 })
    }

    try {
      return await Agency.query().where('bankId', normalizedBankId)
    } catch {
      throw new Exception('Banque non trouvee ou erreur de lecture', { status: 404 })
    }
  }

  async update(id: number, data: any, bankId: number) {
    const normalizedBankId = Number(bankId)
    const agency = await Agency.findOrFail(id)

    if (!Number.isFinite(normalizedBankId) || agency.bankId !== normalizedBankId) {
      throw new Exception('Acces refuse : modification interdite', { status: 403 })
    }

    try {
      agency.merge(data)
      await agency.save()
      return agency
    } catch {
      throw new Exception('Erreur lors de la mise a jour', { status: 400 })
    }
  }

  async delete(id: number, bankId: number) {
    const normalizedBankId = Number(bankId)
    const agency = await Agency.findOrFail(id)

    if (!Number.isFinite(normalizedBankId) || agency.bankId !== normalizedBankId) {
      throw new Exception('Acces refuse : suppression interdite', { status: 403 })
    }

    try {
      await agency.delete()
      return true
    } catch {
      throw new Exception('Erreur lors de la suppression', { status: 500 })
    }
  }
}
