import Tariff from '#models/tariff'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

export default class TariffService {
  /**
   * Creer un nouveau tarif soumis a validation
   */
  async create(data: {
    bankId: number
    serviceId: number
    amount: string
    currency?: string
    submittedBy?: number | null
  }) {
    try {
      return await Tariff.create({
        ...data,
        currency: data.currency || 'CDF',
        status: 'PENDING',
      })
    } catch {
      throw new Exception('Erreur lors de la creation du tarif', { status: 400 })
    }
  }

  /**
   * Changer le statut d'un tarif
   */
  async updateStatus(
    id: number,
    status: 'APPROVED' | 'REJECTED',
    options?: { approvedBy?: number | null; rejectionReason?: string | null }
  ) {
    try {
      const tariff = await Tariff.findOrFail(id)
      tariff.status = status

      if (status === 'APPROVED') {
        tariff.approvedBy = options?.approvedBy ?? null
        tariff.approvedAt = DateTime.utc()
        tariff.rejectionReason = null
      } else {
        tariff.approvedBy = null
        tariff.approvedAt = null
        tariff.rejectionReason = options?.rejectionReason ?? null
      }

      await tariff.save()
      return tariff
    } catch {
      throw new Exception('Impossible de mettre a jour le statut du tarif', { status: 400 })
    }
  }

  /**
   * Recuperer l'historique filtre
   */
  async getHistory(bankId: number, serviceId: number) {
    try {
      return await Tariff.query()
        .where('bankId', bankId)
        .where('serviceId', serviceId)
        .orderBy('createdAt', 'asc')
    } catch {
      throw new Exception("Erreur lors de la recuperation de l'historique", { status: 500 })
    }
  }
}
