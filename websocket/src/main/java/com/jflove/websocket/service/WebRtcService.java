package com.jflove.websocket.service;

import com.alibaba.fastjson.JSON;
import com.jflove.websocket.handle.OperationHandle;
import com.jflove.websocket.model.RequestModel;
import com.jflove.websocket.model.WebSocketSessionModel;
import com.jflove.websocket.storage.WebSocketSessionStorage;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 * user:tanjun
 * date:2020/4/24
 * desc:webrtc信令服务
 */
@Service
public class WebRtcService implements WebSocketHandler {

    private static final Log logger = LogFactory.getLog(WebRtcService.class);


    /**
     * 在WebSocket协商成功且WebSocket连接已打开并可以使用后调用。
     * @param webSocketSession
     * @throws Exception
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        WebSocketSessionStorage.add(webSocketSession);
        logger.debug("连接了一个新用户,sessionId:{" + webSocketSession.getId() +
                "},LocalAddress:{" +webSocketSession.getLocalAddress()+
                "},RemoteAddress:{"+webSocketSession.getRemoteAddress()+
                "}");
    }

    /**
     * 当新的WebSocket消息到达时调用。
     * @param webSocketSession
     * @param webSocketMessage
     * @throws Exception
     */
    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
        String websocketmessage = webSocketMessage.getPayload().toString();
        RequestModel requestModel = JSON.parseObject(websocketmessage, RequestModel.class);
        String sessionId = webSocketSession.getId();
        logger.debug("收到消息," +
               "sessionId:{" + sessionId +
               "},操作符:{" +requestModel.getType()+
               "},消息内容:{" +requestModel.getMessage()+
               "}");
        //处理操作
        new OperationHandle().execute(webSocketSession,requestModel);
    }


    /**
     * 处理来自基础WebSocket消息传输的错误。
     * @param webSocketSession
     * @param throwable
     * @throws Exception
     */
    @Override
    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
        //如果有正在对话,则先通知双方关闭
        new OperationHandle().execute(webSocketSession,new RequestModel("4"));
        WebSocketSessionStorage.delete(webSocketSession.getId());
        new OperationHandle().execute(webSocketSession,new RequestModel("5"));//将最新状态推送给所有用户
        logger.debug("异常",throwable);
    }

    /**
     * 在任一侧关闭WebSocket连接之后或发生传输错误之后调用
     * @param webSocketSession
     * @param closeStatus
     * @throws Exception
     */
    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {
        //如果有正在对话,则先通知双方关闭
        new OperationHandle().execute(webSocketSession,new RequestModel("4"));
        WebSocketSessionStorage.delete(webSocketSession.getId());
        new OperationHandle().execute(webSocketSession,new RequestModel("5"));//将最新状态推送给所有用户
        logger.debug("关闭:"+closeStatus);
    }

    /**
     * WebSocketHandler是否处理部分消息。
     * @return
     */
    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
