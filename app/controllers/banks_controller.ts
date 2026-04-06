import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import BankService from '#services/bank_service'

@inject()
export default class BanksController {
  constructor(protected bankService: BankService) {}

  async index({ response }: HttpContext) {
    try {
      const banks = await this.bankService.getAllActive()
      return response.ok(banks)
    } catch (error) {
      return response.status(error.status || 500).send({ message: error.message })
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const data = request.only(['name', 'description'])
      
      const bank = await this.bankService.createBank(data, user.id)
      return response.created(bank)
    } catch (error) {
      return response.status(error.status || 400).send({ message: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const bank = await this.bankService.findById(params.id)
      return response.ok(bank)
    } catch (error) {
      return response.status(error.status || 404).send({ message: error.message })
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'isActive'])
      const bank = await this.bankService.updateBank(params.id, data, auth.user!.id)
      
      return response.ok(bank)
    } catch (error) {
      return response.status(error.status || 400).send({ message: error.message })
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      await this.bankService.deactivateBank(params.id, auth.user!.id)
      return response.ok({ message: 'Banque désactivée avec succès' })
    } catch (error) {
      return response.status(error.status || 400).send({ message: error.message })
    }
  }
}