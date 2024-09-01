export const getCurrentFormattedDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const microseconds = String(now.getMilliseconds() * 1000).padStart(6, '0')
  const tzOffset = -now.getTimezoneOffset()
  const tzHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0')
  const tzMinutes = String(Math.abs(tzOffset) % 60).padStart(2, '0')
  const tzSign = tzOffset >= 0 ? '+' : '-'
  const tz = `UTC${tzSign}${tzHours}:${tzMinutes}`
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds} ${tz}`
  return formattedDateTime
}
