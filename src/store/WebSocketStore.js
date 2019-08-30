/*
 * @Author: zengzijian
 * @Date: 2018-12-12 14:33:46
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-19 11:00:41
 * @Description: websocket封装在mobx
 */
import { observable, action, computed, toJS } from 'mobx';
import http from '@/config/http';
import { Modal, message } from 'antd';
import common from '@/utils/common';
import store from '@/store/business/strategy/strategy/Index';
import { ALPN_ENABLED } from 'constants';


class WebSocketStore {

    constructor() {
        this.init = this.init.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.close = this.close.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.loadingShow = this.loadingShow.bind(this);
    }

    websocket = null;

    loading = null;

    close() {
        this.websocket.close();
        console.log("websocket连接已经关闭");
    }

    sendMessage(message) {
        this.websocket.send(message);
    }

    onMessage(msg) {
        store.getDataSourceForApi();
        let data = JSON.parse(msg);
        let self = this;
        // setTimeout(self.loading, 0);
        if (data.resultCode === 1000) {
            if (!common.isEmpty(data.result))
                message.success(data.result);
        } else {
            setTimeout(() => {
                Modal.error({
                    title: '上线失败',
                    content: data.resultMessage,
                });
            }, 2500)
        }

    }

    loadingShow() {
        this.loading = message.loading('正在后台上线');
    }

    init(param) {

        if (!common.isEmpty(this.websocket)) {
            this.close();
        }

        // param = hex_md5(param);
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            let wsApiPrefix = http.wsApiPrefix;
            if (process.env.NODE_ENV === 'production') {
                wsApiPrefix = 'ws://' + location.host;
            }
            this.websocket = new WebSocket(`${wsApiPrefix}/websocket/${param}`);
        } else {
            console.warn("您的浏览器或版本太旧，暂不支持websocket");
            Modal.warning({ title: '系统提示', content: "您的浏览器或版本太旧，暂不支持websocket" });
            return
        }
        let self = this;
        //连接成功建立的回调方法
        this.websocket.onopen = function (event) {
            console.log("WebSocket connects successful:", event);
        }
        //连接发生错误的回调方法
        this.websocket.onerror = function (event) { console.error("WebSocket error observed:", event); };
        //接收到消息的回调方法

        this.websocket.onmessage = function (event) { console.log("websocketevent", event); console.log("websocket收到信息：", JSON.parse(event.data)); self.onMessage(event.data); }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
            self.websocket.close();
        }
    }

}
export default new WebSocketStore