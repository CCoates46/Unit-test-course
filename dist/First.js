//Types
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let a = 'Hello!';
let b = 5;
let c = false;
let someArray = [];
someArray.push(a);
someArray.push(b);
let someArray2 = [];
someArray2.push(b);
console.log(a);
function generateEmail(input, force) {
    return input.isVisitor && !force ? undefined : `${input.firstName}.${input.lastName}@gmail.com`;
}
function isPerson(potentialPerson) {
    return 'firstName' in potentialPerson && 'lastName' in potentialPerson ? true : false;
}
function printEmailIfPerson(potentialPerson) {
    isPerson(potentialPerson) ? console.log(generateEmail(potentialPerson)) : console.log('Input is not a person');
}
printEmailIfPerson({
    firstName: 'John',
    lastName: 'Doe'
});
// console.log(generateEmail({
//     firstName: 'Clare',
//     lastName: 'Coates',
//     isVisitor: true
// }, true))
function someAsyn() {
    return __awaiter(this, void 0, void 0, function* () {
        return 'async';
    });
}
