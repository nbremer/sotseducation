var mobileScreen = ($(window).width() > 400 ? false : true);

///////////////////////////////////////////////////////////////////////////
//////////// State of the State Main Code - Chord Diagram /////////////////
///////////////////////////////////////////////////////////////////////////

	var chordMargin = {left: 50, top: 10, right: 50, bottom: 10},
		//chordMaxWidth = 1000 - chordMargin.left - chordMargin.right,
		//chordMaxHeight = 700 - chordMargin.top - chordMargin.bottom,
		//chordCurrentWidth = $(".dataresource.chord").width(),
		//chordCurrentHeight = window.innerHeight*0.75,
		//chordWidth = (chordCurrentWidth < chordMaxWidth ? chordCurrentWidth : chordMaxWidth),
		//chordHeight = (chordCurrentHeight < chordMaxHeight ? chordCurrentHeight: chordMaxHeight);
		chordWidth = Math.min($(".dataresource.chord").width(), 800) - chordMargin.left - chordMargin.right,
		//chordHeight = window.innerHeight - chordMargin.top - chordMargin.bottom;
		chordHeight = (mobileScreen ? 300 : Math.min($(".dataresource.chord").width(), 800)*5/6) - chordMargin.top - chordMargin.bottom;
			
	var svgChord = d3.select(".dataresource.chord").append("svg")
			.attr("width", (chordWidth + chordMargin.left + chordMargin.right))
			.attr("height", (chordHeight + chordMargin.top + chordMargin.bottom));

	//var chordButtonPadding = parseInt($("#ChordButtonWrapper").css('padding-left'))
	//	chordButtonHalfWidth = $("#ChordButtons").width()/2;
		
	///////////////////////////////////////////////////////////////////////////
	///////////////////// Initiate global variables ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

		
	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Initiate charts ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var chordTitleWrapper = svgChord.append("g").attr("class", "chordTitleWrapper");
	var chordExplanationWrapper = svgChord.append("g").attr("class", "chordExplanationWrapper");
	var chordWrapper = svgChord.append("g").attr("class", "chordWrapper");
	
	//////////////////////////////////////////////////////
	//////////////////// Titles on top ///////////////////
	//////////////////////////////////////////////////////
	
	var chordRadius = Math.min(chordWidth, chordHeight) / 2 - (mobileScreen ? 80 : 100);
	var titleOffset = 40;
	//The 50 = pullOutSize;
	
	//Opleidingen title	
	chordTitleWrapper.append("text")
		.attr("class","chordSubTitle left")
		.attr("x", (chordWidth/2 + chordMargin.left - chordRadius - 50))
		.attr("y", titleOffset)
		.style("text-anchor", "middle")
		.attr("fill", "#3B3B3B")
		.style("font-size", "12px")
		.text("Opleidingen");
	chordTitleWrapper.append("line")
		.attr("class","chordSubTitleLine left")
		.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6)
		.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4)
		.attr("y1", titleOffset+8)
		.attr("y2", titleOffset+8)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges")
	//Beroepen title
	chordTitleWrapper.append("text")
		.attr("class","chordSubTitle right")
		.attr("x", (chordWidth/2 + chordMargin.left + chordRadius + 50))
		.attr("y", titleOffset)
		.style("text-anchor", "middle")
		.attr("fill", "#3B3B3B")
		.style("font-size", "12px")
		.text("Beroepen");
	chordTitleWrapper.append("line")
		.attr("class","chordSubTitleLine right")
		.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6 + 2*(chordRadius + 50))
		.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4 + 2*(chordRadius + 50))
		.attr("y1", titleOffset+8)
		.attr("y2", titleOffset+8)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges")
		
	//The title on top
	chordTitleWrapper.append("text")
		.attr("class","chordTitleNiveau")
		.attr("x", (chordWidth/2 + chordMargin.left))
		.attr("y", (chordHeight*0.15 + chordMargin.bottom))
		.style("text-anchor", "middle")
		.attr("fill", "#5E5E5E")
		.style("font-size", "16px")
		.text("HBO");
			
	//Draw the map
	drawChord(chordWidth, chordHeight, chordMargin);

	///////////////////////////////////////////////////////////////////////////
	///////////// Initiate global functions to Onderwijs //////////////////////
	///////////////////////////////////////////////////////////////////////////
	
	//On resize, make sure the chord diagram still fits
	/*window.onresize = function() {
		var newChordWidth = (window.innerWidth*0.76)*0.95,
			newChordHeigth = window.innerHeight*0.75;
		
        var chordWidth = (newChordWidth < chordMaxWidth)? newChordWidth : chordMaxWidth,
			chordHeight = (newChordHeigth < chordMaxHeight)? newChordHeigth : chordMaxHeight;

		//Move the buttons to the middle
		//d3.select("#ChordButtonWrapper")
		//	.style("left", (chordWidth/2 + chordButtonHalfWidth - chordButtonPadding)+"px");
				
		//Resize the SVG
		svgChord.attr("width", (chordWidth + chordMargin.left + chordMargin.right))
				.attr("height", (chordHeight + chordMargin.top + chordMargin.bottom));
					
		drawChord(chordWidth, chordHeight, chordMargin);

		chordRadius = Math.min(chordWidth, chordHeight) / 2 - 100;		
		//Move titles
		d3.selectAll(".chordSubTitle.left")
			.attr("x", (chordWidth/2 + chordMargin.left - chordRadius - 50));
		d3.selectAll(".chordSubTitleLine.left")
			.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6)
			.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4);
		d3.selectAll(".chordSubTitle.right")
			.attr("x", (chordWidth/2 + chordMargin.left + chordRadius + 50));
		d3.selectAll(".chordSubTitleLine.right")
			.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6 + 2*(chordRadius + 50))
			.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4 + 2*(chordRadius + 50));
		d3.selectAll(".chordTitle")
			.attr("x", (chordWidth/2 + chordMargin.left));
		d3.selectAll(".chordTitleNiveau")
			.attr("x", (chordWidth/2 + chordMargin.left));
    }	*/
	
//////////////////////////////////////////////////////
////////////// Draw the Chord/Sankey /////////////////
//////////////////////////////////////////////////////

function drawChord(width, height, margin) {
	//Largely taken form: http://stackoverflow.com/questions/21813723/change-and-transition-dataset-in-chord-diagram-with-d3
	//and adjusted for my circumstances
	
	var Names= ["Administratief personeel","Ambachtslieden","Bedrijfsbeheer (vak)specialisten","Elementaire beroepen","Gezondheidszorg (vak)specialisten",
				"IT (vak)specialisten","Juridisch/Culturele (vak)specialisten","Leidinggevende functies","Onderwijsgevenden",
				"Verkopers en verleners persoonlijke diensten","Verzorgend personeel","Wetenschap/Techniek (vak)specialisten", "Overig", "",
				"Techniek","Onderwijs","Landbouw","Kunst, Taal en Cultuur","Gezondheidszorg","Gedrag & Maatschappij","Economie",""];
	var emptyPerc = 0.5,
		numProffesions = 13;
	
	////////////////////////////////////////////////////////////
	/////////////////////// HBO Data ///////////////////////////
	////////////////////////////////////////////////////////////
	
	var totalHBO = 17533,
		respondentsHBO = totalHBO,
		emptyStroke = Math.round(totalHBO*emptyPerc);
	var matrixHBO = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,65,44,57,39,123,1373,0], //Administratief personeel
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,11,0,0,24,0], //Ambachtslieden
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,173,43,52,55,36,125,2413,0], //Bedrijfsbeheer (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,16,13,23,10,37,54,0], //Elementaire beroepen
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,161,24,17,0,2089,85,60,0], //Gezondheidszorg (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,510,0,0,57,0,0,251,0], //IT (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,118,10,454,99,1537,271,0], //Juridisch en culturele (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,21,10,15,125,41,261,0], //Leidinggevende functies
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,2206,37,292,32,116,76,0], //Onderwijsgevenden
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,74,43,116,51,135,752,0], //Verkopers en verleners persoonlijke diensten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,34,0,22,27,156,36,0], //Verzorgend personeel
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1141,0,111,291,0,0,48,0], //Wetenschap en techniek (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,0,39,0,0,20,109,0], //Overig
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], //dummyBottom
		[232,32,173,32,161,510,16,76,32,96,15,1141,36,0,0,0,0,0,0,0,0,0], //Techniek
		[65,0,43,16,24,0,118,21,2206,74,34,0,0,0,0,0,0,0,0,0,0,0], //Onderwijs
		[44,0,52,13,17,0,10,10,37,43,0,111,39,0,0,0,0,0,0,0,0,0], //Landbouw
		[57,11,55,23,0,57,454,15,292,116,22,291,0,0,0,0,0,0,0,0,0,0], //Kunst, Taal en Cultuur
		[39,0,36,10,2089,0,99,125,32,51,27,0,0,0,0,0,0,0,0,0,0,0], //Gezondheidszorg
		[123,0,125,37,85,0,1537,41,116,135,156,0,20,0,0,0,0,0,0,0,0,0], //Gedrag & Maatschappij
		[1373,24,2413,54,60,251,271,261,76,752,36,48,109,0,0,0,0,0,0,0,0,0], //Economie
		[0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0] //dummyTop
	];
	//3557
	var offsetHBO = (2*Math.PI)/360 * (emptyStroke/(totalHBO + emptyStroke))*360/4; //((SUM white / SUM (all + white)*360/4)

	////////////////////////////////////////////////////////////
	/////////////////////// MBO Data ///////////////////////////
	////////////////////////////////////////////////////////////
	
	var totalMBO = 21328,
		respondentsMBO = totalMBO,
		emptyStroke = Math.round(totalMBO*emptyPerc);
	var matrixMBO = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,42,0,88,122,1152,0], //Administratief personeel
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2187,0,43,0,19,0,105,0], //Ambachtslieden
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,0,0,0,20,19,285,0], //Bedrijfsbeheer (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,428,0,192,0,354,219,686,0], //Elementaire beroepen
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,0,37,0,1518,30,31,0], //Gezondheidszorg (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,93,0,0,0,0,0,213,0], //IT (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,125,0,25,0,536,567,132,0], //Juridisch en culturele (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,12,10,61,0], //Leidinggevende functies
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,35,36,12,0], //Onderwijsgevenden
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,549,0,305,0,1069,621,2704,0], //Verkopers en verleners persoonlijke diensten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,54,0,10,0,2095,1283,112,0], //Verzorgend personeel
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,485,0,22,0,18,10,23,0], //Wetenschap en techniek (vak)specialisten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1064,0,302,0,91,49,515,0], //Overig
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], //dummyBottom
		[320,2187,45,428,103,93,125,32,13,549,54,485,1064,0,0,0,0,0,0,0,0,0], //Techniek
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //Onderwijs
		[42,43,0,192,37,0,25,0,0,305,10,22,302,0,0,0,0,0,0,0,0,0], //Landbouw
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //Kunst, Taal en Cultuur
		[88,19,20,354,1518,0,536,12,35,1069,2095,18,91,0,0,0,0,0,0,0,0,0], //Gezondheidszorg
		[122,0,19,219,30,0,567,10,36,621,1283,10,49,0,0,0,0,0,0,0,0,0], //Gedrag & Maatschappij
		[1152,105,285,686,31,213,132,61,12,2704,112,23,515,0,0,0,0,0,0,0,0,0], //Economie
		[0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0] //dummyTop
	];
	//4315
	var offsetMBO = (2*Math.PI)/360 * (emptyStroke/(totalMBO + emptyStroke))*360/4; //((SUM white / SUM (all + white)*360/4)

	////////////////////////////////////////////////////////////
	///////////////// Initiate variables ///////////////////////
	////////////////////////////////////////////////////////////
	
	/*** Define parameters and tools ***/
	var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100),
		innerRadius = outerRadius * 0.95;
		
	var offset = offsetHBO, //amount of clockwise rotation
		respondents = respondentsHBO, //number of respondents for the %'s in the hover titles
		pullOutSize = (mobileScreen? 20 : 50), //how far apart to pull the two halves
		opacityDefault = 0.6, //default opacity of chords
		opacityLow = 0.02;

	function fill() {
		return "#00A1DE";
	}

	//create number formatting functions
	var formatPercent = d3.format("%");

	//create the arc path data generator for the groups
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(startAngle)
		.endAngle(endAngle);

	//create the chord path data generator for the chords
	var path = chordStretch()
		//d3.svg.chord()
		.radius(innerRadius)
		.startAngle(startAngle)
		.endAngle(endAngle);

	//define the default chord layout parameters
	//within a function that returns a new layout object;
	//that way, you can create multiple chord layouts
	//that are the same except for the data.
	function getDefaultLayout() {
		return customChordLayout() //d3.layout.chord()
		.padding(0.02)
		.sortChords(d3.ascending);
	}  
	var last_layout; //store layout between updates

	//Remove any previous chords
	chordWrapper.selectAll("g").remove();
	
	/*** Initialize the visualization ***/
	var g = chordWrapper.append("g")
			.attr("id", "circle")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

	/*** Start with initial data matrix ***/
	updateChords(matrixHBO); 

	////////////////////////////////////////////////////////////
	////////////// Create / Update Chords //////////////////////
	////////////////////////////////////////////////////////////
		
	/* Create OR update a chord layout from a data matrix */
	function updateChords( matrix ) {
		
		/* Compute chord layout. */
		layout = getDefaultLayout(); //create a new layout object
		layout.matrix(matrix);
		
		////////////////////////////////////////////////////////////
		////////////////// Create outer Arcs ///////////////////////
		////////////////////////////////////////////////////////////

		/* Create/update "group" elements */
		var groupG = g.selectAll("g.group")
			.data(layout.groups(), function (d) {
				return d.index; 
				//use a key function in case the 
				//groups are sorted differently between updates
			});
		
		 //No groups ever disappear in this case, but ok
		 groupG.exit()
		    .transition().duration(1500)
		        .style("opacity", 0)
		        .remove(); //remove after transitions are complete
				
		
		var newGroups = groupG.enter().append("g")
			.attr("class", "group")
			.on("mouseover", fade(opacityLow))
			.on("mouseout", fade(opacityDefault));

		/////////////////////// Arcs /////////////////////////
		newGroups.append("path")
			.style("stroke", function(d,i) { //If this is the dummy arc, make it transparent and not responsive
				if (Names[i] === "") {return "none";
				} else {return fill(d.index); }
			})
			.style("fill", function(d,i) {
				if (Names[i] === "") {return "none";
				} else {
					return fill(d.index); 
				}
			})
			.style("pointer-events", function(d,i) {
				if (Names[i] === "") {return "none";
				} else {return "auto"; }
			})
			.style("opacity", 0)
			.attr("transform", function(d, i) { //Pull the two slices apart
						d.pullOutSize = pullOutSize * ( i > numProffesions ? -1 : 1);
						return "translate(" + d.pullOutSize + ',' + 0 + ")";
			});
		//update the paths to match the layout
		groupG.select("path") 
			.transition()
				.duration(1500)
				.style("opacity", 1)
				.attrTween("d", arcTween( last_layout ));
			
		/////////////////////// Labels /////////////////////////
		//create the group labels
		groupG.append("text")
			.attr("class", "chordText")
			.attr("dy", ".35em")
			.attr("x", 0)
			.attr("y", 0)
			.attr("fill", "#8F8F8F")
			.style("opacity", 0)
			.text(function (d) {return Names[d.index];})
			.call(wrapChord, 120);

		//position group labels to match layout
		groupG.select("text")
			.transition()
				.duration(1500)
				.attr("transform", function(d, i) {
					d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
					d.pullOutSize = pullOutSize * ( i > numProffesions ? -1 : 1);
					var c = arc.centroid(d);
					return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
					+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
					+ "translate(" + 20 + ",0)"
					+ (d.angle > Math.PI ? "rotate(180)" : "")
				})
				.attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : "begin";})
				.style("opacity", 1);
	  
		/////////////////////// Tooltip /////////////////////////
		//Create the title tooltip for the new groups
		newGroups.append("title");		
		//Create the title tooltip for the new groups
		groupG.select("title")
			.text(function(d, i) {return numFormatPercentDec(d.value/respondents) + " mensen in " + Names[i];});
			
		////////////////////////////////////////////////////////////
		////////////////// Create inner Chords /////////////////////
		//////////////////////////////////////////////////////////// 
		
		/* Create/update the chord paths */
		var chordPaths = g.selectAll("path.chord")
			.data(layout.chords(), chordKey );
				//specify a key function to match chords
				//between updates
			  
		//create the new chord paths
		var newChords = chordPaths.enter()
			.append("path")
			.attr("class", "chord")
			.style("stroke", "none")
			//.style("fill", "#D3D3D3")
			.style("fill", 	"url(#gradientLinearPerLine)") //gradientLinear //"#C4C4C4")
			.style("stroke-opacity", 0)
			.style("opacity", 0)
			.style("pointer-events", function(d,i) { //Remove pointer events from dummy strokes
				if (Names[d.source.index] === "") {return "none";
				} else {return "auto"; }
			})
			.on("mouseover", fadeOnChord)
			.on("mouseout", fade(opacityDefault));
		// Add title tooltip for each new chord.
		newChords.append("title");
		
		// Update all chord title texts
		chordPaths.select("title")
			.text(function(d) {
					return [numFormatPercentDec(d.source.value/respondents), " studenten van ", Names[d.target.index], " naar de sector ", Names[d.source.index]].join(""); 
			});

		//handle exiting paths:
		chordPaths.exit().transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

		//update the path shape
		chordPaths
			.transition().duration(1500)
			.style("opacity", function(d) {
				if (Names[d.source.index] === "") {return 0;
				} else {return opacityDefault; }
			})
			.attrTween("d", chordTween(last_layout));
		
		last_layout = layout; //save for next update
		
	}//updateChords

	////////////////////////////////////////////////////////////
	////////////////// Button Activity /////////////////////////
	////////////////////////////////////////////////////////////

	/* Activate the buttons and link to data sets */
	d3.select("#ChordHBObutton").on("click", function () {
		offset = offsetHBO;
		respondents = respondentsHBO;
		chordTitleWrapper.select(".chordTitleNiveau").text("HBO");
		updateChords( matrixHBO );
	});

	d3.select("#ChordMBObutton").on("click", function() {
		offset = offsetMBO;
		respondents = respondentsMBO;
		chordTitleWrapper.select(".chordTitleNiveau").text("MBO");
		updateChords( matrixMBO );
	});

	////////////////////////////////////////////////////////////
	////////////////// Extra Functions /////////////////////////
	////////////////////////////////////////////////////////////

	// Returns an event handler for fading a given chord group.
	function fade(opacity) {
	  return function(d, i) {
		g.selectAll("path.chord")
			.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
			.transition()
			.style("opacity", opacity);
	  };
	}//fade
	// Fade function when hovering over chord
	function fadeOnChord(d) {
		var chosen = d;
		g.selectAll("path.chord")
			.transition()
			.style("opacity", function(d) {
				if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
					return opacityDefault;
				} else { 
					return opacityLow; 
				}//else
			});
	}//fadeOnChord
	
	//Rotate the chord diagram to not start at the top
	function startAngle(d) {
				return d.startAngle + offset;
			}

	function endAngle(d) {
		return d.endAngle + offset;
	}

	////////////////////////////////////////////////////////////
	/////////////// Custom Chord Function //////////////////////
	////////////////////////////////////////////////////////////

	function chordStretch() {
		var source = d3_source, 
			target = d3_target, 
			radius = d3_svg_chordRadius, 
			startAngle = d3_svg_arcStartAngle, 
			endAngle = d3_svg_arcEndAngle;
			
		var π = Math.PI,
			halfπ = π / 2;

		function subgroup(self, f, d, i) {
			var subgroup = f.call(self, d, i), 
				r = radius.call(self, subgroup, i), 
				a0 = startAngle.call(self, subgroup, i) - halfπ, 
				a1 = endAngle.call(self, subgroup, i) - halfπ;
		  return {
			r: r,
			a0: [a0],
			a1: [a1],
			p0: [ r * Math.cos(a0), r * Math.sin(a0)],
			p1: [ r * Math.cos(a1), r * Math.sin(a1)]
		  };
		}

		function arc(r, p, a) {
			var sign = (p[0] >= 0 ? 1 : -1); //Does p[0] lie on the right side?
			return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign*pullOutSize) + "," + p[1];
		}


		function curve(p1) {
			var sign = (p1[0] >= 0 ? 1 : -1); //Does p1[0] lie on the right side?
			return "Q 0,0 " + (p1[0] + sign*pullOutSize) + "," + p1[1];
		}
		
		/*
		M = moveto
		M x,y
		Q = quadratic Bézier curve
		Q control-point-x,control-point-y end-point-x, end-point-y
		A = elliptical Arc
		A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
		Z = closepath

		M251.5579641956022,87.98204731514328
		A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
		Q 0,0 -177.8355222451483,198.48621369706098
		A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
		Q 0,0 251.5579641956022,87.98204731514328
		Z
		*/	
		function chord(d, i) {
			var s = subgroup(this, source, d, i), 
				t = subgroup(this, target, d, i);
						
		return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] + 
				arc(s.r, s.p1, s.a1 - s.a0) + 
				curve(t.p0) + 
				arc(t.r, t.p1, t.a1 - t.a0) + 
				curve(s.p0) + 
				"Z";
	   }//chord

		chord.radius = function(v) {
		  if (!arguments.length) return radius;
		  radius = d3_functor(v);
		  return chord;
		};
		chord.source = function(v) {
		  if (!arguments.length) return source;
		  source = d3_functor(v);
		  return chord;
		};
		chord.target = function(v) {
		  if (!arguments.length) return target;
		  target = d3_functor(v);
		  return chord;
		};
		chord.startAngle = function(v) {
		  if (!arguments.length) return startAngle;
		  startAngle = d3_functor(v);
		  return chord;
		};
		chord.endAngle = function(v) {
		  if (!arguments.length) return endAngle;
		  endAngle = d3_functor(v);
		  return chord;
		};
		return chord;
	  };
	  
	function d3_svg_chordRadius(d) {
		return d.radius;
	}

	function d3_source(d) {
		return d.source;
	}
	  
	function d3_target(d) {
		return d.target;
	}

	function d3_svg_arcStartAngle(d) {
		return d.startAngle;
	}
	  
	function d3_svg_arcEndAngle(d) {
		return d.endAngle;
	}

	function d3_functor(v) {
		return typeof v === "function" ? v : function() {
			return v;
		};
	}

	////////////////////////////////////////////////////////////
	//////////// END - Custom Chord Function ///////////////////
	////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////
	////////// Custom Chord Layout Function ////////////////////
	////////////////////////////////////////////////////////////

	function customChordLayout() {
	var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n).reverse());
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: (x - x0) / k
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
	
	////////////////////////////////////////////////////////////
	//////// END - Custom Chord Layout Function ////////////////
	////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////////////////////
	/////////////// Functions from AmeliaBR ////////////////////
	//////////// for changing between datasets /////////////////
	////////////////////////////////////////////////////////////

	function arcTween(oldLayout) {
		//this function will be called once per update cycle
		
		//Create a key:value version of the old layout's groups array
		//so we can easily find the matching group 
		//even if the group index values don't match the array index
		//(because of sorting)
		var oldGroups = {};
		if (oldLayout) {
			oldLayout.groups().forEach( function(groupData) {
				oldGroups[ groupData.index ] = groupData;
			});
		}
		
		return function (d, i) {
			var tween;
			var old = oldGroups[d.index];
			if (old) { //there's a matching old group
				tween = d3.interpolate(old, d);
			}
			else {
				//create a zero-width arc object
				var emptyArc = {startAngle:startAngle(d),
								endAngle:startAngle(d)};
				tween = d3.interpolate(emptyArc, d);
			}
			
			return function (t) {
				return arc( tween(t) );
			};
		};
	}//arcTween

	function chordKey(data) {
		return (data.source.index < data.target.index) ?
			data.source.index  + "-" + data.target.index:
			data.target.index  + "-" + data.source.index;
		
		//create a key that will represent the relationship
		//between these two groups *regardless*
		//of which group is called 'source' and which 'target'
	}//chordKey

	function chordTween(oldLayout) {
		//this function will be called once per update cycle
		
		//Create a key:value version of the old layout's chords array
		//so we can easily find the matching chord 
		//(which may not have a matching index)
		
		var oldChords = {};
		
		if (oldLayout) {
			oldLayout.chords().forEach( function(chordData) {
				oldChords[ chordKey(chordData) ] = chordData;
			});
		}
		
		return function (d, i) {
			//this function will be called for each active chord
			
			var tween;
			var old = oldChords[ chordKey(d) ];
			if (old) {
				//old is not undefined, i.e.
				//there is a matching old chord value
				
				//check whether source and target have been switched:
				if (d.source.index != old.source.index ){
					//swap source and target to match the new data
					old = {
						source: old.target,
						target: old.source
					};
				}//if  
				tween = d3.interpolate(old, d);
			}
			else {
				//create a zero-width chord object
				if (oldLayout) {
					var oldGroups = oldLayout.groups().filter(function(group) {
							return ( (group.index == d.source.index) ||
									 (group.index == d.target.index) )
						});
					old = {source:oldGroups[0],
							   target:oldGroups[1] || oldGroups[0] };
						//the OR in target is in case source and target are equal
						//in the data, in which case only one group will pass the
						//filter function
					
					if (d.source.index != old.source.index ){
						//swap source and target to match the new data
						old = {
							source: old.target,
							target: old.source
						};
					}
				}
				else old = d;
					
				var emptyChord = {
					source: { startAngle: old.source.startAngle,
							 endAngle: old.source.startAngle},
					target: { startAngle: old.target.startAngle,
							 endAngle: old.target.startAngle}
				};
				tween = d3.interpolate( emptyChord, d );
			}

			return function (t) {
				//this function calculates the intermediary shapes
				return path(tween(t));
			};
		};
	}//chordTween

	////////////////////////////////////////////////////////////
	//////////// END - Functions from AmeliaBR /////////////////
	////////////////////////////////////////////////////////////
	
}//drawChord