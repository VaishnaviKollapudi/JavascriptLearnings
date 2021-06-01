function validate(){
    var name=document.contactForm.name.value;
    
    var email=document.contactForm.email.value;  
    var atposition=email.indexOf("@");  
    var dotposition=email.lastIndexOf(".");  
    var status = true;
 
  
    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length ){ 
        document.getElementById("emailspan").innerHTML = "Check your email Id";
        status = false
    } 
    if(email.length<1){
        document.getElementById("emailspan").innerHTML = "Empty email";
        status = false
    }

    if(name.length<1){
        
        document.getElementById("namespan").innerHTML = "Name required";
        status=false;
    }

    return status;
}