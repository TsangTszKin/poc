/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-10-12 16:59:52
 * @Description: 
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import FormBox from '@/components/login/FormBox';
import loginLogo from '@/assets/login-logo.png';
import '@/styles/login/index.less';
import LoginBg from '@/assets/login-bg.png';
import authService from '@/api/authService';
import publicUtils from '@/utils/publicUtils';

@inject('GlobalStore')
@observer
class Login extends Component {
    constructor() {
        super();
    }

    submit = (form) => {
        form.validateFields((err, values) => {
            if (!err) {
                this.props.GlobalStore.setIsLoading(true);
                let { userName, password } = values;
                let self = this;
                authService.login({ "username": userName, "password": password }).then(res => {
                    console.log('res', res)
                    self.props.GlobalStore.setIsLoading(false)
                    if (!publicUtils.isOk(res)) return
                    localStorage.token = res.data.result.token;
                    localStorage.expire = res.data.result.expire;
                    localStorage.userName = res.data.result.jwtUser.nickName;
                    localStorage.account = userName;
                    localStorage.orgName = res.data.result.jwtUser.orgName;
                    // localStorage.nikeName = res.data.result.jwtUser.nickName;
                    self.props.GlobalStore.userInfo.setName(res.data.result.jwtUser.nickName);
                    self.props.GlobalStore.userInfo.setOrgName(res.data.result.jwtUser.orgName);
                    self.props.GlobalStore.userInfo.setAccount(userName);
                    self.props.GlobalStore.getAuthActionForApi();
                    if (res.data.result.jwtUser.tokenExpTimeMs) self.props.GlobalStore.setTokenExpTimeMsValue(res.data.result.jwtUser.tokenExpTimeMs);
                    self.props.GlobalStore.getTopMenuForApi();
                }).catch(() => self.props.GlobalStore.setIsLoading(false));
            }
        });

    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        return (
            <div className='Login_wrap clear clearFix' style={{ backgroundImage: 'url(' + LoginBg + ')' }}>
                <div className='form P_auto'>
                    <img src={loginLogo} style={{ marginBottom: '30px', width: '40%' }} />
                    <FormBox submit={this.submit} />
                </div>
            </div>
        )
    }
}

export default Login