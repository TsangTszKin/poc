/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:26
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 16:27:15
 * @Description: 
 */
import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Provider, observer } from 'mobx-react';
import Layouts from './layouts/Index'
import GlobalStore from '@/store/GlobalStore'
import Login from './login'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
// import "antd/dist/antd.less";   // 引入官方提供的 less 样式入口文件
import "@/styles/default.less";   // 用于覆盖上面定义的变量

@withRouter
@observer
class Routers extends Component {
    constructor(props) {
        super(props)
        this.pathname = this.props.location.pathname;
    }
    checkJsessionID = () => {
        if (this.props.location.pathname != '/login') {
            if (!localStorage.token) {
                this.props.history.replace('/login')
            } else {
                // GlobalStore.getAuthActionForApi();
            }
        } else {
            if (localStorage.token) {
                // this.props.history.replace('/business/home')
            }
        }
    }
    componentWillMount() {

        if (!localStorage.topMenu) {
            this.props.history.push('/login');
            return
        }

        if (this.pathname === '/') {
            if (localStorage.token) {
                this.props.history.replace('/home/index')
            }
        } else {
            this.checkJsessionID()
        }
        // this.props.history.replace('/business/home')
    }
    componentWillReceiveProps() {
        this.checkJsessionID()
    }
    render() {
        return (
            <Provider GlobalStore={GlobalStore}>
                <LocaleProvider locale={zh_CN}>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path='/' component={Layouts} />
                    </Switch>
                </LocaleProvider>
            </Provider>
        )
    }
}

export default Routers