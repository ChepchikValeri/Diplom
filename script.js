function addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    
}

function removeData(chart, datasetIndex) {
    chart.data.datasets[datasetIndex].data = [];
}
function removeDataset(chart, datasetIndex) {
    if (chart.data.datasets[datasetIndex] != undefined) {
      chart.data.datasets.splice(datasetIndex);
    }
}
options = {
  type: 'scatter',
  data: {
      labels: [],
      datasets: [{
          label: 'cm-1',
          borderDash: [5, 5],
          borderWidth: 1,
          borderColor: '#922893',
          pointBorderColor: '#922893',
          showLine: true,
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
}
options_zoom = {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [{
            label: 'cm-1',
            borderDash: [5, 5],
            borderWidth: 1,
            borderColor: '#922893',
            pointBorderColor: '#922893',
            showLine: true,
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
    type: 'scatter',
    data: {
        labels: [],
        datasets: [{
            label: 'cm-1',
            borderDash: [5, 5],
            borderWidth: 1,
            borderColor: '#922893',
            pointBorderColor: '#922893',
            showLine: true,
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
    let csv = event.target.result;
    let chart_data = $.csv.toArrays(csv);
    let tmpFloat = chart_data.map(data => [parseFloat(data[0]), parseFloat(data[1])]);
    chart_data = tmpFloat;
    chart_data_minimized = [];
    for (let i = 0; i < chart_data.length; i++) {
      let tmp = 0;
      let count = 0;
      if (i != chart_data.length - 1) {
        if (chart_data[i][0] != chart_data[i+1][0]) {
          chart_data_minimized.push(chart_data[i]);
        }
        else {
          while (chart_data[i][0] == chart_data[i+1][0]) {
            tmp += chart_data[i][1];
            count++;
            if (i < chart_data.length - 2) {
              i++;
            }
            else {
              break;
            }
          }
          tmp += chart_data[i][1];
          count++;
          tmp = tmp / count;
          chart_data_minimized.push(chart_data[i])
        }
      }
      else {
      chart_data_minimized.push(chart_data[i]);
      }
    }
    removeData(chart, 0);
    //console.log(chart_data_minimized)
    chart_data_minimized.forEach(data => {addData(chart, {x:data[0],  y:data[1]})})
    chart.update();
  }
  //delete files from input, so it can load again the same file
  document.getElementById('files').value = "";
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
var handlePointerDown = function(evt) {
  const points = chart.getElementsAtEventForMode(evt, 'index', {
    intersect: false
  });
  startIndex = points[0]._index;
  const rect = canvas.getBoundingClientRect();
  selectionRect.startX = evt.clientX - rect.left;
  selectionRect.startY = chart.chartArea.top;
  drag = true;
  // save points[0]._index for filtering
}


var handlePointerMove = function(evt) {
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
  } 
  else {
    selectionContext.clearRect(0, 0, canvas.width, canvas.height);
    var x = evt.clientX - rect.left;
    if (x > chart.chartArea.left) {
      selectionContext.fillRect(x,
      chart.chartArea.top,
      1,
      chart.chartArea.bottom - chart.chartArea.top);
    }
  }
}


var handlePointerUp = function (evt) {
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
  removeData(chart_zoom, 0);
  //addData(chart_zoom, chart.data.labels.slice(startIndex, points[0]._index), chart.data.datasets[0].data.slice(startIndex, points[0]._index))
  chart_data_minimized.slice(zoom_startIndex, zoom_stopIndex).forEach(data => {addData(chart_zoom, {x:data[0], y:data[1]})})
  //chart_zoom.options.scales.yAxes[0].ticks.Min = 10;
  chart_zoom.update();
  console.log('implement filter between ' + options.data.datasets[0].data[zoom_startIndex].x + ' and ' + options.data.datasets[0].data[zoom_stopIndex].x);
}
canvas.addEventListener('pointerdown', handlePointerDown, false);
canvas.addEventListener('pointermove', handlePointerMove, false);
canvas.addEventListener('pointerup', handlePointerUp, false);




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
  } 
  else {
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
  
  chart_2_data_sliced = chart_2.data.datasets[0].data.slice(zoom_startIndex,zoom_stopIndex);
  removeData(chart_zoom, 0);
  chart_2_data_sliced.forEach(data => {addData(chart_zoom, data)})
  //chart_zoom.options.scales.yAxes[0].ticks.Min = 10;
  chart_zoom.update();
  console.log('implement filter between ' + options.data.datasets[0].data[zoom_startIndex].x + ' and ' + options.data.datasets[0].data[zoom_stopIndex].x);    
});
function linReg(data) {
  const my_regression = regression.linear(data.map(element => [element.x, element.y]));
  //console.log(my_regression);
  return my_regression;
}
function drawLinReg(chart,datasetData, datasetRegression) {
  reg = linReg(chart.data.datasets[datasetData].data);
  console.log("drawing on chart 2 dataset data = " + datasetData + "datasetRegression = " + datasetRegression);
  prediction = chart.data.datasets[datasetData].data.map(element => {return {x: reg.predict(element.x)[0], y: reg.predict(element.x)[1]}});
  console.log(prediction);
  chart.data.datasets[datasetRegression] = ({data:prediction, label: "Line regression", type:'scatter', showLine: true});
  chart.update();
}