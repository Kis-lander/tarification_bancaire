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
    const bank = await Bank.findOrFail(data.bankId)

    if (bank.id !== bankId) {
      throw new Exception("Acces refuse : vous n'etes pas autorise a gerer cette banque", { status: 403 })
    }

    try {
      return await Agency.create(data)
    } catch {
      throw new Exception("Erreur lors de la creation de l'agence", { status: 400 })
    }
  }

  async getByBank(bankId: number) {
    try {
      return await Agency.query().where('bankId', bankId)
    } catch {
      throw new Exception('Banque non trouvee ou erreur de lecture', { status: 404 })
    }
  }

  async update(id: number, data: any, bankId: number) {
    const agency = await Agency.findOrFail(id)

    if (agency.bankId !== bankId) {
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
    const agency = await Agency.findOrFail(id)

    if (agency.bankId !== bankId) {
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
