import chrono from 'chrono-node'

function parseTime(h24) {
  let hour = parseInt(h24.substr(0, h24.length == 3 ? 1 : 2))
  let minute = parseInt(h24.substr(-2))
  return { hour, minute, }
}

function refine (text, results, opt) {
  const pattern = /([0-9]{3,4}) *- *([0-9]{3,4})/
  const refinedResults = results.map(result => {
    const match = text.match(pattern)
    if(!match) return result

    const yearMismatch = result.start.get('year').toString() === match[1]

    let index = match.index
    let start = parseTime(match[1])
    let end = parseTime(match[2])
    const newResult = new chrono.ParsedResult({
      ref: result.ref, text: match[0], index, start: result.start, end
    })

    newResult.tags['militaryParser'] = true
    newResult.start.assign('hour', start.hour)
    newResult.start.assign('minute', start.minute)
    newResult.start.assign('meridiem', newResult.start.get('hour') < 12 ? 0 : 1)
    newResult.start.impliedValues = {
      day: result.start.get('day'),
      month: result.start.get('month'),
      year: yearMismatch ? result.ref.getFullYear() : result.start.get('year')
    }
    newResult.end.assign('meridiem', newResult.end.get('hour') < 12 ? 0 : 1)

    return newResult
  })

  return refinedResults

}

const militaryRefiner = new chrono.Refiner()
militaryRefiner.refine = refine
export default militaryRefiner
