/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-16 09:42:49
 * @Description: 每个容器的页眉
 */
import React, { Component } from 'react';
import BreadCrumb from '@/components/BreadCrumb';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import { Select } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import testImg from '@/assets/test.png';
import sqlImg from '@/assets/sql.png';
import publicUtils from '@/utils/publicUtils';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';

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
        this.copyForApi = this.copyForApi.bind(this);
        this.allVersionForApi = this.allVersionForApi.bind(this);
    }


    //版本的方法
    copyForApi() {
        common.loading.show();
        switch (this.props.meta.saveType) {
            case 'real-time-query':
                variableService.rtqCopy(this.props.match.params.id).then((res) => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    let id = res.data.result.id;
                    if (!common.isEmpty(id)) {
                        this.goToApplicationVersion(id);
                    }
                }).catch(() => common.loading.hide());
                break;
            case 'rule':
                strategyService.ruleCopy(this.props.match.params.id).then((res) => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    let id = res.data.result.id;
                    if (!common.isEmpty(id)) {
                        this.goToApplicationVersion(id);
                    }
                }).catch(() => common.loading.hide());
                break;
            case 'definition':
                strategyService.strategyCopy(this.props.match.params.id).then((res) => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    let id = res.data.result.id;
                    if (!common.isEmpty(id)) {
                        this.goToApplicationVersion(id);
                    }
                }).catch(() => common.loading.hide());

                break;
            default:
                break;
        }
    }

    goToApplicationVersion(id) {
        switch (this.props.meta.saveType) {
            case 'real-time-query':
                this.props.history.push(`/business/variable/real-time-query/save2.0/1/${this.props.match.params.rtqVarType}/${id}`);
                break;
            case 'rule':
                this.props.history.push(`/business/strategy/rule/save/1/${id}`);
                break;
            case 'ruleSet':
                this.props.history.push(`/business/strategy/rule-set/save/${this.props.match.params.type}/${id}`);
                break;
            case 'rule-view':
                this.props.history.push(`/business/strategy/rule/details/${id}`);
                break;
            case 'ruleSet-view':
                this.props.history.push(`/business/strategy/rule-set/details/${id}`);
                break;
            case 'definition':
                this.props.history.push(`/business/strategy/definition/save/1/${id}`);
                break;
            default:
                break;
        }
    }


    allVersionForApi(id) {
        switch (this.props.meta.saveType) {
            case 'real-time-query':
                variableService.rtqV2AllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
                break;
            case 'rule':
                strategyService.ruleAllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
                break;
            case 'ruleSet':
                strategyService.ruleSetAllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
                break;
            case 'rule-view':
                strategyService.ruleAllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
                break;
            case 'ruleSet-view':
                strategyService.ruleSetAllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
                break;
            case 'definition':
                strategyService.strategyAllVersion(id).then((res) => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        element.type = 2;
                        tempArray.push(element)
                        if (element.id === id) {
                            this.props.store.version.setValue(element.version);
                        }
                    })
                    this.props.store.version.setList(tempArray);
                    this.goToApplicationVersion(id);
                });
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
                    <span id="page-title">{this.props.meta.title}</span> <span className="description">{this.props.meta.descript}</span>
                </p>

                <div style={{ float: 'right', marginTop: '-34px' }}>
                    <div style={{ marginTop: '35px' }}>
                        {this.props.isShowSelect ?
                            !common.isEmpty(this.props.meta.btns) ?
                                this.props.auth.version ?
                                    <div style={{ float: 'right' }}>
                                        {this.props.meta.btns.map((item) =>
                                            item.name === '版本' ?
                                                <div
                                                //  onMouseDown={(e) => { e.preventDefault(); return false; }}
                                                >
                                                    <Select
                                                        size="small"
                                                        value={this.props.store.version.getValue}
                                                        defaultValue={this.props.store.version.getValue}
                                                        style={{ width: '140px', marginTop: '5px' }}
                                                        placeholder="版本"
                                                        key={Math.random()}
                                                        onChange={(value, option) => {
                                                            let id = option.props.id;
                                                            if (!common.isEmpty(id)) {
                                                                this.props.store.setId(id);
                                                                this.allVersionForApi(id);
                                                                this.props.store.setStoreBus(1);
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            this.props.store.version.getList.map((item) =>
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
                                <div style={{ float: 'right' }}>
                                    {this.props.meta.btns.map((item) =>
                                        item.name !== '版本' ?
                                            item.name === '测试' ?
                                                this.props.auth.test ?
                                                    <p style={{ width: 'fit-content', margin: '0 30px 0 0', float: 'left', cursor: 'pointer', height: '24px', padding: '3px 0' }}
                                                        onClick={() => {
                                                            this.props.store.getTestInput(this.props.match.params.id);
                                                        }}
                                                    >
                                                        <img src={testImg} style={{ height: '19px', marginRight: '6px' }} alt='' />
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
                                                            <img src={sqlImg} style={{ height: '16px', marginRight: '6px' }} alt='' />
                                                            <span style={{ position: 'relative', top: '2px' }}>{item.name}</span>
                                                        </p>
                                                        : ''
                                                    : ''
                                            : ''

                                    )}
                                </div> : ''

                            : ''
                        }
                        <div style={{ clear: 'both' }} />
                    </div>
                    {/* <div style={{ clear: 'both' }}></div> */}

                </div>

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