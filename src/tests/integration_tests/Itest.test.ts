import { Account } from "../../app/server_app/model/AuthModel"
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel"
import { Server } from "../../app/server_app/server/Server"
import axios from 'axios'
import { makeAwesomeRequest } from "./utils/http-client"
import { Reservation } from "../../app/server_app/model/ReservationModel"
import * as generated from "../../app/server_app/data/IdGenerator"

describe('Server app integration test', () => {

    let server: Server

    beforeAll(() => {
        server = new Server()
        server.startServer()
    })

    afterAll(() => {
        server.stopServer()
    })

    const someUser:Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }

    const someReservation:Reservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: 'someStartDate',
        endDate: 'someEndDate'
    }

    it('should register new user', async () => {
        const result = await fetch('http://localhost:8080/register', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.userId).toBeDefined()
        console.log(`connectig to address: ${process.env.HOST}`)

    })

    it('should register new user with awesomeRequest', async () => {
        const result = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register'
        }, someUser)

        expect(result.statusCode).toBe(HTTP_CODES.CREATED)
        expect(result.body.userId).toBeDefined()

    })

    let token: string
    it('should login a registered user', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.token).toBeDefined()
        token = resultBody.token

    })

    let createdReservationId: string
    it('should create a reservation if authorised', async () => {
        const result = await fetch('http://localhost:8080/reservation', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.reservationId).toBeDefined()
        createdReservationId = resultBody.reservationId

    })

    it('should get a reservation if authorised', async () => {
        const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method:HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })

        const resultBody = await result.json()

        const expectedReservation = structuredClone(someReservation)
        expectedReservation.id = createdReservationId
        

        expect(result.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toEqual(expectedReservation)

    })

    it('should create and retrieve multiple reservations if authorised', async () => {
        await fetch('http://localhost:8080/reservation', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        })

        const getAllResult = await fetch(`http://localhost:8080/reservation/all`, {
            method:HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })

        const resultBody = await getAllResult.json()

        expect(getAllResult.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toHaveLength(4)
        
    })

    it('should update a reservation if authorised', async () => {
        const updatedResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method:HTTP_METHODS.PUT,
            body: JSON.stringify({
                startDate: 'otherStartDate'
            }),
            headers: {
                authorization: token
            }
        })
        expect(updatedResult.status).toBe(HTTP_CODES.OK)
       
        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method:HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })

        const getRequestBody: Reservation = await getResult.json()
        expect(getRequestBody.startDate).toBe('otherStartDate')

    })

    it('should delete a reservation if authorised', async () => {
        const deleteResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method:HTTP_METHODS.DELETE,
            headers: {
                authorization: token
            }
        })
        expect(deleteResult.status).toBe(HTTP_CODES.OK)
       
        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method:HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })

        expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND)

    })

    it('snapshot demo', async () => {
    
    jest.spyOn(generated, 'generateRandomId').mockReturnValueOnce('1234')

    await fetch('http://localhost:8080/reservation', {
        method:HTTP_METHODS.POST,
        body: JSON.stringify(someReservation),
        headers: {
            authorization: token
        }
    })

    const getResult = await fetch(`http://localhost:8080/reservation/1234`, {
            method:HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        })
    const getRequestBody: Reservation = await getResult.json()

    expect(getRequestBody).toMatchSnapshot()

    })
})
