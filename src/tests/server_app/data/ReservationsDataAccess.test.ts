import { DataBase } from "../../../app/server_app/data/DataBase"
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { Reservation } from "../../../app/server_app/model/ReservationModel"
import * as IdGenerator from '../../../app/server_app/data/IdGenerator'

const mockInsert = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
const mockGetBy = jest.fn()
const mockGetAllElements = jest.fn()

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: mockInsert,
                update: mockUpdate,
                delete: mockDelete,
                getBy: mockGetBy,
                getAllElements: mockGetAllElements
            }   
        })
    }   
})


describe('ReservationsDataAccess test suite', () => {

    let sut: ReservationsDataAccess

    let resId = '1234'

    let someReservation: Reservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: '05 May 2023',
        endDate: '10 May 2023'
    }

    beforeEach(() => {
        sut = new ReservationsDataAccess()
        expect(DataBase).toHaveBeenCalledTimes(1)
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(resId)
    })

    afterEach(() => {
        jest.clearAllMocks()
        someReservation.id = ''
    })

    it('should return the id of a newly created reservation', async () => {
        mockInsert.mockResolvedValueOnce(resId)

        const actualId = await sut.createReservation(someReservation)

        expect(actualId).toBe(resId)
        expect(mockInsert).toHaveBeenCalledWith(someReservation)

    })

    it('should update a reservation', async () => {
        
        await sut.updateReservation(
            resId,
            'endDate',
            '12 May 2023'
        )

        expect(mockUpdate).toHaveBeenCalledWith(
            resId,
            'endDate',
            '12 May 2023'
        )
    })

    it('should delete a reservation', async () => {
        
        await sut.deleteReservation(resId)

        expect(mockDelete).toHaveBeenCalledWith(resId)
    })

    it('should get a reservation by Id', async () => {
        mockGetBy.mockResolvedValueOnce(someReservation)

        const result = await sut.getReservation(resId)

        expect(result).toBe(someReservation)
        expect(mockGetBy).toHaveBeenCalledWith('id', resId)

    })

    it('should get a reservation by all Elements', async () => {
        mockGetAllElements.mockResolvedValueOnce([someReservation, someReservation])

        const result = await sut.getAllReservations()

        expect(result).toEqual([someReservation, someReservation])
        expect(mockGetAllElements).toBeCalledTimes(1)

    })
})