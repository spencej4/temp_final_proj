let map; //The map variable that is an instance of a google.maps.Map is local to the initialize function. 
         //this forces global scope of map to be reused and initialized in further function calls


$(window).load(function() {
    // Construct the query string
    url = "https://data.kingcounty.gov/resource/gkhn-e8mn.json"
          + '?zip_code=98107'; //hardcoded zipcode parameter...for now

    // Intialize our map
    var center = new google.maps.LatLng(47.608013,-122.335167);
    var mapOptions = {
      zoom: 12,
      center: center
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
});


let myData = null;

$.ajax({
    async: false,
    url: "https://data.kingcounty.gov/resource/gkhn-e8mn.json",
    type: "GET",
    data: {
      "$limit" : 5000,
    }
}).done(function(data) {
  myData = data;
  alert(`Retrieved ${data.length} records from the dataset!`);
  return myData;
});

//when user submits a zipcode by clicking submit
$('#zipcode_submit').click(function(){
        //sets local variable to input field value
        let zipcode = $('#zipcode_input').val();
        //calls function and passes the variable as a parameter
        findZipCode(zipcode);
});

//searches for all instances of zipcode value 
function findZipCode(val) {
        let numZipcodes = 0;
        let zipCodeArr =[];
        for (var i = 0; i < myData.length; i++) {
            if(myData[i].zip_code === val){
                //logs object instances which match
                console.log(myData[i]);
                numZipcodes += 1;
                zipCodeArr.push(myData[i]);            }
        }
        alert(`Found ${numZipcodes} matching zipcodes from the dataset!`);
        //console.log(zipCodeArr); //instead here we should be creating new google maps with the new array

        $.each(zipCodeArr, function(i, entry) {
              console.log(entry);
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(entry.latitude, 
                                                   entry.longitude),
                  map: map,
                  title: location.name
              });
          });
}

//when user submits an insepction score by clicking submit
$('#inspection_score_submit').click(function(){
        //sets local variable to input field value
        let score = $('#inspection_score_input').val();
        //calls function and passes the variable as a parameter
        findScore(score);
});

//searches for all instances of inspection score value 
function findScore(val) {
        let numInspScores =0;
        for (var i = 0; i < myData.length; i++) {
            if(myData[i].inspection_score === val){
                //logs object instances which match
                console.log(myData[i]);
                numInspScores += 1;
            }
        }
        alert(`Found ${numInspScores} matching inspections scores from the dataset!`);
}

//extra
//generic function to search data objects keys and values
function findMatch(key, val) {
        alert("running findMatch");
        for (var i = 0; i < myData.length; i++) {
            if(myData[i][key] === val){
                console.log(myData[i]);
            }
        }
}
