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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2038888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38, 500, 1500, "http://35.223.72.104:3000/-3"], "isController": false}, {"data": [0.38, 500, 1500, "http://35.223.72.104:3000/-2"], "isController": false}, {"data": [0.355, 500, 1500, "http://35.223.72.104:3000/-5"], "isController": false}, {"data": [0.12, 500, 1500, "http://35.223.72.104:3000/-4"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.43, 500, 1500, "http://35.223.72.104:3000/-1"], "isController": false}, {"data": [0.17, 500, 1500, "http://35.223.72.104:3000/-0"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 0, 0.0, 4126.939999999997, 244, 19194, 1667.5, 13260.0, 14996.949999999999, 18053.070000000003, 41.04037346739855, 23505.95406043195, 28.976748063407378], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.72.104:3000/-3", 100, 0, 0.0, 1279.3999999999999, 244, 2353, 1283.0, 1865.9, 2206.6499999999996, 2352.5499999999997, 22.878059940517044, 33.155313429421184, 9.31655370624571], "isController": false}, {"data": ["http://35.223.72.104:3000/-2", 100, 0, 0.0, 1275.4200000000005, 257, 2357, 1275.0, 1858.4, 2207.5499999999997, 2356.5099999999998, 22.361359570661897, 49.04649765205724, 9.10613959078712], "isController": false}, {"data": ["http://35.223.72.104:3000/-5", 100, 0, 0.0, 1344.33, 294, 2689, 1351.5, 1950.5000000000002, 2277.4999999999995, 2685.8999999999983, 16.72240802675585, 89.22972408026756, 6.777147784280936], "isController": false}, {"data": ["http://35.223.72.104:3000/-4", 100, 0, 0.0, 1960.8999999999999, 605, 6894, 1854.0, 2746.7000000000003, 3332.899999999999, 6881.179999999993, 11.373976342129207, 724.3579034918107, 4.698429680391265], "isController": false}, {"data": ["Test", 100, 0, 0.0, 12975.669999999995, 5033, 19194, 13416.0, 17838.600000000002, 18609.35, 19193.42, 5.1190171487074485, 11727.708280010238, 14.457224212951113], "isController": true}, {"data": ["http://35.223.72.104:3000/-1", 100, 0, 0.0, 1205.739999999999, 304, 2509, 1193.0, 1839.5000000000002, 2056.5499999999997, 2508.1599999999994, 17.310022503029256, 168.75581508568462, 7.2012398303617795], "isController": false}, {"data": ["http://35.223.72.104:3000/-0", 100, 0, 0.0, 1787.0599999999997, 428, 2883, 1746.0, 2754.8, 2817.3999999999996, 2882.56, 26.288117770767613, 82.27872798370137, 9.83237217402734], "isController": false}, {"data": ["http://35.223.72.104:3000/", 100, 0, 0.0, 12975.669999999995, 5033, 19194, 13416.0, 17838.600000000002, 18609.35, 19193.42, 5.130046683424819, 11752.977030215976, 14.488374031703689], "isController": false}, {"data": ["http://35.223.72.104:3000/-6", 100, 0, 0.0, 11186.999999999998, 2279, 17736, 11763.5, 15265.900000000001, 17006.85, 17735.81, 5.252376700456956, 11583.932158989443, 2.1081316639529386], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
