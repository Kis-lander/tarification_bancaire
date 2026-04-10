import User from '#models/user'
import { bankSignupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class NewAccountController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(bankSignupValidator)
    const user = await User.create({
      email: payload.email,
      rule: 'BANK',
      password: await hash.make(payload.password),
    })

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }
}
