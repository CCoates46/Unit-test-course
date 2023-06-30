import { test, describe, mock } from 'node:test'
import * as assert from 'node:assert'
import { toUpperCase } from "./utils"

describe('node test trials', () => {

    test('toUpperCase', () => {
        const actual = toUpperCase('abc')
        const expected = 'ABC'

        assert.strictEqual(actual, expected)
    })

    test('some mock', () => {
       
        const toUpperCaseMock = mock.fn((arg) => {
            return toUpperCase(arg)
        }) 

        assert.strictEqual(toUpperCaseMock.mock.calls.length, 0)
        toUpperCaseMock('abc')
        assert.strictEqual(toUpperCaseMock.mock.calls.length, 1)
    })
})