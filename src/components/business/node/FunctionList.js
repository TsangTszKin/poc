import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const functionListForString = [
    {
        "val": 0,
        "label": "COUNT"
    }];
const functionListForDate = [
    {
        "val": 0,
        "label": "COUNT"
    }, {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },]
const functionListForNumber = [
    {
        "val": 0,
        "label": "COUNT"
    },
    {
        "val": 1,
        "label": "SUM"
    },
    {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },
    {
        "val": 4,
        "label": "AVG"
    }]
const functionListForNull = [
    {
        "val": '',
        "label": "无"
    }]

class FunctionList extends Component {
    constructor(props) {
        super(props);
        this.getVarDataType = this.getVarDataType.bind(this);
    }

    getVarDataType = () => {
        let rs = null;
        let dataType = this.props.varDataType;
        if (typeof dataType === 'string')
            dataType = Number(dataType)

        switch (dataType) {
            case 12:
                rs = 'string';
                break;
            case -3:
                rs = 'string';
                break;
            case -5:
                rs = 'int';
                break;
            case 4:
                rs = 'int';
                break;
            case -6:
                rs = 'int';
                break;
            case 5:
                rs = 'int';
                break;
            case 3:
                rs = 'float';
                break;
            case 2:
                rs = 'float';
                break;
            case 6:
                rs = 'float';
                break;
            case 16:
                rs = 'boolean';
                break;
            case 93:
                rs = 'time';
                break;
            case 1111:
                rs = 'string';
                break;
            default:
                break;
        }
        return rs
    }


    render() {
        switch (this.getVarDataType()) {
            case 'string':
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForString.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>
            case 'time':
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForDate.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>
            case 'boolean':
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForNull.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>

            case 'float':
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForNumber.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>
            case 'int':
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForNumber.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>

            default:
                return <Select defaultValue={(element.functionType || element.functionType == 0) && (element.functionCode || element.functionCode == 0) ? element.functionType + '·-·' + element.functionCode : ''} style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(i, 'functionType', value.split('·-·')[0]); }}>
                    {functionListForNull.map((item, j) =>
                        <Select.Option value={item.val}>{item.label}</Select.Option>
                    )}
                </Select>
        }
    }
}

FunctionList.propTypes = {
    varDataType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}
FunctionList.defaultProps = {}

export default FunctionList;