import moment from 'moment'
import chrono from 'chrono-node'

export default function(str, timezoneOffset) {
  const patternHour   = /(\d*\.{0,1}\d+)\s*(hours|hour|hrs|hr|h)\b/i;
  const patternMin    = /(\d*\.{0,1}\d+)\s*(minutes|minute|mins|min|m)\b/i;
  const patternChrono = /(\d*):(\d+)\s*(hours|hour|hrs|hr|h)\b/i

  const hoursMatch   = str.match(patternHour)
  const minutesMatch = str.match(patternMin)
  const chronoMatch  = str.match(patternChrono)

  const duration = moment.duration()

  if (hoursMatch && !chronoMatch)
    duration.add(parseFloat(hoursMatch[1]), 'hours')
  if (minutesMatch && !chronoMatch)
    duration.add(parseFloat(minutesMatch[1]), 'minutes')
  if (chronoMatch)
    duration
    .add(parseInt(chronoMatch[1]), 'hours')
    .add(parseInt(chronoMatch[2]), 'minutes')

  let momentDate = moment()

  //  Make sure momentDate is in user's timezone
  if (timezoneOffset)
    momentDate.utcOffset(timezoneOffset)

  // Strip out time string from message
  let message = str
  .replace(patternChrono, '')
  .replace(patternHour, '')
  .replace(patternMin, '')

  const parsedDate = chrono.parse(message)[0]

  // Strip out date string from message
  const dateStr = parsedDate ? parsedDate.text : ''
  message = message.replace(dateStr, '').trim()

  if (parsedDate) {
    parsedDate.start.assign('timezoneOffset', timezoneOffset)
    momentDate = parsedDate
    .start
    .moment()
  }

  //  Make sure date is noon in UTC
  const originalDayOfMonth = momentDate.date()
  const date = momentDate
  .utc()
  .date(originalDayOfMonth)
  .hour(12)
  .minute(0)
  .second(0)
  .millisecond(0)
  .toDate()

  return { date, duration: duration.asSeconds(), message }
}
