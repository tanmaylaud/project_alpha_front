var chart;

function loadChart(dataVal) {
	var yAxisLabels = ['Fake', 'May be Fake' ,'Neutral','Probably True','True'];
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'graph',
			type: 'column',

			options3d: {
				enabled: true,
				alpha: 15,
				beta: 15,
				depth: 50,
				viewDistance: 25,
			}

		},

		allowDecimals: false ,

		xAxis: {
			categories : ['TOI', 'DNA' ,'BSIndia','CNNNews','next1','next2','next3','next4'],

			title: {
				enabled: true,
				text:'Sources',
				style: {
					fontWeight: 'normal'
				}
			}
		},

		yAxis: {
			min: 0,
			max: 100,
			tickInterval: 20,
			labels: {
				formatter: function() {
					return yAxisLabels[this.value/20];
				}
			},

			title: {
				enabled: true,
				text:'Results',
				style: {
					fontWeight: 'normal'
				} 

			}

		},

		title: {
			text: 'Source Analysis'
		},

		credits: {
			text: 'by Truenet'
		},

		exporting: { enabled: false },

		legend: { 
			enabled: false
		},

		plotOptions: {
			column: {
				depth: 25,
				color: '#11CF68'
			}
		},
		series: [{
			data: dataVal
		}]
	});
	showValues();
}

function showValues() {
	$('#alpha-value').html(chart.options.chart.options3d.alpha);
	$('#beta-value').html(chart.options.chart.options3d.beta);
	$('#depth-value').html(chart.options.chart.options3d.depth);
}

// Activate the sliders
$('#sliders input').on('input change', function () {
	chart.options.chart.options3d[this.id] = parseFloat(this.value);
	showValues();
	chart.redraw(false);
});
