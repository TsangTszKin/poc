/*
 * @Author: zengzijian
 * @Date: 2019-06-29 09:21:04
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:23:26
 * @Description: 
 */
import React, { Component } from 'react';
import { Select, Input, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import '@/styles/pageToolBar2';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@withRouter
@inject("store")
@observer
class PageToolBar extends Component {
    constructor(props) {
        super(props);
        this.selectorChange = this.selectorChange.bind(this);
        this.getCategoryListByType = this.getCategoryListByType.bind(this);
    }
    state = {
        selectValue: '',
        selectValue2: '',
        keyword: '',
        selectData: [],
        selectData2: []
    }

    componentDidMount() {
        this.getCategoryListByType();
    }

    componentWillUpdate() {
        // this.getCategoryListByType();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectData !== this.props.selectData) {
            this.setState({
                selectData: nextProps.selectData
            })
        }
        if (nextProps.selectData2 !== this.props.selectData2) {
            this.setState({
                selectData2: nextProps.selectData2
            })
        }
        if (nextProps.searchValue !== this.props.searchValue) {
            this.setState({
                keyword: nextProps.searchValue
            })
        }
    }

    selectorChange = (key, value) => {
        let query = common.deepClone(this.props.store.getQuery);
        query[key] = value;
        this.props.store.setPageNum(1);
        this.props.store.setQuery(query);
        this.props.store.getDataSourceForApi();
    }
    getCategoryListByType() {
        commonService.getCategoryListByType(this.props.categoryType).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [{ code: '', value: '所有' }];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.dataValue,
                        value: element.dataName
                    });
                })
                this.setState({
                    selectData2: tempArray
                })
            }
        })
    }

    render() {
        return (
            <div className="pageToolBar-container2" style={{ display: this.props.store.getShowToolBarType == 2 ? 'flex' : 'none' }} >
                <div style={{ flex: 1}}>
                    <div className="main">
                        <div className="cell">
                            <p className="select-name">{this.props.selectName}：&nbsp;</p>
                            <div className="select-container" >
                                <Select value={this.props.store.getQuery.dimensionId} style={{ width: 120 }} onChange={(value) => this.selectorChange('dimensionId', value)}>
                                    {this.state.selectData.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )}
                                </Select>
                            </div>
                            <div style={{ clear: 'both' }}></div>
                        </div>

                        <div className="search cell">
                            <Input.Search
                                className="search-input"
                                placeholder={this.props.searchPlaceholder}
                                // enterButton="查询"
                                onSearch={value => {
                                    //废弃
                                    // this.selectorChange('name', value);
                                    // this.selectorChange('code', value);
                                    //解决name和code不同步查询的问题
                                    let query = common.deepClone(this.props.store.getQuery);
                                    query.name = value;
                                    query.code = value;
                                    this.props.store.setPageNum(1);
                                    this.props.store.setQuery(query);
                                    this.props.store.getDataSourceForApi();
                                }}
                                onChange={(e) => {
                                    // this.selectorChange('name', e.target.value);
                                    // this.selectorChange('code', e.target.value);
                                    //解决name和code不同步查询的问题
                                    let query = common.deepClone(this.props.store.getQuery);
                                    query.name = e.target.value;
                                    query.code = e.target.value;
                                    this.props.store.setPageNum(1);
                                    this.props.store.setQuery(query);
                                    this.props.store.getDataSourceForApi();
                                }}
                                value={this.props.store.getQuery.name}
                                style={{ marginTop: '5px' }}
                            />
                        </div>

                        <div className="cell">
                            <p className="select-name2" >{this.props.selectName2}：&nbsp;</p>
                            <div className="select-container">
                                <Select value={this.props.store.getQuery.category} style={{ width: 120 }} onChange={(value) => this.selectorChange('category', value)}>
                                    {this.state.selectData2.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )}
                                </Select>
                            </div>
                            <div style={{ clear: 'both' }}></div>
                        </div>
                    </div>
                    <div className="main">
                        {/* <div className="cell" style={{ marginLeft: '13px' }}>
                        <p className="select-name" >选择状态：&nbsp;</p>
                        <div className="select-container" style={{ display: this.state.selectData2.length > 0 && this.props.selectName2 ? 'block' : 'none' }}>
                            <Select value={this.props.store.getQuery.approvalStatus} style={{ width: 120 }} onChange={(value) => this.selectorChange('approvalStatus', value)}>
                                <Select.Option value="">所有</Select.Option>
                                <Select.Option value={0}>审核中</Select.Option>
                                <Select.Option value={1}>通过</Select.Option>
                                <Select.Option value={2}>拒绝</Select.Option>
                                <Select.Option value={3}>待审核</Select.Option>
                            </Select>
                        </div>
                        <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                    </div> */}
                        {
                            (() => {
                                switch (this.props.type) {
                                    case 'rtq':
                                        return (
                                            <div className="cell" style={{ marginLeft: '13px' }}>
                                                <p className="select-name" >选择类型：&nbsp;</p>
                                                <div className="select-container" style={{ display: this.state.selectData2.length > 0 && this.props.selectName2 ? 'block' : 'none' }}>
                                                    <Select value={this.props.store.getQuery.rtqVarType} style={{ width: 120 }} onChange={(value) => this.selectorChange('rtqVarType', value)}>
                                                        <Select.Option value="">所有</Select.Option>
                                                        <Select.Option value='RTQQUERY'>实时集合</Select.Option>
                                                        <Select.Option value='RTQVAR'>实时变量</Select.Option>
                                                        <Select.Option value='SCRIPTVAR'>脚本变量</Select.Option>
                                                    </Select>
                                                </div>
                                                <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                                            </div>
                                        )
                                    case 'ext':
                                        return (
                                            <div className="cell" style={{ marginLeft: '13px' }}>
                                                <p className="select-name" >选择类型：&nbsp;</p>
                                                <div className="select-container" style={{ display: this.state.selectData2.length > 0 && this.props.selectName2 ? 'block' : 'none' }}>
                                                    <Select value={this.props.store.getQuery.type} style={{ width: 120 }} onChange={(value) => this.selectorChange('type', value)}>
                                                        <Select.Option value="">所有</Select.Option>
                                                        <Select.Option value={0}>计算变量</Select.Option>
                                                        <Select.Option value={1}>正则变量</Select.Option>
                                                        <Select.Option value={2}>函数变量</Select.Option>
                                                    </Select>
                                                </div>
                                                <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                                            </div>
                                        )
                                    case 'rule':
                                        return (
                                            <div className="cell" style={{ marginLeft: '13px' }}>
                                                <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                                            </div>
                                        )

                                    case 'ruleSet':
                                        return (
                                            <div className="cell" style={{ marginLeft: '13px' }}>
                                                <p className="select-name" >匹配模式：&nbsp;</p>
                                                <div className="select-container" style={{ display: this.state.selectData2.length > 0 && this.props.selectName2 ? 'block' : 'none' }}>
                                                    <Select value={this.props.store.getQuery.type} style={{ width: 120 }} onChange={(value) => this.selectorChange('type', value)}>
                                                        <Select.Option value="">所有</Select.Option>
                                                        <Select.Option value={0}>优先级模式</Select.Option>
                                                        <Select.Option value={1}>全规则模式</Select.Option>
                                                    </Select>
                                                </div>
                                                <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                                            </div>
                                        )
                                    case 'strategy':
                                        return (
                                            <div className="cell" style={{ marginLeft: '13px' }}>
                                                <a style={{ marginLeft: '24px' }} onClick={() => this.props.store.setShowToolBarType(1)}>收起<Icon type="up" /></a>
                                            </div>
                                        )
                                    default:
                                        break;
                                }
                            })()
                        }
                        <div className="cell">
                            <div className="add-btn-container" style={{ display: this.props.btnStr ? 'block' : 'none' }}>
                                <Button type="primary" onClick={this.props.btnCallBack}>{this.props.btnStr}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.children}
            </ div>
        )
    }
}
PageToolBar.propTypes = {
    selectName: PropTypes.string,
    selectName2: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    changeToolBar: PropTypes.func.isRequired,
    btnStr: PropTypes.string,
    btnCallBack: PropTypes.func,
    categoryType: PropTypes.oneOf(['batch', 'var', 'rule', 'ruleSet', 'strategy', 'eventSource']),
    searchValue: PropTypes.number,
    type: PropTypes.oneOf(['rtq', 'rule', 'ruleSet', 'strategy'])
}
PageToolBar.defaultProps = {
    selectName: '',
    selectName2: '',
    searchPlaceholder: '请输入关键字查询',
    categoryType: '',
    searchValue: ''
}
export default PageToolBar