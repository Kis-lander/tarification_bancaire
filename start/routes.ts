import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import router from '@adonisjs/core/services/router'
import BanksController from '#controllers/banks_controller'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

  // 🌍 Public
router.get('/banks', [BanksController, 'index'])
router.get('/banks/:id', [BanksController, 'show'])

// 🔐 Protégé (BANQUE uniquement)
router.group(() => {
  router.post('/banks', [BanksController, 'store'])
  router.put('/banks/:id', [BanksController, 'update'])
  router.delete('/banks/:id', [BanksController, 'destroy'])
})
.middleware('auth')
.middleware({
  role: ['BANK']
})