/** Format ISO date → "Jan 1, 2024" */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

/** Truncate a string to maxLen chars */
export const truncate = (str, maxLen = 60) =>
  str.length > maxLen ? str.slice(0, maxLen) + '…' : str

/** Capitalize first letter */
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/** Sleep helper */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
