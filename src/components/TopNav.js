/* eslint-disable no-undef */
/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:37
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 18:39:07
 * @Description: 页面顶部导航栏
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import authService from '@/api/authService';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
/**
 * 页面顶部导航栏
 * 
 * @class TopNav
 * @extends {Component}
 */
@withRouter
@inject('GlobalStore')
@observer
class TopNav extends Component {
    constructor(props) {
        super(props);
        this.goTo = this.goTo.bind(this);
        this.isActive = this.isActive.bind(this);
        this.getLeftMenuForApi = this.getLeftMenuForApi.bind(this);
        this.state = {
            index: 0,
            nav: []
        }
    }
    componentDidMount() {

        if (localStorage.topMenu) {
            this.setState({ nav: JSON.parse(localStorage.topMenu) })
        }


        setTimeout(function () {


            var timer = setInterval(function () {
                if (window.layui) {
                    layui.use(['layer', 'laydate', 'jquery'], function () {
                        window.layer = layui.layer;
                        window.$ = layui.$;
                        window.laydate = layui.laydate;
                        $("ul.nav li.nav-item").click(function () {
                            $(this).addClass("nav-item-selected").siblings().removeClass("nav-item-selected");
                        })
                    });
                    stop();
                }
            }, 100);

            function stop() {
                window.clearInterval(timer);
            }



        }, 500)
    }
    goTo(id) {
        this.getLeftMenuForApi(id, true);
        // this.props.history.push(url);
        // this.setState({
        //     index: this.state.index++
        // })
    }
    // eslint-disable-next-line no-unused-vars
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true
        }
        return true
    }
    isActive(label, id) {
        if (this.props.location.pathname.includes(label)) {
            this.getLeftMenuForApi(id, false);
            return true
        } else {
            return false
        }
    }
    getLeftMenuForApi(topMenuId, isGoToFirst) {
        authService.getLeftMenu(topMenuId).then((res) => {
            if (!publicUtils.isOk(res)) return;
            if (!common.isEmpty(res.data.result)) {
                res.data.result = common.deepClone(res.data.result[topMenuId])
                this.props.GlobalStore.menu.setLeft(res.data.result);
                localStorage.leftMenu = JSON.stringify(res.data.result);
                let firstMenu = res.data.result[0];
                let url = '';
                if (!common.isEmpty(firstMenu.child)) {
                    url = res.data.result[0].child[0].url;
                } else {
                    url = res.data.result[0].url;
                }
                if (isGoToFirst) {
                    this.props.history.push(url)
                    this.props.GlobalStore.menu.setLeft(res.data.result);
                }
            } else {
                this.props.GlobalStore.menu.setLeft([]);
            }
        });
    }
    render() {

        return (
            <ul className="nav" >
                {
                    this.state.nav.map((item) =>
                        <li key={item.url}
                            className={`nav-item ${this.isActive(item.label, item.id) ? "nav-item-selected" : null}`}
                            onClick={
                                () => this.goTo(item.id)
                            } > {item.name} </li>
                    )
                }
            </ul>
        )
    }
}

export default TopNav