//single-liner
const printName = (name) => 'Hi ' + name;
console.log(printName("Vaishu"))


//template values
const printBill = (name,bill) => `Hi ${name}, please pay: Rs.${bill}/-`;
console.log(printBill("Vaishu","90"))



//object deconstruction
const person = {
    name: "Noam Chomsky",
    age: 92,
}

const {name:firstName,age}=person

console.log(firstName);
console.log(age);