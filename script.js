//D3JS
var data, columns;
var table;
var thead;
var tbody;
var checkedIndicators = []
var checkedCountries = []
var maxmin;
var headers;
var header_sort = {}
var color_code = {}

var tabulate = function () {
    dateRange = getRangeDates()
    //console.log(dateRange[0])
	table = d3.select('#d3table').append('table')
	thead = table.append('thead')
	tbody = table.append('tbody')
	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
		.filter(function (d,i) {
			return checkedIndicators.includes(d) || i < 3
		})
	  .append('th')
		.on("mouseover",function (d) {
			d3.select(this).style("cursor", "pointer");
			d3.select(this).style("background", "#d0e9f3");
		})
		.on("mouseout",function (d) {
			d3.select(this).style("cursor", "default");
			d3.select(this).style("background", "#ffffff");
		})
        .text(function (d, i) {
	    	return d
	    });

	var rows = tbody.selectAll('tr')
		.data(data)
	    .enter()
		.append('tr')
		.filter(function(d) {
		    //console.log()
			//return d.year == 1900 + (sliderTime.value().getYear()) && checkedCountries.includes(d.name)
            return (d.year >= dateRange[0] && d.year <= dateRange[1]) && checkedCountries.includes(d.name)

		})

	if (checkedCountries.length > 0) {
		filtered = rows.data();

		correlations = getCorrelations(filtered);

		var maxmin = getMaxMin(filtered);

		var cells = rows.selectAll('td')
			.data(function (row) {
				return columns.map(function (column) {
					return {column: column, value: row[column]}
				})
			})
			.enter()
			.filter(function (d, i) {
				return checkedIndicators.includes(d.column) || i < 3;
			})
			.append('td')

			.text(function (d) {
				return isNaN(d.value) ? d.value : Math.round(d.value * 100) / 100
			})

		table.selectAll("td")
			.style("background", function (d, i) {
				if (!isNaN(d.value)) {
					var gradient = [];
					if (i % (checkedIndicators.length + 3) > 2){
						gradient =  "linear-gradient(to right," + getGradient("#5897F2",d.value);
						return "background", gradient;
					}
					if (i % (checkedIndicators.length + 3) == 2) {
						var blue = (Math.round(normalize(maxmin, d.value) * 100) / 100) * 100;
						gradient = "linear-gradient(to right," + getGradient("#55f296",blue);
						return "background", gradient;
					}
				}
			})
	}


    headers = table.selectAll("th").data(columns);

    headers
        .on("click", function(d) {
            // even number of clicks
            //if (clicks.title % 2 == 0) {
            // sort ascending: alphabetically
            if (header_sort[d] % 2 == 0){
                rows.sort(function(a,b) {
                    //console.log(JSON.stringify(a[d]));
                    if (a[d] < b[d]) {
                        return -1;
                    } else if (a[d] > b[d]) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }else{
                rows.sort(function(a,b) {
                    //console.log(JSON.stringify(a[d]));
                    if (a[d] < b[d]) {
                        return 1;
                    } else if (a[d] > b[d]) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            }

            header_sort[d]++;

            // odd number of clicks
            /*} else if (clicks.title % 2 != 0) {
                // sort descending: alphabetically
                rows.sort(function(a,b) {
                    if (a.title.toUpperCase() < b.title.toUpperCase()) {
                        return 1;
                    } else if (a.title.toUpperCase() > b.title.toUpperCase()) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            }*/
        });



    return table;
}

var countriesSelector = function(){
	var countries = [];
	for (i=0;i<data.length;i++){
		if (!countries.includes(data[i]['name'])) countries.push(data[i]['name'] )
	}
	radioButtonsCountries(countries);
}

var indicatorSelector = function(){
	var indicators = [];
	for (i=3;i<columns.length;i++){
		if (!indicators.includes(columns[i])) indicators.push(columns[i])
	}
	radioButtonsIndicators(indicators);
}

d3.csv('data.csv')
	.then(function(d) {
		columns = ['name',	'year',	'InequalityRate',	'property rights',	'government integrity',	'judicial effectiveness',	'tax burden',	'government spending',	'fiscal health',	'business freedom',	'labor freedom',	'monetary freedom',	'trade freedom',	'investment freedom',	'financial freedom']
		data = d;

        for (i =0; i< columns.length;i++){
		    header_sort[columns[i]] = 0;
        }
        console.log(header_sort)
		tabulate();
		countriesSelector();
		indicatorSelector();
	});

//slider-year
var dataTime = d3.range(0, 19).map(function(d) {
	return new Date(2000 + d, 10, 3);
});

var sliderTime;
var gTime;
//gTime.call(sliderTime);
//d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

//slider-Range
var sliderRange = d3
	.sliderBottom()
	.min(d3.min(dataTime))
	.max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
	.width(1050)
	.tickFormat(d3.timeFormat('%Y'))
	.tickValues(dataTime)
	.default([new Date(2005, 10, 3),new Date(2010, 10, 3)])
	.fill('#2196f3')
	.on('onchange', val => {
        table.remove();
        //gTime.remove();
        tabulate();
	    //console.log( val.map(function(num) { return num;}) );
		//d3.select('p#value-range').text(val.map(d3.format('.2%')).join('-'));
	});

var getRangeDates = function () {
    dates = sliderRange.value().map(a => new Date(a).getYear() + 1900)

    /*sliderTime = d3
        .sliderBottom()
        .min(new Date(dates[0],1,1))
        .max(new Date(dates[1],1,1))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(1050)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        //.default(new Date(2001, 10, 3))
        .default(2000)
        .on('onchange', val => {
            table.remove();
            tabulate();
        });

    gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', 1400)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gTime.call(sliderTime); */

    return dates;
}

var gRange = d3
	.select('div#slider-range')
	.append('svg')
	.attr('width', 1100)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

//utils
var getMaxMin = function (d){
	var max = parseFloat(d[0]["InequalityRate"])
	var min = parseFloat(d[0]["InequalityRate"])
	for (i=0; i<d.length;i++){
		if (parseFloat(d[i]["InequalityRate"]) > max){
			max = parseFloat(d[i]["InequalityRate"]);
		}
		if (parseFloat(d[i]["InequalityRate"]) < min){
			min = parseFloat(d[i]["InequalityRate"]);
		}
	}
	return [max,min]
}

var normalize = function(maxmin,value){
	//var out = (value - maxmin[1]) / (maxmin[0] - maxmin[1] + 0.0001);
	var out = value / maxmin[0]
	return out
}

//radio buttons
var radioButtonsCountries = function(selections){

	var ul = d3.select('#selectionCountries').append('ul').attr("class","ul1");

	ul.selectAll('li')
		.data(selections)
		.enter()
		.append('li')
		.append("label")
		.text(function(d) { return d+"  "; })
		.insert("input")
		.attr("type", "checkbox")
		.attr("name","countriesCheck")

	ul.selectAll("input").on("click", function(val) {
		if (this.checked){
			if (checkedCountries.length > 14){
				this.checked = false
			}else{
				checkedCountries.push(val);
			}
		}else{
			checkedCountries = checkedCountries.filter(item => item !== val)
		}
		table.remove();
		tabulate()
	});
}

var getGradient = function(color, perc){
	var out = color + " " + perc + "%";
	var rest = 100 - perc;
	if (rest == 0){
		out = out +","+ out + ")"
	}else{
		for (rest;rest > 0;rest = rest - 10){
			out = out + ",white 10%";
		}
		out = out + ")"
	}

	return out
}

var radioButtonsIndicators = function(selections){

	var ul = d3.select('#selectionIndicators').append('ul');

	ul.selectAll('li')
		.data(selections)
		.enter()
		.append('li')
		.append("label")
		.text(function(d) { return d+"  "; })
		.insert("input")
		.attr("name","indicatorsCheck")
		.attr("type", "checkbox")

	ul.selectAll("input").on("click", function(val) {
		if (this.checked){
			if (checkedIndicators.length > 4){
				this.checked = false
			}else{
				checkedIndicators.push(val);
			}
		}else{
			checkedIndicators = checkedIndicators.filter(item => item !== val)
		}
		table.remove();
		tabulate()
	});
}


var getCorrelations = function(d){

	//first we order by year ascending (correlation troughtout time)
	d.sort(function(a,b) {
		return a.year - b.year
	});

	//get the countries currently displayed
	countries = []
	countries = d.map(a => a.name).filter((x,i,a) => a.indexOf(x)==i)

	countries_data = {};
	for (var c=0;c<countries.length;c++){
		countries_data[countries[c]] = []
		for (var i=2;i<columns.length;i++){
			indicator = d.filter(a => a.name == countries[c]).map(j => parseFloat(j[columns[i]]))
			countries_data[countries[c]].push(indicator)
		}
		for (var i=3;i<columns.length;i++){
			correlation = pearsonCorrelation(countries_data[countries[c]],0,i-2)
			color = "#FFFFFF"
			if (correlation < 0){
				color = "#FF5E50"
			}
			if (correlation > 0){
				color = "#5897F2"
			}
			color_code[countries[c]+"_"+columns[i]] = color
		}
	}
	//console.log(countries_data)
}

//calculate the correlation between 2 arrays
var pearsonCorrelation = function(prefs, p1, p2){
	var si = [];

	console.log(prefs)
	console.log(p1)
	console.log(p2)

	for (var key in prefs[p1]) {
		if (prefs[p2][key]) si.push(key);
	}

	var n = si.length;

	if (n == 0) return 0;

	var sum1 = 0;
	for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

	var sum2 = 0;
	for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

	var sum1Sq = 0;
	for (var i = 0; i < si.length; i++) {
		sum1Sq += Math.pow(prefs[p1][si[i]], 2);
	}

	var sum2Sq = 0;
	for (var i = 0; i < si.length; i++) {
		sum2Sq += Math.pow(prefs[p2][si[i]], 2);
	}

	var pSum = 0;
	for (var i = 0; i < si.length; i++) {
		pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
	}

	var num = pSum - (sum1 * sum2 / n);
	var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
		(sum2Sq - Math.pow(sum2, 2) / n));

	if (den == 0) return 0;

	console.log("The correlation: " + num / den);

	return num / den;
}
//example
var data2 = new Array(
	new Array(1,10,20,30,40),
	new Array(500,400,300,200,100)
);
