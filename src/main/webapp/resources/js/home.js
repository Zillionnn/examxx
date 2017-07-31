
var exampaperid;
function startRandomExam(){

    //"questionKnowledgePointRate":{"1":0,"2":0,"3":0}};   "1":0  1为知识点
    var question_entity={"paperName":"模拟试卷","passPoint":60,"time":"60","paperPoint":"100","paperType":"1",
        "questionTypeNum":{"1":20,"2":2,"3":10,"4":1},"questionTypePoint":{"1":1,"2":5,"3":5,"4":10},
        "questionKnowledgePointRate":{"1":0,"2":0,"3":0}};

    //console.log(JSON.stringify(question_entity));
    $.ajax({
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        type : "POST",
        //url : "/student/questionfilter-{fieldId}-{knowledge}-{questionType}-{searchParam}-{page}.html",
        //url : "/student/questionfilter-0-0-0-0-1.html",
        url:'student/exampaper-add',
        data : JSON.stringify(question_entity),
        success : function(message, tst, jqXHR) {
            /*	if (!util.checkSessionOut(jqXHR))
             return false;*/
            //console.log(message);
            if (message.result == "success") {
                //	//console.log("MESSAGE ID>>"+message.generatedId);
                exampaperid=message.generatedId;
                //	document.location.href = document.getElementsByTagName('base')[0].href + 'admin/exampaper-edit/' + message.generatedId;
                util.success("添加成功", function() {
                    document.location.href = document.getElementsByTagName('base')[0].href + '/student/examing/' + message.generatedId;
                });
            } else {
                //console.log("add paper fail");
                util.error("操作失败请稍后尝试>>" + message.result);
                $(".df-submit").removeAttr("disabled");
            }

        },
        error : function(jqXHR, textStatus) {
            //console.log("add paper fail");
            util.error("操作失败请稍后尝试");
            $(".df-submit").removeAttr("disabled");
        }
    });
}


function restartPractise(id){
    var result=confirm("确定重新开始此知识点练习吗？");
    if(result){
        $.ajax({
            url:'restart-practise/'+id,
            type:'GET',
            dataType:'json',
            success:function(data){
                alert("已重置该知识点练习进度");
                window.location.reload();
            },
            error:function(err){
               // console.log(err);
            }
        });
    }

}
