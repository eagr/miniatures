let hookStates = []

// reset on every render
let ptr = 0

function getHookState () {
  const head = ptr
  if (!hookStates[ptr]) {
    const hs = {}
    hookStates.push(hs)
    ptr++
  }
  return hookStates[head]
}

function useReducer (reducer, initialState, initialize) {
  const hs = getHookState()
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

function haveDepsChanged (oldDeps, newDeps) {
  const compareArrays = function (xs, ys) {
    if (xs.length !== ys.length) {
      return true
    }
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] !== ys[i]) {
        return true
      }
    }
    return false
  }

  if (typeof oldDeps === 'undefined') return true
  return compareArrays(oldDeps, newDeps)
}

function useEffect (effect, deps) {
  const hs = getHookState()
  if (haveDepsChanged(hs.deps, deps)) {
    hs.deps = deps
    hs.value = effect
    // FIXME schedule a call to the effect callback
  }
}

function useLayoutEffect (effect, deps) {
  const hs = getHookState()
  if (haveDepsChanged(hs.deps, deps)) {
    hs.deps = deps
    hs.value = effect
    // FIXME schedule a call to the effect callback
  }
}

function useMemo (factory, deps) {
  const hs = getHookState()
  if (haveDepsChanged(hs.deps, deps)) {
    hs.deps = deps
    hs.memoized = factory()
  }
  return hs.memoized
}

function useCallback (callback, deps) {
  return useMemo(() => callback, deps)
}

function useRef (initialState) {
  return useMemo(() => ({ current: initialState }), [])
}
