// 🐨 this is going to be our generic asyncReducer
import {useEffect, useRef, useReducer, useCallback} from 'react'

const useSafeDispatch = dispatch => {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return useCallback(
    (...args) => {
      if (mountedRef.current) {
        dispatch(...args)
      }
      return
    },
    [dispatch],
  )
}

const asyncReducer = (state, action) => {
  switch (action.type) {
    case 'pending': {
      return {...state, status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {...state, status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {...state, status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useAsync = initialState => {
  const [state, unsafeDispatch] = useReducer(asyncReducer, {
    data: null,
    error: null,
    status: 'idle',
    ...initialState,
  })

  const dispatch = useSafeDispatch(unsafeDispatch)

  const run = useCallback(
    promise => {
      if (!promise) {
        return
      }

      dispatch({type: 'pending'})

      promise
        .then(data => {
          dispatch({type: 'resolved', data})
        })
        .catch(error => {
          dispatch({type: 'rejected', error})
        })
    },
    [dispatch],
  )

  return {...state, run}
}

export default useAsync
