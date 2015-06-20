///////////////////////////////////////////////////////////////////////////
//////////// State of the State Main Code - Chord Diagram /////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var //roseMargin = {left: 100, top: 20, right: 30, bottom: 20},
	//roseWidth = 500 - roseMargin.left - roseMargin.right,
    //roseHeight = 1200 - roseMargin.top - roseMargin.bottom,
	rosePadding = 0,
    roseRadius = 120;

//The data per HBO/MBO	
var roseData = {
	HBO: [
		[0,0,0.021,0.007,0.184,0.003,0.003,0.007,0.111,0.035,0,0.01], //Drenthe
		[0.017,0,0.028,0.061,0.028,0.011,0.017,0.204,0.066,0.088,0.006,0.028], //Flevoland
		[0.025,0.026,0,0.019,0.083,0.003,0.012,0.048,0.043,0.011,0,0.018], //Friesland
		[0.003,0.009,0.004,0,0.002,0.015,0.061,0.034,0.051,0.102,0.003,0.043], //Gelderland
		[0.121,0.009,0.087,0.02,0,0.001,0.007,0.048,0.032,0.029,0,0.02], //Groningen
		[0,0.001,0.001,0.027,0,0,0.126,0.023,0.009,0.017,0,0.017], //Limburg
		[0.001,0.003,0,0.044,0.001,0.033,0,0.026,0.002,0.025,0.013,0.066], //Noord-Brabant
		[0.001,0.013,0.004,0.01,0.006,0.008,0.01,0,0.006,0.058,0.001,0.046], //Noord-Holland
		[0.015,0.018,0.015,0.108,0.016,0.005,0.023,0.035,0,0.036,0.002,0.055], //Overijssel
		[0.002,0.01,0.004,0.059,0.001,0.005,0.032,0.131,0.015,0,0.004,0.076], //Utrecht
		[0,0.004,0,0.008,0,0,0.112,0.008,0.008,0,0,0.124], //Zeeland
		[0.001,0.004,0.002,0.01,0.001,0.002,0.026,0.057,0.007,0.038,0.007,0] //Zuid-Holland
		],
	MBO: [
		[0,0.004,0.013,0.009,0.106,0.003,0.006,0.013,0.062,0.009,0,0.004], //Drenthe
		[0.004,0,0.008,0.038,0.004,0,0.01,0.188,0.032,0.034,0.002,0.008], //Flevoland
		[0.021,0.009,0,0.012,0.037,0.002,0.001,0.02,0.016,0.005,0,0.006], //Friesland
		[0.003,0.007,0.003,0,0,0.005,0.031,0.018,0.042,0.059,0,0.014], //Gelderland
		[0.073,0,0.03,0.011,0,0,0,0.008,0.011,0.003,0.001,0.01], //Groningen
		[0,0.001,0,0.012,0.001,0,0.068,0.003,0.002,0.005,0,0.002], //Limburg
		[0.002,0,0,0.015,0,0.02,0,0.008,0.003,0.005,0.009,0.019], //Noord-Brabant
		[0.001,0.006,0.001,0.011,0.002,0.001,0.009,0,0.006,0.016,0,0.019], //Noord-Holland
		[0.021,0.013,0.004,0.053,0.006,0.007,0.007,0.01,0,0.016,0.001,0.014], //Overijssel
		[0.003,0.002,0,0.064,0.001,0.003,0.014,0.065,0.003,0,0,0.027], //Utrecht
		[0.002,0,0,0.003,0,0.002,0.076,0.009,0.009,0.003,0,0.04], //Zeeland
		[0.001,0.001,0.001,0.008,0.002,0.001,0.017,0.034,0.003,0.022,0.006,0] //Zuid-Holland
		]
};

//The % that stays in each province, for the text in the middle
var roseDiagonal = {
		HBO: [0.608, 0.429, 0.688, 0.663, 0.609, 0.764, 0.764, 0.818, 0.656, 0.652, 0.69, 0.83],
		MBO: [0.764, 0.67, 0.861, 0.813, 0.844, 0.898, 0.91, 0.918, 0.844, 0.814, 0.833, 0.898]
	};
//Start of in the HBO mode	
var	chosen = "HBO",
	//roseColors = ["#9E0041", "#C9364C", "#E95C48", "#F98A4D", "#FEBC6D", "#FBE18A", "#E8F196", "#BCE3A0", "#86CFA3", "#56ACAE", "#467DB6", "#5E4EA1"],
	roseColors = ["#EFB605", "#E79B01", "#E35B0F", "#DD092D", "#C50046", "#A70A61", "#892E83", "#604BA2", "#2D6AA6", "#089384", "#25AE64", "#7EB852"],
	roseProvincies = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "N. Brabant", "N. Holland", "Overijssel", "Utrecht", "Zeeland", "Z. Holland"];
//Create an SVG for each row in the data
var roseWrapper = d3.select(".dataresource.rose")
				.selectAll(".windRoses")
					.data(roseData[chosen])
				  .enter().append("svg")
					.attr("class", "windRoses")
					.attr("width", (roseRadius + rosePadding) * 2)
					.attr("height", (roseRadius + rosePadding) * 2)
					.attr("id", function(d,i) {return 'pie'+i;});

//Create a g element per data row (province)				  
var flowers = roseWrapper.append("g")
					.attr("transform", "translate(" + (roseRadius + rosePadding) + "," + (roseRadius + rosePadding) + ")");

//Draw the windroses				
drawRoses(roseData, roseDiagonal, roseProvincies, roseRadius, roseColors);

///////////////////////////////////////////////////////////////////////////
//////////////////// Draw legends and explanations ////////////////////////
///////////////////////////////////////////////////////////////////////////

function createRoseLegend() {
	
	//Create the needed height and width of the legend so it will fill,
	//but not overflow the div
	var legendRectSize = 10, //dimensions of the colored square
		legendProvincieWidth = 100, //width of one legend square-text element
		legendProvincieHeight = 20, //height of one legend square-text element
		legendWidth = $("#roseLegendSquares").width(), //the width of the bootstrap div
		legendNumCols = Math.floor(legendWidth / legendProvincieWidth), //what number of columns fits in div
		legendNumRows = Math.ceil(12/legendNumCols),	//what number of rows is needed to place the 12 provinces
		legendHeight = legendNumRows * legendProvincieHeight; //what is the total height needed for the entire legend
					
	//Create container per rect/text pair  
	var legendWrapper = d3.select("#roseLegendSquares").append("svg")
			.attr("width", legendWidth)
			.attr("height", legendHeight);
	
	var legend = legendWrapper.selectAll('.roseLegendSquare')  	
			  .data(roseColors)                              
			  .enter().append('g')   
			  .attr('class', 'roseLegendSquare')                                
			  .attr('width', legendProvincieWidth)
			  .attr('height', legendProvincieHeight)
			  .attr("transform", function(d,i) { return "translate(" + (Math.floor(i/legendNumRows) * 100) + "," + (i%legendNumRows * 20) + ")"; });
	  
		//Append circles to Legend
		legend.append('rect')                                     
			  .attr('width', legendRectSize) 
			  .attr('height', legendRectSize) 			  
			  .attr('transform', 'translate(' + 10 + ',' + 0 + ')') 		  
			  .style('fill', function(d) {return d;});                                  
		//Append text to Legend
		legend.append('text')                                     
			  .attr('transform', 'translate(' + (legendRectSize + 10 + 5) + ',' + (legendRectSize/2) + ')')
			  .style("text-anchor", "start")
			  .attr("dy", ".35em")
			  .attr("fill", "#949494")
			  .style("font-size", "10px")			  
			  .text(function(d,i) { return roseProvincies[i]; });  

	//Create the explanation of the three little circles
	var svgRose = 	d3.select("#roseLegendCircles").append("svg")
		.attr("width", $("#roseLegendCircles").width())
		.attr("height", $("#roseLegendCircles").height()/3);

	svgRose.selectAll(".flowerLegend.circle")
		.data([1,2,3])
		.enter().append("circle")
		.attr("class", "flowerLegend circle")
		.attr("r", function(d) { return d; })
		.style("fill", "#B5B5B5")
		.attr("transform", function(d,i) { 
			return "translate(" + (i * 10 + 10) + ",10)";
		});
	svgRose.append("text")
		.attr("x", 50)
		.attr("y", 10)
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.attr("fill", "#949494")
		.style("font-size", "11px")
		.text("Geeft aan dat dit de provincie zelf is. Dit stukje is leeg gelaten en het percentage van afgestudeerden dat " +
			  "na 1.5 jaar in dezelfde provincie woont staat in het midden van elke plot")
		.call(wrap, ($("#roseLegendCircles").width() - 60));			  
};//function createRoseLegend

//Draw the legend
createRoseLegend();

