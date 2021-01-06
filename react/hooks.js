/**
 * Every call of useState() or useReducer() should create an independent state object that persists over the lifetime of the component.
 */

let hookStates = []

// reset on every render
let ptr = 0

function getOrCreateHookState () {
  const head = ptr
  if (!hookStates[ptr]) {
    const hs = {}
    hookStates.push(hs)
    ptr++
  }
  return hookStates[head]
}

function useReducer (reducer, initialState, initialize) {
  const hs = getOrCreateHookState()

  if (!hs.value) {
    hs.value = [
      initialize ? initialize(initialState) : initialState,
      (action) => {
        hs.value[0] = reducer(hs.value[0], action)
      },
    ]
  }

  return hs.value
}

function useState (initialState) {
  return useReducer(
    (_, newState) => newState,
    initialState
  )
}
