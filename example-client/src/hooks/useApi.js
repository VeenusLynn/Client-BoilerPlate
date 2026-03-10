import { useState, useEffect, useCallback } from 'react'

export function useApi(apiFn, ...args) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...overrideArgs) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFn(...(overrideArgs.length ? overrideArgs : args))
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { if (apiFn && args.length) execute() }, []) // eslint-disable-line

  return { data, loading, error, execute }
}
