function parseTime(h24) {
  let hour = parseInt(h24.substr(0, h24.length == 3 ? 1 : 2))
  let minute = parseInt(h24.substr(-2))
  return { hour, minute, }
}

export default parseTime
