import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import BanksController from '#controllers/banks_controller'
import AgenciesController from '#controllers/agencies_controller'

// 🌍 Public
router.on('/').render('pages/home').as('home')
router.get('/banks', [BanksController, 'index'])
router.get('/banks/:id', [BanksController, 'show'])
router.get('/agencies', [AgenciesController, 'index'])
router.get('/banks/:bankId/agencies', [AgenciesController, 'byBank'])

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

// 🔐 Protégé (BANQUE uniquement)
router.group(() => {
  router.post('/banks', [BanksController, 'store'])
  router.put('/banks/:id', [BanksController, 'update'])
  router.delete('/banks/:id', [BanksController, 'destroy'])
  router.post('/agencies', [AgenciesController, 'store'])
  router.put('/agencies/:id', [AgenciesController, 'update'])
  router.delete('/agencies/:id', [AgenciesController, 'destroy'])
})
.use(middleware.auth())
.use(middleware.role(['BANK']))
