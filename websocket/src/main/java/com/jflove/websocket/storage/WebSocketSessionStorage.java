package com.jflove.websocket.storage;

import com.jflove.websocket.model.WebSocketSessionModel;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * user:tanjun
 * date:2020/4/26
 * desc: 存储websocketsession
 */
public class WebSocketSessionStorage {
    private final static ConcurrentHashMap<String/**sessionId*/, WebSocketSessionModel> webSocketSessionMap = new ConcurrentHashMap<>();

    /**
     * 添加一个session的存储
     * @param session
     * @return
     */
    public static boolean add(WebSocketSession session){
        if(webSocketSessionMap.containsKey(session.getId())){
            return false;//已存在
        }
        webSocketSessionMap.put(session.getId(),new WebSocketSessionModel(session));
        return true;
    }

    /**
     * 移除一个session的存储
     * @param sessionId
     * @return
     */
    public static WebSocketSessionModel delete(String sessionId){
        if(!webSocketSessionMap.containsKey(sessionId)){
            return null;//不存在
        }
        return webSocketSessionMap.remove(sessionId);
    }

    /**
     * 对一个uid设置指定的昵称
     * @param sessionId
     * @param name
     * @return
     */
    public static boolean setName(String sessionId,String name){
        if(!webSocketSessionMap.containsKey(sessionId)){
            return false;//不存在
        }
        webSocketSessionMap.get(sessionId).setName(name);
        return true;
    }

    /**
     * 在指定用户数组中,排除掉自己
     * @param sessionId
     * @param all 用户数组
     * @return
     */
    public static ArrayList<WebSocketSessionModel> getUsersList(String sessionId,ArrayList<WebSocketSessionModel> all){
        ArrayList<WebSocketSessionModel> arrlist = new ArrayList<>();
        for (WebSocketSessionModel model:all) {
            if(model.getSessionId().equals(sessionId)){//是自己,排除掉
                continue;
            }
            arrlist.add(model);
        }
        return arrlist;
    }

    /**
     * 查询所有用户,排除自己
     * @param sessionId
     * @return
     */
    public static ArrayList<WebSocketSessionModel> getUsersList(String sessionId){
        ArrayList<WebSocketSessionModel> all = getAllUsersList();
        return getUsersList(sessionId,all);
    }

    /**
     * 获取现在所有正在连接的用户
     * @return
     */
    public static ArrayList<WebSocketSessionModel> getAllUsersList(){
        ArrayList<WebSocketSessionModel> arrlist = new ArrayList<>();
        Iterator<Map.Entry<String,WebSocketSessionModel>> iterator = webSocketSessionMap.entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry<String,WebSocketSessionModel> next = iterator.next();
            arrlist.add(next.getValue());
        }
        return arrlist;
    }

    /**
     * 获得指定用户的信息
     * @param sessionId
     * @return
     */
    public static WebSocketSessionModel get(String sessionId){
        return webSocketSessionMap.get(sessionId);
    }
}
