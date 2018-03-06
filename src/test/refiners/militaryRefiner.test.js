import test from 'tape'
import parser from '../../parser'

test('military format and date without a year', t => {
  const { start, end } = parser('Aug 11 0800-1030')

  t.equals(start.getDate(), 11, 'day is the 11th')
  t.equals(start.getMonth(), 7, 'month is August') // month count starts at 0 (eg. January = 0)
  t.equals(start.getFullYear(), new Date().getFullYear(), 'year is current year')

  t.equals(start.getHours(), 8, 'start is 8 am')
  t.equals(start.getMinutes(), 0, 'start is 11:00 am')
  t.equals(end.getHours(), 10, 'end is 10 pm')
  t.equals(end.getMinutes(), 30, 'end is 10:30 am')

  t.end()
})

test('military format and date without a year, day overlap', t => {
  const { start, end } = parser('Aug 11 2000-0230')

  t.equals(start.getDate(), 11, 'start day is the 11th')
  t.equals(end.getDate(), 12, 'end day is the 12th')
  t.equals(start.getMonth(), 7, 'month is August') // month count starts at 0 (eg. January = 0)
  t.equals(start.getFullYear(), new Date().getFullYear(), 'year is current year')

  t.equals(start.getHours(), 20, 'start is 8 pm')
  t.equals(start.getMinutes(), 0, 'start is 8:00 pm')
  t.equals(end.getHours(), 2, 'end is 2 am')
  t.equals(end.getMinutes(), 30, 'end is 2:30 am')

  t.end()
})
