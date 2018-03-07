/*
 * When entering a date with no year followed by time in military format,
 * the year should be the current year (not the first 4 digits of the military
 * time).
 *
 * If the date is Jan 15 2018:
 * 'Aug 11 2015-2100' should parse as 'Aug 11 2018 8:15pm - 9:00pm'
 *
 * If the date is Jan 15 2018:
 * 'Aug 11 2015-0300' should parse as 'Aug 11 2018 8:15pm - August 12 2018 3:00am'
 *
 * See https://github.com/tickbin/tickbin/issues/27
 */

import chrono from 'chrono-node'
import moment from 'moment'
import parseTime from '../helpers/parseTime'


function refine (text, results, opt) {
  results.forEach(result => {
    const pattern = /([0-9]{3,4}) *- *([0-9]{3,4})/
    const match = text.match(pattern)
    if (!match) return result
    if (result.start.get('year') === parseInt(match[1])) {
      let start = parseTime(match[1])
      let end = parseTime(match[2])

      const refined = new chrono.ParsedResult({
        start: {
          hour: start.hour,
          minute: start.minute,
          day: result.start.knownValues.day,
          month: result.start.knownValues.month,
          year: moment().year()
        },
        end: {
          hour: end.hour,
          minute: end.minute,
          day: end.hour > start.hour
            ? result.start.knownValues.day
            : result.start.knownValues.day + 1,
          month: result.start.knownValues.month,
          year: moment().year()
        }
      })

      result.start = refined.start
      result.end = refined.end
    }
  })

  return results

}

const militaryRefiner = new chrono.Refiner()
militaryRefiner.refine = refine
export default militaryRefiner
