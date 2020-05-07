package com.jflove.websocket.handle;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jflove.websocket.model.RequestModel;
import com.jflove.websocket.model.ResponseModel;
import com.jflove.websocket.model.WebSocketSessionModel;
import com.jflove.websocket.storage.WebSocketSessionStorage;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;

/**
 * user:tanjun
 * date:2020/4/26
 * desc:1对1对话处理
 */
public class OperationHandle {

    public void execute(WebSocketSession thisSession, RequestModel requestModel)throws Exception{
        ResponseModel responseModel = new ResponseModel(requestModel.getType(),requestModel.getMessage());
        switch (requestModel.getType()){
            case "a"://心跳
                thisSession.sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//响应心跳
                break;
            case "0"://接收身份信息,返回身份id
                WebSocketSessionStorage.setName(thisSession.getId(),requestModel.getMessage());
                responseModel.setMessage(requestModel.getMessage());//返回自己的名字
                thisSession.sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//响应已经成功接收身份信息
                execute(thisSession,new RequestModel("5"));//有人注册后,需要将身份信息发送给其它已经连接的用户
                break;
            case "1"://收到请求获取其他用户列表
                ArrayList<WebSocketSessionModel> users = WebSocketSessionStorage.getUsersList(thisSession.getId());
                responseModel.setMessage(JSON.toJSONString(users));
                thisSession.sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//响应用户列表
                break;
            case "2"://向另一个用户发起对话申请
                WebSocketSessionModel otherModel = WebSocketSessionStorage.get(requestModel.getMessage());
                if(otherModel.getStatus() == 0){//正在空闲中
                    WebSocketSessionModel thisModel = WebSocketSessionStorage.get(thisSession.getId());
                    thisModel.setStatus(2);//将自己设置为正在准备对话
                    thisModel.setCallId(otherModel.getSessionId());//将自己的远程对话人设置成对方
                    otherModel.setStatus(2);//将对方设置为正在准备对话
                    otherModel.setCallId(thisModel.getSessionId());//将对方的远程对话人设置成自己
                    responseModel.setMessage(JSON.toJSONString(thisModel));
                    otherModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//将自己的信息发给对方
                    execute(thisSession,new RequestModel("5"));//将最新状态推送给所有用户
                }
                break;
            case "3"://用户响应另一个用户的对话请求
                WebSocketSessionModel thisModel = WebSocketSessionStorage.get(thisSession.getId());
                if(thisModel.getStatus() == 2){//自己是正在准备对话
                    WebSocketSessionModel callModel = WebSocketSessionStorage.get(thisModel.getCallId());
                    if(callModel.getStatus() == 2){//对方也是准备对话
                        JSONObject jsonObject = JSON.parseObject(JSON.toJSONString(thisModel));
                        jsonObject.put("ready",requestModel.getMessage());
                        responseModel.setMessage(JSON.toJSONString(jsonObject));
                        callModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//将自己的应答发送给对方
                        if ("1".equals(requestModel.getMessage())){//同意对话,修改状态
                            thisModel.setStatus(1);
                            callModel.setStatus(1);
                        }else if("0".equals(requestModel.getMessage())){//不同意对话,移除状态,移除对话id
                            thisModel.setStatus(0);
                            callModel.setStatus(0);
                            thisModel.setCallId(null);
                            callModel.setCallId(null);
                        }
                        execute(thisSession,new RequestModel("5"));//将最新状态推送给所有用户
                    }
                }
                break;
            case "4"://一个用户向另一个用户取消对话申请
                WebSocketSessionModel iModel = WebSocketSessionStorage.get(thisSession.getId());
                if(iModel.getStatus() == 1 && !StringUtils.isEmpty(iModel.getCallId())){
                    WebSocketSessionModel callModel =  WebSocketSessionStorage.get(iModel.getCallId());
                    //判断对方是否与自己在对话
                    if(callModel.getStatus() == 1 && iModel.getSessionId().equals(callModel.getCallId())){
                        //通知双方关闭对话
                        try {
                            responseModel.setMessage(callModel.getSessionId());
                            iModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//通知自己与对方关闭连接
                            iModel.setCallId(null);
                            iModel.setStatus(0);
                        }catch (java.lang.IllegalStateException e){//有可能是对方直接关闭浏览器,会话早就断开了,从缓存中删除
                            WebSocketSessionStorage.delete(iModel.getSessionId());
                        }
                        try {
                            responseModel.setMessage(iModel.getSessionId());
                            callModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));//通知对方与自己关闭连接
                            callModel.setCallId(null);
                            callModel.setStatus(0);
                        }catch (java.lang.IllegalStateException e) {//有可能是对方直接关闭浏览器,会话早就断开了,从缓存中删除
                            WebSocketSessionStorage.delete(callModel.getSessionId());
                        }
                        execute(thisSession,new RequestModel("5"));//将最新状态推送给所有用户
                    }
                }
                break;
            case "5"://给每个在线的用户推一次当前在线用户列表
                ArrayList<WebSocketSessionModel> allUsersList = WebSocketSessionStorage.getAllUsersList();
                for (WebSocketSessionModel user:allUsersList) {
                    ArrayList<WebSocketSessionModel> others = WebSocketSessionStorage.getUsersList(user.getSessionId(),allUsersList);
                    user.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(new ResponseModel("1",JSON.toJSONString(others)))));
                }
                break;
            case "6"://收到offer信令,发送给与他对话的用户
                WebSocketSessionModel isModel = WebSocketSessionStorage.get(thisSession.getId());
                if(isModel.getStatus() == 1 && !StringUtils.isEmpty(isModel.getCallId())){
                    WebSocketSessionModel callModel = WebSocketSessionStorage.get(isModel.getCallId());
                    if(callModel.getStatus() == 1 && isModel.getSessionId().equals(callModel.getCallId())){
                        callModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));
                    }
                }
                break;
            case "7"://收到answer信令,响应给与他对话的用户
                WebSocketSessionModel woModel = WebSocketSessionStorage.get(thisSession.getId());
                if(woModel.getStatus() == 1 && !StringUtils.isEmpty(woModel.getCallId())){
                    WebSocketSessionModel callModel = WebSocketSessionStorage.get(woModel.getCallId());
                    if(callModel.getStatus() == 1 && woModel.getSessionId().equals(callModel.getCallId())){
                        callModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));
                    }
                }
                break;
            case "8"://发送候选信息给对方
                WebSocketSessionModel wModel = WebSocketSessionStorage.get(thisSession.getId());
                if(wModel.getStatus() == 1 && !StringUtils.isEmpty(wModel.getCallId())){
                    WebSocketSessionModel callModel = WebSocketSessionStorage.get(wModel.getCallId());
                    if(callModel.getStatus() == 1 && wModel.getSessionId().equals(callModel.getCallId())){
                        callModel.getWebSocketSession().sendMessage(new TextMessage(JSON.toJSONString(responseModel)));
                    }
                }
                break;
        }
    }
}
