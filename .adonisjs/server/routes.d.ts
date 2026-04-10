import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'banks.page': { paramsTuple?: []; params?: {} }
    'compare.page': { paramsTuple?: []; params?: {} }
    'map.page': { paramsTuple?: []; params?: {} }
    'history.page': { paramsTuple?: []; params?: {} }
    'analytics.page': { paramsTuple?: []; params?: {} }
    'banks.index': { paramsTuple?: []; params?: {} }
    'banks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.index': { paramsTuple?: []; params?: {} }
    'agencies.byBank': { paramsTuple: [ParamValue]; params: {'bankId': ParamValue} }
    'tariffs.history': { paramsTuple?: []; params?: {} }
    'compare.submit': { paramsTuple?: []; params?: {} }
    'analytics.evolution': { paramsTuple?: []; params?: {} }
    'agencies.map': { paramsTuple?: []; params?: {} }
    'bcc.access': { paramsTuple?: []; params?: {} }
    'bcc.signup': { paramsTuple?: []; params?: {} }
    'bcc.signup.store': { paramsTuple?: []; params?: {} }
    'bcc.login': { paramsTuple?: []; params?: {} }
    'bcc.login.store': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'bcc.banks': { paramsTuple?: []; params?: {} }
    'bcc.banks.store': { paramsTuple?: []; params?: {} }
    'bcc.services': { paramsTuple?: []; params?: {} }
    'bcc.services.store': { paramsTuple?: []; params?: {} }
    'bcc.bankUsers': { paramsTuple?: []; params?: {} }
    'bcc.bankUsers.store': { paramsTuple?: []; params?: {} }
    'bcc.tariffReviews': { paramsTuple?: []; params?: {} }
    'bcc.tariffReviews.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bcc.tariffReviews.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bank.tariffs': { paramsTuple?: []; params?: {} }
    'bank.tariffs.store': { paramsTuple?: []; params?: {} }
    'bank.tariffs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tariffs.store': { paramsTuple?: []; params?: {} }
    'agencies.store': { paramsTuple?: []; params?: {} }
    'agencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'banks.page': { paramsTuple?: []; params?: {} }
    'compare.page': { paramsTuple?: []; params?: {} }
    'map.page': { paramsTuple?: []; params?: {} }
    'history.page': { paramsTuple?: []; params?: {} }
    'analytics.page': { paramsTuple?: []; params?: {} }
    'banks.index': { paramsTuple?: []; params?: {} }
    'banks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.index': { paramsTuple?: []; params?: {} }
    'agencies.byBank': { paramsTuple: [ParamValue]; params: {'bankId': ParamValue} }
    'tariffs.history': { paramsTuple?: []; params?: {} }
    'analytics.evolution': { paramsTuple?: []; params?: {} }
    'agencies.map': { paramsTuple?: []; params?: {} }
    'bcc.access': { paramsTuple?: []; params?: {} }
    'bcc.signup': { paramsTuple?: []; params?: {} }
    'bcc.login': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'bcc.banks': { paramsTuple?: []; params?: {} }
    'bcc.services': { paramsTuple?: []; params?: {} }
    'bcc.bankUsers': { paramsTuple?: []; params?: {} }
    'bcc.tariffReviews': { paramsTuple?: []; params?: {} }
    'bank.tariffs': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'banks.page': { paramsTuple?: []; params?: {} }
    'compare.page': { paramsTuple?: []; params?: {} }
    'map.page': { paramsTuple?: []; params?: {} }
    'history.page': { paramsTuple?: []; params?: {} }
    'analytics.page': { paramsTuple?: []; params?: {} }
    'banks.index': { paramsTuple?: []; params?: {} }
    'banks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.index': { paramsTuple?: []; params?: {} }
    'agencies.byBank': { paramsTuple: [ParamValue]; params: {'bankId': ParamValue} }
    'tariffs.history': { paramsTuple?: []; params?: {} }
    'analytics.evolution': { paramsTuple?: []; params?: {} }
    'agencies.map': { paramsTuple?: []; params?: {} }
    'bcc.access': { paramsTuple?: []; params?: {} }
    'bcc.signup': { paramsTuple?: []; params?: {} }
    'bcc.login': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'bcc.banks': { paramsTuple?: []; params?: {} }
    'bcc.services': { paramsTuple?: []; params?: {} }
    'bcc.bankUsers': { paramsTuple?: []; params?: {} }
    'bcc.tariffReviews': { paramsTuple?: []; params?: {} }
    'bank.tariffs': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'compare.submit': { paramsTuple?: []; params?: {} }
    'bcc.signup.store': { paramsTuple?: []; params?: {} }
    'bcc.login.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'bcc.banks.store': { paramsTuple?: []; params?: {} }
    'bcc.services.store': { paramsTuple?: []; params?: {} }
    'bcc.bankUsers.store': { paramsTuple?: []; params?: {} }
    'bcc.tariffReviews.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bcc.tariffReviews.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bank.tariffs.store': { paramsTuple?: []; params?: {} }
    'tariffs.store': { paramsTuple?: []; params?: {} }
    'agencies.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'bank.tariffs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'agencies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}