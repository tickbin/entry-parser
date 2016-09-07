import Duration from 'duration'
import shortid from 'shortid'
import moment from 'moment'
import parser from './parser'
import durationParser from './durationParser'

export const hashPattern = /(#\w+[\w-]*)/g
export const version = 6
export default class Entry {
  constructor(user, originalMessage, opts = {}, timezoneOffset) {
    let { date } = opts
    if (timezoneOffset && !date) {
      //  ensure reference date is in users time and zone
      date = moment().utcOffset(timezoneOffset)
    } else if (!date) {
      date = new Date()
    }

    if (typeof originalMessage === 'object')
      return this._fromObject(originalMessage)

    this.version = version
    this.user = user
    this._id = shortid.generate()
    this.original= originalMessage
    //  ensure ref is a date and not a moment
    this.ref = new Date(date)
    this.parse(originalMessage, date, timezoneOffset)
    this.parseTags(originalMessage)
  }

  _fromObject(doc) {
    Object.assign(this, doc)
    const start = new Date(this.start)
    const end = new Date(this.end)
    const text = this.time
    const message = this.message
    this.setParsedFields({start, end, text, message})
    this.tags = new Set(doc.tags)
    return this
  }

  parse(msg, date, timezoneOffset) {
    const durationParse = durationParser(msg, timezoneOffset)

    if (durationParse.duration > 0) {
      durationParse.time = msg.replace(durationParse.message, '')
      this.setParsedDurationFields(durationParse)
    } else {
      let d = parser(msg, date, timezoneOffset)
      if (d.isRange) this.setParsedFields(d)
    }
  }

  parseTags(message) {
    // Set makes things unique
    this.tags = new Set(message.match(hashPattern))
  }

  setParsedDurationFields(opts) {
    this.createdFrom = 'duration'
    this.start = opts.date
    this.startArr = moment(this.start).utc().toArray()
    this.time = opts.time
    this.message = opts.message
    this.duration = { seconds: opts.duration }
  }

  setParsedFields(opts) {
    this.createdFrom = 'calendar'
    this.hasDates = true
    this.start = opts.start
    this.startArr = moment(this.start).utc().toArray()
    this.end = opts.end
    this.endArr = moment(this.end).utc().toArray()
    this.time = opts.text
    this.message = opts.message
    this.duration = new Duration(this.start, this.end)
  }

  getDates() {
    let start = this.start
    let end = this.end
    return { start, end }
  }

  toObject() {
    return {
      _id: this._id,
      version: this.version,
      ref: this.ref,
      user: this.user,
      original: this.original,
      message: this.message,
      hasDates: this.hasDates,
      start: this.start,
      startArr: this.startArr,
      end: this.end,
      endArr: this.endArr,
      time: this.time,
      tags: [...this.tags],
      duration: this.duration ? {
        seconds: this.duration.seconds,
      } : null
    } 
  }

  static fromObject(doc) {
    let e = new Entry(doc.user, doc)

    return e
  }
}
