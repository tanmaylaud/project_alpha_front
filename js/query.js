var adjArray = ["Justin Bieber killed in stampede", "Terror attack in London", "Donald Trump is dead", "Emma Watson is pregnant"];

var i = 0;

function chooseWord() {
  
  if (i >= adjArray.length) {
    i = 0;
  }

  var newWord = adjArray[i];
  i++;
  
  return newWord;
}
  
function wordSwap(word) {
  	$("#adj").text(word);
}

$(function() {  
	setInterval(function() { 
    $("#adj").text(chooseWord()) 
  }, 3000);
});