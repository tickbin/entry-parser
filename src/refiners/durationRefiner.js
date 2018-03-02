/*
 * When entering a time that starts with an implied time descriptor and is
 * followed by a number containing a decimal, the number needs to be
 * parsed out of the message because chrono-node does not handle it correctly.
 *
 * When entering an entry like 'Yesterday 7.5 hours #tag':
 *  result.text should just be 'Yesterday'
 *  chrono-node will return with result.text = 'Yesterday 7.5'
 *
 * These variations are properly handled by chrono-node:
 *  - 'Yesterday 7 hours #tag'
 *  - '7.5 hours Yesterday #tag'
 *
 * See https://github.com/tickbin/parser/issues/35
 */

import chrono from 'chrono-node'

function refine (text, results, opt) {
  results.forEach(result => {
    const hasNum = /\d/.exec(result.text)
    if (hasNum) result.text = result.text.substring(0, hasNum.index)
  })
  return results
}

const durationRefiner = new chrono.Refiner()
durationRefiner.refine = refine
export default durationRefiner
