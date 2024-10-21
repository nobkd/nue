import { tests } from 'commonmark-spec'
import { nuemark } from '../index.js'

const skip = []

test('cmark spec', () => {
    for (const test of tests) {
        if (skip.includes(test.number)) continue

        console.log(JSON.stringify(test.markdown))
        expect(nuemark(test.markdown)).toEqual(test.html)
    }
})
