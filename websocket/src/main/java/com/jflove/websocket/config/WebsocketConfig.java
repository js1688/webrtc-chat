package com.jflove.websocket.config;

import com.jflove.websocket.service.WebRtcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * user:tanjun
 * date:2020/4/24
 * desc:
 */
@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer {

    @Autowired
    WebRtcService service;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        //将webrtc服务添加进去,并设置任何ip地址都能访问,使用默认协议握手,不添加子协议
        registry.addHandler(service, "/webrtc").setAllowedOrigins("*");
    }
}
