function CustomJustGage(id, label)
{   
	var g = new JustGage({
		id: id,
		//pointer: true,
		//pointerOptions: {
		//	toplength: 5,
		//	bottomlength: 15,
		//	bottomwidth: 1.5
		//},
		value: 0,
		hideValue: true,
		min: 0,
		max: 100,
		donutStartAngle: 270,
		gaugeWidthScale: 0.2,
		refreshAnimationTime: 1000,
		refreshAnimationType: "<>",
		hideInnerShadow: true,
		donut: true,
		label: label,
		labelMinFontSize: 100,
		gaugeColor: "#f000",
		levelColors: [
		"#e74c3c",
		"#f39c12",
		"#2ecc71"
		]
	});
	return g;
}

var count = 0;
var g =0;
var interval;
function search()
{   document.getElementById("RES").style.opacity='1';

    document.getElementById("result").innerHTML=' ';
     g=0;
	 g = CustomJustGage("result", "Possibility of\nTruth");
	g.refresh(0);

	clearInterval(interval);
	interval = setInterval(function() {
		g.refresh((count += 100) % 200);
	}, 1000);

	setTimeout(function() {analyze()}, 0);
}

function analyze()
{   document.getElementById("query").style.opacity='0';
	var query = {query: document.querySelector('.search').querySelector('.search__input').value};
	$.ajax({
		url: "http://ryuzaki.pythonanywhere.com/api/v1/analyze",
		type: "post",
		contentType: "application/json; charset=UTF-8",
		data: JSON.stringify(query),
		datatype: 'json',
		success: function(data){
			console.log(data);
			clearInterval(interval);
			g.refresh(data['percentage']);
			joy=0;sadness=0;anger=0;disgust=0;fear=0;i=0;sentiment_val=0;entities="";
			for(i = 0; i < data['entities'].length; ++i){
				joy += data['entities'][i]['emotion']['joy']*100;
				sadness += data['entities'][i]['emotion']['sadness']*100;
				anger += data['entities'][i]['emotion']['anger']*100;
				disgust += data['entities'][i]['emotion']['disgust']*100;
				fear += data['entities'][i]['emotion']['fear']*100;
				sentiment_val += data['entities'][i]['sentiment']['score'] * 100;
				entities += data['entities'][i]['text'] + ": " + data['entities'][i]['type'] + "<br>";
			}
			text = "Joy: " + (joy/i).toFixed(2) + "%<br>";
			text += "Sadness: " + (sadness/i).toFixed(2) + "%<br>";
			text += "Anger: " + (anger/i).toFixed(2) + "%<br>";
			text += "Disgust: " + (disgust/i).toFixed(2) + "%<br>";
			text += "Fear: " + (fear/i).toFixed(2) + "%<br>";
           
			document.getElementById("Emotions").innerHTML = text;
		

			sentiment_val = (sentiment_val/i);
			if(sentiment_val > 0)
				text = "Positive";
			else text = "Negative";

			document.getElementById("Sentiment").innerHTML = text+ " " + sentiment_val.toFixed(2) + "%";
			document.getElementById("Entities").innerHTML = entities;

			document.getElementById("RES").style.opacity='1';
		    

		},
		error: function(){
			clearInterval(interval);
			g.refresh(0);
			document.getElementById("result-text").innerHTML = "Sorry for the Inconvenience";
		}
	});
}

$(document).ready(function(){
	$("#search-input").keypress(function(e){
		if(e.keyCode==13)
		{
			$("#search-btn").click();
		}
	});
});