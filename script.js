let map; //The map variable that is an instance of a google.maps.Map is local to the initialize function. 
         //this forces global scope of map to be reused and initialized in further function calls

$(window).load(function() {

// Intialize our map
  var center = new google.maps.LatLng(47.608013,-122.335167);
  var mapOptions = {
   zoom: 12,
   center: center
  }
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);


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


// submit form
$( "#inputForm" ).submit(function(e) {
    e.preventDefault(); //added to prevent form submission from reloading the page
    let inputZIP= $('#inputForm').find('input[name="searchZIP"]').val();
    let inputGrade = $('#inputForm').find('input[name="grade"]').val();
    // make sure the key in searchParams is a valid field in the Food Safety database
    let searchParams = {'zip_code': inputZIP,
                        'grade': inputGrade,
                        };
    searchURL = generateURL(searchParams);
    //alert( searchURL ); //for testing


    // Retrieve our data and plot it
    $.getJSON(searchURL, function(data, textstatus) {
        myData = data;
      })
        .done(function(){
          //alert('ajax call performed'); //for testing
            $.each(myData, function(i, entry) {
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
});
