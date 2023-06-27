import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordCheck"



describe('PasswordChecker test suite', () => {

    let sut: PasswordChecker

    beforeEach(() => {
        sut = new PasswordChecker()
    })

    it('Password with less than 8 chars is invalid', () => {
        const actual = sut.checkPassword('1234567')
        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.SHORT)
        
    })

    it('Password with 8 chars or more is valid', () => {
        const actual = sut.checkPassword('12345678')
        expect(actual.valid).not.toContain(PasswordErrors.SHORT)
        
    })

    it('Password with no upper case is invalid', () => {
        const actual = sut.checkPassword('abcd')
        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE)
        
    })

    it('Password with upper case is valid', () => {
        const actual = sut.checkPassword('abcD')
        expect(actual.valid).not.toContain(PasswordErrors.NO_UPPER_CASE)
        
    })

    it('Password with no lower case is invalid', () => {
        const actual = sut.checkPassword('ABCD')
        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE)

    })

    it('Password with lower case is valid', () => {
        const actual = sut.checkPassword('abCD')
        expect(actual.valid).not.toContain(PasswordErrors.NO_LOWER_CASE)
        
    })

    it('Complex password is valid', () => {
        const actual = sut.checkPassword('123abcDE')
        expect(actual.reasons).toHaveLength(0)
        expect(actual.valid).toBe(true)
    })

    it('Admin password with no number is invalid', () => {
        const actual = sut.checkAdminPassword('abcDEfgh')
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER_CASE)
        expect(actual.valid).toBe(false)
    })

    it('Admin password with number is valid', () => {
        const actual = sut.checkAdminPassword('abcDEfg1')
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER_CASE)
    })
})