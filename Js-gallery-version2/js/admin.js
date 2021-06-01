var important;

//Get the list iof images from the sessionStorage
function getImagesList() {
	var imagesList = JSON.parse(sessionStorage.getItem("imagesList"));
	return imagesList;
}

// validation of ADD IMAGE FORM
function validate(url, name, info, currentDate) {
	var status = true;

	if (url.length < 1) {
		document.getElementById("urlspan").innerHTML = "URL Required";
		status = false;
	}
	if (name.length < 1) {
		document.getElementById("namespan").innerHTML = "Name required";

		status = false;
	}
	if (info.length < 1) {
		document.getElementById("infospan").innerHTML = "Description required";
		status = false;
	}

	if (!currentDate) {
		document.getElementById("datespan").innerHTML = "Date required";
		status = false;
	}

	return status;
}

//add an image, get details from the add form and update the session storage, and load both the gallery and admin page
function addImage() {
	var url = document.AddForm.url.value;
	var name = document.AddForm.name.value;
	var info = document.AddForm.info.value;
	var currentDate = document.AddForm.currentDate.value;

	var status = validate(url, name, info, currentDate);
	if (status == false) {
		return false;
	}

	var imagesList = getImagesList();

	if (imagesList == null) {
		imagesList = [{ url, name, info, currentDate }];
		sessionStorage.setItem("imagesList", JSON.stringify(imagesList));
	} else {
		imagesList.push({ url, name, info, currentDate });
		sessionStorage.setItem("imagesList", JSON.stringify(imagesList));
	}

	loadImagesInGalleryAdmin();
	loadImagesInGallery();

	return true;
}

//delete image
function deleteImage(name) {
	var imagesList = getImagesList();
	console.log(imagesList);
	var photo = imagesList.filter((item) => item.name !== name);
	sessionStorage.setItem("imagesList", JSON.stringify(photo));
	console.log(getImagesList());
	document.getElementById("wrapper").innerHTML = "";
	loadImagesInGalleryAdmin();
	loadImagesInGallery();
}

//In case
function isExists(name) {
	var imagesList = getImagesList();
	if (
		imagesList.filter(function (item) {
			return item.name == name;
		}).length > 0
	) {
		return true;
	} else {
		return false;
	}
}

//load the image without any operations
function loadImagesInGallery() {
	var imagesList = JSON.parse(sessionStorage.getItem("imagesList"));
	for (let index = 0; index < imagesList.length; index++) {
		var picture = document.createElement("IMG");
		picture.src = imagesList[index].url;
		var element = document.getElementById("wrapper-gal");
		element.appendChild(picture);
	}
}

//load images in the gallery admin page, each image has an update and a delete option
function loadImagesInGalleryAdmin() {
	var imagesList = JSON.parse(sessionStorage.getItem("imagesList"));

	console.log(imagesList.length);
	var element = document.getElementById("wrapper");

	for (let index = 0; index < imagesList.length; index++) {
		//div id="image-holder"
		var division = document.createElement("DIV");
		division.setAttribute("id", "image-holder");

		//adds image
		var picture = document.createElement("IMG");
		picture.src = imagesList[index].url;

		//delete button
		var deleteButton = document.createElement("button");
		deleteButton.setAttribute("id", "deleteButton");
		deleteButton.innerHTML = "DELETE";
		deleteButton.setAttribute("data-name", imagesList[index].name);

		//update button
		var updateButton = document.createElement("button");
		updateButton.setAttribute("id", "updateButton");
		updateButton.innerHTML = "UPDATE";
		updateButton.setAttribute("data-name", imagesList[index].name);

		//appending
		division.appendChild(picture);
		division.appendChild(deleteButton);
		division.appendChild(updateButton);
		element.appendChild(division);
	}

	deleteButtons = document.querySelectorAll("#deleteButton");
	deleteButtons.forEach(function (item) {
		item.addEventListener("click", function () {
			console.log("Deleting " + item);
			deleteImage(item.dataset.name);
		});
	});

	updateButtons = document.querySelectorAll("#updateButton");
	updateButtons.forEach(function (item) {
		item.addEventListener("click", function () {
			console.log("updating " + item);
			sessionStorage.setItem("updateList", item.dataset.name);
			location.href = "update.html";
		});
	});
}

//to populate the update form
function populateUpdateForm() {
	let imageToBeUpdated = sessionStorage.getItem("updateList"); //name of the image you want to update

	var imagesList = getImagesList(); //list of images

	var i;
	let imageDetails;
	for (i = 0; i < imagesList.length; i++) {
		if (imagesList[i].name === imageToBeUpdated) {
			imageDetails = [
				imagesList[i].url,
				imagesList[i].info,
				imagesList[i].currentDate,
			];
			document
				.getElementById("updateURL")
				.setAttribute("value", imagesList[i].url);
			document
				.getElementById("updateInfo")
				.setAttribute("value", imagesList[i].info);
			document
				.getElementById("updateDate")
				.setAttribute("value", imagesList[i].currentDate);
			break;
		}
	}
	important = i;
}

function updateImage() {
	const newUrl = document.updateForm.updateURL.value;

	const newInfo = document.updateForm.updateInfo.value;

	const newDate = document.updateForm.updateDate.value;

	var imagesList = getImagesList();
	imagesList[important].url = newUrl;
	imagesList[important].info = newInfo;
	imagesList[important].currentDate = newDate;

	sessionStorage.setItem("imagesList", JSON.stringify(imagesList));
	sessionStorage.removeItem("updateList");
	loadImagesInGallery();
	loadImagesInGalleryAdmin();
	return true;
}

function cancelUpdate() {
	sessionStorage.removeItem("updateList");
}
