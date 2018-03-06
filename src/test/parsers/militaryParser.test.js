import test from 'tape'
import chrono from 'chrono-node'
import moment from 'moment'
import militaryParser from '../../parsers/militaryParser'

const parser = new chrono.Chrono
parser.parsers.push(militaryParser)

test('matches leading zeros 0800-0930', t => {
  const results = parser.parse('0800-0930 worked on things')

  t.equals(results[0].start.get('hour'), 8, 'start is 8 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 8:00 am')
  t.equals(results[0].end.get('hour'), 9, 'end is 9:30 am')
  t.equals(results[0].end.get('minute'), 30, 'end is 9:30 am')
  t.end()
})

test('matches non-leading zeros 1100-1300', t => {
  const results = parser.parse('1100-1300 worked on things')

  t.equals(results[0].start.get('hour'), 11, 'start is 11 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 11:00 am')
  t.equals(results[0].end.get('hour'), 13, 'end is 1:00 pm')
  t.equals(results[0].end.get('minute'), 0, 'end is 1:00 pm')
  t.end()
})

test('adds militaryParser to tags', t => {
  const results = parser.parse('1100-1300 worked on things')

  t.ok(results[0].tags['militaryParser'], 'tagged with militaryParser')
  t.end()
})

test('military time has certain meridiem', t => {
  const results = parser.parse('0800-1300 worked on things')

  t.ok(results[0].start.isCertain('meridiem'))
  t.ok(results[0].end.isCertain('meridiem'))
  t.end()
})

test('set matching text', t => {
  const results = parser.parse('spent 0800-1300 working on things')

  t.equals(results[0].text, '0800-1300', 'sets matching text')
  t.equals(results[0].index, 6, 'sets index')
  t.end()
})

test('military format and date with a year', t => {
  const results = parser.parse('Aug 11 2017 1100-2030')

  t.equals(results[0].start.get('day'), 11, 'day is the 11th')
  t.equals(results[0].start.get('month'), 8, 'month is August')
  t.equals(results[0].start.get('year'), 2017, 'year is 2017')

  t.equals(results[0].start.get('hour'), 11, 'start is 11 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 11:00 am')
  t.equals(results[0].end.get('hour'), 20, 'end is 8 pm')
  t.equals(results[0].end.get('minute'), 30, 'end is 8:30 pm')

  t.end()
})

test('military format with implied date', t => {
  const results = parser.parse('Yesterday 1100-2030')
  const yesterday = moment().subtract(1, 'day')

  t.equals(results[0].start.get('day'), yesterday.date(), 'day is yesterday')
  t.equals(results[0].start.get('month'), yesterday.month()+1, 'month is current month') // Moment starts the month count at 0 (eg. January = 0)
  t.equals(results[0].start.get('year'), yesterday.year(), 'year is current year')

  t.equals(results[0].start.get('hour'), 11, 'start is 11 am')
  t.equals(results[0].start.get('minute'), 0, 'start is 11:00 am')
  t.equals(results[0].end.get('hour'), 20, 'end is 8 pm')
  t.equals(results[0].end.get('minute'), 30, 'end is 8:30 pm')

  t.end()
})

test('military format with mm/dd/yy date format and day span', t => {
  const results = parser.parse('01/01/17 2000-0230')

  t.equals(results[0].start.get('day'), 1, 'start day is the 1st')
  t.equals(results[0].end.get('day'), 2, 'end day is the 2nd')
  t.equals(results[0].start.get('month'), 1, 'month is January')
  t.equals(results[0].start.get('year'), 2017, 'year is 2017')

  t.equals(results[0].start.get('hour'), 20, 'start is 8 pm')
  t.equals(results[0].start.get('minute'), 0, 'start is 8:00 pm')
  t.equals(results[0].end.get('hour'), 2, 'end is 2 am')
  t.equals(results[0].end.get('minute'), 30, 'end is 2:30 am')

  t.end()
})
