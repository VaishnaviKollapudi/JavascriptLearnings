const nameOfInitials = (firstName,lastName)=>{
    return firstName[0]+lastName[0];
}
document.getElementById("demo1").innerHTML = nameOfInitials("Vaishnavi","Kollapudi");