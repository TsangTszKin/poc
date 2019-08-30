import React, { Component } from 'react';
import { Icon, Popconfirm, Divider } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

@withRouter
@inject('store')
@observer
class Info extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ width: '100%'}}>
                <div style={{marginBottom: '10px'}} >
                    <p>个人信息</p>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>姓名</p>
                        <p style={{ width: '75%', float: 'left' }}>陈超</p>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>手机</p>
                        <p style={{ width: '75%', float: 'left' }}>13716263302</p>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>邮箱</p>
                        <p style={{ width: '75%', float: 'left' }}>linkaidi@office.cgbchina</p>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>组织</p>
                        <p style={{ width: '75%', float: 'left' }}>零售银行部/总行/广发银行</p>
                        <div style={{clear: 'both'}}></div>
                    </div>

                </div>
                <Divider />
                <div>
                    <p>账号信息</p>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>账号</p>
                        <p style={{ width: '75%', float: 'left' }}>linkaidi</p>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}>系统角色</p>
                        <p style={{ width: '75%', float: 'left' }}>业务群管理员</p>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div>
                        <p style={{ width: '25%', float: 'left' }}></p>
                        <p style={{ width: '75%', float: 'left' }}>• CGB卡中心业务群</p>
                        <p style={{ width: '25%', float: 'left' }}></p>
                        <p style={{ width: '75%', float: 'left' }}>• 空中银行业务群</p>
                        <div style={{clear: 'both'}}></div>
                    </div>

                </div>
                
            </div>
        )
    }
}
Info.propTypes = {
}
Info.defaultProps = {
}
export default Info