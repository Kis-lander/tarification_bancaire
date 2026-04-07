import Tariff from '#models/tariff'
import { Exception } from '@adonisjs/core/exceptions'

export default class AnalyticsService {
  /**
   * 📈 Récupère l'évolution des tarifs d'un service spécifique pour une banque
   * Retourne un format optimisé pour les graphiques (Chart.js, Recharts, etc.)
   */
  async getEvolution(bankId: number, serviceId: number) {
    try {
      // 1. Récupérer les tarifs approuvés triés par date
      const data = await Tariff.query()
        .where('bankId', bankId)
        .where('serviceId', serviceId)
        .where('status', 'APPROVED')
        .orderBy('createdAt', 'asc')

      // 2. Formater les données pour le frontend
      return data.map((item) => ({
        // .toISODate() retourne "YYYY-MM-DD"
        date: item.createdAt.toISODate(), 
        amount: item.amount,
        currency: item.currency // Optionnel : utile si tu gères plusieurs devises
      }))
    } catch (error) {
      // 3. Gestion d'erreur si la base de données est injoignable ou crash
      throw new Exception('Impossible de générer les données analytiques', { 
        status: 500 
      })
    }
  }
}