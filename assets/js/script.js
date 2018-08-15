$(document).ready(function(){
  $('.presentation-carousel').slick({
    prevArrow:"<i class='icon-arrow-left' style='font-size:30px; position:absolute; left:-95px; color:#296460; top:40%'></i>",
    nextArrow:"<i class='icon-arrow-right' style='font-size:30px; position:absolute; right:-95px; top:40%; color:#296460'></i>",
  });
  $('.tab').on('click', function () {
    $('.tabs').find('.tab-active').removeClass('tab-active');
    $('.tabs').find('.tab-content.content-active').removeClass('content-active');
    $(this).addClass('tab-active');
		$('.tabs').find('#'+$(this).attr('data-number')).addClass('content-active');

		// Setting up the box shadows
		// the first and last tabs are always the same,
		// so we only need to run from second to the fifth
		for(i = 2; i < 6; i++){
			if (i < parseInt($(this).attr('data-number'))) {
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].style.boxShadow = 'inset -5px 0px 5px #00000014';
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].childNodes[1].style.boxShadow = 'inset -5px 0px 5px #00000014';
			} else {
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].style.boxShadow = 'inset 5px 0px 5px #00000014';
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].childNodes[1].style.boxShadow = 'inset 5px 0px 5px #00000014';
			}
		}
  })
});

// D3.js graph
function drawChart(data) {
	function responsivefy(svg) {
		// get container + svg aspect ratio
		var container = d3.select(svg.node().parentNode),
			width = parseInt(svg.style("width")),
			height = parseInt(svg.style("height")),
			aspect = width / height;
		// add viewBox and preserveAspectRatio properties,
		// and call resize so that svg resizes on inital page load
		svg.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMid")
			.call(resize);
		// to register multiple listeners for same event type,
		// you need to add namespace, i.e., 'click.foo'
		// necessary if you call invoke this function for multiple svgs
		// api docs: https://github.com/mbostock/d3/wiki/Selections#on
		d3.select(window).on("resize." + container.attr("id"), resize);
		// get width of container and resize svg to fit it
		function resize() {
			var targetWidth = parseInt(container.style("width"));
			svg.attr("width", targetWidth);
			svg.attr("height", Math.round(targetWidth / aspect));
		}
	}

	var svgWidth = 600, svgHeight = 350;
	var margin = { top: 20, right: 20, bottom: 30, left: 50  };
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;
	var svg = d3.select('.graph svg')
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.style("padding", "0% 22% 1% 16%")
		.call(responsivefy);

	var g = svg.append("g")
	   .attr("transform",
		       "translate(" + margin.left + "," + margin.top + ")"
		    );

	var x = d3.scaleTime().rangeRound([0, width]);
	var y = d3.scaleLinear().rangeRound([height, 0]);

	var line = d3.line()
	   .x(function(d) { return x(d.date) })
	   .y(function(d) { return y(d.value) })

	x.domain(d3.extent(data, function(d) { return d.date  }));
	y.domain([0, d3.max(data, function(d) { return d.value  })]);

	// define the area
	var area = d3.area()
		.x(function(d) { return x(d.date);  })
		.y0(height)
		.y1(function(d) { return y(d.value);  });

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickValues(["","2015","2016","2017"]).tickFormat(d3.format("0000")))
		.attr("class", "x")
		.select(".domain");

	g.append("g").call(d3.axisLeft(y)
		.tickValues([10,20,30,40]))
		.attr("class", "y")
		.style("transform", "translateX(-40%)");

	// add the area
	g.append("path")
		.data([data])
		.attr("fill", "#b5b5b520")
		.attr("class", "area")
		.attr("d", area);

	// Data line
	g.append("path")
		.datum(data)
		.attr("class", "data-line")
		.attr("fill", "none")
		.attr("stroke", "#e25160")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 2)
		.attr("d", line);

	// Excedent area
	g.append("path")
		.datum([data[data.length-1], {'date':2017.4, 'value':40}])
		.attr("fill", "#3d3d3d80")
		.attr("class", "area")
		.attr("d", area);
	g.append("path")
		.datum([{'date': 2017.4, 'value': 40}, {'date':2030, 'value':40}])
		.attr("fill", "#3d3d3d80")
		.attr("class", "area")
		.attr("d", area);

	g.append("path")
		.datum([{'date':2017.4, 'value':40}])
		.attr("fill", "#3d3d3d80")
		.attr("class", "area")

	// Excedent line
	g.append("path")
		.datum([data[data.length-1], {'date':2017.4, 'value':40}])
		.attr("class", "projection-line")
		.attr("fill", "none")
		.attr("stroke", "#e25160")
		.attr("stroke-width", 2)
		.attr("stroke-dasharray", 2)
		.attr("d", line);

	// Data dots
	g.selectAll("line-circle")
		.data(data)
		.enter().append("circle")
		.attr("class", "data-circle")
		.attr("class", function(d) { return d.value;})
		.attr("r", 6)
		.attr("cx", function(d) { return x(d.date);  })
		.attr("cy", function(d) { return y(d.value);  })
		.text('teste')
		.attr("fill", "#333333")
		.attr("stroke", "#e25160")
		.attr("stroke-width", 2)
		.attr("d", line);

	g.append("text")
	  .attr("class", "label")
		.style("font-size", "20px");

	svg.selectAll(".label")
	  .data(data)
	  .enter().append("text")
	  .attr("x", function(d) { return x(d.date);  })
	  .attr("y", function(d) { return y(d.value);  })
	  .attr("dx", "2em")
	  .attr("dy", "-0.35em")
		.attr("class", "label")
		.attr("fill", "#636363")
	  .text(function(d) { return d.value; });

	d3.selectAll(".graph .domain").attr("stroke", "#00000000");
	d3.selectAll(".y text").style("transform", "translate(40%, -10px)");
	d3.selectAll(".graph line")
		.attr("stroke", "#2a2a2a")
		.attr("x2", "1000")
		.attr("stroke-dasharray", "2")
		.style("transform", "")
		.style("position", "absolute");
	d3.selectAll(".x line").style("display", "none");
	d3.selectAll(".tick text").style('font-family', 'din-2014').attr('fill', '#848484');
	d3.selectAll(".tick text").style('font-size', '15px');
	d3.selectAll(".graph .label").style('font-size', '20px');
	$("." + data[0].value).hide();
}

drawChart([{'date': 2014, 'value': 0}, {'date': 2015, 'value': 10}, {'date': 2016, 'value': 29}, {'date': 2017, 'value': 37}]);

$('nav').on('click', function() {
	$('.column').fadeToggle(300);
})

var areas = [];
areas[0] = [];
// Africa
areas[1] = ["AO", "GA", "NG", "BJ", "GM", "RW", "BW",
						"GH", "BF", "GW", "SN", "BI", "KE", "SL",
						"CM", "LS", "SO", "CF", "LR", "ZA", "TD",
						"MG", "SS", "CD", "MR", "TG", "GQ", "MZ",
						"UG", "ER", "NA", "ZM", "ET", "NE", "ZW", "Africa"];
// Latin America
areas[2] = ["PY", "AR", "PE", "DO", "PR", "BS", "EC",
						"SV", "BZ", "BR", "GY", "SR", "HT", "HN",
						"TT", "CL", "JM", "CO", "MX", "UY", "CR",
						"NI", "VE", "CU", "PA", "BO", "LatinAmerica"];
// Asia
areas[3] = ["AF", "IN", "PK", "BD", "LK", "BT", "NP", "Asia"];
// Carribean
areas[4] = ["BS", "CU", "GB", "HT", "DO", "JM", "PR", "Carribean"];
// Eastern Europe & Central Asia
areas[5] = ["AL", "AM", "AZ", "BY", "BA", "GE", "KZ",
						"XK", "KG", "MK", "MD", "ME", "RU", "RS",
						"TJ", "TM", "UA", "UZ", "ECA"];
// Middle East & North Africa
areas[6] = ["DZ", "JO", "QA", "KW", "SA", "DJ", "LB",
						"EG", "SY", "LY", "TN", "IR", "AE", "IQ",
						"MA", "IL", "OM", "YE", "MiddleEast"];

function selectArea(code){
	var mapObj = $("#map").vectorMap("get", "mapObject");
	areas.forEach(function(area) {
		if(area.indexOf(code)>-1) {
			$('#'+area[area.length-1]).addClass('active');
			$('.map').find('.button'+area[area.length-1]).addClass("button-active");
			mapObj.setSelectedRegions(area.slice(0, area.length-1));
			return;
		}
	});
}
function clearAll(){
	var mapObj = $("#map").vectorMap("get", "mapObject");
	mapObj.clearSelectedRegions();

	$('.map').find('.info.active').removeClass('active');
	$('.map').find('.button-active').removeClass('button-active');
}

$('#map').vectorMap({
	map: 'world_merc',
	zoomButtons: false,
	backgroundColor: 'transparent',
	zoomOnScroll: false,
	zoomMin: 0.7,
	focusOn: {
		x: 0.0,
		y: 0.0,
		scale: 0.7
	},
	markerStyle: {
		initial: {
			fill: '#F8E23B',
			stroke: '#383f47'
		}
	},
	markers: [
		{ latLng: [12, -72.45], name: 'Education', style: {r:9, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [-20, -60], name: 'Education', style: {r:9, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [-30, -55], name: 'Education', style: {r:9, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [-05, 20], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [0, 28], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [-15, 24], name: 'Education', style: {r: 15, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [32, 70], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [29, 90], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [9, 115], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [14, 122], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },
		{ latLng: [3, 127], name: 'Education', style: {r: 10, fill:'#ec5563', class:'jvectormap-marker jvectormap-element education'} },

		{ latLng: [22, -70], name: 'Agriculture', style: {r: 15, fill:'#41aef0', class:'jvectormap-marker jvectormap-element agriculture'} },
		{ latLng: [-22, -48], name: 'Agriculture', style: {r: 15, fill:'#41aef0', class:'jvectormap-marker jvectormap-element agriculture'} },
		{ latLng: [14, 133], name: 'Agriculture', style: {r: 15, fill:'#41aef0', class:'jvectormap-marker jvectormap-element agriculture'} },

		{ latLng: [16.5, -72], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [-25, -60], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [-26, -55], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [-7, 27], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [37, 72], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [34, 93], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [8, 121], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },
		{ latLng: [8, 126], name: 'Gender', style: {r: 5, fill:'#f7b534', class:'jvectormap-marker jvectormap-element gender'} },

		{ latLng: [15, -68], name: 'Anti-corruption', style: {r:8, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [-30, -48], name: 'Anti-corruption', style: {r:8, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [32, 60], name: 'Anti-corruption', style: {r: 15, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [28, 80], name: 'Anti-corruption', style: {r: 15, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [37, 79], name: 'Anti-corruption', style: {r: 10, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [32, 99], name: 'Anti-corruption', style: {r: 10, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [-1, 117], name: 'Anti-corruption', style: {r: 15, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },
		{ latLng: [4.5, 135], name: 'Anti-corruption', style: {r: 10, fill:'#1e5468', class:'jvectormap-marker jvectormap-element anti-corruption'} },

		{ latLng: [-23, -56], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
		{ latLng: [-05, 30], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
		{ latLng: [37, 68], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
		{ latLng: [33.7, 88], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
		{ latLng: [11, 125], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
		{ latLng: [4.5, 122], name: 'Cities', style: {r:3, fill:'#f07125', class:'jvectormap-marker jvectormap-element cities'} },
	],
	regionStyle: {
		initial: {
			fill: '#31746cbf'
		},
		hover: {
			fill: "#29655e"
		},
		selected: {
			fill: "#235754"
		}
	},
	onRegionClick: function(e, code){
		clearAll();
		selectArea(code);
		return false;
	}
});

$('#map').find('button').on('click', function() {
	$('#map').find('.button-active').removeClass('button-active');
	$(this).addClass('button-active');
	clearAll();
	selectArea($(this).attr('data-code'));
});

$('#map').find('h1').on('click', function() {
	$('#map').find('.title-active').removeClass('title-active');
	$('#map').find('.buttons-menu').removeClass('buttons-active');
	$(this).addClass('title-active');
	clearAll();

	var trigger = $(this);

	if(trigger.attr('data-value') === 'regions') {
		$('#map').find('.map-buttons').addClass('buttons-active');
		$('.jvectormap-marker').hide();
		$('#map').find('.info').removeClass('hide');
	} else {
		$('#map').find('.map-buttons-filters').addClass('buttons-active');
		$('.jvectormap-marker').show();
		$('#map').find('.info').addClass('hide');
	}
});

$('.filter').on('click', function() {
	$('.jvectormap-marker').hide();
	$('.'+$(this).attr('data-code')).show();

	if($(this).attr('data-code') === 'all'){
		$('.jvectormap-marker').show();
	}
});
