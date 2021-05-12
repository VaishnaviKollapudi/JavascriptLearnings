// function fetchFromJsonFile(){

//     fetch("imagesList.json").then(Response=>{return Response.json()}).then(data=>{
//         var storageData = JSON.stringify(data);
//         sessionStorage.setItem("imagesList",storageData);
//     });
// }

function validate(url,name,info,currentDate){
    
    var status = true;
 
  
    if(url.length<1){
        document.getElementById("urlspan").innerHTML = "URL Required";
        status = false;
    }
    if( url.length>500){
        document.getElementById("urlspan").innerHTML = "URL length exceeded!!";
        status = false;
    }
    if(name.length<1){
        console.log("hello");
        document.getElementById("namespan").innerHTML = "Name required";
        console.log("after");
        status = false;
    }
    if(info.length<1){
        document.getElementById("infospan").innerHTML = "Description required";
        status = false;
    }

    if(!currentDate){
        
        document.getElementById("datespan").innerHTML = "Date required";
        status=false;
    }

    return status;
}



function getImagesList(){
    var imagesList = JSON.parse(sessionStorage.getItem("imagesList"));
    return imagesList;
}


function addImage(){
    var url = document.AddForm.url.value;
    var name = document.AddForm.name.value;
    var info = document.AddForm.info.value;
    var currentDate = document.AddForm.currentDate.value;

    var status = validate(url,name,info,currentDate);
    if(status == false){
        return false;
    }
    

    var imagesList = getImagesList();

    if(imagesList == null){
        
        //fetchFromJsonFile();
        imagesList = [{url,name,info,currentDate}];
        sessionStorage.setItem("imagesList",JSON.stringify(imagesList));
        
    }
    else{
        if(isExists(name)){
            const photo = imagesList.map(item => {
                if(item.name === name){
                    return{
                        url, name, info, currentDate
                    }
                }
                else{
                    return item;
                }
            })
            sessionStorage.setItem("imagesList", JSON.stringify(photo));
        }
        else{
            imagesList.push({url, name, info, currentDate});
            sessionStorage.setItem("imagesList", JSON.stringify(imagesList));
        }
    }
    
    loadImagesInGallery();
    return true;
}


function deleteImage(){
    var name = document.deleteForm.name.value;

    var imagesList = getImagesList();

    if(isExists(name)){
        var photo = imagesList.filter(item => item.name !==name);
        sessionStorage.setItem("imagesList", JSON.stringify(photo));
        loadImagesInGallery();
        return true;
    }
    else{
        document.getElementById("namespan").innerHTML = "Inavlid name";
        return false;
    }
}

function isExists(name){
    var imagesList = getImagesList();
    if((imagesList.filter(function(item){
        return item.name == name;         
    })).length > 0){
        return true;
    }
    else{
        return false;
    }
}

function loadImagesInGallery()
{
    var imagesList = JSON.parse(sessionStorage.getItem("imagesList"));
   for(let index=0;index<imagesList.length;index++){
        var picture = document.createElement("IMG");
        picture.src = imagesList[index].url;
        var element = document.getElementById("wrapper");
        element.appendChild(picture);
    }
}
