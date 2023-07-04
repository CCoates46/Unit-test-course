//Types

let a = 'Hello!'
let b = 5
let c = false


let someArray:any[] = []
someArray.push(a)
someArray.push(b)


let someArray2: string[] = []
someArray2.push(b as any)

console.log(a)


// User defined Types

interface Person {
    firstName: string,
    lastName: string,
    job?: job,
    isVisitor?: boolean
}

type job = 'Engineer' | 'Programmer'

function generateEmail(input: Person, force?: boolean): string | undefined {
    return input.isVisitor && !force ? undefined : `${input.firstName}.${input.lastName}@gmail.com`
}

function isPerson(potentialPerson: any):boolean {
    return 'firstName' in potentialPerson && 'lastName' in potentialPerson ? true : false
}

function printEmailIfPerson(potentialPerson: any): void  {
    isPerson(potentialPerson) ? console.log(generateEmail(potentialPerson)) : console.log('Input is not a person')
}

printEmailIfPerson({
    firstName: 'John',
    lastName: 'Doe'
})

// console.log(generateEmail({
//     firstName: 'Clare',
//     lastName: 'Coates',
//     isVisitor: true
// }, true))

async function someAsyn() {
    return 'async'
}