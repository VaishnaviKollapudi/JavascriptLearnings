// function sayHello(name){
//     alert("HELLO "+name);
//     return name;
// }
// function getName(){
//     var person = prompt("Enter your name: ");
//     return person;
// }
// sayHello(getName());



const sumUp = function(resultDisplayer, ...numbers){

    let sum = 0;
    for(const num of numbers){
        sum += num;
    }
    resultDisplayer(sum);
}
const subtractUp = function(resultDisplayer, ...numbers){

    let value = 0;
    for(const num of numbers){
        value -= num;
    }
    resultDisplayer(value);
}

const showResult = (messageText, result)=>{
    //first parameter always goes to bind()
    alert(messageText + " "+ result);
}

sumUp(showResult.bind(this,"The result after adding is :"),1,2,3,4,5);
subtractUp(showResult.bind(this,"The result after subtraction is : "),1,2,13,4,15);

