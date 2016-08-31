import moment from 'moment'
import chrono from 'chrono-node'

export default function(str, ref, timezoneOffset) {
  const patternHour   = /(\d*\.{0,1}\d+)\s*(hours|hour|hrs|hr|h)([\W]+|$)/i;
  const patternMin    = /(\d*\.{0,1}\d+)\s*(minutes|minute|mins|min|m)([\W]+|$)/i;
  const patternChrono = /(\d*):(\d+)\s*(hours|hour|hrs|hr|h)([\W]+|$)/i

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

  const date = chrono.parseDate(str) || new Date()

  return { date, duration: duration.asSeconds() }
}
