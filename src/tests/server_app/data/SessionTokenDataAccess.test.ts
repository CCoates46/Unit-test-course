import { DataBase } from "../../../app/server_app/data/DataBase"
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess"
import * as IdGenerator from '../../../app/server_app/data/IdGenerator'
import { Account } from "../../../app/server_app/model/AuthModel"


const mockInsert = jest.fn()
const mockUpdate = jest.fn()
const mockGetBy = jest.fn()

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: mockInsert,
                update: mockUpdate,
                getBy: mockGetBy,
            }   
        })
    }   
})

const someSession: Account = {
    id: '',
    userName: 'testUser',
    password: 'somePassword'
}


describe('SessionTokenDataAccess test suite', () => {

    let sut: SessionTokenDataAccess

    let tokenId = '1234'

    beforeEach(() => {
        sut = new SessionTokenDataAccess()
        expect(DataBase).toHaveBeenCalledTimes(1)
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(tokenId)
        jest.spyOn(global.Date, 'now').mockReturnValue(0)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should generate a token for an account', async () => {
        mockInsert.mockResolvedValueOnce(tokenId)

        const actualTokenId = await sut.generateToken(someSession)

        expect(actualTokenId).toBe(tokenId)
        expect(mockInsert).toHaveBeenCalledWith({
            id: '',
            userName: someSession.userName,
            valid: true,
            expirationDate: new Date(1000 * 60 * 60)
            })
    })

    it('should invalidate a token', async () => {
        
        await sut.invalidateToken(tokenId)

        expect(mockUpdate).toBeCalledWith(tokenId, 'valid', false)
    })

    it('should check a valid token', async () => {
        mockGetBy.mockResolvedValueOnce({ valid: true })
        
        const actual = await sut.isValidToken({} as any)

        expect(actual).toBe(true)
    })

    it('should check an invalid token', async () => {
        mockGetBy.mockResolvedValueOnce({ valid: false })
        
        const actual = await sut.isValidToken({} as any)

        expect(actual).toBe(false)
    })

    it('should check for a non existent token', async () => {
        mockGetBy.mockResolvedValueOnce(undefined)
        
        const actual = await sut.isValidToken({} as any)

        expect(actual).toBe(false)
        
    })

})