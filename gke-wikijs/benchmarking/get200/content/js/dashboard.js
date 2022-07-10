/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04083333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0475, 500, 1500, "http://35.223.72.104:3000/-3"], "isController": false}, {"data": [0.05, 500, 1500, "http://35.223.72.104:3000/-2"], "isController": false}, {"data": [0.04, 500, 1500, "http://35.223.72.104:3000/-5"], "isController": false}, {"data": [0.01, 500, 1500, "http://35.223.72.104:3000/-4"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.1625, 500, 1500, "http://35.223.72.104:3000/-1"], "isController": false}, {"data": [0.0575, 500, 1500, "http://35.223.72.104:3000/-0"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/-6"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 7986.724374999998, 477, 32708, 3355.0, 24519.8, 26727.749999999993, 29791.300000000003, 48.77900064022438, 27938.267888174138, 34.44064205359592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.72.104:3000/-3", 200, 0, 0.0, 2743.5449999999996, 1039, 4733, 2671.0, 4127.2, 4327.15, 4557.79, 26.64890073284477, 38.62008660892738, 10.852140239840107], "isController": false}, {"data": ["http://35.223.72.104:3000/-2", 200, 0, 0.0, 2743.870000000001, 810, 4559, 2735.0, 4108.6, 4324.5, 4536.7300000000005, 24.72493509704537, 54.230668191370995, 10.06865032760539], "isController": false}, {"data": ["http://35.223.72.104:3000/-5", 200, 0, 0.0, 2834.1249999999964, 1039, 5460, 2776.5, 4207.2, 4468.099999999999, 5250.450000000004, 21.77700348432056, 116.20072952961674, 8.82564106054007], "isController": false}, {"data": ["http://35.223.72.104:3000/-4", 200, 0, 0.0, 3612.395000000001, 1376, 7172, 3561.5, 4938.4, 5503.449999999997, 6900.920000000006, 18.609844607797523, 1185.1781311063553, 7.68746510654136], "isController": false}, {"data": ["Test", 200, 0, 0.0, 24830.709999999995, 11696, 32708, 25326.5, 28953.600000000002, 30441.249999999996, 32267.120000000003, 6.086982986882552, 13945.325577502512, 17.190971482484706], "isController": true}, {"data": ["http://35.223.72.104:3000/-1", 200, 0, 0.0, 2299.915000000002, 617, 4964, 2247.5, 3932.6, 4240.4, 4948.340000000004, 21.910604732690622, 213.6069990687993, 9.115153921998248], "isController": false}, {"data": ["http://35.223.72.104:3000/-0", 200, 0, 0.0, 2965.31, 477, 4513, 3068.5, 4238.7, 4391.05, 4500.82, 36.71745915182669, 114.9213443179732, 13.733190288232054], "isController": false}, {"data": ["http://35.223.72.104:3000/", 200, 0, 0.0, 24830.70499999999, 11696, 32708, 25326.5, 28953.600000000002, 30441.249999999996, 32267.120000000003, 6.097375080028048, 13969.133944087069, 17.22032102679796], "isController": false}, {"data": ["http://35.223.72.104:3000/-6", 200, 0, 0.0, 21863.929999999993, 10772, 30698, 22557.5, 26345.600000000002, 28380.999999999996, 30372.61, 6.19348445435402, 13659.51222438994, 2.4858614362690448], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
