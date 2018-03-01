$(window).load(function() {
    // Construct the query string
    url = "https://data.kingcounty.gov/resource/gkhn-e8mn.json"
          + '?zip_code=98107&$limit=5'; //hardcoded zipcode parameter...for now, limit to 5 for now
    
    // This doesn't really do anything except show that a URL can be built using form inputs
    $( "#inputForm" ).submit(function( event ) {
      let inputZIP= $('#inputForm').find('input[name="searchZIP"]').val();
      let inputViolation= $('#inputForm').find('input[name="searchViolation"]').val();
      // make sure the key in searchParams is a valid field in the Food Safety database
      let searchParams = {'zip_code': inputZIP,
                          'violation_description': inputViolation
                          };
      let searchURL = generateURL(searchParams);
      alert( searchURL ); //for testing
    });
    
    // Intialize our map
    var center = new google.maps.LatLng(47.608013,-122.335167);
    var mapOptions = {
      zoom: 12,
      center: center
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    // Retrieve our data and plot it
    $.getJSON(url, function(data, textstatus) {
          $.each(data, function(i, entry) {
              console.log(entry);
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(entry.latitude, 
                                                   entry.longitude),
                  map: map,
                  title: location.name
              });
          });
    });
});

//this uses both the key and value strings to build the URL
function generateURL(searchParams) {
    let searchParamString = "";
    for (let key in searchParams) {
        // skip loop if the property is from prototype
        if (!searchParams.hasOwnProperty(key)) continue;
        searchParamString = searchParamString + key + "=" + searchParams[key] + "&"
    }
    // remove the last &
    searchParamString = searchParamString.slice(0, -1); 
    return ("https://data.kingcounty.gov/resource/gkhn-e8mn.json?"
          + searchParamString);
}
//------------------------------start previous code-------------------------------//
/*
    $.ajax({
        url: "https://data.kingcounty.gov/resource/gkhn-e8mn.json",
        type: "GET",
        data: {
          "$limit" : 25000,
        }
    }).done(function(data) {
    	useReturnData(data);
      alert("Retrieved " + data.length + " records from the dataset!");
      //console.log(data[0].zip_code);
    });


function useReturnData(data){
    myData = data;
    
    for (var i=0; i<myData.length; i++){
        if(myData[i].zip_code == "98107"){
        		console.log(myData[i]);
        }
    }
}
*/
//------------------------------end previous code---------------------------------//
/*
function contains(key, val) {
    		for (var i = 0; i < myData.length; i++) {
        		if(myData[i][key] === val){
          			console.log("found data match");
          			//console.log(myData[i]);
          	}
    		}
}

contains("zip_code","98107");
});
*/
