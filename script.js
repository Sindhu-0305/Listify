/*if we need to use import or export function it is must to set type = module in html */
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase , ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

/*refers as objects*/
const appsettings = {
    databaseURL:"https://fir-bc808-default-rtdb.europe-west1.firebasedatabase.app/"
};
/*connecting our website to the database */
const app=initializeApp(appsettings);
const database=getDatabase(app);
/*create reference */
const shoppinglistindb=ref(database, "shoppinglist");

const inputfieldel=document.getElementById("inputfield");
const addbuttonel=document.getElementById("addbutton");
const shoppinglistel=document.getElementById("shopping-list");
addbuttonel.addEventListener("click",function(){
    
    let inputvalue=inputfieldel.value;
    if(inputvalue==""){
        alert("Empty item cannot be added !!")
        return;
    }
    /*push the datas into database */
    push(shoppinglistindb, inputvalue);
    /*security rules: set both the rules to true so that the datas can be added to the database, then set the write rule to false so no one can interrupt the database - before, it is set to a time called unix epoch time (a time representing a particular date after which changes cannot be made to the database) */
    clearinputfield();
    // console.log(inputvalue);
});



/*to fetch items from database onValue function is used before which it has to be  imported*/
/*The snapshot contains the actual data stored at the specified location in your database. */
onValue(shoppinglistindb, function(snapshot){
    
    
    /*on deleting the last item we also deleted the shopping list reference and when the reference no longer exists the onvalue function fails so at that point we dont get a snapshot caz no one exists so we check if snapshot exists else change the innerhtml of the ul to some text */
     if(snapshot.exists()){
        let itemsarray=Object.entries(snapshot.val());
      
      
       /*to remove the items that already exists while adding a newer item to the list, like it duplicates the list items and gets added to it in the end */
        clearlistel();
        for(let i=0; i<itemsarray.length;i++){
          let items=itemsarray[i];
          let curritemid=items[0];
          let curritemval=items[1];
          appenditemtoshoppinglist(items);
      }
     }
     else{
        shoppinglistel.innerHTML="No items here..yet !";
     }


     
    });
    
    function clearlistel(){
        shoppinglistel.innerHTML="";
    }








function clearinputfield(){
    inputfieldel.value="";

}

function appenditemtoshoppinglist(item){
    // shoppinglistel.innerHTML+=`<li>${itemvalue}</li>`;/*backticks */
    let itemid=item[0];
    let itemvalue=item[1];
   
    let newel= document.createElement("li");
    newel.textContent=itemvalue;
    newel.addEventListener("click",function(){
    let exactlocationindb= ref(database, `shoppinglist/${itemid}`);
    remove(exactlocationindb);
})




    shoppinglistel.append(newel);
}
/*object to array=> Objects.values(objectname) gets the values of the object , .keys gets the keys of the object whereas entries get both key and values of the object */

