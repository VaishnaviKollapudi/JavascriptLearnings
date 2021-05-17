const button = document.querySelector('button');

function getLocalStorage(){
    return localStorage.getItem("counts");
}
function getSessionStorage(){
    return sessionStorage.getItem("counts");
}
button.addEventListener('click',()=>{

    if(getLocalStorage() == null){
        localStorage.setItem("counts",0);
        document.getElementById("ls").innerHTML = "0";

    }
    else{
        localStorage.setItem("counts",JSON.parse(localStorage.getItem("counts"))+1);
        document.getElementById("ls").innerHTML = JSON.parse(localStorage.getItem("counts"));
    }

     if(getSessionStorage() == null){
        sessionStorage.setItem("counts",0);
        document.getElementById("ss").innerHTML = "0";
    }


    sessionStorage.setItem("counts",JSON.parse(sessionStorage.getItem("counts"))+1);
    document.getElementById("ss").innerHTML = JSON.parse(sessionStorage.getItem("counts"));

});
