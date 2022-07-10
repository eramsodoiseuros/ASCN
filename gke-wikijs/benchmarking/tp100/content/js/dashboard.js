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

    var data = {"OkPercent": 99.95344506517691, "KoPercent": 0.04655493482309125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7915150136487716, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login-6"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/e/en/home"], "isController": false}, {"data": [0.265, 500, 1500, "http://35.223.72.104:3000/login-5"], "isController": false}, {"data": [0.035, 500, 1500, "http://35.223.72.104:3000/login-4"], "isController": false}, {"data": [0.265, 500, 1500, "http://35.223.72.104:3000/login-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-2"], "isController": false}, {"data": [0.275, 500, 1500, "http://35.223.72.104:3000/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-3"], "isController": false}, {"data": [0.29, 500, 1500, "http://35.223.72.104:3000/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-4"], "isController": false}, {"data": [0.43, 500, 1500, "http://35.223.72.104:3000/login-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-5"], "isController": false}, {"data": [0.97, 500, 1500, "http://35.223.72.104:3000/logout"], "isController": false}, {"data": [0.975625, 500, 1500, "http://35.223.72.104:3000/graphql"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/en/home"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4296, 2, 0.04655493482309125, 1046.3503258845428, 77, 20872, 282.0, 1687.500000000001, 3003.299999999992, 16161.19999999999, 34.72637620240886, 3744.102568191234, 29.80685676178159], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.72.104:3000/login", 100, 0, 0.0, 13577.76, 4978, 20872, 14644.0, 17599.0, 18584.45, 20864.399999999998, 4.758958739827726, 10898.154936824822, 13.46357760671965], "isController": false}, {"data": ["http://35.223.72.104:3000/", 100, 0, 0.0, 592.5, 578, 637, 590.0, 606.8, 615.9, 636.8599999999999, 4.278623994523361, 23.24412625149752, 14.264865544240973], "isController": false}, {"data": ["Test", 100, 2, 2.0, 17281.839999999993, 9546, 24352, 18790.0, 20973.100000000002, 22013.3, 24342.289999999994, 4.075810067250866, 9479.010414013144, 94.71689041165682], "isController": true}, {"data": ["http://35.223.72.104:3000/login-6", 100, 0, 0.0, 12355.240000000003, 3291, 20017, 13422.0, 16406.7, 17435.699999999997, 20002.359999999993, 4.862867146469559, 10724.882531365492, 1.9517953097646372], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home", 100, 0, 0.0, 584.3199999999999, 570, 621, 583.0, 596.9, 603.0, 620.98, 2.6590794267024753, 11.903535246097801, 8.888700075783763], "isController": false}, {"data": ["http://35.223.72.104:3000/login-5", 100, 0, 0.0, 1479.8400000000004, 506, 2457, 1449.5, 2162.8, 2294.5999999999995, 2456.75, 32.07184092366902, 171.13333867864017, 12.997865218088519], "isController": false}, {"data": ["http://35.223.72.104:3000/login-4", 100, 0, 0.0, 2334.9100000000003, 1152, 4140, 2310.0, 3089.1, 3534.9, 4139.12, 19.932230416583618, 1269.3949945186366, 8.233724088100457], "isController": false}, {"data": ["http://35.223.72.104:3000/login-3", 100, 0, 0.0, 1495.5100000000002, 533, 2470, 1448.0, 2163.8, 2287.2499999999995, 2469.72, 24.962556165751373, 36.176204443334996, 10.165415938592112], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-0", 100, 0, 0.0, 303.47, 290, 399, 302.0, 311.0, 319.9, 398.2899999999996, 1.837965005146302, 5.765179293486252, 0.7000062031318923], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-1", 100, 0, 0.0, 242.34000000000003, 135, 353, 277.0, 286.0, 299.74999999999994, 352.95, 1.8391142825615185, 0.7058319463346452, 0.9213531513223231], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-2", 100, 0, 0.0, 236.52999999999994, 135, 303, 277.0, 285.0, 288.95, 302.95, 1.8390128179193408, 0.7039970943597477, 0.9033432103646762], "isController": false}, {"data": ["http://35.223.72.104:3000/login-2", 100, 0, 0.0, 1451.07, 523, 2445, 1403.0, 2162.2000000000003, 2252.0999999999995, 2444.1399999999994, 24.962556165751373, 54.751856590114826, 10.165415938592112], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-3", 100, 0, 0.0, 247.86, 136, 354, 277.0, 286.0, 293.84999999999997, 353.8399999999999, 1.8436238269943401, 0.7057622462712708, 0.9056081884552276], "isController": false}, {"data": ["http://35.223.72.104:3000/login-1", 100, 0, 0.0, 1363.4300000000005, 486, 2455, 1388.5, 2053.2000000000003, 2118.1499999999996, 2453.5799999999995, 22.39140170174653, 218.29429998880428, 9.315172973578145], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-4", 100, 0, 0.0, 278.13, 136, 353, 280.0, 290.6, 299.74999999999994, 352.95, 1.8388437350593947, 0.7057281131624434, 0.9158303758596594], "isController": false}, {"data": ["http://35.223.72.104:3000/login-0", 100, 0, 0.0, 1220.9299999999998, 426, 1963, 1249.5, 1632.7000000000003, 1942.4499999999998, 1962.94, 34.43526170798898, 74.0828921315427, 13.0477358815427], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-5", 100, 0, 0.0, 278.74999999999994, 138, 354, 281.0, 290.6, 299.95, 353.93999999999994, 1.8390128179193408, 0.705793005314747, 0.9015472994096768], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-6", 100, 0, 0.0, 271.57000000000016, 134, 353, 280.0, 288.0, 298.95, 352.95, 1.8391142825615185, 0.7094239664177732, 0.8980050207819914], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-6", 100, 0, 0.0, 270.82, 136, 296, 277.5, 286.9, 289.95, 295.99, 2.681684097613301, 1.0344386899973184, 1.3094160632877447], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-5", 100, 0, 0.0, 270.52000000000004, 138, 293, 278.0, 285.0, 287.0, 292.99, 2.681396471282244, 1.0290906379042206, 1.3145127232262563], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-4", 100, 0, 0.0, 274.8100000000001, 140, 295, 279.0, 285.9, 289.95, 294.98, 2.681180792020806, 1.0290078625626726, 1.3353537147759875], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-3", 100, 0, 0.0, 262.1400000000001, 136, 295, 279.0, 283.0, 289.74999999999994, 294.99, 2.681684097613301, 1.0265821936175918, 1.3172725596674713], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-2", 100, 0, 0.0, 233.04000000000002, 136, 295, 275.0, 284.0, 286.0, 294.95, 2.681684097613301, 1.0265821936175918, 1.3172725596674713], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-0", 98, 0, 0.0, 258.7244897959184, 140, 310, 280.0, 288.0, 298.05, 310.0, 1.625638643752903, 0.7747184161634928, 0.6175521800975383], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-1", 100, 0, 0.0, 223.96000000000004, 135, 295, 275.0, 284.0, 285.0, 294.98, 2.691572685920383, 1.0329961577799909, 1.3484148319112859], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-1", 98, 0, 0.0, 167.38775510204076, 157, 260, 165.0, 172.10000000000002, 180.64999999999992, 260.0, 1.625342068164856, 0.5126811406418442, 0.6904529293473753], "isController": false}, {"data": ["http://35.223.72.104:3000/-3", 100, 0, 0.0, 258.0900000000001, 137, 315, 279.0, 290.0, 294.0, 314.90999999999997, 4.338206585397597, 1.6607197084725176, 2.1309745238818274], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-0", 100, 0, 0.0, 300.85999999999996, 290, 334, 299.0, 312.9, 315.9, 333.91999999999996, 2.679241238881149, 5.824209958739686, 1.02564703675919], "isController": false}, {"data": ["http://35.223.72.104:3000/-2", 100, 0, 0.0, 251.11, 138, 307, 278.0, 286.9, 297.95, 306.99, 4.339901050256054, 1.6613683708011455, 2.131806863553511], "isController": false}, {"data": ["http://35.223.72.104:3000/-5", 100, 0, 0.0, 273.09999999999997, 140, 315, 279.0, 287.9, 297.95, 314.8499999999999, 4.366621544910703, 1.6758615890135802, 2.140667983930833], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 100, 2, 2.0, 419.69000000000005, 77, 547, 444.0, 458.9, 465.95, 546.5999999999998, 1.6543144520910535, 1.3513358072227368, 1.3045820374536792], "isController": false}, {"data": ["http://35.223.72.104:3000/graphql", 800, 0, 0.0, 189.67, 138, 1080, 149.0, 174.79999999999995, 484.7999999999997, 1035.88, 6.77294546932279, 16.492477731296088, 8.130510955239297], "isController": false}, {"data": ["http://35.223.72.104:3000/-4", 100, 0, 0.0, 276.26, 138, 315, 280.0, 289.8, 294.0, 314.87999999999994, 4.339901050256054, 1.6656065554205364, 2.1614741558892456], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home", 100, 0, 0.0, 590.2100000000003, 572, 685, 587.0, 601.9, 614.95, 684.91, 1.8284544074893494, 9.945792040737963, 6.10853762502057], "isController": false}, {"data": ["http://35.223.72.104:3000/-1", 100, 0, 0.0, 232.46, 136, 315, 276.0, 286.9, 294.0, 314.88999999999993, 4.340466166066236, 1.6658234406875296, 2.1744718195234167], "isController": false}, {"data": ["http://35.223.72.104:3000/-0", 100, 0, 0.0, 304.65999999999997, 294, 335, 303.0, 314.9, 319.9, 334.9, 4.332567913002037, 13.560429844894069, 1.6204819440232225], "isController": false}, {"data": ["http://35.223.72.104:3000/-6", 100, 0, 0.0, 260.37, 137, 315, 279.0, 290.9, 297.84999999999997, 314.90999999999997, 4.340466166066236, 1.674300913668128, 2.119368245149529], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, 100.0, 0.04655493482309125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4296, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
