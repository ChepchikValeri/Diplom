function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    
}
function cleanChart(chart) {
  while (chart.data.labels.length > 0) {
    removeData(chart);
  }
  chart.update();
}
// enable syntax highlighting
//chart js

//var ctx = document.getElementById('chart_1');
//var chart = new Chart(ctx, {
  options = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cm-1',
            data: []
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                }
            }]
        }
    }
}//);
options_zoom = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cm-1',
            data: []
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 15
              }
            }]
        }
    }
}//);

options_2 = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cm-1',
            data: []
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 15
              }
            }]
        }
    }
}
canvas_zoom = document.getElementById('chart_2');
  var ctx_range_zoom = canvas_zoom.getContext('2d');
  var chart_zoom = new Chart(ctx_range_zoom, options_zoom);
hljs.initHighlightingOnLoad();

            $(document).ready(function() {
              if(isFileAPIAvailable()) {
                console.log("isFileAPIAvailable\n")
                $('#files').bind('change', handleDialog);
              }
            });
var chart_data = 0;
            function handleDialog(event) {
              var files = event.target.files;
              var file = files[0];

              var fileInfo = `
                <span style="font-weight:bold;">${escape(file.name)}</span><br>
                - FileType: ${file.type || 'n/a'}<br>
                - FileSize: ${file.size} bytes<br>
                - LastModified: ${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}
              `;
              $('#file-info').replaceWith(fileInfo);

              var reader = new FileReader();
              reader.readAsText(file);
              reader.onload = function(event){
                var csv = event.target.result;
                chart_data = $.csv.toArrays(csv);
              removeData(chart);
              chart_data.forEach(data => {addData(chart, data[0], data[1])})
              chart.update();
              }
            }   



  var canvas = document.getElementById('chart_1');
  var ctx_range = canvas.getContext('2d');
  var chart = new Chart(ctx_range, options);
  var overlay = document.getElementById('overlay');
  var startIndex = 0;
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  var selectionContext = overlay.getContext('2d');
  var selectionRect = {
    w: 0,
    startX: 0,
    startY: 0
  };
  var drag = false;
  canvas.addEventListener('pointerdown', evt => {
    const points = chart.getElementsAtEventForMode(evt, 'index', {
      intersect: false
    });
    startIndex = points[0]._index;
    const rect = canvas.getBoundingClientRect();
    selectionRect.startX = evt.clientX - rect.left;
    selectionRect.startY = chart.chartArea.top;
    drag = true;
    // save points[0]._index for filtering
  });
  canvas.addEventListener('pointermove', evt => {

    const rect = canvas.getBoundingClientRect();
    if (drag) {
      const rect = canvas.getBoundingClientRect();
      selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
      selectionContext.globalAlpha = 0.5;
      selectionContext.clearRect(0, 0, canvas.width, canvas.height);
      selectionContext.fillRect(selectionRect.startX,
        selectionRect.startY,
        selectionRect.w,
        chart.chartArea.bottom - chart.chartArea.top);
    } else {
      selectionContext.clearRect(0, 0, canvas.width, canvas.height);
      var x = evt.clientX - rect.left;
      if (x > chart.chartArea.left) {
        selectionContext.fillRect(x,
          chart.chartArea.top,
          1,
          chart.chartArea.bottom - chart.chartArea.top);
      }
    }
  });
  canvas.addEventListener('pointerup', evt => {

    const points = chart.getElementsAtEventForMode(evt, 'index', {
      intersect: false
    });
    drag = false;
    zoom_startIndex = startIndex;
    zoom_stopIndex = points[0]._index;
    if (zoom_startIndex > zoom_stopIndex) {
      let temp = zoom_startIndex;
      zoom_startIndex = zoom_stopIndex;
      zoom_stopIndex = temp;
    }
    cleanChart(chart_zoom);
    //addData(chart_zoom, chart.data.labels.slice(startIndex, points[0]._index), chart.data.datasets[0].data.slice(startIndex, points[0]._index))
    chart_data.slice(zoom_startIndex, zoom_stopIndex).forEach(data => {addData(chart_zoom, data[0], data[1])})
    //chart_zoom.options.scales.yAxes[0].ticks.Min = 10;
    chart_zoom.update();
    console.log('implement filter between ' + options.data.labels[zoom_startIndex] + ' and ' + options.data.labels[zoom_stopIndex]);  
  });

/*
function chart_range(chart_id, overlay_id) {
  var canvas = document.getElementById('chart_1');
  var ctx_range = canvas.getContext('2d');
  var chart = new Chart(ctx_range, options);
  var overlay = document.getElementById('overlay');
  var startIndex = 0;
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  var selectionContext = overlay.getContext('2d');
  var selectionRect = {
    w: 0,
    startX: 0,
    startY: 0
  };
  var drag = false;
  canvas.addEventListener('pointerdown', evt => {
    const points = chart.getElementsAtEventForMode(evt, 'index', {
      intersect: false
    });
    startIndex = points[0]._index;
    const rect = canvas.getBoundingClientRect();
    selectionRect.startX = evt.clientX - rect.left;
    selectionRect.startY = chart.chartArea.top;
    drag = true;
    // save points[0]._index for filtering
  });
  canvas.addEventListener('pointermove', evt => {

    const rect = canvas.getBoundingClientRect();
    if (drag) {
      const rect = canvas.getBoundingClientRect();
      selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
      selectionContext.globalAlpha = 0.5;
      selectionContext.clearRect(0, 0, canvas.width, canvas.height);
      selectionContext.fillRect(selectionRect.startX,
        selectionRect.startY,
        selectionRect.w,
        chart.chartArea.bottom - chart.chartArea.top);
    } else {
      selectionContext.clearRect(0, 0, canvas.width, canvas.height);
      var x = evt.clientX - rect.left;
      if (x > chart.chartArea.left) {
        selectionContext.fillRect(x,
          chart.chartArea.top,
          1,
          chart.chartArea.bottom - chart.chartArea.top);
      }
    }
  });
  canvas.addEventListener('pointerup', evt => {

    const points = chart.getElementsAtEventForMode(evt, 'index', {
      intersect: false
    });
    drag = false;
    zoom_startIndex = startIndex;
    zoom_stopIndex = points[0]._index;
    if (zoom_startIndex > zoom_stopIndex) {
      let temp = zoom_startIndex;
      zoom_startIndex = zoom_stopIndex;
      zoom_stopIndex = temp;
    }
    cleanChart(chart_zoom);
    //addData(chart_zoom, chart.data.labels.slice(startIndex, points[0]._index), chart.data.datasets[0].data.slice(startIndex, points[0]._index))
    chart_data.slice(zoom_startIndex, zoom_stopIndex).forEach(data => {addData(chart_zoom, data[0], data[1])})
    //chart_zoom.options.scales.yAxes[0].ticks.Min = 10;
    chart_zoom.update();
    console.log('implement filter between ' + options.data.labels[zoom_startIndex] + ' and ' + options.data.labels[zoom_stopIndex]);  
  });
}
*/


var canvas_2 = canvas_zoom;
var ctx_range_2 = ctx_range_zoom;
var chart_2 = chart_zoom;
var overlay_2 = document.getElementById('overlay_2');
var startIndex_2 = 0;
overlay_2.width = canvas_2.width;
overlay_2.height = canvas_2.height;
var selectionContext_2 = overlay_2.getContext('2d');
var selectionRect_2 = {
  w: 0,
  startX: 0,
  startY: 0
};
var drag_2 = false;
canvas_2.addEventListener('pointerdown', evt => {
  const points_2 = chart_2.getElementsAtEventForMode(evt, 'index', {
    intersect: false
  });
  startIndex_2 = points_2[0]._index;
  const rect_2 = canvas_2.getBoundingClientRect();
  selectionRect_2.startX = evt.clientX - rect_2.left;
  selectionRect_2.startY = chart_2.chartArea.top;
  drag_2 = true;
  // save points_2[0]._index for filtering
});
canvas_2.addEventListener('pointermove', evt => {

  const rect_2 = canvas_2.getBoundingClientRect();
  if (drag_2) {
    const rect_2 = canvas_2.getBoundingClientRect();
    selectionRect_2.w = (evt.clientX - rect_2.left) - selectionRect_2.startX;
    selectionContext_2.globalAlpha = 0.5;
    selectionContext_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    selectionContext_2.fillRect(selectionRect_2.startX,
      selectionRect_2.startY,
      selectionRect_2.w,
      chart_2.chartArea.bottom - chart_2.chartArea.top);
  } else {
    selectionContext_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    var x_2 = evt.clientX - rect_2.left;
    if (x_2 > chart_2.chartArea.left) {
      selectionContext_2.fillRect(x_2,
        chart_2.chartArea.top,
        1,
        chart_2.chartArea.bottom - chart_2.chartArea.top);
    }
  }
});
canvas_2.addEventListener('pointerup', evt => {

  const points_2 = chart_2.getElementsAtEventForMode(evt, 'index', {
    intersect: false
  });
  drag_2 = false;
  zoom_startIndex = startIndex_2;
  zoom_stopIndex = points_2[0]._index;
  if (zoom_startIndex > zoom_stopIndex) {
    let temp = zoom_startIndex;
    zoom_startIndex = zoom_stopIndex;
    zoom_stopIndex = temp;
  }
  
  chart_2_labels_sliced = chart_2.data.labels.slice(zoom_startIndex, zoom_stopIndex);
  chart_2_data_sliced = chart_2.data.datasets[0].data.slice(zoom_startIndex,zoom_stopIndex);
  for (var i = chart_2_data_sliced.length - 1; i >= 0; i--) {
    chart_2_data_sliced[i] = [chart_2_labels_sliced[i], chart_2_data_sliced[i]]
  }
  cleanChart(chart_zoom);
  chart_2_data_sliced.forEach(data => {addData(chart_zoom, data[0], data[1])})
  //chart_zoom.options.scales.yAxes[0].ticks.Min = 10;
  chart_zoom.update();
  console.log('implement filter between ' + options.data.labels[zoom_startIndex] + ' and ' + options.data.labels[zoom_stopIndex]);  
});
