import Bank from '#models/bank'
import Service from '#models/service'
import Tariff from '#models/tariff'
import { Exception } from '@adonisjs/core/exceptions'

export default class ComparisonService {
  /**
   * Construit une matrice de comparaison entre plusieurs banques et services
   */
  async compareBanks(bankIds: number[], serviceIds: number[]) {
    try {
      // 1. Récupérer les données nécessaires en parallèle
      const [banks, services, tariffs] = await Promise.all([
        Bank.query().whereIn('id', bankIds),
        Service.query().whereIn('id', serviceIds),
        Tariff.query()
          .whereIn('bankId', bankIds)
          .whereIn('serviceId', serviceIds)
          .where('status', 'APPROVED')
      ])

      // 2. Construire la grille de comparaison (Logique métier)
      return services.map((service) => {
        const row: any = {
          service: service.name,
          values: {}
        }

        banks.forEach((bank) => {
          const tariff = tariffs.find(
            (t) => t.bankId === bank.id && t.serviceId === service.id
          )
          // On associe le nom de la banque au montant du tarif trouvé (ou null)
          row.values[bank.name] = tariff ? tariff.amount : null
        })

        return row
      })
    } catch (error) {
      throw new Exception('Erreur lors de la génération de la comparaison', { status: 500 })
    }
  }
}