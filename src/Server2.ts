
interface IServer {

    startServer(): void
    stopServer(): void
}



class Server implements IServer {

    public port: number
    public address: string

    constructor(port: number, address: string) {
        this.port = port
        this.address = address
    }

    async startServer(){
       const data = await this.getData()
        console.log(`Starting server at: ${this.address}: ${this.port} `)
    }

    stopServer(): void {}

     async getData(): Promise<string> {
        return 'data'
    }
}

const someServer2: IServer = new Server(8080, 'localhost')
someServer2.startServer()