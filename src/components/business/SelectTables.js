/*
 * @Author: zengzijian
 * @LastEditors: zengzijian
 * @Description: 选择表：【A表】                              --- 【渲染来自tables】
                        【内连接】【B表】【B.字段】【等于】【A.字段】  --- 【渲染来自joinFields】
                        【左连接】【C表】【C.字段】【等于】【A.字段】  --- 【渲染来自joinFields】
                        传自tables 
 * @Date: 2019-03-01 15:39:17
 * @LastEditTime: 2019-03-08 09:49:58
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import AddAndSub from '@/components/AddAndSub';

class FieldLeftJoin extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        // console.log("this.props", this.props)
        return (
            <div style={{ marginBottom: '10px', width: '1020px' }}>
                <p style={{ float: 'left', height: '32px', lineHeight: '32px', width: '66px', float: 'left' }}>
                    {/* {
                        this.props.index === 1 ? '选择表：' : ''
                    } */}
                </p>
                <Select
                    defaultValue={this.props.joinType}
                    style={{ width: '90px', margin: '0px 3px 0 0', float: 'left' }}
                    onChange={(value, option) => {
                        this.props.callBack('joinType', value, this.props.index);
                    }}
                    placeholder="连接关系"
                >
                    <Select.Option value={1}>内连接</Select.Option>
                    <Select.Option value={2}>左连接</Select.Option>
                    <Select.Option value={3}>右连接</Select.Option>
                    <Select.Option value={4}>外连接</Select.Option>
                </Select>
                <Select
                    defaultValue={this.props.joinFields.joinTable.name}
                    style={{ width: '160px', margin: '0px 3px 0 10px', float: 'left' }}
                    onChange={(value, option) => {
                        this.props.callBack('tables', value, this.props.index);
                    }}
                >
                    {
                        this.props.tableList.map((item, i) =>
                            <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                        )
                    }

                </Select>
                <Select
                    showSearch={true}
                    optionFilterProp="children"
                    value={this.props.joinFields.field ? `${this.props.joinFields.table.name}·-·${this.props.joinFields.field}` : ''}
                    style={{ width: '250px', float: 'left' }}
                    onChange={(value, option) => {
                        let fieldCode = option.props.code;
                        let tableCode = option.props.table;
                        this.props.callBack('table', {
                            "aliasName": "",
                            "name": tableCode
                        }, this.props.index);
                        this.props.callBack('field', fieldCode, this.props.index);
                    }}
                >
                    {
                        this.props.fieldList.map((item, i) =>
                            item.fieldsList.map((item2, i) =>
                                <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            )

                        )
                    }
                </Select>
                <Select defaultValue="lucy" style={{ width: '75px', margin: '0 3px', float: 'left' }} disabled>
                    <Select.Option value="lucy">等于</Select.Option>
                </Select>
                <Select
                    showSearch={true}
                    optionFilterProp="search"
                    value={this.props.joinFields.joinField ? `${this.props.joinFields.joinTable.name}·-·${this.props.joinFields.joinField}` : ''}
                    style={{ width: '250px', float: 'left' }}
                    onChange={(value, option) => {
                        let fieldCode = option.props.code;
                        let tableCode = option.props.table;
                        this.props.callBack('joinTable', {
                            "aliasName": "",
                            "name": tableCode
                        }, this.props.index);
                        this.props.callBack('joinField', fieldCode, this.props.index);
                    }}
                >
                    {
                        this.props.fieldList.map((item, i) =>
                            item.fieldsList.map((item2, i) =>
                                <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`}  value={`${item.name}·-·${item2.code}`} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            )

                        )
                    }
                </Select>
                <AddAndSub sub={() => { this.props.subCallBack(this.props.index) }} type='sub' style={{ float: 'left', position: 'relative', top: '-3px' }} />
                <div style={{ clear: 'both' }}></div>
            </div>
        )
    }
}
FieldLeftJoin.proptypes = {
    fieldList: PropTypes.array,
    joinFields: PropTypes.object,
    index: PropTypes.number,
    callBack: PropTypes.func,
    joinType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tableList: PropTypes.array,
    subCallBack: PropTypes.func
}
FieldLeftJoin.defaultProps = {
    fieldList: [],
    joinFields: {
        "field": "",
        "joinField": "",
        "joinTable": {
            "aliasName": "",
            "name": ""
        },
        "table": {
            "aliasName": "",
            "name": ""
        }
    },
    index: 0,
    callBack: () => { },
    joinType: '',
    tableList: [],
    subCallBack: () => { }
}
export default FieldLeftJoin