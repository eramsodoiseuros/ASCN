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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7611035319084433, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login"], "isController": false}, {"data": [0.495, 500, 1500, "http://35.223.72.104:3000/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login-6"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/e/en/home"], "isController": false}, {"data": [0.005, 500, 1500, "http://35.223.72.104:3000/login-5"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.72.104:3000/login-4"], "isController": false}, {"data": [0.008333333333333333, 500, 1500, "http://35.223.72.104:3000/login-3"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "http://35.223.72.104:3000/en/home-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-2"], "isController": false}, {"data": [0.01, 500, 1500, "http://35.223.72.104:3000/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-3"], "isController": false}, {"data": [0.03833333333333333, 500, 1500, "http://35.223.72.104:3000/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-4"], "isController": false}, {"data": [0.09166666666666666, 500, 1500, "http://35.223.72.104:3000/login-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/logout-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "http://35.223.72.104:3000/-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://35.223.72.104:3000/e/en/home-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "http://35.223.72.104:3000/-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "http://35.223.72.104:3000/-5"], "isController": false}, {"data": [0.965, 500, 1500, "http://35.223.72.104:3000/logout"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "http://35.223.72.104:3000/graphql"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "http://35.223.72.104:3000/-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://35.223.72.104:3000/en/home"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "http://35.223.72.104:3000/-1"], "isController": false}, {"data": [0.99, 500, 1500, "http://35.223.72.104:3000/-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "http://35.223.72.104:3000/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12894, 3, 0.023266635644485806, 2128.04676593765, 3, 39512, 284.0, 4201.5, 7473.5, 33422.34999999999, 91.51235991738763, 9885.96004773366, 78.54595756534823], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.72.104:3000/login", 300, 0, 0.0, 30778.52333333332, 12773, 39512, 31439.5, 35925.8, 36797.15, 38535.14000000001, 7.587061531069017, 17374.59318334134, 21.464567632331], "isController": false}, {"data": ["http://35.223.72.104:3000/", 300, 0, 0.0, 624.9500000000003, 571, 2800, 593.0, 664.0, 718.95, 1533.6100000000067, 9.025813827546784, 49.03379133070582, 30.09192227269992], "isController": false}, {"data": ["Test", 300, 3, 1.0, 34508.15999999996, 18246, 42967, 35054.0, 39343.9, 40508.049999999996, 42036.73, 6.963141769566429, 16272.24222866232, 161.87101432666418], "isController": true}, {"data": ["http://35.223.72.104:3000/login-6", 300, 0, 0.0, 27802.716666666696, 9626, 39117, 28345.0, 33531.400000000016, 34652.1, 36040.51, 7.666555927525492, 16908.319570800642, 3.0771039904423603], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home", 300, 0, 0.0, 605.2600000000003, 560, 798, 591.5, 640.8000000000001, 707.6999999999999, 789.97, 7.526342197691922, 33.69214124435524, 25.15885677997993], "isController": false}, {"data": ["http://35.223.72.104:3000/login-5", 300, 0, 0.0, 3833.9300000000007, 1412, 11795, 3754.5, 5439.0, 5755.199999999999, 6763.700000000001, 21.585839689163908, 115.18069146639805, 8.748167452151389], "isController": false}, {"data": ["http://35.223.72.104:3000/login-4", 300, 0, 0.0, 5298.323333333331, 1917, 13307, 5078.0, 7644.200000000002, 8927.849999999999, 11896.73000000001, 19.76544999341152, 1258.7734920608775, 8.164829440637766], "isController": false}, {"data": ["http://35.223.72.104:3000/login-3", 300, 0, 0.0, 3667.2700000000027, 1074, 8268, 3561.5, 5316.0, 5595.9, 6678.440000000008, 30.199315482182403, 43.765414233944036, 12.29796343366217], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-0", 300, 0, 0.0, 314.3866666666664, 287, 531, 304.0, 349.90000000000003, 377.95, 435.7500000000002, 4.659253277008138, 14.61476711499037, 1.7745202910480213], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-1", 300, 0, 0.0, 206.26333333333335, 134, 347, 157.0, 287.90000000000003, 299.0, 336.97, 4.671514660770177, 1.792876232111992, 2.340319356420997], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-2", 300, 0, 0.0, 251.26666666666665, 134, 334, 278.5, 297.0, 304.9, 324.94000000000005, 4.66164245202393, 1.7845350011654104, 2.289849759148473], "isController": false}, {"data": ["http://35.223.72.104:3000/login-2", 300, 0, 0.0, 3684.9799999999996, 1078, 8312, 3662.0, 5322.200000000001, 5607.299999999999, 8233.700000000017, 30.199315482182403, 66.23795173142743, 12.29796343366217], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-3", 300, 0, 0.0, 258.20999999999987, 135, 339, 280.0, 294.90000000000003, 303.0, 325.9200000000001, 4.661570016781652, 1.7845072720492263, 2.2898141781652064], "isController": false}, {"data": ["http://35.223.72.104:3000/login-1", 300, 0, 0.0, 3557.669999999999, 1053, 11162, 3495.5, 5195.500000000001, 5707.65, 7629.860000000006, 21.88662727073758, 213.3732422302473, 9.105178923177938], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-4", 300, 0, 0.0, 283.9399999999999, 137, 479, 282.0, 301.0, 309.9, 337.98, 4.661570016781652, 1.7890595865187398, 2.3216803794517995], "isController": false}, {"data": ["http://35.223.72.104:3000/login-0", 300, 0, 0.0, 2974.746666666668, 383, 4851, 3163.5, 4516.8, 4682.65, 4826.89, 52.770448548812666, 113.52861147757257, 19.99505277044855], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-5", 300, 0, 0.0, 284.5599999999999, 162, 468, 282.0, 299.0, 309.0, 335.98, 4.661570016781652, 1.7890595865187398, 2.285261863695693], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home-6", 300, 0, 0.0, 285.2933333333333, 263, 347, 282.0, 301.0, 309.95, 333.99, 4.66164245202393, 1.7981921567865744, 2.2761926035273095], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-6", 300, 0, 0.0, 287.37000000000006, 136, 417, 282.0, 308.90000000000003, 325.95, 414.8900000000001, 7.587637209772876, 2.926871775254186, 3.7049009813344127], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-5", 300, 0, 0.0, 286.55999999999995, 135, 422, 281.5, 308.0, 326.0, 412.9200000000001, 7.586102260658474, 2.911463074647246, 3.718968100439994], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-4", 300, 0, 0.0, 283.3066666666666, 137, 422, 281.0, 308.80000000000007, 325.0, 412.9200000000001, 7.587637209772876, 2.9120521713288485, 3.778999000961101], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-3", 300, 0, 0.0, 256.2466666666668, 132, 421, 279.0, 301.0, 317.9, 414.85000000000014, 7.61459972587441, 2.914963957561297, 3.7403746700340115], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-2", 300, 0, 0.0, 253.61333333333343, 132, 415, 278.0, 302.0, 319.0, 403.85000000000014, 7.587637209772876, 2.90464236936618, 3.7271303872224193], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-0", 297, 0, 0.0, 251.99663299663302, 137, 381, 278.0, 290.2, 298.09999999999997, 330.6799999999994, 3.925974884335757, 1.870972405816259, 1.4914103808658294], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-1", 300, 0, 0.0, 224.45666666666665, 132, 422, 273.0, 301.90000000000003, 320.9, 405.83000000000015, 7.587637209772876, 2.9120521713288485, 3.8012284068491073], "isController": false}, {"data": ["http://35.223.72.104:3000/logout-1", 297, 0, 0.0, 171.4882154882156, 154, 365, 164.0, 188.0, 212.09999999999997, 276.2199999999998, 3.9250409684410847, 1.2380744461000686, 1.6673758020233123], "isController": false}, {"data": ["http://35.223.72.104:3000/-3", 300, 0, 0.0, 263.81666666666666, 134, 1301, 280.5, 299.90000000000003, 316.95, 385.98, 9.452093638740982, 3.6183795960805316, 4.642971777623743], "isController": false}, {"data": ["http://35.223.72.104:3000/e/en/home-0", 300, 0, 0.0, 310.6800000000003, 285, 490, 301.5, 331.90000000000003, 362.95, 478.94000000000005, 7.580543272267846, 16.478798168035375, 2.9019267214150344], "isController": false}, {"data": ["http://35.223.72.104:3000/-2", 300, 0, 0.0, 244.88999999999987, 133, 1284, 277.0, 298.90000000000003, 315.79999999999995, 388.7900000000002, 9.460439595093186, 3.62157453249661, 4.647071402667844], "isController": false}, {"data": ["http://35.223.72.104:3000/-5", 300, 0, 0.0, 287.6300000000001, 136, 1289, 283.0, 303.0, 330.84999999999997, 429.5600000000004, 9.461633077869239, 3.631271288674425, 4.638417778408553], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 300, 3, 1.0, 420.0433333333337, 3, 605, 442.0, 473.90000000000003, 505.69999999999993, 558.9300000000001, 3.9572093759480813, 3.1832735148922975, 3.152473750511139], "isController": false}, {"data": ["http://35.223.72.104:3000/graphql", 2400, 0, 0.0, 184.2616666666666, 136, 2279, 157.0, 199.0, 237.94999999999982, 808.7399999999943, 18.73170731707317, 71.94987804878049, 22.486280487804876], "isController": false}, {"data": ["http://35.223.72.104:3000/-4", 300, 0, 0.0, 283.4666666666666, 138, 1289, 282.0, 301.0, 326.69999999999993, 386.0, 9.461633077869239, 3.631271288674425, 4.712336786829407], "isController": false}, {"data": ["http://35.223.72.104:3000/en/home", 300, 0, 0.0, 605.2900000000005, 572, 867, 593.0, 645.9000000000001, 663.95, 782.3700000000006, 4.63922308477407, 25.234836506046456, 15.498810715832123], "isController": false}, {"data": ["http://35.223.72.104:3000/-1", 300, 0, 0.0, 240.49999999999983, 133, 1309, 276.0, 295.90000000000003, 307.0, 384.98, 9.49938254013489, 3.6457591194072387, 4.758968010829296], "isController": false}, {"data": ["http://35.223.72.104:3000/-0", 300, 0, 0.0, 323.3799999999999, 286, 1494, 304.0, 338.0, 424.5999999999999, 669.5200000000013, 9.108850766661606, 28.509635456201607, 3.406923675421284], "isController": false}, {"data": ["http://35.223.72.104:3000/-6", 300, 0, 0.0, 286.5666666666671, 138, 869, 282.0, 303.0, 318.84999999999997, 386.0, 9.453285016543248, 3.6465308413423667, 4.615861824484008], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 3, 100.0, 0.023266635644485806], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12894, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 3, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.72.104:3000/logout", 300, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.72.104:3000 failed to respond", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
