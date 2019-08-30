/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-13 18:55:54
 * @Description: 每个容器的页眉
 */
import React, { Component } from 'react';
import BreadCrumb from '@/components/BreadCrumb';
import PropTypes, { func } from 'prop-types';
import common from '@/utils/common';
import { Icon, Select, Divider, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import testImg from '@/assets/test.png';
import sqlImg from '@/assets/sql.png';
import publicUtils from '@/utils/publicUtils';

/**
 * 容器页面的面包屑导航以及页面基础信息
 * 
 * @class PageHeader
 * @extends {Component}
 */
@withRouter
@inject('store')
@observer
class PageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { index: 0 }
        this.goToApplicationVersion = this.goToApplicationVersion.bind(this);
    }

    goToApplicationVersion(id) {
        alert(this.props.meta.saveType)
        switch (this.props.meta.saveType) {
            case 'real-time-query':
                this.props.history.push(`/business/variable/real-time-query/save/${id}`);
                break;
            case 'rule':
                this.props.history.push(`/business/strategy/rule/save/${id}`);
                break;
            case 'definition':
                this.props.history.push(`/business/strategy/definition/save/1/${this.props.match.params.type}/${id}`);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div className="panel-header">
                <BreadCrumb nav={this.props.meta.nav} />
                <p className='title'>
                    {this.props.meta.title} <span className="description">{this.props.meta.descript}</span>
                </p>
                {this.props.isShowSelect ?
                    !common.isEmpty(this.props.meta.btns) ?
                        this.props.auth.version ?
                            <div style={{ height: '21px', float: 'right' }}>
                                {this.props.meta.btns.map((item, i) =>
                                    item.name == '版本' ?
                                        <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                                            <Select
                                                size="small"
                                                value={this.props.store.version.getValue}
                                                defaultValue={this.props.store.version.getValue}
                                                style={{ width: '140px', marginTop: '5px' }}
                                                placeholder="版本"
                                                key={Math.random()}
                                                dropdownRender={menu => (
                                                    <div >
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ padding: '8px', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                this.props.store.copyForApi();
                                                                let self = this;
                                                                let timer = setInterval(() => {
                                                                    if (sessionStorage.currentVersionId) {
                                                                        clearInterval(timer);
                                                                        self.goToApplicationVersion(sessionStorage.currentVersionId);
                                                                        sessionStorage.removeItem("currentVersionId");
                                                                    }

                                                                }, 100);
                                                            }} >
                                                            <Icon type="plus" /> 复制版本
                                                        </div>
                                                        <div style={{ padding: '8px', cursor: 'pointer' }} onClick={() => {
                                                            this.props.store.setDefaultVersionForApi();
                                                            let self = this;
                                                            let timer = setInterval(() => {

                                                                if (sessionStorage.versionOver) {
                                                                    clearInterval(timer);
                                                                    sessionStorage.removeItem("versionOver");
                                                                    self.setState({ index: Math.random() + Math.random() })
                                                                }

                                                            }, 300);
                                                        }} >
                                                            <Icon type="check-circle" /> 应用版本
                                                        </div>
                                                        <div style={{ padding: '8px', cursor: 'pointer' }} onClick={() => {

                                                            let currentRouterid = this.props.match.params.id;

                                                            let enableVersionId = '';
                                                            for (let i = 0; i < this.props.store.version.getList.length; i++) {
                                                                const element = this.props.store.version.getList[i];
                                                                if (element.enable) enableVersionId = element.id;
                                                            }
                                                            if (currentRouterid === enableVersionId) {
                                                                message.warning("当前应用的版本不可删除");
                                                                return
                                                            }
                                                            this.props.store.deleteVersionForApi(currentRouterid);
                                                            let self = this;
                                                            let timer = setInterval(() => {
                                                                if (sessionStorage.currentVersionId) {
                                                                    clearInterval(timer);
                                                                    self.goToApplicationVersion(sessionStorage.currentVersionId);
                                                                    sessionStorage.removeItem("currentVersionId");
                                                                }

                                                            }, 100);
                                                        }} >
                                                            <Icon type="delete" /> 删除版本
                                                        </div>
                                                    </div>
                                                )}
                                                onChange={(value, option) => {
                                                    let self = this;
                                                    switch (option.props.type) {
                                                        case 0:
                                                            this.props.store.copyForApi();
                                                            break;
                                                        case 1:
                                                            this.props.store.setDefaultVersionForApi();
                                                            break;
                                                        case 2:
                                                            let id = option.props.id;
                                                            if (!common.isEmpty(id)) {
                                                                this.props.store.setId(id);
                                                                this.props.store.allVersionForApi();


                                                                let timer = setInterval(() => {
                                                                    if (sessionStorage.versionOver) {
                                                                        clearInterval(timer);
                                                                        sessionStorage.removeItem("versionOver");
                                                                        self.goToApplicationVersion(id);
                                                                    }

                                                                }, 100);


                                                            }

                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }}
                                            >
                                                {
                                                    this.props.store.version.getList.map((item, i) =>
                                                        item.version !== this.props.store.version.getValue ?
                                                            <Select.Option key={Math.random()} value={item.version} id={item.id} type={item.type}>{item.version}{item.enable ? '(已应用)' : ''}</Select.Option>
                                                            :
                                                            <Select.Option key={Math.random()} value={item.version} id={item.id} type={item.type} disabled>{item.version}{item.enable ? '(已应用)' : ''}</Select.Option>
                                                    )
                                                }
                                            </Select>

                                        </div>
                                        :
                                        ''
                                )}
                            </div> : ''
                        : ''
                    : ''
                }


                {this.props.isShowBtns ?
                    !common.isEmpty(this.props.meta.btns) ?
                        <div style={{ height: '21px', float: 'right' }}>
                            {this.props.meta.btns.map((item, i) =>
                                item.name !== '版本' ?
                                    item.name === '测试' ?
                                        this.props.auth.test ?
                                            <p style={{ width: 'fit-content', margin: '0 30px 0 0', float: 'left', cursor: 'pointer', height: '24px', padding: '3px 0' }}
                                                onClick={() => {
                                                    this.props.store.getTestInput(this.props.match.params.id);
                                                }}
                                            >
                                                <img src={testImg} style={{ height: '19px', marginRight: '6px' }} />
                                                <span style={{ position: 'relative', top: '2px' }}>{item.name}</span>
                                            </p>
                                            : ''
                                        :
                                        item.name === '总览' ?
                                            this.props.auth.sql ?
                                                <p style={{ width: 'fit-content', margin: '0 30px 0 0', float: 'left', cursor: 'pointer', height: '24px', padding: '3px 0' }}
                                                    onClick={() => {
                                                        this.props.store.getSqlPreviewForAPI(this.props.match.params.id);
                                                    }}
                                                >
                                                    <img src={sqlImg} style={{ height: '16px', marginRight: '6px' }} />
                                                    <span style={{ position: 'relative', top: '2px' }}>{item.name}</span>
                                                </p>
                                                : ''
                                            : ''
                                    : ''

                            )}
                        </div> : ''

                    : ''
                }

            </div>
        )
    }
}
PageHeader.propTypes = {
    isShowBtns: PropTypes.bool,
    isShowSelect: PropTypes.bool,
    auth: PropTypes.shape({
        test: PropTypes.bool,
        sql: PropTypes.bool,
        version: PropTypes.bool,
    })
}
PageHeader.defaultProps = {
    isShowBtns: false,
    isShowSelect: false,
    auth: {
        test: false,
        sql: false,
        version: false,
    }
}
export default PageHeader