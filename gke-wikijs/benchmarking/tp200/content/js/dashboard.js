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

    var data = {"OkPercent": 99.97673336435551, "KoPercent": 0.023266635644485806};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7686448385629832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login"], "isController": false}, {"data": [0.4975, 500, 1500, "http://35.223.72.104:3000/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login-6"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/e/en/home"], "isController": false}, {"data": [0.0625, 500, 1500, "http://35.223.72.104:3000/login-5"], "isController": false}, {"data": [0.0225, 500, 1500, "http://35.223.72.104:3000/login-4"], "isController": false}, {"data": [0.0675, 500, 1500, "http://35.223.72.104:3000/login-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-2"], "isController": false}, {"data": [0.0625, 500, 1500, "http://35.223.72.104:3000/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-3"], "isController": false}, {"data": [0.165, 500, 1500, "http://35.223.72.104:3000/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-4"], "isController": false}, {"data": [0.1225, 500, 1500, "http://35.223.72.104:3000/login-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-5"], "isController": false}, {"data": [0.98, 500, 1500, "http://35.223.72.104:3000/logout"], "isController": false}, {"data": [0.9809375, 500, 1500, "http://35.223.72.104:3000/graphql"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/en/home"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-1"], "isController": false}, {"data": [0.9975, 500, 1500, "http://35.223.72.104:3000/-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8596, 2, 0.023266635644485806, 1616.337831549559, 15, 30640, 283.0, 2972.3, 4864.149999999992, 24940.42000000001, 38.11922679520893, 4116.366743700472, 32.71810685445427], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.72.104:3000/login", 200, 0, 0.0, 22977.704999999987, 9509, 30640, 23189.0, 27402.3, 28133.85, 29869.360000000008, 6.508721687060661, 14905.16334857459, 18.413834694740952], "isController": false}, {"data": ["http://35.223.72.104:3000/", 200, 0, 0.0, 603.2800000000002, 567, 1636, 594.0, 618.9, 634.5999999999999, 684.6700000000003, 7.170771933598652, 38.956058854110644, 23.907241583306444], "isController": false}, {"data": ["Test", 200, 2, 1.0, 26712.44500000001, 14496, 34077, 26765.0, 30935.1, 31651.6, 33319.39000000001, 5.844364571461967, 13647.194687883537, 135.86298435171386], "isController": true}, {"data": ["http://35.223.72.104:3000/login-6", 200, 0, 0.0, 20781.120000000003, 6620, 29433, 21332.0, 25130.7, 26391.25, 28523.33, 6.615069127472382, 14589.302399616325, 2.6550716908116687], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home", 200, 0, 0.0, 590.1950000000003, 569, 683, 586.0, 606.9, 617.0, 654.8500000000001, 5.485012204152154, 24.553999945149876, 18.335153100403147], "isController": false}, {"data": ["http://35.223.72.104:3000/login-5", 200, 0, 0.0, 2715.2099999999996, 990, 5093, 2864.0, 3836.9, 4008.0499999999997, 4881.79, 29.577048210588583, 157.82128068618752, 11.98679199940846], "isController": false}, {"data": ["http://35.223.72.104:3000/login-4", 200, 0, 0.0, 3707.9199999999987, 1385, 10729, 3738.5, 5140.8, 5627.699999999999, 6933.540000000001, 17.788846393311395, 1132.8924108334074, 7.348322289424531], "isController": false}, {"data": ["http://35.223.72.104:3000/login-3", 200, 0, 0.0, 2555.785, 1006, 4428, 2693.5, 3741.1000000000004, 3911.1, 4124.72, 35.34193320374625, 51.21819226011663, 14.392173970666196], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-0", 200, 0, 0.0, 306.0650000000001, 288, 390, 302.0, 320.0, 329.0, 386.7600000000002, 3.868322308614754, 12.133839116475185, 1.4732868167575723], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-1", 200, 0, 0.0, 234.02500000000015, 133, 361, 276.0, 287.0, 291.95, 357.7800000000002, 3.8700439249985488, 1.4852805298090133, 1.9388013022697808], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-2", 200, 0, 0.0, 224.4699999999999, 135, 341, 275.0, 286.0, 290.95, 311.9200000000001, 3.8700439249985488, 1.4815011900385069, 1.9010079045647168], "isController": false}, {"data": ["http://35.223.72.104:3000/login-2", 200, 0, 0.0, 2578.4299999999994, 991, 4567, 2719.5, 3702.1, 3914.8999999999996, 4368.100000000002, 30.459945172098692, 66.80960630520865, 12.40409876637222], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-3", 200, 0, 0.0, 260.00500000000005, 135, 361, 280.0, 290.9, 299.84999999999997, 360.8000000000002, 3.869744403382157, 1.481386529419732, 1.9008607762707272], "isController": false}, {"data": ["http://35.223.72.104:3000/login-1", 200, 0, 0.0, 2209.8049999999985, 882, 4096, 2303.0, 3538.8, 3650.85, 3876.91, 35.66333808844508, 347.68271888373755, 14.836505884450785], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-4", 200, 0, 0.0, 278.51499999999993, 139, 361, 280.0, 289.9, 298.9, 360.83000000000015, 3.869744403382157, 1.4851655766886598, 1.9273141071532225], "isController": false}, {"data": ["http://35.223.72.104:3000/login-0", 200, 0, 0.0, 2195.434999999999, 465, 3498, 2421.0, 3307.6, 3410.5, 3483.92, 45.19774011299435, 97.2369350282486, 17.125706214689266], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-5", 200, 0, 0.0, 279.175, 139, 361, 280.0, 292.0, 300.79999999999995, 357.83000000000015, 3.8801800403538724, 1.489170660018625, 1.9021976369703555], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-6", 200, 0, 0.0, 280.1550000000001, 137, 361, 280.0, 290.9, 299.95, 360.83000000000015, 3.8700439249985488, 1.492839209350026, 1.8896698852531975], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-6", 200, 0, 0.0, 278.25999999999993, 138, 322, 280.0, 293.0, 303.0, 315.96000000000004, 5.533574966106854, 2.1345333121212957, 2.701940901419362], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-5", 200, 0, 0.0, 280.02500000000026, 143, 325, 281.0, 294.9, 301.95, 315.96000000000004, 5.533574966106854, 2.1237255485156186, 2.7127486650250394], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-4", 200, 0, 0.0, 274.3449999999999, 136, 320, 280.0, 292.0, 300.95, 311.97, 5.532044366995823, 2.123138121317733, 2.755217409343623], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-3", 200, 0, 0.0, 248.92499999999984, 135, 322, 278.0, 290.8, 302.9, 311.99, 5.532809560694921, 2.118028659953524, 2.717776571317915], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-2", 200, 0, 0.0, 236.52999999999992, 135, 320, 277.0, 289.9, 299.9, 307.0, 5.532809560694921, 2.118028659953524, 2.717776571317915], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-0", 198, 0, 0.0, 251.69696969696972, 140, 385, 279.0, 288.0, 298.04999999999995, 356.28999999999974, 1.2821343003302466, 0.6110171275011331, 0.4870607840121738], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-1", 200, 0, 0.0, 236.05999999999995, 134, 312, 276.5, 288.9, 295.9, 308.97, 5.555555555555555, 2.1321614583333335, 2.783203125], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-1", 198, 0, 0.0, 167.4343434343435, 152, 312, 163.0, 179.0, 192.0, 266.4599999999996, 1.28130460104834, 0.4041615099009901, 0.5443042006406523], "isController": false}, {"data": ["http://35.223.72.104:3000/-3", 200, 0, 0.0, 253.19499999999996, 136, 333, 280.0, 294.0, 302.95, 319.9100000000001, 7.529270037269887, 2.8822986861423785, 3.6984597936980013], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-0", 200, 0, 0.0, 302.21500000000003, 285, 397, 300.0, 315.9, 322.95, 342.9200000000001, 5.5285272003538255, 12.018067917956655, 2.116389318885449], "isController": false}, {"data": ["http://35.223.72.104:3000/-2", 200, 0, 0.0, 234.36, 133, 330, 279.0, 295.0, 300.95, 326.8800000000001, 7.529270037269887, 2.8822986861423785, 3.6984597936980013], "isController": false}, {"data": ["http://35.223.72.104:3000/-5", 200, 0, 0.0, 277.05500000000023, 137, 333, 283.0, 295.0, 301.95, 326.95000000000005, 7.529270037269887, 2.88965148891315, 3.6911069909272296], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 200, 2, 1.0, 415.6700000000001, 15, 628, 441.5, 460.0, 470.9, 601.3500000000006, 1.293008701948564, 1.0401270098204012, 1.030063260450743], "isController": false}, {"data": ["http://35.223.72.104:3000/graphql", 1600, 0, 0.0, 191.4349999999996, 135, 2231, 156.0, 185.0, 274.449999999998, 1134.98, 7.431076763022961, 26.864172507512354, 8.920557725533179], "isController": false}, {"data": ["http://35.223.72.104:3000/-4", 200, 0, 0.0, 277.89500000000004, 138, 333, 282.0, 294.0, 301.95, 326.95000000000005, 7.530120481927711, 2.8899778802710845, 3.7503529743975905], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home", 200, 0, 0.0, 594.1150000000001, 565, 690, 589.0, 610.8, 628.8499999999999, 680.99, 3.8471896279767632, 20.92660764436579, 12.85276925518409], "isController": false}, {"data": ["http://35.223.72.104:3000/-1", 200, 0, 0.0, 250.67, 133, 322, 281.0, 294.0, 302.95, 309.0, 7.530120481927711, 2.8899778802710845, 3.772413874246988], "isController": false}, {"data": ["http://35.223.72.104:3000/-0", 200, 0, 0.0, 312.23999999999995, 287, 1326, 304.0, 323.9, 331.95, 385.8000000000002, 7.24296526998153, 22.669632510049613, 2.7090387679716077], "isController": false}, {"data": ["http://35.223.72.104:3000/-6", 200, 0, 0.0, 274.92499999999995, 137, 333, 283.0, 294.9, 303.0, 332.97, 7.563438339068941, 2.9175372499338197, 3.693085126498506], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, 100.0, 0.023266635644485806], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8596, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 200, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
