///////////////////////////////////////////////////////////////////////////
/////// State of the State - Onderwijs Main Code - Scatter plots //////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var scatterMargin = {left: 50, top: 50, right: 20, bottom: 50},
	scatterWidth = Math.min($(".dataresource.scatterMBO").width(),600) - scatterMargin.left - scatterMargin.right,
	scatterHeight = scatterWidth*2/3;
	
var	circleLegendMargin = {left: 10, top: 10, right: 10, bottom: 10},
	circleLegendWidth = $(".dataresource.scatterLegendCircle").width() - circleLegendMargin.left - circleLegendMargin.right,
	circleLegendHeight = 100;

//Create and SVG for each element
var svgScatterMBO = d3.select(".dataresource.scatterMBO").append("svg")
			.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
			.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

var svgScatterHBO = d3.select(".dataresource.scatterHBO").append("svg")
			.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
			.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));	

var svgCircleLegend = d3.select(".dataresource.scatterLegendCircle").append("svg")
			.attr("width", (circleLegendWidth + circleLegendMargin.left + circleLegendMargin.right))
			.attr("height", (circleLegendHeight + circleLegendMargin.top + circleLegendMargin.bottom));		

//Create and g element for each SVG			
var scatterMBO = svgScatterMBO.append("g").attr("class", "chartMBO")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
		
var scatterHBO = svgScatterHBO.append("g").attr("class", "chartHBO")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");

var circleLegend = svgCircleLegend.append("g").attr("class", "legendWrapper")
				.attr("transform", "translate(" + (circleLegendWidth/2 + circleLegendMargin.left) + "," + (circleLegendMargin.top + 20) +")");

///////////////////////////////////////////////////////////////////////////
/////////////////// Scatterplot specific functions ////////////////////////
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
///////////////// Create the legends in the middle ////////////////////////
///////////////////////////////////////////////////////////////////////////
function createScatterLegend() {
	
	var margin = {left: 10, top: 10, right: 10, bottom: 10},
		legendRectSize = 15, //dimensions of the colored square
		legendSectorWidth = 150, //width of one legend square-text element
		legendSectorHeight = 30, //height of one legend square-text element
		legendWidth = $(".dataresource.scatterLegend").width(), //the width of the bootstrap div
		legendNumCols = Math.min(Math.floor(legendWidth / legendSectorWidth), 7), //what number of columns fits in div
		legendNumRows = Math.ceil(7/legendNumCols),	//what number of rows is needed to place the sectors
		legendHeight = legendNumRows * legendSectorHeight, //what is the total height needed for the entire legend
		legendWidth = legendSectorWidth * legendNumCols;
		
	//Create container per rect/text pair  
	var legendWrapper = d3.select(".dataresource.scatterLegend").append("svg")
			.attr("width", legendWidth)
			.attr("height", legendHeight + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + 0 + "," + margin.top +")");;
	
	//Create container per rect/text pair  
	var sectorLegend = legendWrapper.selectAll('.scatterLegendSquare')  	
			  .data(sectorColor.range())                              
			  .enter().append('g')   
			  .attr('class', 'scatterLegendSquare')                                
			  .attr('width', legendSectorWidth)
			  .attr('height', legendSectorHeight)
			  .attr("transform", function(d,i) { return "translate(" + (i%legendNumCols * legendSectorWidth) + "," + (Math.floor(i/legendNumCols) * 30) + ")"; })
			  .style("cursor", "pointer")
			  .on("mouseover", sectorSelect(0.02))
			  .on("mouseout", sectorSelect(0.7))
			  .on("click", sectorClick);
			  
	//Non visible white rectangle behind square and text for better UX
	sectorLegend.append('rect')                                     
		  .attr('width', legendSectorWidth) 
		  .attr('height', legendSectorHeight) 			  
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')') 		  
		  .style('fill', "white");
	//Append small squares to Legend
	sectorLegend.append('rect')                                     
		  .attr('width', legendRectSize) 
		  .attr('height', legendRectSize) 			  
		  .attr('transform', 'translate(' + 10 + ',' + 0 + ')') 		  
		  .style('fill', function(d) {return d;});                                 
	//Append text to Legend
	sectorLegend.append('text')                                     
		  .attr('transform', 'translate(' + (legendRectSize + 15) + ',' + (legendRectSize/2) + ')')
		  .attr("class", "legendText")
		  .style("text-anchor", "start")
		  .attr("dy", ".30em")
		  //.attr("fill", "#949494")
		  .style("font-size", "11px")			  
		  .text(function(d,i) { return sectorColor.domain()[i]; });  
		
}//function createScatterLegend

///////////////////////////////////////////////////////////////////////////
///////////////////// Click functions for legend //////////////////////////
///////////////////////////////////////////////////////////////////////////

//Reset the click event when the user clicks anywhere but the legend
d3.select(".scatterOnderwijs").on("click", resetClick);

//Function to show only the circles for the clicked sector in the legend
function sectorClick(d,i) {
	
	event.stopPropagation();

	//deactivate the mouse over and mouse out events
	d3.selectAll(".scatterLegendSquare")
		.on("mouseover", null)
		.on("mouseout", null);
		
	//Chosen study sector
	var chosen = sectorColor.domain()[i];

	/////////////////// MBO ///////////////////	
	//Only show the circles of the chosen sector
	scatterMBO.selectAll("circle")
		.style("opacity", 0.7)
		.style("visibility", function(d) {
			if (d.Studie_sector != chosen) return "hidden";
			else return "visible";
		});

	//Make sure the pop-ups are only shown for the clicked on sector
	scatterMBO.selectAll(".voronoi.MBO")
		.on("mouseover", function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return showScatterTooltip.call(this, d, i);
		})
		.on("mouseout",  function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return removeScatterTooltip.call(this, d, i);
		});
		
	/////////////////// HBO ///////////////////	
	//Only show the circles of the chosen sector
	scatterHBO.selectAll("circle")
		.style("opacity", 0.7)
		.style("visibility", function(d) {
			if (d.Studie_sector != chosen) return "hidden";
			else return "visible";
		});
	
	//Make sure the pop-ups are only shown for the clicked on sector
	scatterHBO.selectAll(".voronoi.HBO")
		.on("mouseover", function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return showScatterTooltip.call(this, d, i);
		})
		.on("mouseout",  function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return removeScatterTooltip.call(this, d, i);
		});
	
}//sectorClick

//Show all the cirkels again when clicked outside legend
function resetClick() {	

	//Activate the mouse over and mouse out events of the legend
	d3.selectAll(".scatterLegendSquare")
		.on("mouseover", sectorSelect(0.02))
		.on("mouseout", sectorSelect(0.7));

	/////////////////// MBO ///////////////////	
	//Show all circles
	scatterMBO.selectAll("circle")
		.style("opacity", 0.7)
		.style("visibility", "visible");

	//Activate all pop-over events
	scatterMBO.selectAll(".voronoi.MBO")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });
		
	/////////////////// HBO ///////////////////	
	//Show all circles
	scatterHBO.selectAll("circle")
		.style("opacity", 0.7)
		.style("visibility", "visible");
	
	//Activate all pop-over events
	scatterHBO.selectAll(".voronoi.HBO")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });

}//resetClick

///////////////////////////////////////////////////////////////////////////
/////////////////// Hover functions of the circles ////////////////////////
///////////////////////////////////////////////////////////////////////////

//Hide the tooltip when the mouse moves away
function removeScatterTooltip (d, i) {

	//Which chart is being hovered over
	if (hasClass(d3.select(this), "MBO")) var element = d3.selectAll(".circle.MBO."+d.StudieClass);
	else var element = d3.selectAll(".circle.HBO."+d.StudieClass);
		
	//Fade out the bubble again
	element.style("opacity", 0.7);
	
	//Hide tooltip
	$('.popover').each(function() {
		$(this).remove();
	}); 
  
	//Fade out guide lines, then remove them
	d3.selectAll(".guide")
		.transition().duration(200)
		.style("opacity",  0)
		.remove()
}//function removeScatterTooltip

//Show the tooltip on the hovered over slice
function showScatterTooltip (d, i) {
		
	//Which chart is being hovered over
	if (hasClass(d3.select(this), "MBO")) {
		var cont = '.dataresource.scatterMBO',
			chartSVG = scatterMBO,
			element = d3.selectAll(".circle.MBO."+d.StudieClass);
	} else {
		var cont = '.dataresource.scatterHBO';
			chartSVG = scatterHBO,
			element = d3.selectAll(".circle.HBO."+d.StudieClass);
	}//else

	//Define and show the tooltip
	$(element).popover({
		placement: 'auto top',
		container: cont,
		trigger: 'manual',
		html : true,
		content: function() { 
			return "<span style='font-size: 11px; text-align: center;'>" + d.Studienaam + "</span>"; }
	});
	$(element).popover('show');

	//Make chosen circle more visible
	element.style("opacity", 1);
	
	//Append lines to bubbles that will be used to show the precise data points
	//vertical line
	chartSVG.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", element.attr("cx"))
			.attr("x2", element.attr("cx"))
			.attr("y1", +element.attr("cy"))
			.attr("y2", (scatterHeight))
			.style("stroke", element.style("fill"))
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);
	//horizontal line
	chartSVG.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", +element.attr("cx"))
			.attr("x2", 0)
			.attr("y1", element.attr("cy"))
			.attr("y2", element.attr("cy"))
			.style("stroke", element.style("fill"))
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);
					
}//function showScatterTooltip
	
///////////////////////////////////////////////////////////////////////////
//////////////////// Hover function for the legend ////////////////////////
///////////////////////////////////////////////////////////////////////////

//Decrease opacity of non selected study sectors when hovering in Legend	
function sectorSelect(opacity) {
	return function(d, i) {
		var chosen = sectorColor.domain()[i];
		
		scatterMBO.selectAll("circle")
			.filter(function(d) { return d.Studie_sector != chosen; })
			.transition()
			.style("opacity", opacity);
			
		scatterHBO.selectAll("circle")
			.filter(function(d) { return d.Studie_sector != chosen; })
			.transition()
			.style("opacity", opacity);
	  };
}//function sectorSelect

//////////////////////////////////////////////////////
/////////////// Draw the Scatter plot ////////////////
//////////////////////////////////////////////////////
						 
function drawScatter(data, wrapper, width, height, margin, chartTitle, circleClass) {
							 
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		.domain([0.4,1])
		.nice();
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(5)
		.tickFormat(numFormatPercent)
		.scale(xScale);	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis);
			
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain([0.25,1])
		.nice();
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(6)  //Set rough # of ticks
		.tickFormat(numFormatPercent)
		.scale(yScale);	

	//Append the y-axis
	wrapper.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.call(yAxis);

	////////////////////////////////////////////////////////////	
	///////////////////////// Trendline ////////////////////////
	////////////////////////////////////////////////////////////
	
	// Add trendline
	if (circleClass === "MBO") {
		wrapper.append("line")
			.attr("class", "trendline")
			.attr("x1", xScale(0.5))
			.attr("y1", yScale(0.6285))
			.attr("x2", xScale(1))
			.attr("y2", yScale(0.7648));
	} else {
		wrapper.append("line")
			.attr("class", "trendline")
			.attr("x1", xScale(0.45))
			.attr("y1", yScale(0.67944))
			.attr("x2", xScale(0.9))
			.attr("y2", yScale(0.76998));			
	}//else
		
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	
	//Already defined in global
	//var rScale = d3.scale.sqrt()
	//				.range([0, 20])
	//				.domain([0, 5000]);
	//var sectorColor = d3.scale.ordinal()
	//				.range(["#EFB605", "#E3690B", "#CF003E", "#991C71", "#4F54A8", "#07997E", "#7EB852"])
	//				.domain(["economie", "gedrag & maatschappij", "gezondheidszorg", "kunst, taal en cultuur", "landbouw", "onderwijs", "techniek"]);
				
	wrapper.selectAll("circle")
			.data(data.sort(function(a,b) { return b.Total > a.Total; })) //Sort so the biggest circles are below
			.enter().append("circle")
				.attr("class", function(d,i) { return "circle " + circleClass + " " + d.StudieClass; })
				.style("opacity", 0.7)
				.style("stroke", function(d) { if(d.Studienaam.indexOf("Overig") > -1) return d3.rgb(sectorColor(d.Studie_sector)).darker(); })
				.style("stroke-width", function(d) { if(d.Studienaam.indexOf("Overig") > -1) return 1.5; })
				.style("fill", function(d) {return sectorColor(d.Studie_sector);})
				.attr("cx", function(d) {return xScale(d.perc_blijft);})
				.attr("cy", function(d) {return yScale(d.perc_goed_voldoende);})
				.attr("r", function(d) {return rScale(d.Total);})
				.style("pointer-events", "none");
				
	////////////////////////////////////////////////////////////// 
	//////////////////////// Voronoi ///////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//Initiate the voronoi function
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(d.perc_blijft); })
		.y(function(d) { return yScale(d.perc_goed_voldoende); })
		.clipExtent([[0, 0], [width, height]]);

	//Initiate the voronoi group element	
	var voronoiGroup = wrapper.append("g")
		.attr("class", "voronoi");
		
	voronoiGroup.selectAll("path")
		.data(voronoi(data))
		.enter().append("path")
		.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
		.datum(function(d, i) { return d.point; })
		.attr("class", function(d,i) { return "voronoi " + circleClass + " " + d.StudieClass; })
		//.style("stroke", "red")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });
		
	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + 40) + ")")
		.style("font-size", "10px")
		.text("% dat in dezelfde provincie blijft wonen");

	//Set up y axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.attr("transform", "translate(" + 0 + "," + (-margin.top*7/8) + ")")
		.style("font-size", "10px")
		.text("% dat in een goed aansluitende sector werkt")
		.call(wrap, margin.left*2);
		
	//Set up chart title
	wrapper.append("g")
		.append("text")
		.attr("class","chartTitle")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text(chartTitle);	
		
}// function drawScatter

//////////////////////////////////////////////////////
/////////////////// Bubble Legend ////////////////////
//////////////////////////////////////////////////////

function bubbleLegend(wrapperVar, scale, sizes, titleName) {

	var legendSize1 = sizes[0],
		legendSize2 = sizes[1],
		legendSize3 = sizes[2],
		legendCenter = 0,
		legendBottom = 50,
		legendLineLength = 25,
		textPadding = 5;
	
	wrapperVar.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + legendCenter + "," + -14 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text(titleName)
		.call(wrap, 80);
		
	wrapperVar.append("circle")
        .attr('r', scale(legendSize1))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize1)));
    wrapperVar.append("circle")
        .attr('r', scale(legendSize2))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize2)));
    wrapperVar.append("circle")
        .attr('r', scale(legendSize3))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize3)));
		
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize1)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize1)));	
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize2)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize2)));
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize3)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize3)));
		
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize1)))
		.attr('dy', '0.25em')
		.text(legendSize1);	
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize2)))
		.attr('dy', '0.25em')
		.text(legendSize2);	
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize3)))
		.attr('dy', '0.25em')
		.text(legendSize3);	
		
}//bubbleLegend

//////////////////////////////////////////////////////
//////////// Data for the scatter plot ///////////////
//////////////////////////////////////////////////////

var HBOScatter = [
  {
    "Studienaam": "Overig kunst, taal en cultuur",
    "StudieClass": "overig_kunst_taal_en_cultuur",
    "Studie_sector": "kunst, taal en cultuur",
    "perc_blijft": 0.6833,
    "perc_goed_voldoende": 0.6635,
    "Total": 1587
  },
  {
    "Studienaam": "Opleiding leraar basisonderwijs",
    "StudieClass": "opleiding_leraar_basisonderwijs",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.8045,
    "perc_goed_voldoende": 0.8367,
    "Total": 1568
  },
  {
    "Studienaam": "Opleiding tot Verpleegkundige",
    "StudieClass": "opleiding_tot_verpleegkundige",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.7764,
    "perc_goed_voldoende": 0.8042,
    "Total": 941
  },
  {
    "Studienaam": "Sociaal Pedagogische Hulpverlening",
    "StudieClass": "sociaal_pedagogische_hulpverlening",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7926,
    "perc_goed_voldoende": 0.7292,
    "Total": 858
  },
  {
    "Studienaam": "Commerciele Economie",
    "StudieClass": "commerciele_economie",
    "Studie_sector": "economie",
    "perc_blijft": 0.7189,
    "perc_goed_voldoende": 0.7158,
    "Total": 753
  },
  {
    "Studienaam": "Maatschappelijk Werk en Dienstverlening",
    "StudieClass": "maatschappelijk_werk_en_dienstverlening",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.778,
    "perc_goed_voldoende": 0.6847,
    "Total": 672
  },
  {
    "Studienaam": "Overig techniek",
    "StudieClass": "overig_techniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6286,
    "perc_goed_voldoende": 0.8069,
    "Total": 636
  },
  {
    "Studienaam": "Overig onderwijs",
    "StudieClass": "overig_onderwijs",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.7775,
    "perc_goed_voldoende": 0.8498,
    "Total": 588
  },
  {
    "Studienaam": "Communicatie",
    "StudieClass": "communicatie",
    "Studie_sector": "economie",
    "perc_blijft": 0.7056,
    "perc_goed_voldoende": 0.6134,
    "Total": 578
  },
  {
    "Studienaam": "Personeel en Arbeid",
    "StudieClass": "personeel_en_arbeid",
    "Studie_sector": "economie",
    "perc_blijft": 0.7631,
    "perc_goed_voldoende": 0.6715,
    "Total": 574
  },
  {
    "Studienaam": "Management, Economie en Recht",
    "StudieClass": "management_economie_en_recht",
    "Studie_sector": "economie",
    "perc_blijft": 0.7268,
    "perc_goed_voldoende": 0.6618,
    "Total": 537
  },
  {
    "Studienaam": "Bedrijfseconomie",
    "StudieClass": "bedrijfseconomie",
    "Studie_sector": "economie",
    "perc_blijft": 0.7554,
    "perc_goed_voldoende": 0.799,
    "Total": 512
  },
  {
    "Studienaam": "Opl. tot Fysiotherapeut",
    "StudieClass": "opl_tot_fysiotherapeut",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.7048,
    "perc_goed_voldoende": 0.8989,
    "Total": 510
  },
  {
    "Studienaam": "Pedagogiek",
    "StudieClass": "pedagogiek",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.8213,
    "perc_goed_voldoende": 0.7375,
    "Total": 467
  },
  {
    "Studienaam": "Overig economie",
    "StudieClass": "overig_economie",
    "Studie_sector": "economie",
    "perc_blijft": 0.6861,
    "perc_goed_voldoende": 0.6962,
    "Total": 434
  },
  {
    "Studienaam": "Rechten",
    "StudieClass": "rechten",
    "Studie_sector": "economie",
    "perc_blijft": 0.757,
    "perc_goed_voldoende": 0.6655,
    "Total": 393
  },
  {
    "Studienaam": "Spec. Educational Needs: Leraar Speciaal Onderwijs",
    "StudieClass": "spec_educational_needs_leraar_speciaal_onderwijs",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.8885,
    "perc_goed_voldoende": 0.8663,
    "Total": 376
  },
  {
    "Studienaam": "Bouwkunde",
    "StudieClass": "bouwkunde",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7854,
    "perc_goed_voldoende": 0.6498,
    "Total": 344
  },
  {
    "Studienaam": "Facility Management",
    "StudieClass": "facility_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.6578,
    "perc_goed_voldoende": 0.6584,
    "Total": 337
  },
  {
    "Studienaam": "Werktuigbouwkunde",
    "StudieClass": "werktuigbouwkunde",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7339,
    "perc_goed_voldoende": 0.8598,
    "Total": 323
  },
  {
    "Studienaam": "Technische Bedrijfskunde",
    "StudieClass": "technische_bedrijfskunde",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7178,
    "perc_goed_voldoende": 0.8314,
    "Total": 320
  },
  {
    "Studienaam": "Accountancy",
    "StudieClass": "accountancy",
    "Studie_sector": "economie",
    "perc_blijft": 0.8156,
    "perc_goed_voldoende": 0.8582,
    "Total": 313
  },
  {
    "Studienaam": "Overig landbouw",
    "StudieClass": "overig_landbouw",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.5846,
    "perc_goed_voldoende": 0.6967,
    "Total": 297
  },
  {
    "Studienaam": "Overig gezondheidszorg",
    "StudieClass": "overig_gezondheidszorg",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.6385,
    "perc_goed_voldoende": 0.8785,
    "Total": 283
  },
  {
    "Studienaam": "Hoger Toeristisch en Recreatief Onderwijs",
    "StudieClass": "hoger_toeristisch_en_recreatief_onderwijs",
    "Studie_sector": "economie",
    "perc_blijft": 0.6503,
    "perc_goed_voldoende": 0.4608,
    "Total": 272
  },
  {
    "Studienaam": "Hoger Hotelonderwijs",
    "StudieClass": "hoger_hotelonderwijs",
    "Studie_sector": "economie",
    "perc_blijft": 0.4162,
    "perc_goed_voldoende": 0.8065,
    "Total": 267
  },
  {
    "Studienaam": "Biologie en Medisch Laboratoriumonderzoek",
    "StudieClass": "biologie_en_medisch_laboratoriumonderzoek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.5188,
    "perc_goed_voldoende": 0.8542,
    "Total": 244
  },
  {
    "Studienaam": "Vrijetijdsmanagement",
    "StudieClass": "vrijetijdsmanagement",
    "Studie_sector": "economie",
    "perc_blijft": 0.6548,
    "perc_goed_voldoende": 0.4715,
    "Total": 240
  },
  {
    "Studienaam": "Informatica",
    "StudieClass": "informatica",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6105,
    "perc_goed_voldoende": 0.8308,
    "Total": 238
  },
  {
    "Studienaam": "Elektrotechniek",
    "StudieClass": "elektrotechniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7159,
    "perc_goed_voldoende": 0.8154,
    "Total": 233
  },
  {
    "Studienaam": "International Business and Management Studies",
    "StudieClass": "international_business_and_management_studies",
    "Studie_sector": "economie",
    "perc_blijft": 0.5625,
    "perc_goed_voldoende": 0.6783,
    "Total": 226
  },
  {
    "Studienaam": "Media en Entertainment Management",
    "StudieClass": "media_en_entertainment_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.6525,
    "perc_goed_voldoende": 0.5063,
    "Total": 209
  },
  {
    "Studienaam": "Communication & Multimedia Design",
    "StudieClass": "communication_multimedia_design",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6884,
    "perc_goed_voldoende": 0.6242,
    "Total": 198
  },
  {
    "Studienaam": "Toegepaste psychologie",
    "StudieClass": "toegepaste_psychologie",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7107,
    "perc_goed_voldoende": 0.5039,
    "Total": 186
  },
  {
    "Studienaam": "Docent Beeldende Kunst en Vormgeving",
    "StudieClass": "docent_beeldende_kunst_en_vormgeving",
    "Studie_sector": "kunst, taal en cultuur",
    "perc_blijft": 0.8448,
    "perc_goed_voldoende": 0.6054,
    "Total": 185
  },
  {
    "Studienaam": "Civiele Techniek",
    "StudieClass": "civiele_techniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6338,
    "perc_goed_voldoende": 0.8163,
    "Total": 183
  },
  {
    "Studienaam": "Small Business en Retail Management",
    "StudieClass": "small_business_en_retail_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.7376,
    "perc_goed_voldoende": 0.7452,
    "Total": 181
  },
  {
    "Studienaam": "Management in de Zorg",
    "StudieClass": "management_in_de_zorg",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8322,
    "perc_goed_voldoende": 0.8667,
    "Total": 179
  },
  {
    "Studienaam": "Opleiding voor Logopedie",
    "StudieClass": "opleiding_voor_logopedie",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.6719,
    "perc_goed_voldoende": 0.8676,
    "Total": 161
  },
  {
    "Studienaam": "Bedrijfskundige Informatica",
    "StudieClass": "bedrijfskundige_informatica",
    "Studie_sector": "economie",
    "perc_blijft": 0.5667,
    "perc_goed_voldoende": 0.7761,
    "Total": 160
  },
  {
    "Studienaam": "Communicatiesystemen",
    "StudieClass": "communicatiesystemen",
    "Studie_sector": "economie",
    "perc_blijft": 0.5684,
    "perc_goed_voldoende": 0.5755,
    "Total": 145
  },
  {
    "Studienaam": "International Business and Languages",
    "StudieClass": "international_business_and_languages",
    "Studie_sector": "economie",
    "perc_blijft": 0.5938,
    "perc_goed_voldoende": 0.7143,
    "Total": 143
  },
  {
    "Studienaam": "Chemie",
    "StudieClass": "chemie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6786,
    "perc_goed_voldoende": 0.8276,
    "Total": 142
  },
  {
    "Studienaam": "Voeding en Dietiek",
    "StudieClass": "voeding_en_dietiek",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.6442,
    "perc_goed_voldoende": 0.4862,
    "Total": 140
  },
  {
    "Studienaam": "Culturele en Maatschappelijke Vorming",
    "StudieClass": "culturele_en_maatschappelijke_vorming",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.8391,
    "perc_goed_voldoende": 0.5729,
    "Total": 138
  },
  {
    "Studienaam": "Sociaal-Juridische Dienstverlening",
    "StudieClass": "sociaal_juridische_dienstverlening",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7379,
    "perc_goed_voldoende": 0.6909,
    "Total": 128
  },
  {
    "Studienaam": "Medisch Beeldvormende en Radiotherapeutische Technieken",
    "StudieClass": "medisch_beeldvormende_en_radiotherapeutische_technieken",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.5865,
    "perc_goed_voldoende": 0.8966,
    "Total": 126
  },
  {
    "Studienaam": "Vastgoed en Makelaardij",
    "StudieClass": "vastgoed_en_makelaardij",
    "Studie_sector": "economie",
    "perc_blijft": 0.6667,
    "perc_goed_voldoende": 0.6222,
    "Total": 126
  },
  {
    "Studienaam": "Creatieve Therapie",
    "StudieClass": "creatieve_therapie",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7326,
    "perc_goed_voldoende": 0.5269,
    "Total": 123
  },
  {
    "Studienaam": "Integrale Veiligheidskunde",
    "StudieClass": "integrale_veiligheidskunde",
    "Studie_sector": "economie",
    "perc_blijft": 0.6711,
    "perc_goed_voldoende": 0.4556,
    "Total": 112
  },
  {
    "Studienaam": "Leraar VO Lichamelijke Oefening (1e. gr.)",
    "StudieClass": "leraar_vo_lichamelijke_oefening",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.7333,
    "perc_goed_voldoende": 0.7654,
    "Total": 106
  },
  {
    "Studienaam": "Logistiek en Economie",
    "StudieClass": "logistiek_en_economie",
    "Studie_sector": "economie",
    "perc_blijft": 0.6071,
    "perc_goed_voldoende": 0.8506,
    "Total": 106
  },
  {
    "Studienaam": "Sport, Gezondheid en Management",
    "StudieClass": "sport_gezondheid_en_management",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.6232,
    "perc_goed_voldoende": 0.525,
    "Total": 106
  },
  {
    "Studienaam": "Social work",
    "StudieClass": "social_work",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.9467,
    "perc_goed_voldoende": 0.6353,
    "Total": 101
  },
  {
    "Studienaam": "Leraar VO Gezondheidszorg en Welzijn (2e gr.)",
    "StudieClass": "leraar_vo_gezondheidszorg_en_welzijn",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.8272,
    "perc_goed_voldoende": 0.8427,
    "Total": 98
  },
  {
    "Studienaam": "Leraar VO Omgangskunde (2e gr.)",
    "StudieClass": "leraar_vo_omgangskunde",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.8406,
    "perc_goed_voldoende": 0.6962,
    "Total": 97
  },
  {
    "Studienaam": "Opleiding voor Ergotherapie",
    "StudieClass": "opleiding_voor_ergotherapie",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.7901,
    "perc_goed_voldoende": 0.7931,
    "Total": 97
  },
  {
    "Studienaam": "Advanced Nursing Practice",
    "StudieClass": "advanced_nursing_practice",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8214,
    "perc_goed_voldoende": 0.9438,
    "Total": 96
  },
  {
    "Studienaam": "Bedrijfskunde en Agribusiness",
    "StudieClass": "bedrijfskunde_en_agribusiness",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.4857,
    "perc_goed_voldoende": 0.825,
    "Total": 96
  },
  {
    "Studienaam": "Fiscaal Recht en Economie",
    "StudieClass": "fiscaal_recht_en_economie",
    "Studie_sector": "economie",
    "perc_blijft": 0.6849,
    "perc_goed_voldoende": 0.8608,
    "Total": 96
  },
  {
    "Studienaam": "Overig gedrag & maatschappij",
    "StudieClass": "overig_gedrag_maatschappij",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7746,
    "perc_goed_voldoende": 0.6582,
    "Total": 94
  },
  {
    "Studienaam": "Business Administration in Hotel Management",
    "StudieClass": "business_administration_in_hotel_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.4286,
    "perc_goed_voldoende": 0.8429,
    "Total": 93
  },
  {
    "Studienaam": "Dier- en veehouderij",
    "StudieClass": "dier_en_veehouderij",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.6071,
    "perc_goed_voldoende": 0.6406,
    "Total": 93
  },
  {
    "Studienaam": "Informatie en Communicatie Technologie",
    "StudieClass": "informatie_en_communicatie_technologie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7097,
    "perc_goed_voldoende": 0.7,
    "Total": 93
  },
  {
    "Studienaam": "Technische Informatica",
    "StudieClass": "technische_informatica",
    "Studie_sector": "techniek",
    "perc_blijft": 0.6528,
    "perc_goed_voldoende": 0.8718,
    "Total": 89
  },
  {
    "Studienaam": "Financial Services Management",
    "StudieClass": "financial_services_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.6866,
    "perc_goed_voldoende": 0.9324,
    "Total": 87
  },
  {
    "Studienaam": "Leraar VO Engels (2e. gr.)",
    "StudieClass": "leraar_vo_engels",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.7887,
    "perc_goed_voldoende": 0.7917,
    "Total": 87
  },
  {
    "Studienaam": "Leraar VO Geschiedenis (2e gr.)",
    "StudieClass": "leraar_vo_geschiedenis",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.8209,
    "perc_goed_voldoende": 0.7671,
    "Total": 85
  },
  {
    "Studienaam": "Journalistiek",
    "StudieClass": "journalistiek",
    "Studie_sector": "economie",
    "perc_blijft": 0.623,
    "perc_goed_voldoende": 0.597,
    "Total": 84
  },
  {
    "Studienaam": "Integrale Veiligheid",
    "StudieClass": "integrale_veiligheid",
    "Studie_sector": "economie",
    "perc_blijft": 0.6607,
    "perc_goed_voldoende": 0.5484,
    "Total": 83
  },
  {
    "Studienaam": "Leraar VO Nederlands (2e gr.)",
    "StudieClass": "leraar_vo_nederlands",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.746,
    "perc_goed_voldoende": 0.8219,
    "Total": 82
  },
  {
    "Studienaam": "Hogere Europese Beroepen Opleiding",
    "StudieClass": "hogere_europese_beroepen_opleiding",
    "Studie_sector": "economie",
    "perc_blijft": 0.6667,
    "perc_goed_voldoende": 0.5,
    "Total": 80
  },
  {
    "Studienaam": "Autotechniek",
    "StudieClass": "autotechniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.46,
    "perc_goed_voldoende": 0.8302,
    "Total": 70
  },
  {
    "Studienaam": "Ruimtelijke Ordening en Planologie",
    "StudieClass": "ruimtelijke_ordening_en_planologie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.625,
    "perc_goed_voldoende": 0.2973,
    "Total": 69
  },
  {
    "Studienaam": "Chemische Technologie",
    "StudieClass": "chemische_technologie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7308,
    "perc_goed_voldoende": 0.7885,
    "Total": 67
  },
  {
    "Studienaam": "Fysiotherapie",
    "StudieClass": "fysiotherapie",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8333,
    "perc_goed_voldoende": 0.9474,
    "Total": 66
  },
  {
    "Studienaam": "Toerisme en recreatie",
    "StudieClass": "toerisme_en_recreatie",
    "Studie_sector": "economie",
    "perc_blijft": 0.5417,
    "perc_goed_voldoende": 0.5769,
    "Total": 66
  },
  {
    "Studienaam": "Leraar VO Wiskunde (2e gr.)",
    "StudieClass": "leraar_vo_wiskunde",
    "Studie_sector": "onderwijs",
    "perc_blijft": 0.7692,
    "perc_goed_voldoende": 0.8793,
    "Total": 64
  },
  {
    "Studienaam": "Diermanagement",
    "StudieClass": "diermanagement",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.4412,
    "perc_goed_voldoende": 0.5135,
    "Total": 62
  },
  {
    "Studienaam": "Bestuurskunde/Overheidsmanagement",
    "StudieClass": "bestuurskunde_overheidsmanagement",
    "Studie_sector": "economie",
    "perc_blijft": 0.8438,
    "perc_goed_voldoende": 0.7222,
    "Total": 59
  },
  {
    "Studienaam": "Verloskunde",
    "StudieClass": "verloskunde",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.6596,
    "perc_goed_voldoende": 0.98,
    "Total": 57
  },
  {
    "Studienaam": "Godsdienst-pastoraal werk",
    "StudieClass": "godsdienst_pastoraal_werk",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.6098,
    "perc_goed_voldoende": 0.6304,
    "Total": 56
  },
  {
    "Studienaam": "Milieukunde",
    "StudieClass": "milieukunde",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7353,
    "perc_goed_voldoende": 0.6757,
    "Total": 55
  },
  {
    "Studienaam": "Bedrijfskunde MER",
    "StudieClass": "bedrijfskunde_mer",
    "Studie_sector": "economie",
    "perc_blijft": 0.8293,
    "perc_goed_voldoende": 0.7727,
    "Total": 53
  },
  {
    "Studienaam": "Hogere Juridische Opleiding",
    "StudieClass": "hogere_juridische_opleiding",
    "Studie_sector": "economie",
    "perc_blijft": 0.75,
    "perc_goed_voldoende": 0.5294,
    "Total": 51
  },
  {
    "Studienaam": "International Business",
    "StudieClass": "international_business",
    "Studie_sector": "economie",
    "perc_blijft": 0.7273,
    "perc_goed_voldoende": 0.5,
    "Total": 50
  },
  {
    "Studienaam": "People and Business Management",
    "StudieClass": "people_and_business_management",
    "Studie_sector": "economie",
    "perc_blijft": 0.8293,
    "perc_goed_voldoende": 0.6818,
    "Total": 50
  }
]

var MBOScatter = [
  {
    "Studienaam": "Overig techniek",
    "StudieClass": "overig_techniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8117,
    "perc_goed_voldoende": 0.7683,
    "Total": 3277
  },
  {
    "Studienaam": "Helpende (verpleging en verzorging)",
    "StudieClass": "helpende_verpleging_en_verzorging",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.9368,
    "perc_goed_voldoende": 0.8055,
    "Total": 1679
  },
  {
    "Studienaam": "Sociaal pedagogisch werk",
    "StudieClass": "sociaal_pedagogisch_werk",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.9155,
    "perc_goed_voldoende": 0.7365,
    "Total": 1350
  },
  {
    "Studienaam": "Verpleegkundige",
    "StudieClass": "verpleegkundige",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8348,
    "perc_goed_voldoende": 0.8332,
    "Total": 1225
  },
  {
    "Studienaam": "Overig economie",
    "StudieClass": "overig_economie",
    "Studie_sector": "economie",
    "perc_blijft": 0.8377,
    "perc_goed_voldoende": 0.7042,
    "Total": 1148
  },
  {
    "Studienaam": "Sociaal pedagogisch werker",
    "StudieClass": "sociaal_pedagogisch_werker",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.8697,
    "perc_goed_voldoende": 0.6595,
    "Total": 992
  },
  {
    "Studienaam": "Onderwijsassistent",
    "StudieClass": "onderwijsassistent",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.9167,
    "perc_goed_voldoende": 0.5251,
    "Total": 901
  },
  {
    "Studienaam": "Verzorgende-ig",
    "StudieClass": "verzorgende_ig",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8997,
    "perc_goed_voldoende": 0.9104,
    "Total": 866
  },
  {
    "Studienaam": "Overig landbouw",
    "StudieClass": "overig_landbouw",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.8766,
    "perc_goed_voldoende": 0.7374,
    "Total": 702
  },
  {
    "Studienaam": "Verzorgende",
    "StudieClass": "verzorgende",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.9075,
    "perc_goed_voldoende": 0.9519,
    "Total": 576
  },
  {
    "Studienaam": "Chauffeur personenvervoer",
    "StudieClass": "chauffeur_personenvervoer",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8918,
    "perc_goed_voldoende": 0.8631,
    "Total": 533
  },
  {
    "Studienaam": "Medewerker Marketing/ Communicatie",
    "StudieClass": "medewerker_marketing_communicatie",
    "Studie_sector": "economie",
    "perc_blijft": 0.8638,
    "perc_goed_voldoende": 0.5143,
    "Total": 428
  },
  {
    "Studienaam": "Maatschappelijke dienstverlening",
    "StudieClass": "maatschappelijke_dienstverlening",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.9181,
    "perc_goed_voldoende": 0.7714,
    "Total": 420
  },
  {
    "Studienaam": "Doktersassistent",
    "StudieClass": "doktersassistent",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8576,
    "perc_goed_voldoende": 0.8208,
    "Total": 415
  },
  {
    "Studienaam": "Engineering (technicus)",
    "StudieClass": "engineering_technicus",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8259,
    "perc_goed_voldoende": 0.7296,
    "Total": 409
  },
  {
    "Studienaam": "Directie-secretaresse/management-assistent",
    "StudieClass": "directie_secretaresse_management_assistent",
    "Studie_sector": "economie",
    "perc_blijft": 0.8326,
    "perc_goed_voldoende": 0.6598,
    "Total": 398
  },
  {
    "Studienaam": "Horecaondernemer/-manager",
    "StudieClass": "horecaondernemer_manager",
    "Studie_sector": "economie",
    "perc_blijft": 0.5534,
    "perc_goed_voldoende": 0.8157,
    "Total": 373
  },
  {
    "Studienaam": "Schoonheidsspecialist",
    "StudieClass": "schoonheidsspecialist",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8943,
    "perc_goed_voldoende": 0.6786,
    "Total": 359
  },
  {
    "Studienaam": "Medewerker gehandicaptenzorg",
    "StudieClass": "medewerker_gehandicaptenzorg",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8902,
    "perc_goed_voldoende": 0.8191,
    "Total": 356
  },
  {
    "Studienaam": "Verkoopmedewerker",
    "StudieClass": "verkoopmedewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.9275,
    "perc_goed_voldoende": 0.7712,
    "Total": 336
  },
  {
    "Studienaam": "Sociaal dienstverlener",
    "StudieClass": "sociaal_dienstverlener",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.9171,
    "perc_goed_voldoende": 0.7061,
    "Total": 331
  },
  {
    "Studienaam": "Sport- en bewegingsco",
    "StudieClass": "sport_en_bewegingsco",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8442,
    "perc_goed_voldoende": 0.6154,
    "Total": 323
  },
  {
    "Studienaam": "Particuliere beveiliging (beveiliger)",
    "StudieClass": "particuliere_beveiliging_beveiliger",
    "Studie_sector": "economie",
    "perc_blijft": 0.715,
    "perc_goed_voldoende": 0.6912,
    "Total": 319
  },
  {
    "Studienaam": "Boekhoudkundig medewerker",
    "StudieClass": "boekhoudkundig_medewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.9179,
    "perc_goed_voldoende": 0.5694,
    "Total": 315
  },
  {
    "Studienaam": "Assistent-administrateur",
    "StudieClass": "assistent_administrateur",
    "Studie_sector": "economie",
    "perc_blijft": 0.9079,
    "perc_goed_voldoende": 0.6564,
    "Total": 307
  },
  {
    "Studienaam": "Kok",
    "StudieClass": "kok",
    "Studie_sector": "economie",
    "perc_blijft": 0.8705,
    "perc_goed_voldoende": 0.8131,
    "Total": 305
  },
  {
    "Studienaam": "Bouw infra",
    "StudieClass": "bouw_infra",
    "Studie_sector": "techniek",
    "perc_blijft": 0.844,
    "perc_goed_voldoende": 0.5921,
    "Total": 290
  },
  {
    "Studienaam": "Bedrijfsadministratief medewerker",
    "StudieClass": "bedrijfsadministratief_medewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.908,
    "perc_goed_voldoende": 0.66,
    "Total": 288
  },
  {
    "Studienaam": "Verkoopmedewerker Klein-/Middenbedrijf",
    "StudieClass": "verkoopmedewerker_klein_middenbedrijf",
    "Studie_sector": "economie",
    "perc_blijft": 0.8929,
    "perc_goed_voldoende": 0.7935,
    "Total": 283
  },
  {
    "Studienaam": "Arbeidsmarkt gekwalificeerd assistentenprofiel",
    "StudieClass": "arbeidsmarkt_gekwalificeerd_assistentenprofiel",
    "Studie_sector": "economie",
    "perc_blijft": 0.9241,
    "perc_goed_voldoende": 0.8,
    "Total": 279
  },
  {
    "Studienaam": "Bedrijfsadministratief",
    "StudieClass": "bedrijfsadministratief",
    "Studie_sector": "economie",
    "perc_blijft": 0.9149,
    "perc_goed_voldoende": 0.6174,
    "Total": 277
  },
  {
    "Studienaam": "Chauffeur goederenvervoer",
    "StudieClass": "chauffeur_goederenvervoer",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8957,
    "perc_goed_voldoende": 0.8361,
    "Total": 270
  },
  {
    "Studienaam": "Overig gezondheidszorg",
    "StudieClass": "overig_gezondheidszorg",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.9114,
    "perc_goed_voldoende": 0.7861,
    "Total": 261
  },
  {
    "Studienaam": "Sport- en bewegingsleider",
    "StudieClass": "sport_en_bewegingsleider",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8931,
    "perc_goed_voldoende": 0.6593,
    "Total": 257
  },
  {
    "Studienaam": "Verkoopspecialist Grootbedrijf",
    "StudieClass": "verkoopspecialist_grootbedrijf",
    "Studie_sector": "economie",
    "perc_blijft": 0.8944,
    "perc_goed_voldoende": 0.7688,
    "Total": 238
  },
  {
    "Studienaam": "Verkoopspeciaal grootbedrijf",
    "StudieClass": "verkoopspeciaal_grootbedrijf",
    "Studie_sector": "economie",
    "perc_blijft": 0.875,
    "perc_goed_voldoende": 0.7714,
    "Total": 232
  },
  {
    "Studienaam": "Ondernemer/manager detailhandel",
    "StudieClass": "ondernemer_manager_detailhandel",
    "Studie_sector": "economie",
    "perc_blijft": 0.8913,
    "perc_goed_voldoende": 0.6897,
    "Total": 229
  },
  {
    "Studienaam": "Manager handel filiaalmanager",
    "StudieClass": "manager_handel_filiaalmanager",
    "Studie_sector": "economie",
    "perc_blijft": 0.8333,
    "perc_goed_voldoende": 0.6358,
    "Total": 223
  },
  {
    "Studienaam": "Secretarieel",
    "StudieClass": "secretarieel",
    "Studie_sector": "economie",
    "perc_blijft": 0.9189,
    "perc_goed_voldoende": 0.7561,
    "Total": 220
  },
  {
    "Studienaam": "Multimedia vormgever",
    "StudieClass": "multimedia_vormgever",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7905,
    "perc_goed_voldoende": 0.4766,
    "Total": 218
  },
  {
    "Studienaam": "Logistiek medewerker",
    "StudieClass": "logistiek_medewerker",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9098,
    "perc_goed_voldoende": 0.7939,
    "Total": 216
  },
  {
    "Studienaam": "Grafisch vormgever",
    "StudieClass": "grafisch_vormgever",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8081,
    "perc_goed_voldoende": 0.5943,
    "Total": 213
  },
  {
    "Studienaam": "Onderhoudsmonteur elektro en instrumentatie",
    "StudieClass": "onderhoudsmonteur_elektro_en_instrumentatie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8667,
    "perc_goed_voldoende": 0.75,
    "Total": 205
  },
  {
    "Studienaam": "Kapper",
    "StudieClass": "kapper",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.9318,
    "perc_goed_voldoende": 0.7324,
    "Total": 204
  },
  {
    "Studienaam": "Reizen",
    "StudieClass": "reizen",
    "Studie_sector": "economie",
    "perc_blijft": 0.8175,
    "perc_goed_voldoende": 0.5736,
    "Total": 200
  },
  {
    "Studienaam": "Secretaresse",
    "StudieClass": "secretaresse",
    "Studie_sector": "economie",
    "perc_blijft": 0.9402,
    "perc_goed_voldoende": 0.6148,
    "Total": 199
  },
  {
    "Studienaam": "Beheerder technische infrastructuur",
    "StudieClass": "beheerder_technische_infrastructuur",
    "Studie_sector": "economie",
    "perc_blijft": 0.8173,
    "perc_goed_voldoende": 0.6071,
    "Total": 191
  },
  {
    "Studienaam": "Servicemedewerker ICT",
    "StudieClass": "servicemedewerker_ict",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9038,
    "perc_goed_voldoende": 0.5455,
    "Total": 187
  },
  {
    "Studienaam": "Zorghulp",
    "StudieClass": "zorghulp",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.931,
    "perc_goed_voldoende": 0.863,
    "Total": 178
  },
  {
    "Studienaam": "Toerisme, recreatie en reizen",
    "StudieClass": "toerisme_recreatie_en_reizen",
    "Studie_sector": "economie",
    "perc_blijft": 0.6961,
    "perc_goed_voldoende": 0.6019,
    "Total": 171
  },
  {
    "Studienaam": "Assistent medewerker voedsel en leefomgeving",
    "StudieClass": "assistent_medewerker_voedsel_en_leefomgeving",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.9583,
    "perc_goed_voldoende": 0.7788,
    "Total": 168
  },
  {
    "Studienaam": "Automatisering",
    "StudieClass": "automatisering",
    "Studie_sector": "economie",
    "perc_blijft": 0.7794,
    "perc_goed_voldoende": 0.5278,
    "Total": 166
  },
  {
    "Studienaam": "Primaire timmerkracht",
    "StudieClass": "primaire_timmerkracht",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7841,
    "perc_goed_voldoende": 0.7453,
    "Total": 163
  },
  {
    "Studienaam": "All-round kapper",
    "StudieClass": "all_round_kapper",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8559,
    "perc_goed_voldoende": 0.8197,
    "Total": 162
  },
  {
    "Studienaam": "Eerste verkoper",
    "StudieClass": "eerste_verkoper",
    "Studie_sector": "economie",
    "perc_blijft": 0.8812,
    "perc_goed_voldoende": 0.8125,
    "Total": 162
  },
  {
    "Studienaam": "Beveiliging",
    "StudieClass": "beveiliging",
    "Studie_sector": "economie",
    "perc_blijft": 0.5647,
    "perc_goed_voldoende": 0.71,
    "Total": 161
  },
  {
    "Studienaam": "Apothekersassistent",
    "StudieClass": "apothekersassistent",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8785,
    "perc_goed_voldoende": 0.8696,
    "Total": 159
  },
  {
    "Studienaam": "Commercieel medewerker binnendienst",
    "StudieClass": "commercieel_medewerker_binnendienst",
    "Studie_sector": "economie",
    "perc_blijft": 0.9014,
    "perc_goed_voldoende": 0.6329,
    "Total": 156
  },
  {
    "Studienaam": "Autotechnicus",
    "StudieClass": "autotechnicus",
    "Studie_sector": "techniek",
    "perc_blijft": 0.92,
    "perc_goed_voldoende": 0.8165,
    "Total": 154
  },
  {
    "Studienaam": "Juridisch medewerker zakelijke dienstverlening",
    "StudieClass": "juridisch_medewerker_zakelijke_dienstverlening",
    "Studie_sector": "economie",
    "perc_blijft": 0.8281,
    "perc_goed_voldoende": 0.6286,
    "Total": 150
  },
  {
    "Studienaam": "Maatschappelijke zorg",
    "StudieClass": "maatschappelijke_zorg",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.87,
    "perc_goed_voldoende": 0.7642,
    "Total": 148
  },
  {
    "Studienaam": "Sport en bewegen",
    "StudieClass": "sport_en_bewegen",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8085,
    "perc_goed_voldoende": 0.6522,
    "Total": 144
  },
  {
    "Studienaam": "Medewerker beheer informatiesystemen",
    "StudieClass": "medewerker_beheer_informatiesystemen",
    "Studie_sector": "economie",
    "perc_blijft": 0.8261,
    "perc_goed_voldoende": 0.5833,
    "Total": 140
  },
  {
    "Studienaam": "Tandartsassistent",
    "StudieClass": "tandartsassistent",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8481,
    "perc_goed_voldoende": 0.7848,
    "Total": 137
  },
  {
    "Studienaam": "Zelfstandig werkend kok",
    "StudieClass": "zelfstandig_werkend_kok",
    "Studie_sector": "economie",
    "perc_blijft": 0.8381,
    "perc_goed_voldoende": 0.8333,
    "Total": 134
  },
  {
    "Studienaam": "Logistiek teamleider",
    "StudieClass": "logistiek_teamleider",
    "Studie_sector": "economie",
    "perc_blijft": 0.8941,
    "perc_goed_voldoende": 0.7333,
    "Total": 132
  },
  {
    "Studienaam": "Gastheer/-vrouw",
    "StudieClass": "gastheer_vrouw",
    "Studie_sector": "economie",
    "perc_blijft": 0.7949,
    "perc_goed_voldoende": 0.7683,
    "Total": 130
  },
  {
    "Studienaam": "Voortgezette timmerkracht",
    "StudieClass": "voortgezette_timmerkracht",
    "Studie_sector": "techniek",
    "perc_blijft": 0.775,
    "perc_goed_voldoende": 0.837,
    "Total": 129
  },
  {
    "Studienaam": "Sociaal-cultureel werker",
    "StudieClass": "sociaal_cultureel_werker",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.8082,
    "perc_goed_voldoende": 0.4595,
    "Total": 128
  },
  {
    "Studienaam": "Dierenassistent paraveterinair",
    "StudieClass": "dierenassistent_paraveterinair",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.8409,
    "perc_goed_voldoende": 0.5778,
    "Total": 125
  },
  {
    "Studienaam": "Facilitair leidinggevende",
    "StudieClass": "facilitair_leidinggevende",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8519,
    "perc_goed_voldoende": 0.7407,
    "Total": 122
  },
  {
    "Studienaam": "Interieuradviseur",
    "StudieClass": "interieuradviseur",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8961,
    "perc_goed_voldoende": 0.5432,
    "Total": 122
  },
  {
    "Studienaam": "Ondernemer groothandel",
    "StudieClass": "ondernemer_groothandel",
    "Studie_sector": "economie",
    "perc_blijft": 0.7931,
    "perc_goed_voldoende": 0.5424,
    "Total": 120
  },
  {
    "Studienaam": "Overig gedrag & maatschappij",
    "StudieClass": "overig_gedrag_maatschappij",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.7231,
    "perc_goed_voldoende": 0.4865,
    "Total": 120
  },
  {
    "Studienaam": "Commercieel medewerker banken",
    "StudieClass": "commercieel_medewerker_banken",
    "Studie_sector": "economie",
    "perc_blijft": 0.8615,
    "perc_goed_voldoende": 0.7286,
    "Total": 116
  },
  {
    "Studienaam": "Economisch-juridisch",
    "StudieClass": "economisch_juridisch",
    "Studie_sector": "economie",
    "perc_blijft": 0.8136,
    "perc_goed_voldoende": 0.4167,
    "Total": 115
  },
  {
    "Studienaam": "Metaalbewerker",
    "StudieClass": "metaalbewerker",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8852,
    "perc_goed_voldoende": 0.825,
    "Total": 111
  },
  {
    "Studienaam": "Dierenhouder (manager dierverzorging)",
    "StudieClass": "dierenhouder_manager_dierverzorging",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.7692,
    "perc_goed_voldoende": 0.5286,
    "Total": 106
  },
  {
    "Studienaam": "Technisch specialist personenauto's",
    "StudieClass": "technisch_specialist_personenauto_s",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9306,
    "perc_goed_voldoende": 0.8333,
    "Total": 104
  },
  {
    "Studienaam": "Luchtvaartdienstverlener",
    "StudieClass": "luchtvaartdienstverlener",
    "Studie_sector": "techniek",
    "perc_blijft": 0.5882,
    "perc_goed_voldoende": 0.7778,
    "Total": 102
  },
  {
    "Studienaam": "Installatiemonteur werktuigkundige installaties",
    "StudieClass": "installatiemonteur_werktuigkundige_installaties",
    "Studie_sector": "techniek",
    "perc_blijft": 0.871,
    "perc_goed_voldoende": 0.7971,
    "Total": 100
  },
  {
    "Studienaam": "Dierverzorging",
    "StudieClass": "dierverzorging",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.8919,
    "perc_goed_voldoende": 0.5897,
    "Total": 98
  },
  {
    "Studienaam": "Kaderfunctionaris natuur en leefomgeving",
    "StudieClass": "kaderfunctionaris_natuur_en_leefomgeving",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.7679,
    "perc_goed_voldoende": 0.6,
    "Total": 98
  },
  {
    "Studienaam": "ICT Beheerder elektrotechniek",
    "StudieClass": "ict_beheerder_elektrotechniek",
    "Studie_sector": "economie",
    "perc_blijft": 0.8409,
    "perc_goed_voldoende": 0.6,
    "Total": 95
  },
  {
    "Studienaam": "Zelfstandig werkend medewerker recreatie",
    "StudieClass": "zelfstandig_werkend_medewerker_recreatie",
    "Studie_sector": "economie",
    "perc_blijft": 0.7917,
    "perc_goed_voldoende": 0.5102,
    "Total": 94
  },
  {
    "Studienaam": "Assistent leisure & hospitality",
    "StudieClass": "assistent_leisure_hospitality",
    "Studie_sector": "economie",
    "perc_blijft": 0.8333,
    "perc_goed_voldoende": 0.5128,
    "Total": 93
  },
  {
    "Studienaam": "Manager handel",
    "StudieClass": "manager_handel",
    "Studie_sector": "economie",
    "perc_blijft": 0.8254,
    "perc_goed_voldoende": 0.8,
    "Total": 93
  },
  {
    "Studienaam": "Logistiek supervisor",
    "StudieClass": "logistiek_supervisor",
    "Studie_sector": "economie",
    "perc_blijft": 0.8689,
    "perc_goed_voldoende": 0.8281,
    "Total": 89
  },
  {
    "Studienaam": "Commercieel medewerker contactcenter",
    "StudieClass": "commercieel_medewerker_contactcenter",
    "Studie_sector": "economie",
    "perc_blijft": 0.8929,
    "perc_goed_voldoende": 0.8644,
    "Total": 83
  },
  {
    "Studienaam": "Commercieel medewerker reizen verkoper vakantiereizen",
    "StudieClass": "commercieel_medewerker_reizen_verkoper_vakantiereizen",
    "Studie_sector": "economie",
    "perc_blijft": 0.5532,
    "perc_goed_voldoende": 0.549,
    "Total": 82
  },
  {
    "Studienaam": "Manager front office",
    "StudieClass": "manager_front_office",
    "Studie_sector": "economie",
    "perc_blijft": 0.7358,
    "perc_goed_voldoende": 0.7414,
    "Total": 82
  },
  {
    "Studienaam": "Vormgever ruimtelijke presentatie en communicatie",
    "StudieClass": "vormgever_ruimtelijke_presentatie_en_communicatie",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7805,
    "perc_goed_voldoende": 0.4524,
    "Total": 81
  },
  {
    "Studienaam": "Eerste autotechnicus",
    "StudieClass": "eerste_autotechnicus",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9123,
    "perc_goed_voldoende": 0.7213,
    "Total": 80
  },
  {
    "Studienaam": "Meubelmaker/(scheeps)interieurbouwer",
    "StudieClass": "meubelmaker_scheeps_interieurbouwer",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8571,
    "perc_goed_voldoende": 0.7556,
    "Total": 79
  },
  {
    "Studienaam": "Aankomend verkoopmedewerker",
    "StudieClass": "aankomend_verkoopmedewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.9677,
    "perc_goed_voldoende": 0.8421,
    "Total": 78
  },
  {
    "Studienaam": "Dames- en herenkapper",
    "StudieClass": "dames_en_herenkapper",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.9302,
    "perc_goed_voldoende": 0.7347,
    "Total": 78
  },
  {
    "Studienaam": "Dierverzorger (recreatiedieren)",
    "StudieClass": "dierverzorger_recreatiedieren",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.814,
    "perc_goed_voldoende": 0.6,
    "Total": 78
  },
  {
    "Studienaam": "Installatie-, service- en onderhoudstechniek",
    "StudieClass": "installatie_service_en_onderhoudstechniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9444,
    "perc_goed_voldoende": 0.8214,
    "Total": 76
  },
  {
    "Studienaam": "Commercieel medewerker",
    "StudieClass": "commercieel_medewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.9355,
    "perc_goed_voldoende": 0.6286,
    "Total": 75
  },
  {
    "Studienaam": "Fastfood-specialist",
    "StudieClass": "fastfood_specialist",
    "Studie_sector": "economie",
    "perc_blijft": 0.9608,
    "perc_goed_voldoende": 0.8909,
    "Total": 74
  },
  {
    "Studienaam": "Elektrotechnische installaties eerste monteur",
    "StudieClass": "elektrotechnische_installaties_eerste_monteur",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8113,
    "perc_goed_voldoende": 0.7288,
    "Total": 73
  },
  {
    "Studienaam": "Applicatieontwikkelaar",
    "StudieClass": "applicatieontwikkelaar",
    "Studie_sector": "economie",
    "perc_blijft": 0.9143,
    "perc_goed_voldoende": 0.6053,
    "Total": 71
  },
  {
    "Studienaam": "Horeca-assistent",
    "StudieClass": "horeca_assistent",
    "Studie_sector": "economie",
    "perc_blijft": 0.8485,
    "perc_goed_voldoende": 0.8286,
    "Total": 69
  },
  {
    "Studienaam": "Procesoperator-B",
    "StudieClass": "procesoperator_b",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8846,
    "perc_goed_voldoende": 0.9474,
    "Total": 65
  },
  {
    "Studienaam": "Front office medewerker",
    "StudieClass": "front_office_medewerker",
    "Studie_sector": "economie",
    "perc_blijft": 0.8537,
    "perc_goed_voldoende": 0.7391,
    "Total": 64
  },
  {
    "Studienaam": "Accountmanager (junior) handel",
    "StudieClass": "accountmanager_junior_handel",
    "Studie_sector": "economie",
    "perc_blijft": 0.9143,
    "perc_goed_voldoende": 0.625,
    "Total": 63
  },
  {
    "Studienaam": "Manager opslag en vervoer",
    "StudieClass": "manager_opslag_en_vervoer",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8372,
    "perc_goed_voldoende": 0.7234,
    "Total": 63
  },
  {
    "Studienaam": "Netwerkbeheerder",
    "StudieClass": "netwerkbeheerder",
    "Studie_sector": "economie",
    "perc_blijft": 0.8333,
    "perc_goed_voldoende": 0.5897,
    "Total": 63
  },
  {
    "Studienaam": "Schilder",
    "StudieClass": "schilder",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8649,
    "perc_goed_voldoende": 0.8537,
    "Total": 62
  },
  {
    "Studienaam": "Podium- en evenemententechniek",
    "StudieClass": "podium_en_evenemententechniek",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7586,
    "perc_goed_voldoende": 0.6429,
    "Total": 61
  },
  {
    "Studienaam": "Analist",
    "StudieClass": "analist",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7353,
    "perc_goed_voldoende": 0.6765,
    "Total": 58
  },
  {
    "Studienaam": "Facilitaire dienstverlening",
    "StudieClass": "facilitaire_dienstverlening",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.7647,
    "perc_goed_voldoende": 0.7568,
    "Total": 58
  },
  {
    "Studienaam": "Operator-A",
    "StudieClass": "operator_a",
    "Studie_sector": "techniek",
    "perc_blijft": 0.907,
    "perc_goed_voldoende": 0.7778,
    "Total": 58
  },
  {
    "Studienaam": "Brood- en banketbakker",
    "StudieClass": "brood_en_banketbakker",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8684,
    "perc_goed_voldoende": 0.65,
    "Total": 56
  },
  {
    "Studienaam": "Medewerker mode en kleding",
    "StudieClass": "medewerker_mode_en_kleding",
    "Studie_sector": "gezondheidszorg",
    "perc_blijft": 0.8276,
    "perc_goed_voldoende": 0.5667,
    "Total": 56
  },
  {
    "Studienaam": "Medewerker bediening caf",
    "StudieClass": "medewerker_bediening_caf",
    "Studie_sector": "economie",
    "perc_blijft": 0.8286,
    "perc_goed_voldoende": 0.7632,
    "Total": 55
  },
  {
    "Studienaam": "Allround meubelmaker/(scheeps)interieurbouwer",
    "StudieClass": "allround_meubelmaker_scheeps_interieurbouwer",
    "Studie_sector": "techniek",
    "perc_blijft": 0.9667,
    "perc_goed_voldoende": 0.75,
    "Total": 54
  },
  {
    "Studienaam": "Medew. Natuur en leefomgeving",
    "StudieClass": "medew_natuur_en_leefomgeving",
    "Studie_sector": "landbouw",
    "perc_blijft": 0.9032,
    "perc_goed_voldoende": 0.8182,
    "Total": 54
  },
  {
    "Studienaam": "Afbouw",
    "StudieClass": "afbouw",
    "Studie_sector": "techniek",
    "perc_blijft": 0.7353,
    "perc_goed_voldoende": 0.5556,
    "Total": 53
  },
  {
    "Studienaam": "Artiest",
    "StudieClass": "artiest",
    "Studie_sector": "gedrag & maatschappij",
    "perc_blijft": 0.6296,
    "perc_goed_voldoende": 0.3462,
    "Total": 53
  },
  {
    "Studienaam": "Assistant bouw en infra",
    "StudieClass": "assistant_bouw_en_infra",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8636,
    "perc_goed_voldoende": 0.875,
    "Total": 51
  },
  {
    "Studienaam": "Administratief-juridisch medewerker - openbaar bestuur",
    "StudieClass": "administratief_juridisch_medewerker_openbaar_bestuur",
    "Studie_sector": "economie",
    "perc_blijft": 0.9565,
    "perc_goed_voldoende": 0.4348,
    "Total": 50
  },
  {
    "Studienaam": "Kaderfunctionaris meubel/interieurbouwbedrijf",
    "StudieClass": "kaderfunctionaris_meubel_interieurbouwbedrijf",
    "Studie_sector": "techniek",
    "perc_blijft": 0.8824,
    "perc_goed_voldoende": 0.7941,
    "Total": 50
  }
];

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Draw plots ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var rScale = d3.scale.sqrt()
				.range([0, (mobileScreen ? 12 : 20)])
				.domain([0, 5000]);

var sectorColor = d3.scale.ordinal()
					.range(["#EFB605", "#E3690B", "#CF003E", "#991C71", "#4F54A8", "#07997E", "#7EB852"])
					//.range(['#72c7e7', "#3C8A2E", '#3a90ca', "#81BC00", '#1c5aa2', "#BDD203", '#002776'])
					.domain(["economie", "gedrag & maatschappij", "gezondheidszorg", "kunst, taal en cultuur", "landbouw", "onderwijs", "techniek"]);
	
	
// Create MBO scatter plot
drawScatter(data = MBOScatter, wrapper = scatterMBO, width = scatterWidth, height = scatterHeight, 
			margin = scatterMargin, chartTitle="MBO", circleClass = "MBO");
			
// Create HBO scatter plot
drawScatter(data = HBOScatter, wrapper = scatterHBO, width = scatterWidth, height = scatterHeight, 
			margin = scatterMargin, chartTitle="HBO", circleClass = "HBO");

///////////////////////////////////////////////////////////////////////////
////////////////////////// Initialize Legend //////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Draw the legend
createScatterLegend();

//Create a wrapper for the circle legend				
var legendCircle = circleLegend.append("g").attr("class", "legendWrapper")
				.attr("transform", "translate(" + -60 + "," + 20 +")");

legendCircle.append("text")
	.attr("class","legendTitle")
	.attr("transform", "translate(" + 0 + "," + -14 + ")")
	.attr("x", 0 + "px")
	.attr("y", 0 + "px")
	.attr("dy", "1em")
	.text("Elke cirkel is een opleiding")
	.call(wrap, 90);
legendCircle.append("circle")
	.attr('r', rScale(3000))
	.attr('class',"legendCircle")
	.attr('cx', 0)
	.attr('cy', (50-rScale(3000)))
	
//Create g element for bubble size legend
var bubbleSizeLegend = circleLegend.append("g").attr("class", "legendWrapper")
				.attr("transform", "translate(" + 60 + "," + 20 +")");
//Draw the bubble size legend
bubbleLegend(bubbleSizeLegend, rScale, legendSizes = [100, 600, 3000], legendName = "Aantal respondenten");		


