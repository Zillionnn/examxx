/**
 * Created by Hyfd on 2017/7/31.
 */

var sumNum = 0;
var allPointArray = [];
window.onload = function () {

    $(".slideSection").click(function () {
        $(this).next().slideToggle();
    });


    getAllKLPoint();
    allFalse();
};

function allFalse() {
    $.ajax({
        // 	url:'/examxx/admin/getAllFalse',
        url: 'admin/getAllFalse',
        async: false,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            //console.log(data);

            var table = document.getElementById("falseTable");
            for (var rowIndex = 1; rowIndex < data.length; rowIndex++) {

                var tr = table.insertRow(-1);
                var td1 = tr.insertCell(-1);
                var parser = new DOMParser();
                var xmldom = parser.parseFromString(data[rowIndex - 1].content, "text/xml");

                //		//console.log(xmldom.getElementsByTagName('title')[0].firstChild.nodeValue);
                var title = xmldom.getElementsByTagName('title')[0].firstChild.nodeValue;
                td1.innerHTML = title;
                var td2 = tr.insertCell(-1);
                td2.innerHTML = data[rowIndex - 1].times;

                if (data[rowIndex].times == 0) {
                    for (var i in allPointArray) {
                        for (var j in allPointArray[i].points) {
                            if (data[rowIndex - 1].pointId == allPointArray[i].points[j].pointId) {
                                allPointArray[i].points[j].rightTimes++;
                                allPointArray[i].points[j].allQuestion = allPointArray[i].points[j].wrongTimes + allPointArray[i].points[j].rightTimes;
                            }
                        }

                    }
                }

                //新插入一道题wrong times自动设为了1？？
                if (data[rowIndex].times != 0) {
                    for (var i in allPointArray) {
                        for (var j in  allPointArray[i].points) {
                            if (data[rowIndex - 1].pointId == allPointArray[i].points[j].pointId) {
                                allPointArray[i].points[j].wrongTimes++;
                                allPointArray[i].points[j].allQuestion = allPointArray[i].points[j].wrongTimes + allPointArray[i].points[j].rightTimes;
                            }
                        }

                    }
                }

            }
        },
        error: function (err) {
            //console.log(err);
        }
    });

    innerAllKlPoint();

}

function getAllKLPoint() {
    $.ajax({
        //  url:'/examxx/admin/getAllKnowledgePoint',
        url: 'admin/getAllKnowledgePoint',
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (data) {

            for (var i = 0; i < data.length; i++) {
                allPointArray.push({
                    "fieldId": data[i].fieldId,
                    "fieldName": data[i].fieldName,
                    "points": []

                });
                if (i > 0 && data[i].fieldId == data[i - 1].fieldId) {
                    allPointArray.pop();
                }
            }

            for (var j in allPointArray) {
                var pointsArray = [];
                for (var i in data) {
                    if (data[i].fieldId == allPointArray[j].fieldId) {
                        pointsArray.push({
                            "pointId": data[i].pointId,
                            "pointName": data[i].pointName,
                            "wrongTimes": 0,
                            "rightTimes": 0,
                            "allQuestion": 0
                        });
                    }
                    allPointArray[j].points = pointsArray;
                }
            }

            //console.log(allPointArray);

        },
        error: function (err) {
            //console.log("ERROR>>");
            //console.log(err);
        }
    });


}


function innerAllKlPoint() {
    //console.log(allPointArray);
    var fieldFalse = document.getElementById("fieldFalse");

    for (var i =0; i<allPointArray.length; i++) {
        var titleNode = document.createElement("h3");
        var table = document.createElement("table");
        table.setAttribute('class','table');

        titleNode.innerHTML = "题库:" + allPointArray[i].fieldName;
        fieldFalse.appendChild(titleNode);

        fieldFalse.appendChild(table);
        table.createTHead().innerHTML="<tr><th>知识点</th><th>错误率</th></tr>";
        for (var rowIndex = 0; rowIndex < allPointArray[i].points.length; rowIndex++) {
            var tr = table.insertRow(-1);
            var td1 = tr.insertCell(-1);
            td1.innerHTML = allPointArray[i].points[rowIndex].pointName;
            var td2 = tr.insertCell(-1);
            var wrongTimes = allPointArray[i].points[rowIndex].wrongTimes;
            var allQues = allPointArray[i].points[rowIndex].allQuestion;

            var wrongPercent = (wrongTimes / allQues) * 100;
            //console.log(wrongPercent);
            td2.innerHTML = wrongPercent.toFixed(2) + "%";

        }
    }
}

