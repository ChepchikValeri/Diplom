function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

// enable syntax highlighting
var chart_data = [1,2,3];
//chart js

var ctx = document.getElementById('chart_1');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '# of Votes',
            data: chart_data
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


      hljs.initHighlightingOnLoad();

      $(document).ready(function() {
        if(isFileAPIAvailable()) {
          $('#files').bind('change', handleDialog);
        }
      });
