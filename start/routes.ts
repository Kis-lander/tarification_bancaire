import { controllers } from '#generated/controllers'
const AgenciesController = () => import('#controllers/agencies_controller')
const AnalyticsController = () => import('#controllers/analytic_controller')
const BankTariffsController = () => import('#controllers/bank_tariffs_controller')
const BanksController = () => import('#controllers/banks_controller')
const BccBankUsersController = () => import('#controllers/bcc_bank_users_controller')
const BccPortalController = () => import('#controllers/bcc_portal_controller')
const BccServicesController = () => import('#controllers/bcc_services_controller')
const BccTariffReviewsController = () => import('#controllers/bcc_tariff_reviews_controller')
const ComparisonsController = () => import('#controllers/comparisons_controller')
const PublicPagesController = () => import('#controllers/public_pages_controller')
const TariffsController = () => import('#controllers/tariffs_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/', [PublicPagesController, 'home']).as('home')
router.get('/banks', [PublicPagesController, 'banks']).as('banks.page')
router.get('/compare', [PublicPagesController, 'compare']).as('compare.page')
router.get('/map', [PublicPagesController, 'map']).as('map.page')
router.get('/history', [PublicPagesController, 'history']).as('history.page')
router.get('/analytics', [PublicPagesController, 'analytics']).as('analytics.page')

router.get('/api/banks', [BanksController, 'index']).as('banks.index')
router.get('/api/banks/:id', [BanksController, 'show']).as('banks.show')
router.get('/api/agencies', [AgenciesController, 'index']).as('agencies.index')
router.get('/api/banks/:bankId/agencies', [AgenciesController, 'byBank']).as('agencies.byBank')
router.get('/tariffs/history', [TariffsController, 'history']).as('tariffs.history')
router.post('/compare', [ComparisonsController, 'compare']).as('compare.submit')
router.get('/analytics/evolution', [AnalyticsController, 'evolution']).as('analytics.evolution')
router.get('/map/agencies', [AgenciesController, 'map']).as('agencies.map')
router.get('/bcc', [BccPortalController, 'accessPage']).as('bcc.access')

router
  .group(() => {
    router.get('bcc/signup', [BccPortalController, 'signupPage']).as('bcc.signup')
    router.post('bcc/signup', [BccPortalController, 'signup']).as('bcc.signup.store')
    router.get('bcc/login', [BccPortalController, 'loginPage']).as('bcc.login')
    router.post('bcc/login', [BccPortalController, 'login']).as('bcc.login.store')
  })
  .use(middleware.guest({ guards: ['bcc'] }))

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])
    router.get('signup/verify', [controllers.NewAccount, 'verifyPage'])
    router.post('signup/verify', [controllers.NewAccount, 'verifyOtp'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest({ guards: ['web'] }))

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth({ guards: ['web', 'bcc'] }))

router
  .group(() => {
    router.get('/bcc/banks', [BccPortalController, 'dashboard']).as('bcc.banks')
    router.post('/bcc/banks', [BccPortalController, 'storeBank']).as('bcc.banks.store')

    router.get('/bcc/services', [BccServicesController, 'index']).as('bcc.services')
    router.post('/bcc/services', [BccServicesController, 'store']).as('bcc.services.store')

    router.get('/bcc/bank-users', [BccBankUsersController, 'index']).as('bcc.bankUsers')
    router.post('/bcc/bank-users', [BccBankUsersController, 'store']).as('bcc.bankUsers.store')
    router
      .post('/bcc/bank-users/pending/:id/approve', [BccBankUsersController, 'approve'])
      .as('bcc.bankUsers.approve')
    router
      .post('/bcc/bank-users/pending/:id/reject', [BccBankUsersController, 'reject'])
      .as('bcc.bankUsers.reject')

    router.get('/bcc/tariff-reviews', [BccTariffReviewsController, 'index']).as('bcc.tariffReviews')
    router
      .post('/bcc/tariff-reviews/:id/approve', [BccTariffReviewsController, 'approve'])
      .as('bcc.tariffReviews.approve')
    router
      .post('/bcc/tariff-reviews/:id/reject', [BccTariffReviewsController, 'reject'])
      .as('bcc.tariffReviews.reject')
  })
  .use(middleware.auth({ guards: ['bcc'] }))
  .use(middleware.role(['BCC']))

router
  .group(() => {
    router.get('/bank/tariffs', [BankTariffsController, 'index']).as('bank.tariffs')
    router.post('/bank/tariffs', [BankTariffsController, 'store']).as('bank.tariffs.store')
    router
      .post('/bank/tariffs/:id', [BankTariffsController, 'update'])
      .as('bank.tariffs.update.post')
    router.put('/bank/tariffs/:id', [BankTariffsController, 'update']).as('bank.tariffs.update')

    router.post('/tariffs', [TariffsController, 'store']).as('tariffs.store')
    router.post('/agencies', [AgenciesController, 'store'])
    router.put('/agencies/:id', [AgenciesController, 'update'])
    router.delete('/agencies/:id', [AgenciesController, 'destroy'])
  })
  .use(middleware.auth({ guards: ['web'] }))
  .use(middleware.role(['BANK']))
