import Bank from '#models/bank'
import { Exception } from '@adonisjs/core/exceptions'

export default class BankService {
  /**
   * Récupère toutes les banques actives
   */
  async getAllActive() {
    try {
      return await Bank.query().where('isActive', true)
    } catch (error) {
      throw new Exception('Impossible de récupérer la liste des banques', { status: 500 })
    }
  }

  /**
   * Créer une nouvelle banque
   */
  async createBank(data: any, userId: number) {
    try {
      return await Bank.create({
        ...data,
        userId: userId,
        isActive: true
      })
    } catch (error) {
      throw new Exception('Erreur lors de la création de la banque', { status: 400 })
    }
  }

  /**
   * Trouver une banque par ID
   */
  async findById(id: number) {
    try {
      return await Bank.findOrFail(id)
    } catch (error) {
      throw new Exception('Banque non trouvée', { status: 404 })
    }
  }

  /**
   * Mettre à jour une banque avec vérification de propriété
   */
  async updateBank(id: number, data: any, userId: number) {
    const bank = await this.findById(id)

    if (bank.userId !== userId) {
      throw new Exception('Vous n\'êtes pas autorisé à modifier cette banque', { status: 403 })
    }

    try {
      bank.merge(data)
      await bank.save()
      return bank
    } catch (error) {
      throw new Exception('Erreur lors de la mise à jour', { status: 400 })
    }
  }

  /**
   * Désactivation logique d'une banque
   */
  async deactivateBank(id: number, userId: number) {
    const bank = await this.findById(id)

    if (bank.userId !== userId) {
      throw new Exception('Action non autorisée', { status: 403 })
    }

    try {
      bank.isActive = false
      await bank.save()
      return true
    } catch (error) {
      throw new Exception('Erreur lors de la désactivation', { status: 500 })
    }
  }
}