import chrono from 'chrono-node'
import militaryParser from './parsers/militaryParser'
import requireMeridiemRefiner from './refiners/requireMeridiemRefiner'
import impliedAMEndRefiner from './refiners/impliedAMEndRefiner'
import impliedPMStartRefiner from './refiners/impliedPMStartRefiner'
import dayOverlapRefiner from './refiners/dayOverlapRefiner'

const parser = new chrono.Chrono(chrono.options.casualOption())
parser.parsers.push(militaryParser)
parser.refiners.push(requireMeridiemRefiner)
parser.refiners.push(impliedAMEndRefiner)
parser.refiners.push(impliedPMStartRefiner)
parser.refiners.push(dayOverlapRefiner)

export default function(str, ref) {
  let rslt = parser.parse(str, ref)[0]
  let isRange = rslt && rslt.start && rslt.end
  let start = rslt.start ? rslt.start.date() : null
  let end = rslt.end ? rslt.end.date() : null
  let text = rslt.text
  let message = str.replace(text, '').trim()
  return { start, end, text, message, isRange, }
}
