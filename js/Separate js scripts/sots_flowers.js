///////////////////////////////////////////////////////////////////////////
///////////////// State of the State - Draw windroses /////////////////////
///////////////////////////////////////////////////////////////////////////

function drawRoses(data, diagonal, provincies, radius, color) {
	
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
	var flowerSlices = flowers.selectAll(".solidArc.slice")
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
	flowers.append("text")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.attr("class", "flower titles")
		.attr("fill", "#6E6E6E")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(0," + (-radius + 20) + ")")
	  .text(function(d,i) { return "... " + provincies[i]; });

	//Add text in center of flower	
	var flowerText = flowers.append("text")
		.attr("class", "flower value")
		.attr("x", 0)
		.attr("y", -7)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.text(function(d,i) {return numFormatPercent(diagonal[chosen][i]); });	
	flowers.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 6)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("verhuist");	
	flowers.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 14)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("niet");


	//Draw the three little grey circles per rose
	drawRoseCircle(1, 0.05);
	drawRoseCircle(2, 0.125);
	drawRoseCircle(3, 0.22);
	
	////////////////////////////////////////////////////////////
	////////////////// Button Activity /////////////////////////
	////////////////////////////////////////////////////////////

	/* Activate the buttons and link to data sets */
	d3.selectAll(".roseButton").on("click", updateRoses);

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
		  " verhuist van " + provincies[j] + " naar <span style='color: #00A1DE; font-weight: bold;'>" + provincies[i] + "</span></span>"; }
	  });
	  $(this).popover('show')
	}

	//Function to draw little circles at the location that is the province itself
	function drawRoseCircle(radiusCirle, extra) {
		flowers.append("circle")
			.attr("class", "flower circle")
			.attr("r", radiusCirle)
			.style("fill", "#B5B5B5")
			.attr("transform", function(d,i) { 
				d.angle = Math.PI*2/24 * (2*i+1);
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + (innerRadius + (extra*radius)) + ",0)"
			});
	}//drawRoseCircle
	
	//Update the roses
	function updateRoses() {
		chosen = d3.select(this).attr("value");
		
		d3.select(".flowerSubTitle").text(chosen);
		
		//Update the data 
		//Taken from: http://stackoverflow.com/questions/25911019/d3-multiple-pie-chart-updates
		for(x in data[chosen]) {
			var npath = d3.select("#pie"+x).selectAll("path").data(pie(data[chosen][x]))
			npath.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs
		}//for
		
		//Update the text in the middle
		flowers.selectAll(".flower.value")
			.text(function(d,i,j) {return numFormatPercent(diagonal[chosen][j]); })
	}//drawRoseCircle

	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
		return arc(i(t));
	  };
	}	
}; //function drawRoses