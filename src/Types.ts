

let abc = undefined
const def = null

function getData(): string | undefined {
    return ''
}

const data = getData()

if (data) {
    const someOtherData = data
}

let input: unknown
input = 'Hello'
let someSensitiveValue: string


if(typeof input === 'string'){
    someSensitiveValue = input 
} else {
    console.log('Error')
}

console.log(someSensitiveValue)