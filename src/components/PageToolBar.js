import React, { Component } from 'react';
import { Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import '@/styles/pageToolBar';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

class PageToolBar extends Component {
    constructor(props) {
        super(props);
        this.inputChange = this.inputChange.bind(this);
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
            this.getCategoryListByType();
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

    selectorChange = (value) => {
        // console.log(`selected: ${value}`);
        this.setState({
            selectValue: value ? value : ''
        })
        this.props.changeToolBar(value ? value : '', this.state.keyword);
    }
    inputChange = (value) => {
        this.setState({
            keyword: value
        })
        this.props.changeToolBar(this.state.selectValue, value);
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
            <div className="pageToolBar-container" style={this.props.style ? this.props.style : {}} >
                <p className="select-name" style={{ display: this.state.selectData.length > 0 && this.props.selectName ? 'block' : 'none' }}>{this.props.selectName}：&nbsp;</p>
                <div className="select-container" style={{ display: this.state.selectData.length > 0 && this.props.selectName ? 'block' : 'none' }}>
                    <Select defaultValue={this.state.selectValue} style={{ width: 120 }} onChange={this.selectorChange}>
                        {this.state.selectData.map((item, i) =>
                            <Select.Option value={item.code}>{item.value}</Select.Option>
                        )}
                    </Select>
                </div>
                <div className="search" style={{ marginLeft: this.state.selectData.length > 0 && this.props.selectName ? '24px' : '0' }}>
                    {/* <Input placeholder={this.props.searchPlaceholder} onChange={this.inputChange} /> */}
                    <Input.Search
                        placeholder={this.props.searchPlaceholder}
                        // enterButton="查询"
                        onSearch={value => this.inputChange(value)}
                        onChange={(e) => {
                            this.setState({
                                keyword: common.stripscript(e.target.value)
                            })
                        }}
                        value={this.state.keyword}
                        style={{ marginTop: '5px' }}
                    />
                </div>

                <div className="add-btn-container" style={{ display: this.props.btnStr ? 'block' : 'none' }}>
                    <Button type="primary" onClick={this.props.btnCallBack}>{this.props.btnStr}</Button>
                </div>
                {this.props.children}
            </ div>
        )
    }
}
PageToolBar.propTypes = {
    selectName: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    changeToolBar: PropTypes.func.isRequired,
    btnStr: PropTypes.string,
    btnCallBack: PropTypes.func,
    categoryType: PropTypes.oneOf(['batch', 'var', 'rule', 'ruleSet', 'strategy','systemVar', 'eventSource','template']),
    searchValue: PropTypes.number
}
PageToolBar.defaultProps = {
    selectName: '',
    searchPlaceholder: '请输入关键字查询',
    categoryType: '',
    searchValue: ''
}
export default PageToolBar