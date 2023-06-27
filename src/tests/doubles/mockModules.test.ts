
jest.mock('../../app/doubles/otherUtils.ts', () => ({
    ...jest.requireActual('../../app/doubles/otherUtils.ts'),
    calculateComplexity: ()=> {return 10}
}))

jest.mock('uuid', () => ({
    v4: () => '1234'
}))

import * as OtherUtils from '../../app/doubles/otherUtils';

describe('module tests', () => {

    it('Should calculate complexity', () => {
        const result = OtherUtils.calculateComplexity({} as any)
        expect(result).toBe(10)
    })

    it('Should keep other functions', () => {
        const result = OtherUtils.toUpperCase('clare')
        expect(result).toBe('CLARE')
    })

    it('String with ID', () => {
        const result = OtherUtils.toLowerCaseWithID('CLARE')
        expect(result).toBe('clare1234')
    })
})