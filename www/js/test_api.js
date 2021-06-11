const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://cat-fact.herokuapp.com/facts",
	"method": "GET",

};

$.ajax(settings).done(function (response) {
	    console.log(response[0].text);
        
    var content = response[0].text;
    $("#json").append(content);
});

console.log("lalalala");