import Tariff from '#models/tariff'
import { Exception } from '@adonisjs/core/exceptions'

type ComparisonMatrix = Record<number, Record<number, string | null>>

export default class ComparisonService {
  /**
   * 🔥 Comparer banques et services (Grille de tarifs validés)
   */
  async compare(bankIds: number[], serviceIds: number[]) {
    try {
      // 1. Récupérer uniquement les tarifs validés (APPROVED)
      const tariffs = await Tariff.query()
        .whereIn('bankId', bankIds)
        .whereIn('serviceId', serviceIds)
        .where('status', 'APPROVED')

      // 2. Transformer en grille (Matrice Service -> Banque)
      const result: ComparisonMatrix = {}

      for (const serviceId of serviceIds) {
        result[serviceId] = {}

        for (const bankId of bankIds) {
          const tariff = tariffs.find(
            (t) => t.bankId === bankId && t.serviceId === serviceId
          )

          result[serviceId][bankId] = tariff ? tariff.amount : null
        }
      }

      return result
    } catch (error) {
      throw new Exception('Erreur lors du calcul de la comparaison', { status: 500 })
    }
  }

  /**
   * 🏆 Trouver la banque la moins chère (Classement par score total)
   */
  findBest(comparisonResult: ComparisonMatrix) {
    try {
      const scores: Record<number, number> = {}

      for (const serviceId in comparisonResult) {
        for (const bankId in comparisonResult[serviceId]) {
          const value = comparisonResult[serviceId][bankId]

          if (value !== null) {
            const bId = Number(bankId)
            scores[bId] = (scores[bId] || 0) + Number(value)
          }
        }
      }

      // 🔥 Tri par montant croissant (Le moins cher en premier)
      return Object.entries(scores)
        .map(([bankId, total]) => ({
          bankId: Number(bankId),
          totalAmount: total,
        }))
        .sort((a, b) => a.totalAmount - b.totalAmount)
    } catch (error) {
      throw new Exception('Erreur lors du calcul de la meilleure offre', { status: 500 })
    }
  }
}
