/*
 * @Author: zengzijian
 * @Date: 2018-11-01 09:04:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:25:31
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, InputNumber } from 'antd';
import common from '@/utils/common';
import variableService from '@/api/business/variableService';
import publicUtils from '@/utils/publicUtils';

class FunctionParams extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        switch (this.props.val) {
            case -1:
                return <Type_1 param={this.props.param} expandParam={this.props.expandParam} updateParam={this.props.updateParam} />
            case 0:
                return <Type1 param={this.props.param} expandParam={this.props.expandParam} updateParam={this.props.updateParam} />
            case 4:
                return <Type2 param={this.props.param} expandParam={this.props.expandParam} updateParam={this.props.updateParam} />
            case 5:
                return <Type3 param={this.props.param} expandParam={this.props.expandParam} updateParam={this.props.updateParam} />
            case 6:
                return <Type4 param={this.props.param} expandParam={this.props.expandParam} updateParam={this.props.updateParam} />
            default:
                return <div></div>
        }
    }
}

//正则
class Type_1 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ float: 'left', padding: '10px' }}>
                <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>并</p>
                <Select style={{ width: '180px', float: 'left' }} placeholder="请选择" value={this.props.param} onChange={(value) => { this.props.updateParam(value, null) }} >
                    <Select.Option value="replace">替换</Select.Option>
                    <Select.Option value="extract">提取</Select.Option>
                </Select>
                {this.props.param === 'extract' ? '' :
                    <p style={{  width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', margin: '0 10px' }}>为</p>
                }
                {this.props.param === 'extract' ? '' :
                    <Input style={{ width: '200px', float: 'left' }} placeholder="请输入字符串" value={this.props.expandParam} onChange={(e) => { this.props.updateParam(null, e.target.value) }} />
                }
            </div>
        )
    }
}

//字符串替换
class Type1 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ float: 'left', padding: '10px' }}>
                <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>并</p>
                <Input style={{ width: '200px', float: 'left' }} placeholder="请输入替换的字符串" value={this.props.param} onChange={(e) => { this.props.updateParam(e.target.value, null) }} />
                <p style={{width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', margin: '0 10px' }}>为</p>
                <Input style={{ width: '200px', float: 'left' }} placeholder="请输入替换的新字符串" value={this.props.expandParam} onChange={(e) => { this.props.updateParam(null, e.target.value) }} />
            </div>
        )
    }
}

//字符串截取
class Type2 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

            <div style={{ float: 'left', padding: '10px' }}>
                <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>起始位置</p>
                <InputNumber style={{ width: '180px', float: 'left' }} min={1} placeholder="输入字符串截取位置" value={this.props.param} onChange={(value) => { this.props.updateParam(value, null) }} />
                <p style={{ width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', margin: '0 10px' }}>结束位置</p>
                <InputNumber style={{ width: '180px', float: 'left' }} placeholder="输入字符串截取位置" min={1} value={this.props.expandParam} onChange={(value) => { this.props.updateParam(null, value) }} />
            </div>
        )
    }
}

//字符串查询
class Type3 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ float: 'left', padding: '10px' }}>
                <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>查询字符串</p>
                <Input style={{ width: '180px', float: 'left' }} placeholder="输入需要查询的字符串" value={this.props.param} onChange={(e) => { this.props.updateParam(e.target.value, null) }} />
            </div>
        )
    }
}

//日期转换
class Type4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            dateTypeList: []
        }
        this.data = {
            dateFormat1: '',
            dateFormat2: '',
            optType: '',
            number: '',
            timetype: ''
        }
        this.formatDataToLocal = this.formatDataToLocal.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.getDateTypeList = this.getDateTypeList.bind(this);
        this.formatDataToLocal(this.props.param, this.props.expandParam);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.param !== this.props.param) {
            this.formatDataToLocal(nextProps.param, null);
        }
        if (nextProps.expandParam !== this.props.expandParam) {
            this.formatDataToLocal(null, nextProps.expandParam);
        }
    }

    componentDidMount() {
        this.getDateTypeList();
    }

    formatDataToLocal(param, expandParam) {
        if (!common.isEmpty(param)) {
            this.data.dateFormat2 = Number(param);
            this.setState({
                index: Math.random()
            })
        }
        if (!common.isEmpty(expandParam)) {
            if (String(expandParam).indexOf('·-·') != -1) {
                let params = expandParam.split('·-·');
                if (params.length == 3) {
                    this.data.optType = params[0];
                    this.data.number = params[1];
                    this.data.timetype = params[2];
                    this.setState({
                        index: Math.random()
                    })
                }

            } else if (this.props.expandParam === 'invariant') {
                this.data.optType = 'invariant';
            }
        }
    }

    formatDataToSubmit() {
        if (!common.isEmpty(this.data.dateFormat2)) {
            let param = this.data.dateFormat2;
            this.props.updateParam(param, null);
        }
        if (!common.isEmpty(this.data.optType)) {
            if (this.data.optType === 'invariant') {
                this.props.updateParam(null, "invariant");
            } else {
                if (!common.isEmpty(this.data.optType) && !common.isEmpty(this.data.number) && !common.isEmpty(this.data.timetype)) {
                    let param = this.data.optType + '·-·' + this.data.number + '·-·' + this.data.timetype;
                    this.props.updateParam(null, param);
                }
            }
        }

    }

    dataChange(name, value) {
        console.log("dataChange", name, value)
        if (name === 'optType') {
            this.data.optType = "";
            this.data.number = "";
            this.data.timetype = "";
            this.props.updateParam(null, null);
        }
        if (name === 'number' && common.isEmpty(value)) {
            value = 0;
        }
        this.data[name] = value;
        this.setState({
            index: Math.random()
        })
        this.formatDataToSubmit();
    }

    getDateTypeList() {
        variableService.getEnumList("dateType").then(res => {
            if (!publicUtils.isOk(res)) return
            if (!common.isEmpty(res.data.result)) {
                this.setState({
                    dateTypeList: res.data.result
                })
            }
        });
    }

    render() {
        return (

            <div style={{ float: 'left', padding: '10px' }}>
                {/* <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>原格式</p>
                <Select style={{ width: '180px', float: 'left' }} placeholder="日期格式化" value={this.data.dateFormat1} onChange={(value) => { this.dataChange('dateFormat1', value) }} >
                    {this.state.dateTypeList.map((item, i) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select> */}
                <p style={{ width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', margin: '0 10px 0 0' }}>转换为</p>
                <Select style={{ width: '180px', float: 'left' }} placeholder="日期格式化" value={this.data.dateFormat2} onChange={(value) => { this.dataChange('dateFormat2', value) }} >
                    {this.state.dateTypeList.map((item, i) =>
                        <Select.Option key={i} value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>
                <Select style={{ width: '80px', float: 'left', marginLeft: '8px' }} placeholder="增加" value={this.data.optType} onChange={(value) => { this.dataChange('optType', value) }} >
                    <Select.Option value="add">增加</Select.Option>
                    <Select.Option value="reduce">减少</Select.Option>
                    <Select.Option value="invariant">不变</Select.Option>
                </Select>
                {
                    this.data.optType === 'invariant' ? '' :
                        <InputNumber style={{ width: '80px', float: 'left', marginLeft: '8px' }} placeholder="数量" min={0} value={this.data.number} onChange={(value) => { this.dataChange('number', value) }} />
                }
                {
                    this.data.optType === 'invariant' ? '' :
                        <Select style={{ width: '80px', float: 'left', marginLeft: '8px' }} placeholder="天" value={this.data.timetype} onChange={(value) => { this.dataChange('timetype', value) }} >
                            <Select.Option value="day">天</Select.Option>
                            <Select.Option value="month">月</Select.Option>
                            <Select.Option value="week">周</Select.Option>
                            <Select.Option value="hour">小时</Select.Option>
                            <Select.Option value="minute">分钟</Select.Option>
                        </Select>
                }


            </div>
        )
    }
}
Type_1.propTypes = {
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
Type1.propTypes = {
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
Type2.propTypes = {
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
Type3.propTypes = {
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
Type4.propTypes = {
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
FunctionParams.propTypes = {
    val: PropTypes.number,
    param: PropTypes.string,
    expandParam: PropTypes.string,
    updateParam: PropTypes.func
}
FunctionParams.defaultProps = {}
export default FunctionParams;