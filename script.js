
$(document).ready(function(){
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
*/
});