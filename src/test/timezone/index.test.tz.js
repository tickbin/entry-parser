import test from 'tape'
import moment from 'moment'
import Entry from '../../'

test('use timezone offset', t => {
  const timezoneOffset = -720
  const e = new Entry(undefined, '1-2pm did some #stuff', {}, timezoneOffset)
  const { start, end } = e.getDates()

  const yesterday = moment().subtract(1, 'day')

  t.equal(
    moment(start).utcOffset(timezoneOffset).date(),
    yesterday.date(),
    'start is yesterday in relation to server'
  )
  t.equal(
    moment(end).utcOffset(timezoneOffset).date(),
    yesterday.date(),
    'end is yesterday in relation to server'
  )

  t.end()
})
