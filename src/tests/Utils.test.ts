import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils"


describe('Utils test suite', () => {

    describe.only('StringUtils tests', () => {

        let sut = new StringUtils

        beforeEach(() => {
            sut = new StringUtils()
        })


        it('Should return correct Uppercase', () => {
            const actual = sut.toUpperCase('abc')

            expect(actual).toBe('ABC')
        })

        it('Should throw error on invalid argument - function', () => {
            function expectError() {
            const actual = sut.toUpperCase('')
            }
            expect(expectError).toThrow()
            expect(expectError).toThrowError('invalid argument!')
    })

        it('Should throw error on invalid argument - arrow function', () =>{
            expect(()=> {
                sut.toUpperCase('')
            }).toThrowError('invalid argument!')
        })

        it('Should throw error on invalid argument - try catch block', (done) =>{
           try {
                sut.toUpperCase('')
                done('GetStringInfo should throw error for invalid arg!')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty('message', 'invalid argument!')
                done()
            }
        })
    })



    it('should return uppercase of a valid string', () => {
        const sut = toUpperCase
        const expected = 'ABC'

        const actual = sut('abc')

        expect(actual).toBe(expected)
    })
      
    describe('getStringInfo for arg My-String should', () => {
        const actual = getStringInfo('My-String')

        test('return right length', () => {
            expect(actual.characters).toHaveLength(9)
        })

        test('return arg My-String to lowercase', () => {
            expect(actual.lowerCase).toBe('my-string')
        })

        test('return arg My-String to uppercase', () => {
            expect(actual.upperCase).toBe('MY-STRING')
        })

        test('return right characters in arg My-String', () => {
            expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g'])
            expect(actual.characters).toContain<string>('M')
            expect(actual.characters).toEqual(
            expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
        )
        })

        test('return defined extra Info', () => {
            expect(actual.extraInfo).toBeDefined()
        })

        test('return correct extra Info', () => {
            expect(actual.extraInfo).toEqual({})
        })
    })

})