import Tariff from '#models/tariff'
import Bank from '#models/bank'
import { Exception } from '@adonisjs/core/exceptions'

export default class TariffService {
  /**
   * Créer un nouveau tarif (soumis à validation)
   */
  async create(data: any, userId: number) {
    const bank = await Bank.findOrFail(data.bankId)

    // Vérification de propriété
    if (bank.userId !== userId) {
      throw new Exception('Accès refusé : vous n\'êtes pas le propriétaire de cette banque', { status: 403 })
    }

    try {
      return await Tariff.create({
        ...data,
        currency: 'USD',
        status: 'PENDING'
      })
    } catch (error) {
      throw new Exception('Erreur lors de la création du tarif', { status: 400 })
    }
  }

  /**
   * Changer le statut d'un tarif (Approve/Reject)
   */
  async updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    try {
      const tariff = await Tariff.findOrFail(id)
      tariff.status = status
      await tariff.save()
      return tariff
    } catch (error) {
      throw new Exception('Impossible de mettre à jour le statut du tarif', { status: 400 })
    }
  }

  /**
   * Récupérer l'historique filtré
   */
  async getHistory(bankId: number, serviceId: number) {
    try {
      return await Tariff.query()
        .where('bankId', bankId)
        .where('serviceId', serviceId)
        .orderBy('createdAt', 'asc')
    } catch (error) {
      throw new Exception('Erreur lors de la récupération de l\'historique', { status: 500 })
    }
  }
}