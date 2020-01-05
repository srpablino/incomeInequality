//D3JS
var data, columns;
var table;
var thead;
var tbody;

var tabulate = function () {
	table = d3.select('#d3table').append('table')
	thead = table.append('thead')
	tbody = table.append('tbody')
	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d, i) {
	    	return d
	    })

	var rows = tbody.selectAll('tr')
		.data(data)
	    .enter()
		.append('tr')
		.filter(function(d) {
			return d.year == 1900 + (sliderTime.value().getYear())
		})
	filtered = rows.data();
	var maxmin = getMaxMin(filtered);

	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
		.text(function (d) { return  isNaN(d.value)? d.value : Math.round(d.value * 100) / 100  })

	table.selectAll("td")
		.style("background", function(d,i) {
			if (!isNaN(d.value)){
				if (i % columns.length > 2)
					return "background", "linear-gradient(to right,  red "+d.value+"%, red "+(100 - d.value)+"%, white "+(100 - d.value)+"%)"
				if (i % columns.length == 2){
					//console.log(normalize(maxmin,d.value)*100)
					//console.log(100 - normalize(maxmin,d.value)*100)
					return "background", "linear-gradient(to right,  blue "+normalize(maxmin,d.value)*100
					+"%,  blue "+ (100 - normalize(maxmin,d.value)*100)
					+"%,  white "+ (100 - normalize(maxmin,d.value)*100)+"%)"
				}

			}
		})
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
		columns = ['name','year','InequalityRate','property rights','government integrity','judicial effectiveness','tax burden']
		data = d;
		tabulate();
		countriesSelector();
		indicatorSelector();
	});

//slider
var dataTime = d3.range(0, 19).map(function(d) {
	return new Date(2000 + d, 10, 3);
});

var sliderTime = d3
	.sliderBottom()
	.min(d3.min(dataTime))
	.max(d3.max(dataTime))
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

var gTime = d3
	.select('div#slider-time')
	.append('svg')
	.attr('width', 1400)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);
//d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

//utils
var getMaxMin = function (data){
	var max = parseFloat(data[0]["InequalityRate"])
	var min = parseFloat(data[0]["InequalityRate"])
	for (i=0; i<data.length;i++){
		if (parseFloat(data[i]["InequalityRate"]) > max){
			max = parseFloat(data[i]["InequalityRate"]);
		}
		if (parseFloat(data[i]["InequalityRate"]) < min){
			min = parseFloat(data[i]["InequalityRate"]);
		}
	}
	return [max,min]
}

var normalize = function(maxmin,value){
	return (value - maxmin[1]) / (maxmin[0] - maxmin[1])
}

//radio buttons
var radioButtonsCountries = function(selections){

	var ul = d3.select('#selectionCountries').append('ul').attr("class","ul1");

	ul.selectAll('li')
		.data(selections)
		.enter()
		.append('li')
		.append("label")
		.text(function(d) { return d; })
		.insert("input")
		.attr("type", "checkbox")
}

var radioButtonsIndicators = function(selections){

	var ul = d3.select('#selectionIndicators').append('ul');

	ul.selectAll('li')
		.data(selections)
		.enter()
		.append('li')
		.append("label")
		.text(function(d) { return d; })
		.insert("input")
		.attr("type", "checkbox")
}