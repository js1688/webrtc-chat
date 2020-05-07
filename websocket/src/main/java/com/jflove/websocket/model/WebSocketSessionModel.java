package com.jflove.websocket.model;

import com.alibaba.fastjson.annotation.JSONField;
import org.springframework.web.socket.WebSocketSession;

/**
 * user:tanjun
 * date:2020/4/26
 * desc:
 */
public class WebSocketSessionModel {
    private String sessionId;//用户id,唯一的
    private String name;//用户自定义的昵称
    private int status;//状态 0 空闲 1正在对话 2正在准备对话
    private String callId;//一对一,正在呼叫的对方id
    private String callGroupId;//已加入的群组呼叫id,  暂时没这个功能,以后在弄

    @JSONField(serialize = false)//这个字段不会被fastjson转换
    private WebSocketSession webSocketSession;

    public WebSocketSessionModel(WebSocketSession webSocketSession){
        setWebSocketSession(webSocketSession);
        setSessionId(webSocketSession.getId());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WebSocketSession getWebSocketSession() {
        return webSocketSession;
    }

    public void setWebSocketSession(WebSocketSession webSocketSession) {
        this.webSocketSession = webSocketSession;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getCallGroupId() {
        return callGroupId;
    }

    public void setCallGroupId(String callGroupId) {
        this.callGroupId = callGroupId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
