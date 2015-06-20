///////////////////////////////////////////////////////////////////////////
//////////// State of the State Main Code - Chord Diagram /////////////////
///////////////////////////////////////////////////////////////////////////

	var chordMargin = {left: 100, top: 60, right: 100, bottom: 40},
		chordMaxWidth = 1000 - chordMargin.left - chordMargin.right,
		chordMaxHeight = 700 - chordMargin.top - chordMargin.bottom,
		chordCurrentWidth = $(".dataresource.chord").width(),
		chordCurrentHeight = window.innerHeight*0.75,
		chordWidth = (chordCurrentWidth < chordMaxWidth ? chordCurrentWidth : chordMaxWidth),
		chordHeight = (chordCurrentHeight < chordMaxHeight ? chordCurrentHeight: chordMaxHeight);
			
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
	
	var chordRadius = Math.min(chordWidth, chordHeight) / 2 - 100;
	//The 50 = pullOutSize;
	
	//Opleidingen title	
	chordTitleWrapper.append("text")
		.attr("class","chordSubTitle left")
		.attr("x", (chordWidth/2 + chordMargin.left - chordRadius - 50))
		.attr("y", 60)
		.style("text-anchor", "middle")
		.attr("fill", "#3B3B3B")
		.style("font-size", "12px")
		.text("Opleidingen");
	chordTitleWrapper.append("line")
		.attr("class","chordSubTitleLine left")
		.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6)
		.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4)
		.attr("y1", 68)
		.attr("y2", 68)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges")
	//Beroepen title
	chordTitleWrapper.append("text")
		.attr("class","chordSubTitle right")
		.attr("x", (chordWidth/2 + chordMargin.left + chordRadius + 50))
		.attr("y", 60)
		.style("text-anchor", "middle")
		.attr("fill", "#3B3B3B")
		.style("font-size", "12px")
		.text("Beroepen");
	chordTitleWrapper.append("line")
		.attr("class","chordSubTitleLine right")
		.attr("x1", (chordWidth/2 + chordMargin.left - chordRadius - 50)*0.6 + 2*(chordRadius + 50))
		.attr("x2", (chordWidth/2 + chordMargin.left - chordRadius - 50)*1.4 + 2*(chordRadius + 50))
		.attr("y1", 68)
		.attr("y2", 68)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges")
	//The title on top
	chordTitleWrapper.append("text")
		.attr("class","chordTitle")
		.attr("x", (chordWidth/2 + chordMargin.left))
		.attr("y", 15)
		.style("text-anchor", "middle")
		.attr("fill", "#5E5E5E")
		.style("font-size", "16px")
		.text("Welke opleidingen leiden tot welke beroepen?");
		
	//The title on top
	chordTitleWrapper.append("text")
		.attr("class","chordTitleNiveau")
		.attr("x", (chordWidth/2 + chordMargin.left))
		.attr("y", (chordHeight*0.15 + chordMargin.bottom))
		.style("text-anchor", "middle")
		.attr("fill", "#5E5E5E")
		.style("font-size", "16px")
		.text("HBO");
		
	//Add small explanation
	/*
	chordExplanationWrapper.append("text")
		.attr("x", 10)
		.attr("y", (chordHeight))
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.attr("fill", "#949494")
		.style("font-size", "11px")
		.text("Deze plot laat per opleiding zien in welke sector deze afgestudeerden iets meer dan een jaar later werken. " +
			  "Aan de linkerkant staan de verschillende opleidingsrichtingen " +
			  "en rechts staan de verschillende sectoren. Er is dus een stroom van links naar rechts. " +
			  "De dikte van een lijn geeft het aantal afgestudeerden weer " +
			  "en als je even je muis stilhoudt op een lijn, krijg je de absolute aantallen te zien")
		.call(wrap, 300);*/

	//Move the buttons to the middle
	//d3.select("#ChordButtonWrapper")
	//	.style("left", (chordWidth/2 + chordButtonHalfWidth - chordButtonPadding)+"px");
			
	//Draw the map
	drawChord(chordWidth, chordHeight, chordMargin);

	///////////////////////////////////////////////////////////////////////////
	///////////// Initiate global functions to Onderwijs //////////////////////
	///////////////////////////////////////////////////////////////////////////
	
	//On resize, make sure the chord diagram still fits
	window.onresize = function() {
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
    }	