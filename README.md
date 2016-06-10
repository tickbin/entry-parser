A parser to take strings that look like "May 4 2-4pm I did some #stuff" and parse out all the useful information like start/end time, date, tags, etc. into an object.

## Install

```
npm install tickbin-entry-parser
```

## Usage

```javascript
import Parser from 'tickbin-entry-parser'

//  userId may be undefined if you don't wish to associate entry with user
const entry = new Parser(userId, 'May 4 2-4pm I did some #stuff')
//  entry = {
//    version: 4,
//    user: undefined,
//    _id: 'H1yifd_4',
//    message: 'May 4 2-4pm I did some #stuff',
//    ref: Fri Jun 10 2016 10:02:14 GMT-0700 (PDT),
//    hasDates: true,
//    start: Wed May 04 2016 14:00:00 GMT-0700 (PDT),
//    startArr: [ 2016, 4, 4, 14, 0, 0, 0 ],
//    end: Wed May 04 2016 16:00:00 GMT-0700 (PDT),
//    endArr: [ 2016, 4, 4, 16, 0, 0, 0 ],
//    time: 'May 4 2-4pm',
//    duration: {
//      [Number: 7200000]
//      from: Wed May 04 2016 14:00:00 GMT-0700 (PDT),
//      to: Wed May 04 2016 16:00:00 GMT-0700 (PDT)
//    },
//    tags: Set { '#stuff' }
//  }
```

## Building

```
npm install
npm run build
npm test
```
