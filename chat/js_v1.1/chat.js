//在页面添加在线聊天功能入口,因为这是一个单独功能,所以使用动态代码,以后不要这个功能了直接去除掉chat.js引用就行
$("html").append('<link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">');
$("html").append('<script src="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>');
$("html").append('<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>');
$("body").append(
    '<div class="btn-group pull-right" style="position: absolute;right: 20px;top:20px;">'+
        '<button type="button" class="btn dropdown-toggle btn-sm " data-toggle="dropdown" style="opacity:0.6;">'+
            '在线视频聊天(最好使用谷歌浏览器) <span class="glyphicon glyphicon-align-justify"></span>'+
        '</button>'+
        '<ul class="dropdown-menu" id="chat_socketCon" role="menu" id="chat_users">'+
            '<li id="rct_con"><a href="javascript:void(0)">未连接(点击连接获取用户列表)</a></li>'+
            '<li class="divider"></li>'+
        '</ul>'+
    '</div>'
);
$("body").append(
    '<div class="modal fade" id="chat_dialog" tabindex="-1" role="dialog" data-keyboard="false" aria-hidden="true" data-backdrop="static" aria-labelledby="myModalLabel">'+
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
                '<div class="modal-header">'+
                    '<h4 class="modal-title">消息</h4>'+
                '</div>'+
                '<div class="modal-body"><span id="chat_ready_id" data-uid=""></span>,与你发起对话申请,你是否同意</div>'+
                '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" onclick="chat_ready(0)">关闭</button>'+
                    '<button type="button" class="btn btn-primary" onclick="chat_ready(1)">确定</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'
);
$("body").append(
    '<div class="modal fade" id="chat_name_modal" tabindex="-1" role="dialog" data-keyboard="true" data-backdrop="static" aria-labelledby="myModalLabel">'+
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
                '<div class="modal-header">'+
                    '<h4 class="modal-title">提示</h4>'+
                '</div>'+
                '<div class="modal-body"><input type="text" id="chat_name" class="form-control" placeholder="请输入你昵称"></div>'+
                '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
                    '<button type="button" class="btn btn-primary" onclick="chat_setName()">确定</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'
);
$("body").append(
    '<div class="modal fade" id="chat_dialogForOne" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" style="overflow:auto;">' +
    '<div class="modal-dialog" style="width: 904px;">' +
        '<div class="modal-content">' +
            '<div class="modal-header">' +
                '<h4 class="modal-title">你正在与［<label name="name"></label>］对话</h4>' +
            '</div>' +
            '<!-- 聊天框 -->' +
            '<div class="modal-body" style="margin: 0px;padding: 0px;">' +
                '<div style="height: 647px;">' +
                    '<!-- 聊天信息展示 -->' +
                    '<div style="width: 600px;height: 647px;float: left;">' +
                        '<div style="overflow-y:auto;height: 500px;" class="overflow-3">' +
                            '<!-- 每一条聊天记录都加在 li里面 -->' +
                            '<ul class="bubbleDiv overflow-3" name="bubbleDiv"></ul>' +
                        '</div>' +
                        '<!-- 聊天输入 -->' +
                        '<div style="height: 166px;">' +
                            '<!-- 功能框 -->' +
                            '<div style="height: 25px;">' +
                                '<!-- 发送附件功能 -->' +
                                '<div style="margin-left: 5px;">' +
                                    '<label for="chat_fileMsgForOne">' +
                                        '<span><!--<i class="glyphicon glyphicon-link"></i>--></span>' +
                                    '</label>' +
                                    '<!--<form><input type="file" id="chat_fileMsgForOne" style="position:absolute;clip:rect(0 0 0 0);"></form>-->' +
                                '</div>' +
                            '</div>' +
                            '<!-- 输入框 -->' +
                            '<div style="height: 142px;width: 100%;">' +
                                '<textarea class="overflow-3" name = "message" style="width: 100%;height: 100%;resize:none;border: 0px;background-color: #EEEEEE;" placeholder="请输入需要发送的内容"></textarea>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<!-- 右侧视频语音聊天展示 -->' +
                    '<div style="width: 300px;height: 647px;float: left;">' +
                        '<!-- 本地视频框 -->' +
                        '<div class="panel panel-default" style="margin: 0px;padding: 0px;">' +
                            '<div class="panel-body">' +
                               '<video style="height:250px;width:250px;margin: 0px;padding: 0px;" name="video" autoplay>' +'</video>' +
                            '</div>' +
                            '<div class="panel-footer" align="center">' +
                                '<button type="button" class="btn btn-default btn-lg btn-xs" name="openVideo" data-use="false"><i class="glyphicon glyphicon-facetime-video"></i><span>开始视频</span></button>' +
                                '<button type="button" class="btn btn-default btn-lg btn-xs" name="openAudio" data-use="false"><i class="glyphicon glyphicon-earphone"></i><span>开始语音</span></button>' +
                            '</div>' +
                        '</div>' +
                        '<!-- 远端视频框 -->' +
                        '<div class="panel panel-default" style="margin: 0px;padding: 0px;">' +
                            '<div class="panel-body">' +
                                '<video style="height:250px;width:250px;" name="remote" autoplay></video>' +
                            '</div>' +
                            '<div class="panel-footer" align="center">好友视频展示</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" data-dismiss="modal">关闭对话</button>' +
                '<button type="button" class="btn btn-success" id="chat_sendString">发送消息[Enter]</button>' +
            '</div>' +
        '</div>' +
    '</div>'
);
var chat_socket = null;
var rtc = null;
var chat_name = null;

/**
 * 起名
 */
var chat_setName = function(){
    var name = $("#chat_name").val();
    if(name){
        chat_name = name;
        chat_socketCon();//并不是每次都创建
        chat_sendMsg(1,"");//请求获取其他在线用户的信息,排除掉自己
        $("#chat_name_modal").modal('hide');
    }
}
/**
 * 创建websocket
 */
var chat_socketCon = function(){
    if(chat_socket != null){
        return;
    }
    chat_socket = 0;//相当于暂时锁住,防止点击太快创建两次socket
    var t_socket = createWebSocket("webrtc",websocketPath,
    function(){//连接成功,向服务端发送身份
        chat_socket = t_socket;
        chat_sendMsg(0,chat_name);
    },function(){//连接关闭
        chat_socket = null;
        $("#chat_socketCon li a").eq(0).html("未连接(点击连接获取用户列表)");
        var u = $("#chat_socketCon");
        var li = u.find("li");
        for(var i = 2;i < li.length; i++){
            li[i].remove();
        }
        $("#chat_ready_id").html("");
        $("#chat_ready_id").data("uid","");
        $("#chat_dialog").modal('hide');
        $("#chat_dialogForOne").modal("hide");
    },function(){//连接异常
        chat_socket = null;
        $("#chat_socketCon li a").eq(0).html("未连接(点击连接获取用户列表)");
        var u = $("#chat_socketCon");
        var li = u.find("li");
        for(var i = 2;i < li.length; i++){
            li[i].remove();
        }
    },function(msg){//收到消息
        var data = JSON.parse(msg);
        chat_response(data.type,data.message);
    });
}

/**
 * 处理服务端响应的消息
 * 定义请求或响应类型,如果是发出,则是发送该类型的请求,如果是响应,则是收到了该类型的请求
 * type
 * 0(向服务端上报身份,或者收到服务端返回的身份id)
 * 1(向服务端请求获取其他在线用户id数组,或者收到服务端返回的在线用户数组)
 * 2(发起与一个用户的对话准备,或收到一个用户的准备)
 * 3(类型2发起的用户是否准备的响应结果)
 * 4(取消准备并且给对方发送取消准备,或者接受对方取消准备的消息)
 * @param {*} type 
 * @param {*} msg 
 */
var chat_response = function(type,msg){
    if(type == "0"){//收到服务端响应的身份id
        $("#chat_socketCon li a").eq(0).html("已连接(<span id='uid'>"+msg+"</span>)再次点击刷新");
        chat_sendMsg(1,"");//请求获取其他在线用户的信息,排除掉自己
    }else if(type == "1"){//收到服务端响应的其他在线用户信息
        if(msg.length != 0){
            var users = JSON.parse(msg);
            var u = $("#chat_socketCon");
            var li = u.find("li");
            for(var i = 2;i < li.length; i++){
                li[i].remove();
            }
            if(users.length == 0){//没有一个其他用户
                u.append('<li><a href="javascript:void(0)">暂未有其他用户连接</a></li>');
                u.append('<li><a href="javascript:void(0)">可以开两个浏览器模拟使用(暂时只支持谷歌)</a></li>');
                u.append('<li><a href="javascript:void(0)">不是第一次访问,请先清除浏览器文件缓存</a></li>');
                return;
            }
            for(var i in users){
                var uid = users[i]["sessionId"];
                var name = users[i]["name"];
                var status = users[i]["status"];
                var ready = users[i]["callId"] == uid ? 2 : 1;//2正在与自己对话,1正在与别人对话
                u.append("<li name='chat_user'><a href=\"javascript:void(0)\"><span class='glyphicon glyphicon-user'></span>&nbsp;&nbsp;"+name+"&nbsp;&nbsp;<button data-userid='"+uid+"' type='button' class='btn "+(status == 0 ? "btn-success" : ready == 2 ? "btn-primary" : "btn-warning")+" btn-xs' id='u"+uid+"'>"+(status == 0 ? "申请对话" : ready == 2 ? "取消对话" : "正在对话")+"</button></a></li>");
            }
            /**
             * 给每个用户号绑定发起访问请求的事件
             */
            $("#chat_socketCon li[name='chat_user']").on("click",function(e){
                e.stopPropagation();
            });
            $("#chat_socketCon button").off("click").on("click",function(e){
                e.stopPropagation();
                var userid = $(this).data("userid");
                if(userid){
                    var status = $(this).html();
                    if(status == "申请对话"){
                        //检查是否正在跟其他人对话
                        var bts = $("#chat_socketCon button");
                        for(var i = 0;i < bts.length; i++){
                            if($(bts[i]).html() == "取消对话"){
                                return;
                            }
                        }
                        chat_sendMsg(2,userid);//发起对话准备
                        $(this).html("取消对话");
                        $(this).toggleClass("btn-success");
                        $(this).toggleClass("btn-primary");
                    }else if(status == "取消对话"){
                        chat_sendMsg(4,"");//向服务端发起取消对话
                    }
                }
            });
        }
    }else if(type == "2"){//收到了一个用户的准备
        if(msg.length != 0){
            var users = JSON.parse(msg);
            $("#chat_ready_id").html(users.name);
            $("#chat_ready_id").data("uid",users.sessionId);
            $("#chat_dialog").modal('show');
        }
    }else if(type == "3"){//响应一个用户的准备
        if(msg.length != 0){
            var users = JSON.parse(msg);
            var ready = users.ready;
            var uid = users.sessionId;
            if(ready == "1"){//对方同意对话,发起webrtc信令,建立webrtc连接
                var dialogfor = $("#chat_dialogForOne");
                var dialogforname = dialogfor.find("label[name='name']");
                rtc = rtc_getTool(onmessage,onaddstream,function(){
                    dialogfor.modal("hide");
                },function(){
                    dialogforname.html(users.name);
                    dialogfor.modal("show");
                });
                rtc.createPeerConnection();
                rtc.sendOffer();
            }else if(ready == "0"){
                var bt = $("#u" + uid);
                bt.html("申请对话");
                bt.removeClass("btn-primary");
                bt.addClass("btn-success");
            }
        }
    }else if(type == "4"){//收到服务端发过来的取消对话,或者关闭对话
        if(msg.length != 0){
            $("#chat_dialog").modal('hide');
            $("#chat_dialogForOne").modal("hide");
            var u = $("#u" + msg);
            u.html("申请对话");
            u.removeClass("btn-primary");
            u.addClass("btn-success");
            $("#chat_ready_id").html("");
            $("#chat_ready_id").data("uid","");
            if(rtc != null){
                rtc.close();
            }
        }
    }else if(type == "6"){//收到服务端发过来的 offer信令
        if(msg.length != 0){
            var json = JSON.parse(msg);
            rtc.signallingHandle(json);
        }
    }else if(type == "7"){//收到服务端发过来的 answer信令
        if(msg.length != 0){
            var json = JSON.parse(msg);
            rtc.signallingHandle(json);
        }
    }else if(type == "8"){//收到服务端发过来的 候选信令
        if(msg.length != 0){
            var json = JSON.parse(msg);
            rtc.signallingHandle(json);
        }
    }
}

/**
 * 点击连接websocket,或者刷新其他用户
 */
$("#rct_con").on("click",function(e){
    e.stopPropagation();
    if(chat_socket == null){
        //先起名
        $("#chat_name_modal").modal('show');
    }else{
        chat_sendMsg(1,"");//请求获取其他在线用户的信息,排除掉自己
    }
    
});

var chat_sendClick = function(){
    var value = $("#chat_dialogForOne textarea[name='message']").val();
    var msg = {"data":value,"type":"text","id":$("#uid").html()};
    showMessage("chat_dialogForOne",msg,"right");
    rtc.send(JSON.stringify(msg));
}
/**
 * 发送字符串内容
 */
$("#chat_sendString").on("click",function(e){
    chat_sendClick();
});
/**
 * 按回车发送
 */
$("#chat_dialogForOne textarea[name='message']").on("keydown",function(e){
    if(e.keyCode == 13 && e.ctrlKey){
        $(this).val($(this).val() + "\n");
    }else if(e.keyCode == 13){
        e.preventDefault();
        chat_sendClick();
    }
});

/**
 * 发送文件
 */
$("#chat_fileMsgForOne").on("change",function(){
	//todo 现在不实现
});

/**
 * 接收webrtc通道发过来的数据回调
 * @param {*} event 
 */
var filequeue = {};//文件队列,可以应对多个文件同时传送
var onmessage = function(event){
    var msg = JSON.parse(event.data);
    if(msg.type == "text"){//文字内容
        showMessage("chat_dialogForOne",msg,"left");
    }else if(msg.type == "file"){//文件,
        //todo 现在不实现
    }
}

/**
 * 接收webrtc通道发过来的视频,语音流
 * @param {*} event 
 */
var onaddstream = function(remoteStream){
    var video = $("#chat_dialogForOne video[name='remote']")[0];
    video.srcObject = remoteStream;
    video.onloadedmetadata = function(e) {
        video.play();
    };
}

/**
 * 重置视频,语音按钮状态
 */
var resetVideoButton = function(){
	var openVideo = $("#chat_dialogForOne button[name='openVideo']");
	var openAudio = $("#chat_dialogForOne button[name='openAudio']");
	openVideo.find(" > span").html("开始视频");
	openAudio.show();
	openAudio.find(" > span").html("开始语音");
	openVideo.show();
	openVideo.removeClass("active");
    openAudio.removeClass("active");
    openAudio.data("use",false);
    openVideo.data("use",false);
}
/**
 * 打开,关闭视频聊天按钮
 */
$("#chat_dialogForOne button[name='openVideo']").on("click",function(){
	$(this).toggleClass("active");
    if(!$(this).data("use")){//开启视频语音聊天
        $(this).data("use",true);
        rtc.openVideoAudioLocal(function(localStream){//创建本地视频流,绑定到控件上
            var video = $("#chat_dialogForOne video[name='video']")[0]; //获取到展现视频的标签
            video.srcObject=localStream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
            rtc.sendAddStream(localStream);
        },true,true);//为了防止自己能听到自己发出的声音,可以只启动视频,不启动音频,然后再创建一个新的开启语音,视频的对象发给远程
		$(this).find(" > span").html("结束视频");
        $("#chat_dialogForOne button[name='openAudio']").hide();
    }else{//关闭视频语音聊天
        rtc.closeStream();
        resetVideoButton();
	}
});

/**
 * 打开,关闭语音聊天按钮
 */
$("#chat_dialogForOne button[name='openAudio']").on("click",function(){
	$(this).toggleClass("active");
	$(this).data("use",$(this).data("use") ? false : true);
	if($(this).data("use")){//开启语音聊天
		rtc.openVideoAudioLocal(function(localStream){//创建本地视频流,绑定到控件上
            var video = $("#chat_dialogForOne video[name='video']")[0]; //获取到展现视频的标签
            video.srcObject=localStream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
            rtc.sendAddStream(localStream);
        },false,true);//为了防止自己能听到自己发出的声音,可以启动音频后不添加到本地,只发给远程
		$(this).find(" > span").html("结束语音");
		$("#chat_dialogForOne button[name='openVideo']").hide();
	}else{//关闭语音聊天
		rtc.closeStream();
        resetVideoButton();
	}
});

/**
 * 关闭对话框
 */
$("#chat_dialogForOne").on("hidden.bs.modal",function(e){
    resetVideoButton();
    if(rtc != null){
        rtc.close();
        rtc = null;
        chat_sendMsg(4,"");//向服务端发起取消对话
    }
    //清除聊天记录 chat_dialogForOne  bubbleDiv
    var lis = $(this).find("ul[name='bubbleDiv'] > li");
    for (var i = 0 ; i < lis.length; i++){
        $(lis[i]).remove();
    }
});


/**
 * 像服务端发送数据,返回是否发送成功
 * @param {Int} type ,发送数据类型,
 * type=0发送身份标识,
 * @param {string} msg 
 */
var chat_sendMsg = function(type,msg){
    if(chat_socket == null || chat_socket == 0){
        return false;
    }
    chat_socket.send(type,msg);
    return true;
}

/**
 * 是否同意对话  i  1是 0 否
 * @param {*} i 
 */
var chat_ready = function(i){
    chat_sendMsg("3",i);//回复对方
    if(i == 1){//同意
        var uid = $("#chat_ready_id").data("uid");
        var dialogfor = $("#chat_dialogForOne");
        var dialogforname = dialogfor.find("label[name='name']");
        rtc = rtc_getTool(onmessage,onaddstream,function(){
            dialogfor.modal("hide");
        },function(){
            dialogforname.html($("#chat_ready_id").html());
            dialogfor.modal("show");
        });
        rtc.createPeerConnection();
        var bt = $("#u" + uid);
        bt.html("取消对话");
        bt.removeClass("btn-success");
        bt.addClass("btn-primary");
    }
    $("#chat_dialog").modal('hide');
}

/**
 * 添加好友发送的内容到聊天面板
 * @param {*} showId 聊天框id
 * @param {*} message 消息json对象
 * @param {*} is_i right or left代表别人说的话
 */
var showMessage = function(showId,message,is_i){
    if(message.data.length != 0){
        var li = $('<li class="bubbleItem clearfix">');
        var img = $('<img src="https://tse4-mm.cn.bing.net/th?id=OIP.hfxD_t92dafBqI_1EADiHAHaFG&p=0&o=5&pid=1.1" height="35px;" style="float: '+is_i+';">');
        var span = $('<span class="bubble '+is_i+'Bubble">');
        var you_msg = $('<span>');
        you_msg.html(message.data);
        span.append(you_msg);
        var bottomLevel = $('<span class="bottomLevel">');
        span.append(bottomLevel);
        var bottomLevel = $('<span class="topLevel">');
        span.append(bottomLevel);
        li.append(img);
        var div = $("<div style='float:"+is_i+";max-width: 60%;'>");
        var name = $('<label style="font-size:12px;float:'+is_i+';margin-'+is_i+':10px;">昵称['+message.id+']</label>');
        div.append(name);
        div.append($('<br/>'));
        div.append(span);
        li.append(div);
        $("#"+showId+" ul[name='bubbleDiv']").append(li);
        $("#"+showId + " textarea[name='message']").val("");
    }
}