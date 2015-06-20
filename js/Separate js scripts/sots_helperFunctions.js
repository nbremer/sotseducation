//////////////////////////////////////////////////////
///////////// General helper functions ///////////////
//////////////////////////////////////////////////////

//Number formats
var numFormatThree = d3.format(".3f"),
	numFormatTwo = d3.format(".2f"),
	numFormatOne = d3.format(".1f"),
	numFormatSI = d3.format(".2s"),
	numFormatPercent = d3.format(".0%"),
	numFormatPercentDec = d3.format(".1%"),
	numFormatCurrency = d3.format("$,"),
	numFormatThousands = d3.format("0,000");
	
// Function to check if the variable is a function or not
function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//Check if string cls is contained in class
function hasClass(element, cls) {
    return (' ' + element.attr("class") + ' ').indexOf(' ' + cls + ' ') > -1;
}
	
/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
    var text = d3.select(this[0][0]),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, 
        y = text.attr("y"),
		x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      };
    };  
};