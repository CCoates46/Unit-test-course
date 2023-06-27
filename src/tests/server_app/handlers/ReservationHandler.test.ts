import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler"
import { IncomingMessage, ServerResponse } from "http"
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel"
import { Reservation } from "../../../app/server_app/model/ReservationModel"



const getRequestBodyMock = jest.fn()

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}))


describe('ReservationHandler test suite', () => {

    let sut: ReservationsHandler

    const request = {
        method: undefined,
        headers: {
            authorization: undefined
        },
        url: undefined
    }

    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const authorizerMock = {
        registerUser: jest.fn(),
        validateToken: jest.fn()
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn()
    }

    const someReservation = {
        id: undefined,
        endDate: new Date().toDateString(),
        startDate: new Date().toDateString(),
        room: 'someRoom',
        user: 'someUser'
    }

    const someReservationID = '12355'

    beforeEach(() => {
        sut = new ReservationsHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            reservationsDataAccessMock as any as ReservationsDataAccess
        )
        request.headers.authorization = 'abcd'
        authorizerMock.validateToken.mockResolvedValueOnce(true)
    })

    afterEach (() => {
        jest.clearAllMocks()
        request.url = undefined
        responseMock.statusCode= 0
    })

    describe('POST Requests', () => {

        beforeEach(() => {
            request.method = HTTP_METHODS.POST
        })

        it('should create a reservation with a valid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce(someReservation)
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationID)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED)
            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED,
                { 'Content-Type': 'application/json' }
                )
            expect(responseMock.write).toBeCalledWith(JSON.stringify({
                reservationId: someReservationID
            }))
        })
    

        it('should not create a reservation with an invalid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce({})

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Incomplete reservation!'))
        })

        it('should not create a reservation with invalid fields', async () => {
            const modifiedSomeReservation = {...someReservation, someField:'123ad'}
            getRequestBodyMock.mockResolvedValueOnce(modifiedSomeReservation)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Incomplete reservation!'))
        })

    describe('GET requests', () => {
        
        beforeEach(() => {
            request.method = HTTP_METHODS.GET
        })
    

        it('should return all reservations for /all request', async () => {
            request.url = '/reservations/all'
            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([someReservation])

            await sut.handleRequest()

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK,
            { 'Content-Type': 'application/json' }
            )
            expect(responseMock.write).toBeCalledWith(JSON.stringify([someReservation]))
        })

        it('should return a reservations for an ID', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)

            await sut.handleRequest()

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK,
            { 'Content-Type': 'application/json' }
            )
            expect(responseMock.write).toBeCalledWith(JSON.stringify(someReservation))
        })

        it('should return not found for a non existant ID', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(`Reservation with id ${someReservationID} not found`))
            })

        it('should return bad request for a missing ID', async () => {
            request.url = `/reservations`
            
            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Please provide an ID!'))
            })
        })
    })

    describe('PUT requests', () => {
        
        beforeEach(() => {
            request.method = HTTP_METHODS.PUT
        })

        it('should update an existing reservations when all valid fields provided', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)
            
            const updateReservation = {
                startDate: 'someDate1',
                endDate: 'someDate2'
            }
            getRequestBodyMock.mockResolvedValueOnce(updateReservation)

            await sut.handleRequest()

            expect(reservationsDataAccessMock.updateReservation).toBeCalledTimes(2)
            expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
                someReservationID,
                'startDate',
                updateReservation.startDate)
            expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
                someReservationID,
                'endDate',
                updateReservation.endDate
            )
            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify(`Updated ${Object.keys(updateReservation)} of reservation ${someReservationID}`))
        })

        it('should return not found when existing ID does not exist', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined)

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(`Reservation with id ${someReservationID} not found`))
        })

        it('should return Bad Request if invalid fields are provided', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)
            getRequestBodyMock.mockResolvedValueOnce({
                startDate1: 'someDate'
            })

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Please provide valid fields to update!'))
        })

        it('should return Bad Request if no fields are provided', async () => {
            request.url = `/reservations/${someReservationID}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation)
            getRequestBodyMock.mockResolvedValueOnce({})

            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Please provide valid fields to update!'))
        })

        it('should return not found when no ID is provided', async () => {
            request.url = `/reservations`
        
            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Please provide an ID!'))
        })        



    })

    describe('DELETE requests', () => {

        beforeEach(() => {
            request.method = HTTP_METHODS.DELETE
        })

        it('should delete a  valid reservation', async () => {
            request.url = `/reservations/${someReservationID}`

            await sut.handleRequest()

            expect(reservationsDataAccessMock.deleteReservation).toBeCalledWith(someReservationID)
            expect(responseMock.statusCode).toBe(HTTP_CODES.OK)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Deleted reservation with id ${someReservationID}`
            ))
        })

        it('should return bad request for a missing ID', async () => {
            request.url = `/reservations`
            
            await sut.handleRequest()

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Please provide an ID!'))
            })
    })

    it('should return nothing for an unauthorised request', async () => {
        request.headers.authorization = '1234'
        authorizerMock.validateToken.mockReset()
        authorizerMock.validateToken.mockResolvedValueOnce(false)

        await sut.handleRequest()

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toBeCalledWith(JSON.stringify('Unauthorized operation!'))
    })

    it('should return nothing if no authorised header is provided', async () => {
        request.headers.authorization = undefined
        
        await sut.handleRequest()

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toBeCalledWith(JSON.stringify('Unauthorized operation!'))
    })

    it('should do nothing if HTTP method is unsupported', async () => {
        request.method = 'HELLO_WORLD'
        
        await sut.handleRequest()

        expect(responseMock.writeHead).not.toBeCalled()
        expect(responseMock.write).not.toBeCalled()
    })
})