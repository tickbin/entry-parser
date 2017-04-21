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

test('returns original message without date or duration', t => {
  const { message } = durationParser('yesterday 5 hours all the #things')
  t.equal(message, 'all the #things', 'stripped date and time from message')

  t.end()
})

test('does not take the first letter from other words', t => {
  const { duration: dh } = durationParser('2 houses')
  t.equal(dh, 0, 'does not take h from \'houses\'')
  const { duration: dm } = durationParser('2.5 mouses')
  t.equal(dm, 0, 'does not take m from \'mouses\'')
  const { duration: dc } = durationParser('2:30 houses')
  t.equal(dc, 0, 'does not take h from \'houses\'')
  t.end()
})

test('supports various unit formats', t => {
  t.test('parses minutes', t => {
    const { duration } = durationParser('30 minutes')
    t.equal(duration, 1800, 'parsed duration')
    const { duration: duration2 } = durationParser('30minutes')
    t.equal(duration2, 1800, 'parsed duration')
    t.end()
  })

  t.test('parses minute', t => {
    const { duration } = durationParser('30 minute')
    t.equal(duration, 1800, 'parsed duration')
    const { duration: duration2 } = durationParser('30minute')
    t.equal(duration2, 1800, 'parsed duration')
    t.end()
  })

  t.test('parses mins', t => {
    const { duration } = durationParser('30 mins')
    t.equal(duration, 1800, 'parsed duration')
    const { duration: duration2 } = durationParser('30mins')
    t.equal(duration2, 1800, 'parsed duration')
    t.end()
  })

  t.test('parses min', t => {
    const { duration } = durationParser('30 min')
    t.equal(duration, 1800, 'parsed duration')
    const { duration: duration2 } = durationParser('30min')
    t.equal(duration2, 1800, 'parsed duration')
    t.end()
  })

  t.test('parses m', t => {
    const { duration } = durationParser('30 m')
    t.equal(duration, 1800, 'parsed duration')
    const { duration: duration2 } = durationParser('30m')
    t.equal(duration2, 1800, 'parsed duration')
    t.end()
  })

  t.test('parses hours', t => {
    const { duration } = durationParser('1 hours')
    t.equal(duration, 3600, 'parsed duration')
    const { duration: duration2 } = durationParser('1hours')
    t.equal(duration2, 3600, 'parsed duration')
    t.end()
  })

  t.test('parses hour', t => {
    const { duration } = durationParser('1 hour')
    t.equal(duration, 3600, 'parsed duration')
    const { duration: duration2 } = durationParser('1hour')
    t.equal(duration2, 3600, 'parsed duration')
    t.end()
  })

  t.test('parses hrs', t => {
    const { duration } = durationParser('1 hrs')
    t.equal(duration, 3600, 'parsed duration')
    const { duration: duration2 } = durationParser('1hrs')
    t.equal(duration2, 3600, 'parsed duration')
    t.end()
  })

  t.test('parses hr', t => {
    const { duration } = durationParser('1 hr')
    t.equal(duration, 3600, 'parsed duration')
    const { duration: duration2 } = durationParser('1hr')
    t.equal(duration2, 3600, 'parsed duration')
    t.end()
  })

  t.test('parses h', t => {
    const { duration } = durationParser('1 h')
    t.equal(duration, 3600, 'parsed duration')
    const { duration: duration2 } = durationParser('1h')
    t.equal(duration2, 3600, 'parsed duration')
    t.end()
  })

  t.end()
})
