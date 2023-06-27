import { OtherStringUtils, calculateComplexity, toUpperCaseWithCb } from "../../app/doubles/otherUtils"



describe.skip('otherUtils test suite', () => {

    describe('OtherStringUtils tests with spies', () => {

        let sut: OtherStringUtils

        beforeEach(() => {
            sut = new OtherStringUtils()
        })

        it('Use a spy to track calls', () => {

            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase')
            sut.toUpperCase('clare')

            expect(toUpperCaseSpy).toBeCalledWith('clare')
        })

        it('Use a spy to track calls to other module', () => {

            const consoleLogSpy = jest.spyOn(console, 'log')
            sut.logString('clare')

            expect(consoleLogSpy).toBeCalledWith('clare')
        })

        it('Use a spy to replace the implementation of a method', () => {

            jest.spyOn(sut, 'callExternalService').mockImplementation(()=> {
                console.log('calling mocked implemetation')
            });
            sut.callExternalService()
        })

    })

    describe.skip('Tracking callbacks with Jest Mocks', () => {

        const callBackMock = jest.fn()

        afterEach(() => {
            jest.clearAllMocks()
        })

        it('Calls callback for invalid argument - track calls', () => {
            const actual = toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined()
            expect(callBackMock).toBeCalledWith('Invalid argument!')
            expect(callBackMock).toBeCalledTimes(1)
        })

        it('Calls callback for valid argument - track calls', () => {
            const actual = toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC')
            expect(callBackMock).toBeCalledWith('called function with abc')
            expect(callBackMock).toBeCalledTimes(1)
        })

    })

    describe.skip('Tracking callbacks', ()=> {

        let cbArgs = []
        let timesCalled = 0

        function callBackMock(arg:string) {
            cbArgs.push(arg)
            timesCalled++
        }

        afterEach(()=> {
            cbArgs = []
            timesCalled = 0
        })

        it('Calls callback for invalid argument - track calls', () => {
            const actual = toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined()
            expect(cbArgs).toContain('Invalid argument!')
            expect(timesCalled).toBe(1)
        })

        it('Calls callback for valid argument - track calls', () => {
            const actual = toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC')
            expect(cbArgs).toContain('called function with abc')
            expect(timesCalled).toBe(1)
        })

    })

    it('To Uppercase - calls callback for valid argument', () => {
        const actual = toUpperCaseWithCb('abc', ()=> {})
        expect(actual).toBe('ABC')
    })


    it('Calculate complexity', () => {
        const someInfo = {
            length: 5,
            extraInfo: {
                field1: 'someInfo',
                field2: 'someOtherInfo'
            }
        }

        const actual = calculateComplexity(someInfo as any)
        expect(actual).toBe(10)
    })
})