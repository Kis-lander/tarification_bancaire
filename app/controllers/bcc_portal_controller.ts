import Bank from '#models/bank'
import BccUser from '#models/bcc_user'
import BankService from '#services/bank_service'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class BccPortalController {
  constructor(protected bankService: BankService) {}

  async accessPage({ view, auth }: HttpContext) {
    // 1. On cherche en utilisant la colonne 'role'
    const bccAccount = await BccUser.query().where('role', 'BCC').first()

    // 2. On vérifie l'authentification via le guard 'bcc'
    const isBccAuthenticated = auth.use('bcc').isAuthenticated
    const bccUser = auth.use('bcc').user

    return view.render('pages/bcc/access', {
      hasBccAccount: !!bccAccount,
      // On vérifie que c'est bien un BccUser et que son rôle est BCC
      isBccAuthenticated: isBccAuthenticated && bccUser?.role === 'BCC',
    })
  }

  async signupPage({ view }: HttpContext) {
    return view.render('pages/bcc/bccsignup')
  }

  async signup({ request, response, session }: HttpContext) {
    // Utilisation de 'role' au lieu de 'rule'
    const existingBcc = await BccUser.query().where('role', 'BCC').first()

    if (existingBcc) {
      session.flash('error', 'Le compte BCC existe déjà.')
      return response.redirect('/bcc')
    }

    const payload = await request.validateUsing(signupValidator)

    await BccUser.create({
      email: payload.email,
      password: payload.password,
      role: 'BCC', // Nom de propriété mis à jour
    })

    session.flash('success', 'Compte BCC créé avec succès.')
    return response.redirect('/bcc/login')
  }

  async loginPage({ view }: HttpContext) {
    return view.render('pages/bcc/bcclogin')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const bccuser = await BccUser.query().where('email', email).first()

    if (!bccuser || !(await hash.verify(bccuser.password, password))) {
      session.flash('error', 'Identifiants BCC incorrects.')
      return response.redirect().back()
    }

    // Connexion sur le guard 'bcc'
    await auth.use('bcc').login(bccuser)
    
    session.flash('success', 'Bienvenue dans l\'espace BCC.')
    
    // Redirection vers l'accueil pour afficher le bouton d'accès BCC
    return response.redirect('/')
  }

  async dashboard({ view }: HttpContext) {
    const banks = await Bank.query().orderBy('createdAt', 'desc')
    return view.render('pages/bcc/bccbanks', {
      banks,
      hideFlashAlerts: true,
    })
  }

  async storeBank({ auth, request, response, session }: HttpContext) {
    const data = request.only(['name', 'description'])

    // On utilise le guard 'bcc' pour récupérer l'ID de l'admin connecté
    const adminId = auth.use('bcc').user!.id
    
    await this.bankService.createBank(data, adminId)
    session.flash('success', 'Banque enregistrée avec succès.')

    return response.redirect('/bcc/banks')
  }
}
