import Agency from '#models/agency'
import Bank from '#models/bank'
import { Exception } from '@adonisjs/core/exceptions'

export default class AgencyService {
  /**
   * Liste toutes les agences avec leur banque liée
   */
  async getAll() {
    try {
      return await Agency.query().preload('bank')
    } catch (error) {
      throw new Exception('Impossible de récupérer les agences', { status: 500 })
    }
  }

  /**
   * Créer une agence après vérification du propriétaire de la banque
   */
  async create(data: any, userId: number) {
    const bank = await Bank.findOrFail(data.bankId)

    if (bank.userId !== userId) {
      throw new Exception('Accès refusé : vous n\'êtes pas le propriétaire de cette banque', { status: 403 })
    }

    try {
      return await Agency.create(data)
    } catch (error) {
      throw new Exception('Erreur lors de la création de l\'agence', { status: 400 })
    }
  }

  /**
   * Liste les agences d'une banque spécifique
   */
  async getByBank(bankId: number) {
    try {
      return await Agency.query().where('bankId', bankId)
    } catch (error) {
      throw new Exception('Banque non trouvée ou erreur de lecture', { status: 404 })
    }
  }

  /**
   * Mettre à jour une agence avec vérification de sécurité
   */
  async update(id: number, data: any, userId: number) {
    const agency = await Agency.findOrFail(id)
    const bank = await Bank.findOrFail(agency.bankId)

    if (bank.userId !== userId) {
      throw new Exception('Accès refusé : modification interdite', { status: 403 })
    }

    try {
      agency.merge(data)
      await agency.save()
      return agency
    } catch (error) {
      throw new Exception('Erreur lors de la mise à jour', { status: 400 })
    }
  }

  /**
   * Supprimer une agence
   */
  async delete(id: number, userId: number) {
    const agency = await Agency.findOrFail(id)
    const bank = await Bank.findOrFail(agency.bankId)

    if (bank.userId !== userId) {
      throw new Exception('Accès refusé : suppression interdite', { status: 403 })
    }

    try {
      await agency.delete()
      return true
    } catch (error) {
      throw new Exception('Erreur lors de la suppression', { status: 500 })
    }
  }
}