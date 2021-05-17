function getData(uId) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
        const error=false;
        if(!error){
        console.log("Fetched the data!");
        resolve("skc@gmail.com");
        }
        else{
            reject('error');
        }
        }, 4000);
    }
    )}
    
console.log("start");
var email = getData("skc");
email.then((message)=>{console.log("Email id of the user id is: " + message)});
console.log("end");