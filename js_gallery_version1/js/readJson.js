

function loadImages(){

    fetch("imagesList.json").then(Response=>{return Response.json()}).then(data=>{
        console.log(data);
        console.log(data.length)
        for(let index=0;index<data.imagesList.length;index++){
            var picture = document.createElement("IMG");
            picture.src = data.imagesList[index].url;
            var element = document.getElementById("wrapper");
            element.appendChild(picture);
        }
    });
}

loadImages();




    
