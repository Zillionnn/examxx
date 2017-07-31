
$(function(){
    $(".disable-btn").click(function(){
        var message = "确定要禁用该用户吗？";
        var answer = confirm(message);
        if(!answer){
            return false;
        }

        jQuery.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            type : "GET",
            url : 'admin/disable-user/' + $(this).data("id"),
            success : function(message,tst,jqXHR) {
                if(!util.checkSessionOut(jqXHR))return false;
                if (message.result == "success") {
                    util.success("操作成功！", function(){
                        window.location.reload();
                    });
                } else {
                    util.error(message.result);
                }
            },
            error : function(jqXHR, textStatus) {
                util.error("操作失败请稍后尝试");
            }
        });

    });

    $(".enable-btn").click(function(){
        var message = "确定要启用该用户吗？";
        var answer = confirm(message);
        if(!answer){
            return false;
        }
        jQuery.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            type : "GET",
            url : 'admin/enable-user/' + $(this).data("id"),
            success : function(message,tst,jqXHR) {
                if(!util.checkSessionOut(jqXHR))return false;
                if (message.result == "success") {
                    util.success("操作成功！", function(){
                        window.location.reload();
                    });
                } else {
                    util.error(message.result);
                }
            },
            error : function(jqXHR, textStatus) {
                util.error("操作失败请稍后尝试");
            }
        });

    });
});


function deleteUser(id){
    console.log(typeof parseInt(id));

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        url:'admin/delete_user',
        type:'POST',
        data:JSON.stringify(id),
        dataType:'json',
        success:function(data){
            //		alert("删除成功");

        },
        error:function(err){
            //	console.log(err);
        }
    });


}

function deleteSpecifyUser(){
    if(deleteUserList.length==0){
        alert("请选择要删除的用户");
    }else{
        var result = confirm("确定删除选定用户吗？");
        if(result==true) {
            for (var i in deleteUserList) {
                deleteUser(deleteUserList[i]);
            }
        }
        alert("已删除用户");
        window.location.reload();
    }

}
var deleteUserList=[];
function addUserList(id){
    var boxId="box"+id;
    if(document.getElementById(boxId).checked){
        if(deleteUserList.indexOf(id)==-1){
            deleteUserList.push(id);
            console.log(deleteUserList);
        }
    }else{
        var index=	deleteUserList.indexOf(id);
        deleteUserList.splice(index,1);
        console.log(deleteUserList);

    }

}


