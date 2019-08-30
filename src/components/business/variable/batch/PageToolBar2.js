import React, { Component } from 'react';
import { Select, Input, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import '@/styles/pageToolBar';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';

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
        keyword: '',
        selectData: []
    }

    componentDidMount() {
        if (this.props.categoryType !== 'eventSource') {
            // this.getCategoryListByType();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectData !== this.props.selectData) {
            this.setState({
                selectData: nextProps.selectData
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
        console.log("=========",query);
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
                    selectData: tempArray
                })
            }
        })
    }

    render() {
         return (
            <div className="pageToolBar-container" style={{ display: this.props.store.getShowToolBarType == 1 ? 'flex' : 'none' }} >
                <div style={{ flex: 1 }}>
                    <p className="select-name" style={{ display: this.state.selectData.length > 0 && this.props.selectName ? 'block' : 'none' }}>{this.props.selectName}：&nbsp;</p>
                    <div className="select-container" style={{ display: this.state.selectData.length > 0 && this.props.selectName ? 'block' : 'none' }}>
                        <Select value={this.props.store.getQuery.dimensionId} style={{ width: 120 }} onChange={(value) => this.selectorChange('dimensionId', value)}>
                            {this.state.selectData.map((item, i) =>
                                <Select.Option value={item.code}>{item.value}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className="search" style={{ marginLeft: this.state.selectData.length > 0 && this.props.selectName ? '24px' : '0' }}>
                        <Input.Search
                            placeholder={this.props.searchPlaceholder}
                            // enterButton="查询"
                            onSearch={value => {
                                let query = common.deepClone(this.props.store.getQuery);
                                query['name'] = value;
                                query['code'] = value;
                                this.props.store.setPageNum(1);
                                this.props.store.setQuery(query);
                                this.props.store.getDataSourceForApi();
                            }}
                            onChange={(e) => {
                                let query = common.deepClone(this.props.store.getQuery);
                                query['name'] = e.target.value;
                                query['code'] = e.target.value;
                                this.props.store.setPageNum(1);
                                this.props.store.setQuery(query);
                                this.props.store.getDataSourceForApi();
                            }}
                            value={this.props.store.getQuery.name}
                            style={{ marginTop: '5px' }}
                        />
                    </div>

                    <div className="add-btn-container" style={{ display: this.props.btnStr ? 'block' : 'none' }}>
                        <Button type="primary" onClick={this.props.btnCallBack}>{this.props.btnStr}</Button>
                    </div>
                    <a style={{ marginLeft: '24px', whiteSpace: 'nowrap' }} onClick={() => this.props.store.setShowToolBarType(2)}>展开<Icon type="down" /></a>
                </div>
                {this.props.children}
            </ div >
        )
    }
}
PageToolBar.propTypes = {
    selectName: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    changeToolBar: PropTypes.func.isRequired,
    btnStr: PropTypes.string,
    btnCallBack: PropTypes.func,
    categoryType: PropTypes.oneOf(['batch', 'var', 'rule', 'ruleSet', 'strategy', 'eventSource']),
    searchValue: PropTypes.number
}
PageToolBar.defaultProps = {
    selectName: '',
    searchPlaceholder: '请输入关键字查询',
    categoryType: '',
    searchValue: ''
}
export default PageToolBar