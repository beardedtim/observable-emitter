# Observable Emitter

> Like events but better

## Usage

```js
const createEmitter = require('observable-emitter')
// OR
import creatEmitter from 'observable-emitter'

const events = createEmitter({
  source: sourceObs,
  pingTimeout: 1000
})

const onUpperCase = events.on(/[A-Z]/)

onUpperCase.subscribe(action => console.log('Uppercase action!'))

events.emit({ type: 'ABC' }) // Uppercase action!
events.emit({ type: 'D' }) // Uppercase action!
events.emit({ type: 'abc' }) // 
```

## API

`const events = createEmitter(opts)`

* `opts`: 
  - `source`: An observable to treat as incoming source along with emitted events
  - `pingTimeout`: The amount of time between pings

Returns an object of `ObservableEmitter` shape:

* `observableEmitter`:
  - `on`: `(...regExpOrString) => Observable`
    * A function that takes _0->n_ amount of regular expressions or strings to match actions on and returns an observable of those actions emitted into our system
    * Example:
      ```
      const onUpperSubscription = events.on(/[A-Z]/).subscribe(console.log)
      ```
  - `once`: `(...regExpOrString) => Observable`
    * A function that takes _0->n_ amount of regular expressions or strings to match actions on and returns an observable of the first action emitted that matches any of the strings or expressions
    * Example:
      ```
      const onUpperSubscription = events.once(/[A-Z]/).subscribe(console.log)
      ```
  - `clear`: `(errorValue) => void`
    * A function that either takes in a value to pass to subscriptions as an `error` value or if not emits a `complete` action.
    * Example:
      ```
      events.clear()
      ```
  - `emit`: `({ type, ...rest }) => void`
    * A function that takes an action and emits it into the system
    * Example:
      ```
      events.emit({ type: 'SOME_ACTION' })
      ```