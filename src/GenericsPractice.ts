

//adding generics to a function

function returnKeys<T extends Object> (arg: T) {
    console.log(Object.keys(arg))
    return arg
}

const d = returnKeys({
    abc: 'def'
})

//adding generics to Interfaces

interface Person2 <T> {
    name: string,
    age: number,
    special: T
}

const John: Person2<string> = {
    special: 'This is my special property',
    name: 'John',
    age: 20
}

//adding generics to classes

class Observable <T extends Person2<string>>{

    subscribe(arg:T) {
        console.log(`Subscribed to ${arg.name}`)
    }
}

new Observable<typeof John>().subscribe(John)