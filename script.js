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
