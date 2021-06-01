
//getting data from a a session storage
function getStorage(table_number){
    return JSON.parse(sessionStorage.getItem(table_number));
}


// searching for a table
//innerText DOM property, represents the text content of a node and its descendants
function searchForTable(){

    let searchText = document.getElementById("tableSearch").value;
    searchText = searchText.toLowerCase();
    console.log(searchText);

    let tableList = document.getElementsByClassName("table-name");

    for(let index=0;index<tableList.length;index++){
        if(tableList[index].innerText.toLowerCase().includes(searchText))
            tableList[index].parentNode.style.display = "";
        else
            tableList[index].parentNode.style.display = "none";
    }
}

//searching menu - by course / by food

function searchForMenu(){

    let searchText = document.getElementById("menuSearch").value;
    searchText = searchText.toLowerCase();
    console.log(searchText);

    let menuList = document.getElementsByClassName("item-name");
    for(let index=0;index<menuList.length;index++){
        if(menuList[index].innerText.toLowerCase().includes(searchText)){
            menuList[index].parentNode.style.display = "";
        }
        else
            menuList[index].parentNode.style.display = "none";
    }
}

//dropTargets => tables
let dropTarget = document.querySelectorAll(".tableNumber");


//draggables => menu items
let draggables = document.querySelectorAll(".menu-items");


//dataTransfer.setData() => we give the id of the element being dragged a name.
for(let i=0;i<draggables.length;i++){
    draggables[i].addEventListener("dragstart",function(ev){
        ev.dataTransfer.setData("srcId",ev.target.id); 
    });
}

//when the menu-item is dragged and left on the target area, dragenter is used.
for(let i=0;i<dropTarget.length;i++){
    dropTarget[i].addEventListener("dragenter",function(ev){
        ev.preventDefault();
        if(ev.target.className === "tableNumber"){
            ev.target.style.background.hover="orange";
        }
    });
}

for(let i=0;i<dropTarget.length;i++){
    dropTarget[i].addEventListener("dragover",function(ev){
        
        ev.preventDefault();
    });
}



//update the sessionStorage, populate the tables like Table-1, Table-2 etc.

for(let i=0;i<dropTarget.length;i++){
    dropTarget[i].addEventListener("drop",function(ev){
        
        ev.preventDefault();
        let target = ev.target;
        let tableSelected = target.id;//table1 or table2 or table3
        let tablePoint = "#"+tableSelected+" "; 
        let srcId = ev.dataTransfer.getData("srcId"); //item1 or item2 or item3 or item4
        let mainPoint = "#"+srcId+" ";
        let itemName = document.querySelector(mainPoint+ ".item-name").textContent;
        let itemPrice = parseFloat(document.querySelector(mainPoint+"p").textContent);

        console.log(itemName);
        console.log(itemPrice);

        let presentPrice = parseFloat(document.querySelector(tablePoint+"#total-price").textContent);
        let presentItems = parseInt(document.querySelector(tablePoint+"#total-items").textContent);


        console.log(tableSelected);
        console.log(presentPrice);
        console.log(presentItems);

        let totalPrice = presentPrice+itemPrice;

        console.log(totalPrice);

        //right upon droopping the menu-item, the total-cost and tota-items placed or that table changes, so render the corresponding html innetext
        document.querySelector(tablePoint+"#total-price").textContent = totalPrice;
       

        //load drag-drop info into session
        //Item name, price, count
        let uploadItemName;
        let uploadItemPrice;
        let uploadItemCount;

        let data = getStorage(tableSelected);
        if(data == null){
            uploadItemCount = 1;
            uploadItemName = itemName;
            uploadItemPrice = itemPrice;
            data = [{uploadItemName,uploadItemPrice,uploadItemCount}];
            sessionStorage.setItem(tableSelected,JSON.stringify(data));
            document.querySelector(tablePoint+"#total-items").textContent = presentItems+1;
            sessionStorage.setItem(tableSelected+"-"+itemName+"-count",1);
            sessionStorage.setItem(tableSelected+"-"+itemName+"-initial",itemPrice);
            data = getStorage(tableSelected);

        }
        else{
            
            let pos = getPosition(data,itemName); 
            //If the same item is being added
            if(pos >= 0){
                
                uploadItemName = itemName;
                uploadItemCount = 1;
                uploadItemPrice = data[pos].uploadItemPrice+itemPrice;
                const update = data.map(element => {
                    if(element.uploadItemName === itemName){
                        return{
                            uploadItemName, uploadItemPrice, uploadItemCount
                        }
                    }
                    else{
                        return element;
                    }
                });
                sessionStorage.setItem(tableSelected, JSON.stringify(update));
                document.querySelector(tablePoint+"#total-items").textContent = presentItems;
                let countServings = sessionStorage.getItem(tableSelected+"-"+itemName+"-count");
                countServings++;
                sessionStorage.setItem(tableSelected+"-"+itemName+"-count",countServings);
                data = getStorage(tableSelected);

            }
            //If a different item is being added
            else{
                uploadItemCount = 1;
                uploadItemName = itemName;
                uploadItemPrice = itemPrice;
                data.push({uploadItemName,uploadItemPrice,uploadItemCount});
                sessionStorage.setItem(tableSelected,JSON.stringify(data));
                document.querySelector(tablePoint+"#total-items").textContent = presentItems+1; //if a different item is added then total-items on the table will change. When the same item is added again the serving count will be updated.
                sessionStorage.setItem(tableSelected+"-"+itemName+"-count",1); //this is to keep a count of the servings
                sessionStorage.setItem(tableSelected+"-"+itemName+"-initial",itemPrice);
                data = getStorage(tableSelected);
            }
        }
        console.log(data);
    });
}


//get the position of an item name inside the table array of objects
function getPosition(data,itemName){
    for(let i = 0;i<data.length;i++){
        if(data[i].uploadItemName === itemName){
            return i;
        }
    }
    return -1;
}


//when you click on a table, you shoul be able to generateb a orderBox, loadModalBox() does that.
for(let i=0;i<dropTarget.length;i++){

    dropTarget[i].addEventListener('click',()=>{
        let tableDetails = dropTarget[i].children;
        let tableName = tableDetails[0].innerHTML;
        loadModalBox(tableName);
    });
}


//myModal 
function loadModalBox(tableName){

    //when you don't have any orders placed on the table, then the orderBox should not be generated
    if(document.querySelector("#"+tableName+" #total-items").textContent === "0"){
        console.log("loadModalBox function - CANNOT "+tableName+" OPEN NO ORDERS");
        alert("No orders placed on this table yet !!");
    }
    else{
        let tableContents = getStorage(tableName);
        if(tableContents != null){
            document.getElementById("myModal").style.display = "block";
            document.getElementById(tableName).style.background = "orange";
            let totalBillPrice = 0;
            document.querySelector("#myModal .modal-header #table-number").innerHTML = tableName;
        
            var tableRows = "<tr><th>S.No.</th><th>Item</th><th>Price(Rs.)</th><th></th><th></th></tr>";

            for(let j=0;j<tableContents.length;j++){
                let servings = sessionStorage.getItem(tableName+"-"+tableContents[j].uploadItemName+"-count");
                console.log("loadMoalBox function - Servings count = "+servings);
                totalBillPrice += tableContents[j].uploadItemPrice;

                if(servings >=1)
                    tableRows += "<tr id='row-"+(j+1)+"'><td>"+(j+1)+"</td><td>"+ tableContents[j].uploadItemName+"</td><td><span id='price-'"+(j+1)+">"+tableContents[j].uploadItemPrice+"</span></td>"+"<td><p class='servings'>Number of Servings</p><input type='number' id='quantity' name='serving-counts' class='counter-"+tableName+"' value='"+(servings)+"' onchange='changeServings(event,"+(j+1)+")' min='1'>"+ "</td><td><i class='fa fa-trash' aria-hidden='true' onclick='deleteItem("+(j+1)+")'></i></td></tr>";
                else
                    tableRows += "<tr id='row-"+(j+1)+"'><td>"+(j+1)+"</td><td>"+ tableContents[j].uploadItemName+"</td><td><span id='price-'"+(j+1)+">"+tableContents[j].uploadItemPrice+"</span></td>"+"<td><p class='servings'>Number of Servings</p><input type='number' id='quantity' name='serving-counts' class='counter-"+tableName+"' value='1' onchange='changeServings(event)' min='1'  >"+ "</td><td><i class='fa fa-trash' aria-hidden='true' onclick='deleteItem("+(j+1)+")'></i></td></tr>";

            }

            document.getElementById("total-bill").innerHTML = totalBillPrice;
            document.getElementById("orders").innerHTML = tableRows;


            //After deleting all the servings, the total price inside the orderBox becomes zero, in that case, generateBill should not be generated.
            if(totalBillPrice == "0"){
                document.getElementById('myModal').style.display = "none";
                document.getElementById(tableName).style.background = "white";
                loadData();
            }
            
        }
    }
}

//When you click on generate bill, a receipt needs to be loaded - receipt modal (myModal2)
function generateBill(event,f){

    var checkOutString = f.parentNode.parentNode.childNodes[1].innerText;
    var checkOutTableName = checkOutString.substring(0,7);//tableName
    console.log(checkOutTableName);
   
    ordercopyTable = f.parentNode.childNodes[1];
    var totalCheckOutBill = f.previousSibling.previousSibling.innerText; //total price
    document.querySelector("#myModal2 .modal-header #checkout-number").innerHTML = checkOutTableName;
    
    tableRowCount = ordercopyTable.rows.length; //number of rows inside a table
        
    var checkOutRows = "<tr><th>S.No.</th><th>Item</th><th>Price Per Serving(Rs.)</th><th>Servings count</th><th>Item price</th></tr>";

    for(let r=1;r<tableRowCount;r++){
        
        var tdList = ordercopyTable.rows[r].cells;
        var tableItemSno = tdList[0].innerText;
        var tableItemName = tdList[1].innerText;
        var tableItemInitialPrice = sessionStorage.getItem(checkOutTableName+"-"+tableItemName+"-initial");
        var servingsPerItem = sessionStorage.getItem(checkOutTableName+"-"+tableItemName+"-count");
        var tableItemPrice = tdList[2].innerText;
        console.log("tableItemSno => "+tableItemSno);
        console.log("tableItemName => "+tableItemName);
        console.log("Initial price (single)=> "+tableItemInitialPrice);
        console.log("serving per item=> "+servingsPerItem);
        console.log("Item price (single price * number of servings) => "+tableItemPrice);
        checkOutRows += "<tr><td>"+tableItemSno+"</td><td>"+tableItemName+"</td><td>"+tableItemInitialPrice+"</td><td>"+servingsPerItem+"</td><td>"+tableItemPrice+"</td></tr>"; 
    }

    document.querySelector("#myModal2 #orders").innerHTML = checkOutRows;
    document.getElementById("receipt-bill").innerHTML = totalCheckOutBill;

    document.getElementById('myModal').style.display = 'none';
    document.getElementById("myModal2").style.display = "block";
    

}


//close the orders box
document.getElementById("close").addEventListener("click", function () {
    document.getElementById('myModal').style.display = "none";
    let tableName = document.querySelector("#myModal .modal-header #table-number").innerHTML;
    document.getElementById(tableName).style.background = "white";
    loadData();
});


//close the receipt
document.getElementById("close-receipt").addEventListener("click", function () {
    document.getElementById('myModal').style.display = 'none';
    let tableName = document.querySelector("#myModal2 .modal-header #checkout-number").innerHTML;
    document.getElementById(tableName).style.background = "white";
    sessionStorage.removeItem(tableName);
    for(let r=1;r<tableRowCount;r++){
        var list = ordercopyTable.rows[r].cells;
        var tableItemName = list[1].innerText;
        sessionStorage.removeItem(tableName+"-"+tableItemName+"-count");
    }
    document.getElementById('myModal2').style.display = 'none';
    loadData();
});








//delete item from the orderBox
function deleteItem(rowPointer){
    console.log(rowPointer);
    let oneRow = document.getElementById("orders").rows[rowPointer].cells; //we have 4 tds inside 1 tr

    let item_name = oneRow[1].innerText;
    let item_price = oneRow[2].childNodes[0].textContent;
    let table_name =  document.querySelector("#myModal .modal-header #table-number").innerHTML;
    console.log("deleteItem function-DELETE FUNCTION - TABLE ROW DETAILS - "+ item_name+" "+item_price);
    console.log("TABLE NAME = "+table_name)
    let tableDetails = getStorage(table_name);

    let update = tableDetails.filter(item => item.uploadItemName !== item_name);
    sessionStorage.setItem(table_name,JSON.stringify(update));
    sessionStorage.removeItem(table_name+"-"+item_name+"-count");
    document.getElementById("orders").deleteRow(rowPointer);
    loadModalBox(table_name);
}


//update servings in the orderBox
function changeServings(event,rowPointer){

    let oneRow = document.getElementById("orders").rows[rowPointer].cells; //we have 4 tds inside 1 tr
    let item_name = oneRow[1].innerText;
    let item_price = oneRow[2].childNodes[0].textContent;
    var value = event.target.value;
   
    
    
    let table_name =  document.querySelector("#myModal .modal-header #table-number").innerHTML;
    let data = getStorage(table_name);
    let initialCost = sessionStorage.getItem(table_name+"-"+item_name+"-initial");
    let serving_price = value*initialCost;
    
    let uploadItemName = item_name;
    let uploadItemCount = 1;
    let uploadItemPrice = serving_price;
    
    const update = data.map(element => {
        if(element.uploadItemName === item_name){
            return{
                uploadItemName, uploadItemPrice, uploadItemCount
            }
        }
        else{
            return element;
        }
    });
    sessionStorage.setItem(table_name, JSON.stringify(update));
    sessionStorage.setItem(table_name+"-"+item_name+"-count",value);
    loadModalBox(table_name);
}











function loadData(){

    let items = document.getElementsByClassName("tableNumber");
    for(let i=0;i<items.length;i++){
        //get the table name
        let tableDetails = items[i].children;
        let tableName = tableDetails[0].innerHTML;
        console.log("LOAD DATA- Table name=>"+tableName);
        let tableStorage = getStorage(tableName);
        if(tableStorage == null){
            console.log(tableName+" is  null!!")
            document.querySelector("#"+tableName+" #total-price").textContent= 0;
            document.querySelector("#"+tableName+" #total-items").textContent = 0;

        }
        else{
            let totalPrice = 0;
            let totalItems = 0;
            for(let j=0;j<tableStorage.length;j++){
                totalPrice+= tableStorage[j].uploadItemPrice;
                totalItems += tableStorage[j].uploadItemCount
            }
            document.querySelector("#"+tableName+" #total-price").textContent= totalPrice;
            document.querySelector("#"+tableName+" #total-items").textContent = totalItems;
        }
    }
}
