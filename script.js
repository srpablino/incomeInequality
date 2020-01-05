//D3JS
var tabulate = function (data,columns) {
	var table = d3.select('#d3table').append('table')
	var thead = table.append('thead')
	var tbody = table.append('tbody')
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

	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
		.text(function (d) { return  isNaN(d.value)? d.value : Math.round(d.value * 100) / 100  })

	d3.selectAll("td")
		.style("background", function(d,i) {
			if (!isNaN(d.value)){
				if (i % columns.length > 2)
				return "background", "linear-gradient(to right, red, red "+d.value+"%, white "+(100 - d.value)+"%)"
			}
		})
  return table;
}

d3.csv('data.csv')
	.then(function(data) {
		var columns = ['name','year','InequalityRate','property rights','government integrity','judicial effectiveness','tax burden']
		tabulate(data,columns)
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
	.width(900)
	.tickFormat(d3.timeFormat('%Y'))
	.tickValues(dataTime)
	//.default(new Date(2001, 10, 3))
	.default(2000)
	.on('onchange', val => {

		d3.selectAll('tr').remove();
		//table.transition().remove();

		d3.csv('data.csv')
			.then(function(data) {
				var columns = ['name','year','InequalityRate','property rights','government integrity','judicial effectiveness','tax burden']
				tabulate(data,columns)
			});
	});

var gTime = d3
	.select('div#slider-time')
	.append('svg')
	.attr('width', 1000)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

//d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));



