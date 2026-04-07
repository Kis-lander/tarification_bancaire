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
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'banks.store': { paramsTuple?: []; params?: {} }
    'banks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'banks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.store': { paramsTuple?: []; params?: {} }
    'agencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tariffs.store': { paramsTuple?: []; params?: {} }
    'tariffs.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tariffs.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
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
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'compare.submit': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'banks.store': { paramsTuple?: []; params?: {} }
    'agencies.store': { paramsTuple?: []; params?: {} }
    'tariffs.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'banks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tariffs.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tariffs.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'banks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'agencies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}