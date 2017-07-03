<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%-- <%@taglib uri="spring.tld" prefix="spring"%> --%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE html>
<html>
<head>
    <base href="<%=basePath%>">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>用户管理</title>
    <meta name="keywords" content="">
    <link rel="shortcut icon" href="<%=basePath%>resources/images/favicon.ico"/>
    <link href="resources/bootstrap/css/bootstrap-huan.css" rel="stylesheet">
    <link href="resources/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="resources/css/style.css" rel="stylesheet">

    <link href="resources/css/exam.css" rel="stylesheet">
    <link href="resources/chart/morris.css" rel="stylesheet">
    <style type="text/css">
        .disable-btn, .enable-btn {
            text-decoration: underline;
        }

        .disable-btn, .enable-btn {
            cursor: pointer;
        }
    </style>
</head>
<body>
<header>
    <div class="container">
        <div class="row">
            <div class="col-xs-5">
                <div class="logo">
                    <h1>保密考试系统</h1>
                </div>
            </div>
            <div class="col-xs-7" id="login-info">
                <c:choose>
                    <c:when test="${not empty sessionScope.SPRING_SECURITY_CONTEXT.authentication.principal.username}">
                        <div id="login-info-user">

                            <a href="user-detail/${sessionScope.SPRING_SECURITY_CONTEXT.authentication.principal.username}"
                               id="system-info-account"
                               target="_blank">${sessionScope.SPRING_SECURITY_CONTEXT.authentication.principal.username}</a>
                            <span>|</span>
                            <a href="j_spring_security_logout"><i class="fa fa-sign-out"></i> 退出</a>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <a class="btn btn-primary" href="user-register">用户注册</a>
                        <a class="btn btn-success" href="user-login-page">登录</a>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </div>
</header>
<!-- Navigation bar starts -->

<div class="navbar bs-docs-nav" role="banner">
    <div class="container">
        <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
            <ul class="nav navbar-nav">
                <li>
                    <a href="#"><i class="fa fa-home"></i>网站首页</a>
                </li>
                <li>
                    <a href="admin/question-list"><i class="fa fa-edit"></i>试题管理</a>
                </li>

                <li>
                    <a href="admin/exampaper-list"><i class="fa fa-file-text-o"></i>试卷管理</a>
                </li>
                <li class="active">
                    <a href="admin/user-list"><i class="fa fa-user"></i>会员管理</a>
                </li>
                <li>
                    <a href="admin/field-list-1"><i class="fa fa-cloud"></i>题库管理</a>
                </li>
                <li>
                    <a href="admin/sys-backup"><i class="fa fa-cogs"></i>网站设置</a>
                </li>
            </ul>
        </nav>
    </div>
</div>

<!-- Navigation bar ends -->

<!-- Slider starts -->

<div>
    <!-- Slider (Flex Slider) -->

    <div class="container" style="min-height:500px;">

        <div class="row">
            <div class="col-xs-3">
                <ul class="nav default-sidenav">
                    <li>
                        <a> <i class="fa fa-list-ul"></i> 会员管理 </a>
                    </li>
                    <li>
                        <a href="admin/add-user"> <i class="fa fa-list-ul"></i> 添加会员 </a>
                    </li>
                    <li class="active">
                        <a href="admin/user-history"> <i class="fa fa-list-ul"></i> 错题统计 </a>
                    </li>
                </ul>
            </div>
            <div class="col-xs-9">
                <div class="page-header">
                    <h1><i class="fa fa-list-ul"></i> 错误统计 </h1>
                </div>
                <div class="page-content row">
                    <%--该知识点错误率--%>

                    <div id="fieldFalse">
                        <p id="peace"></p>
                        <%--   <table class="table">
                               <c:forEach items="${knowledgeList }" var="item">
                                   <tr>
                                       <td>${item.fieldName}</td>
                                       <td>${item.point}</td>
                                   </tr>

                               </c:forEach>
                           </table>
                      --%>
                    </div>


                    <%--所有题目错误情况--%>
                    <h3 class="slideSection">
                        <a href="javascript:void(0)"> 所有题目错误统计</a>
                    </h3>

                    <div id="allfalse" style="display:none;">
                        <table id="falseTable" class="table">
                            <tr>
                                <td>题目</td>
                                <td>错误</td>
                            </tr>
                        </table>

                    </div>


                </div>
            </div>
        </div>
    </div>
</div>

<footer>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="copy">

                </div>
            </div>
        </div>

    </div>

</footer>

<!-- Slider Ends -->

<!-- Javascript files -->
<!-- jQuery -->
<script type="text/javascript" src="resources/js/jquery/jquery-1.9.0.min.js"></script>
<script type="text/javascript" src="resources/js/all.js"></script>

<!-- Bootstrap JS -->
<script type="text/javascript" src="resources/bootstrap/js/bootstrap.min.js"></script>
<script>
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
            //	url:'/examxx/admin/getAllFalse',
            url: '/admin/getAllFalse',
            async: false,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);

                var table = document.getElementById("falseTable");
                for (var rowIndex = 1; rowIndex < data.length; rowIndex++) {

                    var tr = table.insertRow(-1);
                    var td1 = tr.insertCell(-1);
                    var parser = new DOMParser();
                    var xmldom = parser.parseFromString(data[rowIndex - 1].content, "text/xml");

                    //		console.log(xmldom.getElementsByTagName('title')[0].firstChild.nodeValue);
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
                console.log(err);
            }
        });

        innerAllKlPoint();

    }

    function getAllKLPoint() {
        $.ajax({
            url: '/admin/getAllKnowledgePoint',
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

                console.log(allPointArray);

            },
            error: function (err) {
                console.log("ERROR>>");
                console.log(err);
            }
        });


    }


    function innerAllKlPoint() {
        console.log(allPointArray);
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
                console.log(wrongPercent);
                td2.innerHTML = wrongPercent.toFixed(2) + "%";

            }
        }
    }

</script>
</body>
</html>