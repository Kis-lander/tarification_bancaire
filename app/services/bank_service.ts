import Bank from '#models/bank'
import { Exception } from '@adonisjs/core/exceptions'

export default class BankService {
  /**
   * Recupere toutes les banques actives
   */
  async getAllActive() {
    try {
      return await Bank.query().where('isActive', true)
    } catch {
      throw new Exception('Impossible de recuperer la liste des banques', { status: 500 })
    }
  }

  /**
   * Creer une nouvelle banque
   */
  async createBank(data: { name: string; description?: string | null }) {
    try {
      return await Bank.create({
        ...data,
        isActive: true,
      })
    } catch {
      throw new Exception('Erreur lors de la creation de la banque', { status: 400 })
    }
  }

  /**
   * Trouver une banque par ID
   */
  async findById(id: number) {
    try {
      return await Bank.findOrFail(id)
    } catch {
      throw new Exception('Banque non trouvee', { status: 404 })
    }
  }

  /**
   * Mettre a jour une banque
   */
  async updateBank(
    id: number,
    data: { name?: string; description?: string | null; isActive?: boolean }
  ) {
    const bank = await this.findById(id)

    try {
      bank.merge(data)
      await bank.save()
      return bank
    } catch {
      throw new Exception('Erreur lors de la mise a jour', { status: 400 })
    }
  }

  /**
   * Desactivation logique d'une banque
   */
  async deactivateBank(id: number) {
    const bank = await this.findById(id)

    try {
      bank.isActive = false
      await bank.save()
      return true
    } catch {
      throw new Exception('Erreur lors de la desactivation', { status: 500 })
    }
  }
}
