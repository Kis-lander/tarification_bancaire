import { controllers } from '#generated/controllers'
import AgenciesController from '#controllers/agencies_controller'
import AnalyticsController from '#controllers/analytic_controller'
import BanksController from '#controllers/banks_controller'
import ComparisonsController from '#controllers/comparisons_controller'
import PublicPagesController from '#controllers/public_pages_controller'
import TariffsController from '#controllers/tariffs_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

// Public pages
router.get('/', [PublicPagesController, 'home']).as('home')
router.get('/banks', [PublicPagesController, 'banks']).as('banks.page')
router.get('/compare', [PublicPagesController, 'compare']).as('compare.page')
router.get('/map', [PublicPagesController, 'map']).as('map.page')
router.get('/history', [PublicPagesController, 'history']).as('history.page')
router.get('/analytics', [PublicPagesController, 'analytics']).as('analytics.page')

// Public JSON endpoints
router.get('/api/banks', [BanksController, 'index']).as('banks.index')
router.get('/api/banks/:id', [BanksController, 'show']).as('banks.show')
router.get('/api/agencies', [AgenciesController, 'index']).as('agencies.index')
router.get('/api/banks/:bankId/agencies', [AgenciesController, 'byBank']).as('agencies.byBank')
router.get('/tariffs/history', [TariffsController, 'history']).as('tariffs.history')
router.post('/compare', [ComparisonsController, 'compare']).as('compare.submit')
router.get('/analytics/evolution', [AnalyticsController, 'evolution']).as('analytics.evolution')
router.get('/map/agencies', [AgenciesController, 'map']).as('agencies.map')

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

router
  .group(() => {
    router.post('/banks', [BanksController, 'store'])
    router.put('/banks/:id', [BanksController, 'update'])
    router.delete('/banks/:id', [BanksController, 'destroy'])
    router.post('/agencies', [AgenciesController, 'store'])
    router.put('/agencies/:id', [AgenciesController, 'update'])
    router.delete('/agencies/:id', [AgenciesController, 'destroy'])
    router.post('/tariffs', [TariffsController, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.role(['BANK']))

router
  .put('/tariffs/:id/approve', [TariffsController, 'approve'])
  .use(middleware.auth())
  .use(middleware.role(['ADMIN']))

router
  .put('/tariffs/:id/reject', [TariffsController, 'reject'])
  .use(middleware.auth())
  .use(middleware.role(['ADMIN']))
