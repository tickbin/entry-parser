import test from 'tape'
import moment from 'moment'
import durationParser from '../durationParser'

test('simple hour duration: 5 hours', t => {
  const { date, duration } = durationParser('5 hours')
  t.ok(moment().isSame(date, 'day'), 'parsed as current date')
  t.equal(duration, 18000, 'parsed duration') //  5 hours in seconds

  t.end()
})

test('simple minute duration: 30 minutes', t => {
  const { date, duration } = durationParser('30 minutes')
  t.ok(moment().isSame(date, 'day'), 'parsed as current date')
  t.equal(duration, 1800, 'parsed duration') // 30 minutes in seconds

  t.end()
})

test('hour and minute duration: 5 hours 30 minutes', t => {
  const { date, duration } = durationParser('5 hours 30 minutes')
  t.ok(moment().isSame(date, 'day'), 'parsed as current date')
  t.equal(duration, 19800, 'parsed duration') // 30 minutes in seconds

  t.end()
})

test('chrono input: 5:30 hours', t => {
  const { date, duration } = durationParser('5:30 hours')
  t.ok(moment().isSame(date, 'day'), 'parsed as current date')
  t.equal(duration, 19800, 'parsed duration') // 30 minutes in seconds

  t.end()
})

test('implied date: yesterday 5 hours', t => {
  const { date, duration } = durationParser('yesterday 5 hours')
  t.ok(moment().subtract(1, 'day').isSame(date, 'day'), 'parsed as yesterday')
  t.equal(duration, 18000, 'parsed duration') //  5 hours in seconds

  t.end()
})

test('specified date: Aug 15 5 hours', t => {
  const { date, duration } = durationParser('Aug 15 5 hours')
  t.equal(moment(date).date(), 15, 'date is the 15th day')
  t.equal(moment(date).month(), 7, 'date is Aug')
  t.equal(duration, 18000, 'parsed duration') // 5 hours in seconds

  t.end()
})

test('units in decimal: 1.5 hours 1.5 minutes', t => {
  const { date, duration } = durationParser('1.5 hours 1.5 minutes')
  t.ok(moment().isSame(date, 'day'), 'parsed as current date')
  t.equal(duration, 5490, 'parsed duration')  // 1.5 h and 1.5 m in seconds

  t.end()
})
