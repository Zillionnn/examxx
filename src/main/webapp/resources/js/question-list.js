$(function() {

	question_list.initial();

	showEditModel();

	$(".add-tag-btn").click(function () {
		var label_ids = $(".q-label-item");
		var flag = 0;
		label_ids.each(function () {
			if ($(this).data("id") == $("#tag-from-select").val())
				flag = 1;
		});
		if (flag == 0) {
			var selected = $("#tag-from-select").find("option:selected");

			$(".q-label-list").append("<span class=\"label label-info q-label-item\" data-privatee="
				+ selected.data("privatee") + " data-creator=" + selected.data("creator")
				+ " data-memo=" + selected.data("memo")
				+ " data-id=" + $("#tag-from-select").val()
				+ " data-createTime=" + selected.data("createTime") + ">"
				+ $("#tag-from-select :selected").text() + "  <i class=\"fa fa-times\"></i>	</span>");
		}
		else {
			util.error("不能重复添加");
		}
	});

	//点击修改按钮
	$("#update-exampaper-btn").click(function () {
		if ($("#point-from-select").val() == null || $("#point-from-select").val() == "") {
			util.error("请选择知识类");
		}
		$("#point-from-select").val();
		var data = new Array();

		$(".q-label-item").each(function () {
			var tag = new Object();
			tag.tagId = $(this).data("id");
			tag.questionId = $("#add-update-questionid").text();
			data.push(tag);
		});

		//判断题型获取修改后的答案
		if(document.getElementById("question-type-edit").innerText==1){
			document.getElementById("question-answer-input").value = $(':radio[name="question-radio1"]:checked').val();
		}
		if(document.getElementById("question-type-edit").innerText==2){
			var answer_string='';
			$(':checkbox[name="question-radio1"]:checked').each(function(){
				answer_string+=$(this).val();
			});
			document.getElementById("question-answer-input").value =answer_string;
		}
		if(document.getElementById("question-type-edit").innerText==3){
			document.getElementById("question-answer-input").value = $(':radio[name="question-radio1"]:checked').val();
		}

		var questionName = document.getElementById('question-name-input').value;
		var answer = document.getElementById("question-answer-input").value;
		console.log(answer);
		//设置questionContent  XML
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(questionContent, "text/xml");
		xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue = questionName;
		var questionContentString = xmlToString(xmlDoc);
		console.log(typeof questionContentString);
		//var answer=xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;

		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			contentType:"application/x-www-form-urlencoded;charset=UTF-8",
			type: "POST",
			url: "admin/question-update/" + $("#add-update-questionid").text() + "/" + $("#point-from-select").val()
			+ "/" +$("#question-answer-input").val(),
			data: questionContentString,
			success: function (message, tst, jqXHR) {
				if (!util.checkSessionOut(jqXHR))
					return false;
				if (message.result == "success") {
					util.success("修改成功", function () {
						window.location.reload();
					});
				} else {
					util.error("操作失败请稍后尝试:" + message.result);
				}
			},
			error: function (jqXHR, textStatus) {
				util.error("操作失败请稍后尝试");
			}
		});
		return false;
	});

	$(".q-label-list").on("click", ".fa", function () {
		$(this).parent().remove();
	});

});

var question_list = {
	initial : function initial() {
		this.bindChangeSearchParam();
	},
	
	bindChangeSearchParam : function bindChangeSearchParam(){
		$("#question-filter dl dd span").click(function(){
			if($(this).hasClass("label"))return false;
			
			
			var genrateParamOld = question_list.genrateParamOld();
			
			if($(this).parent().parent().attr("id") == "question-filter-field" ){
				genrateParamOld.field = $(this).data("id");
				question_list.redirectUrl(genrateParamOld);
				
			}else if($(this).parent().parent().attr("id") == "question-filter-knowledge" ){
				genrateParamOld.knowledge = $(this).data("id");
				question_list.redirectUrl(genrateParamOld);
				
			}else{
				genrateParamOld.questiontype = $(this).data("id");
				question_list.redirectUrl(genrateParamOld);
			}
		});
		
		$(".pagination li a").click(function(){
			var pageId = $(this).data("id");
			if(pageId==null||pageId=="")return false;
			var genrateParamOld = question_list.genrateParamOld();
			genrateParamOld.page = pageId;
			question_list.redirectUrl(genrateParamOld);
			
		});
	},
	
	genrateParamOld :function genrateParamOld(){
		
		var field = $("#question-filter-field dd .label").data("id");
		var knowledge = $("#question-filter-knowledge dd .label").data("id");
		var questiontype = $("#question-filter-qt dd .label").data("id");
		var searchParam = 0;
		var page = 1;
		
		var data = new Object();
		data.field = field;
		data.knowledge = knowledge==null?0:knowledge;
		data.questiontype= questiontype;
		data.searchParam = searchParam;
		data.page = page;
		
		return data;
	},

	redirectUrl : function(newparam) {
		var paramurl = newparam.field;
		paramurl = paramurl + "-" + newparam.knowledge;
		paramurl = paramurl + "-" + newparam.questiontype;
		paramurl = paramurl + "-" + newparam.searchParam;
		paramurl = paramurl + "-" + newparam.page;
		paramurl = paramurl + ".html";

		document.location.href = document.getElementsByTagName('base')[0].href
				+ 'admin/questionfilter-' + paramurl;
	}
};



var questionContent;


//xml到string
function xmlToString(xmlData) {
	var xmlString;
	//IE
	if (window.ActiveXObject) {
		xmlString = xmlData.xml;
	}
	// code for Mozilla, Firefox, Opera, etc.
	else {
		xmlString = (new XMLSerializer()).serializeToString(xmlData);
	}
	return xmlString;
}

/**
 *搜索题目
 */
function start_search() {
	$('.pagination-sm').hide();
	var searchValue = document.getElementById("searchBox").value;
	var resultTable = document.getElementById("resultTable");
	var resultTablebody = document.getElementById("resultTablebody");
	console.log(searchValue);

	$.ajax({
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		url: 'admin/searchQ',
		data: searchValue,
		dataType: 'json',
		type: 'POST',
		success: function (data) {
			console.log(data);
			resultTable.innerHTML = "";


			for (var i in data) {
				var qt_id = data[i].id;

				var tr = resultTable.insertRow(-1);
				var td1 = tr.insertCell(-1);
				td1.innerHTML = '<input type="checkbox" value=" ' + data[i].id + ' ">';
				var td2 = tr.insertCell(-1);
				td2.innerHTML = data[i].id;
				var td3 = tr.insertCell(-1);
				td3.innerHTML = '<a href="admin/question-preview/' + qt_id + ' " target="_blank" title="预览">' + data[i].name + '</a>';
				var td4 = tr.insertCell(-1);
				td4.innerHTML = data[i].questionTypeName;
				var td5 = tr.insertCell(-1);
				td5.innerHTML = data[i].fieldName;
				var td6 = tr.insertCell(-1);
				td6.innerHTML = data[i].pointName;
				var td7 = tr.insertCell(-1);
				td7.innerHTML = '  <a class="change-property" onclick="showEditModel(' + qt_id + ')">修改</a>';
				var td8 = tr.insertCell(-1);
				td8.innerHTML =
					'<a class="hrefToHand" id="delete-question-btn" onclick="deleteQuestion(' + qt_id + ' )">删除</a>';

			}
			showEditModel();
		},
		error: function (err) {
			console.log(err);
		}
	});
}

/**
 *修改模态框
 */
function showEditModel(id) {
	$(".change-property").click(function () {
		$("#change-property-modal").modal({backdrop: true, keyboard: true});
//通过id查question
		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			url: 'admin/getquestionbyid',
			type: 'POST',
			data: JSON.stringify(id),
			dataType: 'json',
			success: function (data) {
				console.log(data);
				var fieldArray = document.getElementById("field-select").children;
				var knowledgePointArray = document.getElementById("point-from-select").children;
				console.log(knowledgePointArray);
				document.getElementById("question-type-edit").innerHTML=data.question_type_id;
				for (var i in fieldArray) {
					if (fieldArray[i].value == data.fieldId) {
						document.getElementById("field-select").value = data.fieldId;
					}
				}

				for (var i in knowledgePointArray) {
					if (knowledgePointArray[i].value == data.pointId) {
						document.getElementById("point-from-select").value = data.pointId;
					}
				}

				//解析xml。显示题目
				console.log(data.content);
				questionContent = data.content;
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(questionContent, "text/xml");
				var questionName = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
				var entryList = xmlDoc.getElementsByTagName("string");

				//单选题
				if (data.question_type_id == 1) {
					$("#aq-course4").hide();
					//生成单选框
					var choiceListString = '';
					for (var i = 0; i < entryList.length; i++) {
						var string = entryList[i].childNodes[0].nodeValue;
						if (i % 2 == 0) {
							choiceListString += ' <input type="radio" name="question-radio1"   value="' + string + '">' + string + '. ';
						} else if (i % 2 == 1) {
							choiceListString += string + '<br/>';
						}
					}
					document.getElementById("choiceList").innerHTML = choiceListString;
					var radioList = document.getElementsByName("question-radio1");
					//设置单选框的值
					for (var i = 0; i < radioList.length; i++) {
						if (radioList[i].value == data.answer) {
							radioList[i].setAttribute("checked", true);
						}
					}

				}

				//多选题
				if (data.question_type_id == 2) {
					$("#aq-course4").hide();

					var choiceListString = '';
					for (var i = 0; i < entryList.length; i++) {
						var string = entryList[i].childNodes[0].nodeValue;
						if (i % 2 == 0) {
							choiceListString += ' <input type="checkbox" name="question-radio1"   value="' + string + '">' + string + '. ';
						} else if (i % 2 == 1) {
							choiceListString += string + '<br/>';
						}
					}
					document.getElementById("choiceList").innerHTML = choiceListString;
					var checkboxList = document.getElementsByName("question-radio1");

					for (var i = 0; i < checkboxList.length; i++) {
						for (var j in data.answer) {
							var AI = data.answer.substr(j, 1);
							if (checkboxList[i].value == AI) {
								checkboxList[i].setAttribute("checked", true);
							}
						}
					}
				}

				//判断题
				if (data.question_type_id == 3) {
					$("#aq-course4").hide();
					//生成单选框
					var choiceListString = '';

					choiceListString='<input type="radio" name="question-radio1"  value="T" >正确<br/><input type="radio" name="question-radio1" value="F">错误';
					document.getElementById("choiceList").innerHTML = choiceListString;

					//设置单选框的值
					var radioList = document.getElementsByName("question-radio1");
					for (var i = 0; i < radioList.length; i++) {
						if (radioList[i].value == data.answer) {
							radioList[i].setAttribute("checked", true);
						}
					}

				}
				//var answer=xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
				document.getElementById('question-name-input').value = questionName;
				document.getElementById("question-answer-input").value = data.answer;

			},
			error: function (err) {
				console.log(err);
			}
		});


		var paper_id = $(this).parent().parent().find(":checkbox").val();
		$("#add-update-questionid").text(paper_id);

	});
}

/**
 *删除
 */
function deleteQuestion(id) {
	var result = confirm("确定删除吗？删除后将不可恢复");
	if (result == true) {
		jQuery.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			type: "GET",
			url: 'admin/delete-question/' + id,
			success: function (message, tst, jqXHR) {
				if (!util.checkSessionOut(jqXHR))return false;
				if (message.result == "success") {
					util.success("删除成功！", function () {
						window.location.reload();
					});
				} else {
					util.error("操作失败请稍后尝试");
				}
			},
			error: function (jqXHR, textStatus) {
				util.error("操作失败请稍后尝试");
			}
		});
	}


}
