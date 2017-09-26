jQuery(window).on('load', (function () {
	// will first fade out the loading animation
	jQuery("#status").fadeOut();
	// will fade out the whole DIV that covers the website.
	jQuery("#preloader").delay(1000).fadeOut();
}));

var count = 0;
var g = 0;
var interval;

function countWords(s){
    s = s.replace(/(^\s*)|(\s*$)/gi,"");	//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");			//2 or more space to 1
    s = s.replace(/\n /,"\n");				// exclude newline with a start spacing
    return s.split(' ').length; 
}

function search() {
	document.getElementById("other-analysis").style.opacity = '1';
	document.getElementById("result").innerHTML = ' ';

	var queryText = document.querySelector('.search').querySelector('.search__input').value

	if(queryText.length < 10 || countWords(queryText) < 4)
	{
		document.getElementById("input-query").innerHTML = "<br><center>(" + queryText + ")</center>";
		document.getElementById("result").innerHTML = "<br><center>Too short for checking.</center>";
		document.getElementById("Sentiment").innerHTML = "";
		document.getElementById("Emotions").innerHTML = "";
		document.getElementById("Entities").innerHTML = "";
		document.getElementById("other-analysis").style.opacity = '0';
		document.getElementById("verdict").style.opacity = '0';
		document.getElementById("h_graph").style.opacity = '0';
		return;
	}

	g = 0;
	g = CustomJustGage("result", "");
	g.refresh(0);

	clearInterval(interval);
	interval = setInterval(function () {
		g.refresh((count += 100) % 200);
	}, 1000);

	setTimeout(analyze(queryText), 0);
}
function percentageToColor(percentage) {
	if (percentage >= 75)
		return "#2ecc71";
	else if (percentage >= 55)
		return "#f39c12";
	else if (percentage >= 45)
		return "#bbbbbb";
	else if (percentage >= 25)
		return "#f39c12";
	else if (percentage >= 0)
		return "#e74c3c";
}

function percentageToText(percentage) {
	if (percentage >= 75)
		return "True";
	else if (percentage >= 55)
		return "Probably True";
	else if (percentage >= 45)
		return "Neutral";
	else if (percentage >= 25)
		return "Probably Fake";
	else if (percentage >= 0)
		return "Fake";
}

function analyze(queryText) {
	document.getElementById("input-query").innerHTML = "";
	document.getElementById("verdict").style.opacity = '0';
	document.getElementById("h_graph").style.opacity = '0';
	document.getElementById("graph").style.opacity = '0';
	document.getElementById("query").style.opacity = '0';
	document.getElementById("other-analysis").style.opacity = '0';
	var query = { query: queryText };
	$.ajax({
		url: "http://ryuzaki.pythonanywhere.com/api/v1/analyze",
		type: "post",
		contentType: "application/json; charset=UTF-8",
		data: JSON.stringify(query),
		datatype: 'json',
		success: function (data) {
			document.getElementById("other-analysis").style.opacity = '1';
			try {
				console.log("success");
				console.log(data);
				clearInterval(interval);
				g.refresh(data['percentage']);
				document.getElementById("verdict").style.opacity = 1;
				document.getElementById("verdict").style.color = percentageToColor(data['percentage']);
				document.getElementById("verdict").innerHTML = percentageToText(data['percentage']);
				if (data['entities'].length != 0)
					my_key = 'entities';
				else my_key = 'keywords';
				joy = 0; sadness = 0; anger = 0; disgust = 0; fear = 0; i = 0; sentiment_val = 0; entities = "";
				for (i = 0; i < data[my_key].length; ++i) {
					joy += data[my_key][i]['emotion']['joy'] * 100;
					sadness += data[my_key][i]['emotion']['sadness'] * 100;
					anger += data[my_key][i]['emotion']['anger'] * 100;
					disgust += data[my_key][i]['emotion']['disgust'] * 100;
					fear += data[my_key][i]['emotion']['fear'] * 100;
					sentiment_val += data[my_key][i]['sentiment']['score'] * 100;
					if (my_key == 'entities')
						entities += data[my_key][i]['text'] + ": " + data[my_key][i]['type'] + "<br>";
					else
						entities += data[my_key][i]['text'] + "<br>";
				}

				text = "Joy: " + (joy / i).toFixed(2) + "%<br>";
				text += "Sadness: " + (sadness / i).toFixed(2) + "%<br>";
				text += "Anger: " + (anger / i).toFixed(2) + "%<br>";
				text += "Disgust: " + (disgust / i).toFixed(2) + "%<br>";
				text += "Fear: " + (fear / i).toFixed(2) + "%<br>";

				document.getElementById("Emotions").innerHTML = text;

				sentiment_val = (sentiment_val / i);
				if (sentiment_val > 0)
					text = "Positive";
				else text = "Negative";

				document.getElementById("Sentiment").innerHTML = text + " " + sentiment_val.toFixed(2) + "%";
				document.getElementById("Entities").innerHTML = entities;

				document.getElementById("other-analysis").style.opacity = '1';
				document.getElementById("input-query").innerHTML = "<br><center>(" + queryText + ")</center>";

				loadChart(data['sources']);
				document.getElementById("h_graph").style.opacity = '1';
				document.getElementById("graph").style.opacity = '1';
			}
			catch (error) {
				clearInterval(interval);
				console.log(error);
				document.getElementById("other-analysis").style.opacity = '0';
				document.getElementById("h_graph").style.opacity = '1';
				document.getElementById("graph").style.opacity = '1';
				document.getElementById("input-query").innerHTML = "<br><center>(" + queryText + ")</center>";
				document.getElementById("Sentiment").innerHTML = "";
				document.getElementById("Emotions").innerHTML = "";
				document.getElementById("Entities").innerHTML = "";
			}
		},
		error: function (data) {
			clearInterval(interval);
			g.refresh(0);
			console.log(data);
			document.getElementById("input-query").innerHTML = "<br><center>(" + queryText + ")</center>";
			document.getElementById("result").innerHTML = "<br><center>Kindly reframe your query with better grammar.</center>";
			document.getElementById("Sentiment").innerHTML = "";
			document.getElementById("Emotions").innerHTML = "";
			document.getElementById("Entities").innerHTML = "";
			document.getElementById("other-analysis").style.opacity = '0';
			document.getElementById("verdict").style.opacity = '0';
			document.getElementById("h_graph").style.opacity = '0';
		}
	});
}

$(document).ready(function () {
	$("#search-input").keypress(function (e) {
		if (e.keyCode == 13) {
			$("#search-btn").click();
		}
	});
});

function CustomJustGage(id, label) {
	var g = new JustGage({
		id: id,
		value: 0,
		valueFontColor: "#a0a2ae",
		hideValue: false,
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
