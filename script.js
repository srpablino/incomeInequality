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
			console.log("index" + i + " data "+d)
			if (!isNaN(d.value)){
				if (i % columns.length > 2)
				return "background", "linear-gradient(to right, red, red "+d.value+"%, white "+(100 - d.value)+"%)"
			}
		})
  return table;
}

d3.csv('data.csv',function (data) {
	var columns = ['name','year','InequalityRate','property rights','government integrity','judicial effectiveness','tax burden']
  tabulate(data,columns)
})

//JQuery
$( function() {
	$( "#slider" ).slider({
		min: 2000,
		max: 2020
	});
} );
