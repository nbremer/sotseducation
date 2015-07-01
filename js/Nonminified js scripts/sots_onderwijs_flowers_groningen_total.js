///////////////////////////////////////////////////////////////////////////
//////////// State of the State Main Code - Chord Diagram /////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var roseGroningenPadding = 0,
    roseGroningenRadius = 120;

//The data per HBO/MBO	
var roseDataGroningen = {
	WO: [
		[0.073,0,0.03,0.011,0,0,0,0.008,0.011,0.003,0.001,0.01], //MBO
		[0.121,0.009,0.087,0.02,0,0.001,0.007,0.048,0.032,0.029,0,0.02], //HBO
		[0.061,0.007,0.082,0.033,0,0.012,0.019,0.135,0.079,0.079,0,0.049] //WO
		]
};

//The % that stays in each province, for the text in the middle
var roseGroningenDiagonal = {
		WO: [0.844,0.609,0.445]
	};
//Start of in the HBO mode	
var	roseGroningenColors = ["#EFB605", "#E79B01", "#E35B0F", "#DD092D", "#C50046", "#A70A61", "#892E83", "#604BA2", "#2D6AA6", "#089384", "#25AE64", "#7EB852"],
	roseGroningenProvincies = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "N. Brabant", "N. Holland", "Overijssel", "Utrecht", "Zeeland", "Z. Holland"],
	educations = ["MBO","HBO","WO"];
//Create an SVG for each row in the data
var roseGroningenWrapper = d3.select(".dataresource.roseGroningen")
				.selectAll(".windRoses")
					.data(roseDataGroningen["WO"])
				  .enter().append("svg")
					.attr("class", "windRoses")
					.attr("width", (roseGroningenRadius*1.2 + roseGroningenPadding) * 2)
					.attr("height", (roseGroningenRadius + roseGroningenPadding) * 2)
					.attr("id", function(d,i) {return 'pie'+i;});

//Create a g element per data row (province)				  
var flowersGroningen = roseGroningenWrapper.append("g")
					.attr("transform", "translate(" + (roseGroningenRadius + roseGroningenPadding) + "," + (roseGroningenRadius + roseGroningenPadding) + ")");

//Draw the windroses				
drawRosesWO(roseDataGroningen, roseGroningenDiagonal, roseGroningenProvincies, roseGroningenRadius, roseGroningenColors);

///////////////////////////////////////////////////////////////////////////
//////////////////// Draw legends and explanations ////////////////////////
///////////////////////////////////////////////////////////////////////////

function createRoseLegend() {
	
	//Create the needed height and width of the legend so it will fill,
	//but not overflow the div
	var legendRectSize = 10, //dimensions of the colored square
		legendProvincieWidth = 100, //width of one legend square-text element
		legendProvincieHeight = 20, //height of one legend square-text element
		legendWidth = $("#roseGroningenLegendSquares").width(), //the width of the bootstrap div
		legendNumCols = Math.floor(legendWidth / legendProvincieWidth), //what number of columns fits in div
		legendNumRows = Math.ceil(12/legendNumCols),	//what number of rows is needed to place the 12 provinces
		legendHeight = legendNumRows * legendProvincieHeight; //what is the total height needed for the entire legend
					
	//Create container per rect/text pair  
	var legendWrapper = d3.select("#roseGroningenLegendSquares").append("svg")
			.attr("width", legendWidth)
			.attr("height", legendHeight);
	
	var legend = legendWrapper.selectAll('.roseLegendSquare')  	
			  .data(roseGroningenColors)                              
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
			  .attr("fill", "#4F4F4F")
			  .style("font-size", "10px")			  
			  .text(function(d,i) { return roseGroningenProvincies[i]; });  

	//Create the explanation of the three little circles
	var svgRose = 	d3.select("#roseGroningenLegendCircles").append("svg")
		.attr("width", $("#roseGroningenLegendCircles").width())
		.attr("height", $("#roseGroningenLegendCircles").height()/(mobileScreen ? 2 : 3));

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
		.attr("fill", "#4F4F4F")
		.style("font-size", "11px")
		.text("Dit is de provincie Groningen zelf. Omdat het percentage dat in Groningen blijft al binnen in elke plot aangegeven staat, is dit stukje express leeg gelaten")
		.call(wrap, ($("#roseGroningenLegendCircles").width() - 100));			  
};//function createRoseLegend

//Draw the legend
createRoseLegend();

///////////////////////////////////////////////////////////////////////////
///////////////// State of the State - Draw windroses /////////////////////
///////////////////////////////////////////////////////////////////////////

function drawRosesWO(data, diagonal, provincies, radius, color) {
	
	var innerRadius = 0.2 * radius;
	
	var color = d3.scale.ordinal()
		.domain([0,1,2,3,4,5,6,7,8,9,10,11])
		.range(color);
		
	var pieScale = d3.scale.linear()
					.domain([0,0.2])
					.range([0,1]);
					
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return 1;})
		.padAngle(.02);

	var arc = d3.svg.arc()
	  .innerRadius(function (d) { 
			if (d.data < 0.005 ) {return 0;}
			else {return innerRadius;}
	  })
	  .outerRadius(function (d) { 
			if (d.data < 0.005 ) {return 0;} 
			else {return (radius - innerRadius) * pieScale(d.data) + innerRadius;}
	  });

	//Add the windroses
	var flowerSlices = flowersGroningen.selectAll(".solidArc.slice")
		.data(pie)
	  .enter().append("path")
		.attr("fill", function(d,i) { return color(i); })
		.attr("class", "solidArc slice")
		.attr("stroke", "white")
		.attr("d", arc)
		.each(function(d) { this._current = d; }) // store the initial angles
		.on("mouseover", function (d, i, j) { showRoseTooltip.call(this, d, i, j); })
		.on("mouseout",  function (d) { removeRoseTooltip(); });

	//Add the province texts above	
	flowersGroningen.append("text")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.attr("class", "flower titles")
		.attr("fill", "#6E6E6E")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(0," + (-radius + 20) + ")")
	  .text(function(d,i) { return educations[i]; });

	//Add text in center of flower	
	var flowerText = flowersGroningen.append("text")
		.attr("class", "flower value")
		.attr("x", 0)
		.attr("y", -7)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.text(function(d,i) {return numFormatPercent(diagonal["WO"][i]); });	
	flowersGroningen.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 6)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("verhuist");	
	flowersGroningen.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 14)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("niet");


	//Draw the three little grey circles per rose
	var roseLocation = [4,4,4];
	drawRoseCircle(1, 0.05);
	drawRoseCircle(2, 0.125);
	drawRoseCircle(3, 0.22);

	////////////////////////////////////////////////////////////
	////////////////// Button Activity /////////////////////////
	////////////////////////////////////////////////////////////

	//Hide the tooltip when the mouse moves away
	function removeRoseTooltip () {
	  $('.popover').each(function() {
		$(this).remove();
	  }); 
	}
	//Show the tooltip on the hovered over slice
	function showRoseTooltip (d, i, j) {
	  $(this).popover({
		placement: 'auto top',
		container: '.dataresource.rose',
		trigger: 'manual',
		html : true,
		content: function() { 
		  return "<span style='font-size: 11px;'><span style='color: #00A1DE; font-weight: bold;'>" + numFormatPercentDec(d.data) + "</span>" + 
		  " verhuist van " + provincies[roseLocation[j]] + " naar <span style='color: #00A1DE; font-weight: bold;'>" + provincies[i] + "</span></span>"; }
	  });
	  $(this).popover('show')
	}

	//Function to draw little circles at the location that is the province itself
	function drawRoseCircle(radiusCirle, extra) {
		flowersGroningen.append("circle")
			.attr("class", "flower circle")
			.attr("r", radiusCirle)
			.style("fill", "#B5B5B5")
			.attr("transform", function(d,i) { 
				d.angle = Math.PI*2/24 * (2*roseLocation[i]+1);
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + (innerRadius + (extra*radius)) + ",0)"
			});
	}//drawRoseCircle
	
}; //function drawRoses

