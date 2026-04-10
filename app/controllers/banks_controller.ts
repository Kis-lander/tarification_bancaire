import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Bank from '#models/bank'
import BankService from '#services/bank_service'

type HttpErrorLike = {
  status?: number
  message?: string
}

@inject()
export default class BanksController {
  constructor(protected bankService: BankService) {}

  async index({ response }: HttpContext) {
    try {
      const banks = await this.bankService.getAllActive()
      return response.ok(banks)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 500).send({ message: err.message })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description'])
      const bank = await this.bankService.createBank(data)
      return response.created(bank)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const bank = await this.bankService.findById(params.id)
      return response.ok(bank)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 404).send({ message: err.message })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'isActive'])
      const bank = await this.bankService.updateBank(params.id, data)

      return response.ok(bank)
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.bankService.deactivateBank(params.id)
      return response.ok({ message: 'Banque desactivee avec succes' })
    } catch (error) {
      const err = error as HttpErrorLike
      return response.status(err.status ?? 400).send({ message: err.message })
    }
  }

  async view({ view }: HttpContext) {
    const banks = await Bank.all()
    return view.render('pages/banks', { banks })
  }
}
