const Rx = require('rxjs')

/**
 * Our Options Object
 *
 * @typedef {Object} EventEmitterOptions
 * @property {Observable} source - A source observable to merge with
 * @property {number} pingTimeout - The time between aliveType pings
 * @property {string} aliveType - The ping type
 */

/**
 * Our Event Actions
 *
 * @typedef {Object} Action
 * @property {string} type - The type of action
 */

/**
 * Our public API
 *
 * @typedef {Object} ObservableEventEmitter
 * @property {function(...string | ...RegExp) => Observable} on - Registers to events or event pattern
 * @property {function(...string| ...RegExp) => Observable} once - Registers to events or event patter onces
 * @property {function(string) => void} clear - Sends a complete or error message to all observables
 * @property {function(Action) => void} emit - Emits an action to subscribed listeners
 */

/**
 * Returns an Event Emitter-like API but with Observables
 *
 * @param {EventEmitterOptions} param - The options
 * @return {ObservableEventEmitter} - Our public API
 */
const createEventEmitter = (
  {
    source = Rx.Observable.empty(),
    pingTimeout = 1000,
    aliveType = 'KEEP_ALIVE'
  } = {}
) => {
  // Always be emitting values in case anyone cares
  const keepAlive = Rx.Observable.interval(pingTimeout).map(() => ({
    type: aliveType
  }))

  // Ability to add events to the stream
  const events = new Rx.Subject()

  // A simple way to ensure that this is always publishing somthing
  // and not exit 0 clean
  const aliveAlwaysSource = keepAlive
    .merge(events, source)
    .share()
    .filter(({ type }) => type !== aliveType)

  // How we register to an event or an event pattern
  const on = (...regExps) =>
    aliveAlwaysSource.filter(({ type }) => regExps.some(reg => type.match(reg)))

  const once = regExp => on(regExp).take(1)

  const emit = action => {
    if (!action.type || typeof action.type !== 'string') {
      throw new Error('Action.type must be of type string')
    }

    events.next(action)
  }

  const clear = error => {
    if (error) {
      events.error(error)
    } else {
      events.complete()
    }
  }

  return {
    on,
    once,
    emit,
    clear
  }
}

module.exports = createEventEmitter
