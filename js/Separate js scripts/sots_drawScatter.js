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
				.style("opacity", 0.5)
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