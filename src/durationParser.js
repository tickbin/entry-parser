import moment from 'moment'
import chrono from 'chrono-node'

export default function(str, timezoneOffset) {
  const patternHour   = /(\d*\.{0,1}\d+)\s*(hours|hour|hrs|hr|h)/i;
  const patternMin    = /(\d*\.{0,1}\d+)\s*(minutes|minute|mins|min|m)/i;
  const patternChrono = /(\d*):(\d+)\s*(hours|hour|hrs|hr|h)/i

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

  const parsedDate = chrono.parse(str)[0]

  if (parsedDate) {
    parsedDate.start.assign('timezoneOffset', 0)
    momentDate = parsedDate
    .start
    .moment()
  }

  //  Make sure date is noon in UTC
  const date = momentDate
  .utc()
  .hour(12)
  .minute(0)
  .second(0)
  .millisecond(0)
  .toDate()

  const text = parsedDate ? parsedDate.text : ''
  const message = str
  .replace(patternChrono, '')
  .replace(patternHour, '')
  .replace(patternMin, '')
  .replace(text, '')
  .trim()

  return { date, duration: duration.asSeconds(), message }
}
