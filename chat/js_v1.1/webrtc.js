var rtc_getTool = function(onmessage,onaddstream,onclose,onopen){
    //兼容不同浏览器客户端之间的连接,使用官方的兼用库 <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script><!--webrtc 兼容库-->
    var PeerConnection = RTCPeerConnection;
    //兼容不同浏览器获取到用户媒体对象
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia);
    //兼容不同浏览器
    var SessionDescription = (window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription);
    var pc = null;//本地peerConnection对象
    var oppositeChannel = null;//远端的数据通道
    var localStream = null;//本地摄像头视频流
    var createPeerConnection = function(){
        //创建PeerConnection实例
        pc = new PeerConnection();
        pc.localChannel = pc.createDataChannel({
            ordered: false,
            maxRetransmitTime: 3000,
        });//本地通道,本地通道接收由远程通道发送过来的数据
        pc.localChannel.onerror = function (error) {
            console.log("数据传输通道建立异常:", error);
      	};
        pc.localChannel.onopen = function () {
            console.log("本地数据通道建立成功");
            onopen();
      	};
        pc.localChannel.onclose = function () {
            console.log("关闭数据传输通道");
            onclose();
            close();
            pc = null;
        };
        pc.localChannel.onmessage = function(event){
            onmessage(event);
        };
        pc.ondatachannel = function(event) {
            //对方的通道,发送数据使用这个通道,则发到对方的本地通道的onmessage回调,反之使用本地通道发送数据则oppositeChannel通道的onmessage接收到数据
            oppositeChannel = event.channel;
        };
        pc.onaddstream = function(event){//如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
            onaddstream(event.stream);
        };
        pc.onicecandidate = function(event){//发送候选到其他客户端
            if (event.candidate !== null) {
                var candidate = {"candidate":event.candidate,"type":"_candidate"};
                chat_sendMsg(8,JSON.stringify(candidate));
            }
        };
    }

    /**
     * 发送发起信令
     */
    var sendOffer = function(){
        pc.createOffer(function(desc){
            pc.setLocalDescription(desc);
            chat_sendMsg(6,JSON.stringify({"sdp":desc,"type":"_offer"}));
        }, function (error) {
            console.log("发起信令失败:" + error);
        });
    }

    /**
     * 发送响应信令
     */
    var sendAnswer = function(){
        pc.createAnswer(function(desc){
            pc.setLocalDescription(desc);
            chat_sendMsg(7,JSON.stringify({"sdp":desc,"type":"_answer"}));
        }, function (error) {
            console.log("响应信令失败:" + error);
        });
    }

    /**
     * 处理发送过来的信令  temp 在群组的时候代表 回复给指定的人
     * @param {jsonObject} json 收到的消息,json对象
     */
    var signallingHandle = function(json){
        //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
        if(json.type === "_candidate" ){
            pc.addIceCandidate(new RTCIceCandidate(json.candidate));
        }else{
            pc.setRemoteDescription(new SessionDescription(json.sdp),
                function(){
                    // 如果是一个offer，那么需要回复一个answer
                    if(json.type === "_offer") {
                        sendAnswer();
                    }
                }
            );
        }
    }

    /**
     * 通过建立的webrtc本地通道发送数据给对方
     * 传入的参数不会经过任何处理,直接发送过去
     * @param {object} msg 
     */
    var send = function(msg){
        oppositeChannel.send(msg);
    }
    
    /**
     * 调用摄像头创建视频,音频对象,将对象流传入到回调中
     * @param {*} callbackLocalVideo 回调
     * @param {*} video 是否启动视频
     * @param {*} audio 是否启动音频
     */
    var openVideoAudioLocal = function(callbackLocalVideo,video,audio){
        getUserMedia.call(navigator, {
            video: video,//启动视频
            audio: audio//启动音频
        },function(localMediaStream) {//获取流成功的回调函数
            callbackLocalVideo(localMediaStream);
        },function(error){
            console.log("创建本地媒体对象失败:" + error);
        });
    }

    /**
     * 将打开的视频流发送给对方,同时发送offer信令通知
     * @param {视频流} stream 
     */
    var sendAddStream = function(stream){
        localStream = stream;
        pc.addStream(localStream);
        sendOffer();
    }

    /**
     * 关闭webrtc通道
     */
    var close = function(){
        if(pc != null){
            closeStream();
            pc.localChannel.close();
            pc.close();
            pc = null;
            oppositeChannel = null;
            chat_sendMsg(4,"");//给对方发送关闭通道消息
        }
    }

    /**
     * 关闭本地视频流
     */
    var closeStream = function(){
        if(localStream != null){
            if(localStream.getVideoTracks()[0]){
                localStream.getVideoTracks()[0].stop();
            }
            if(localStream.getAudioTracks()[0]){
                localStream.getAudioTracks()[0].stop();
            }
            if(localStream.getTracks()[0]){
                localStream.getTracks()[0].stop();
            }
            localStream = null;
        }
    }

    return {
        "closeStream":closeStream,
        "sendAddStream":sendAddStream,
        "openVideoAudioLocal":openVideoAudioLocal,
        "close":close,
        "signallingHandle":signallingHandle,
        "sendOffer":sendOffer,
        "sendAnswer":sendAnswer,
        "createPeerConnection":createPeerConnection,
        "send":send};
}