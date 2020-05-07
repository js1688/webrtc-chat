package com.jflove.websocket.model;

/**
 * user:tanjun
 * date:2020/4/26
 * desc:请求结构
 */
public class RequestModel {
    private String type;//操作符

    private String message="";//消息

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public RequestModel(String type){
        setType(type);
    }

    public RequestModel(String type,String message){
        setType(type);
        setMessage(message);
    }
}
