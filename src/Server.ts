


abstract class BaseServer {

    protected port: number
    protected address: string

    constructor(port: number, address: string) {
        this.port = port
        this.address = address
    }

    startServer(){
        console.log(`Starting server at: ${this.address}: ${this.port} `)
    }

    abstract stopServer(): void
}

class DbServer extends BaseServer {

    stopServer(): void {
        console.log('stopping server')
    }

    constructor(port: number, address: string) {
        super(port, address)
        console.log('calling db server constructor')
    }

}

const someServer = new DbServer(8080, 'localhost')
someServer.startServer()
someServer.stopServer()