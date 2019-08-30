import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import AddAndSub from '@/components/AddAndSub';

class FieldLeftJoin extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log("this.props.selectData", this.props.selectData)
        return (
            <div style={{ marginBottom: '10px', width: '930px', overflowX: 'auto' }}>
                <p style={{ float: 'left', height: '32px', lineHeight: '32px', width: '70px' }}>
                    {
                        this.props.index === 0 ? '字段关系：' : ''
                    }
                </p>
                <Select 
                 defaultValue={this.props.joinType}
                 style={{ width: '90px', margin: '0px 3px 0 10px' }}
                 onChange={(value, option) => {
                    this.props.callBack('joinType', value, this.props.index);
                }}
                 >
                    <Select.Option value={1}>内连接</Select.Option>
                    <Select.Option value={2}>左连接</Select.Option>
                    <Select.Option value={3}>右连接</Select.Option>
                    <Select.Option value={4}>外连接</Select.Option>
                </Select>
                <Select
                    showSearch={true}
                    optionFilterProp="search"
                    defaultValue={this.props.joinFields.field ? `${this.props.joinFields.table.name}·-·${this.props.joinFields.field}` : ''}
                    style={{ width: '250px' }}
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
                        this.props.selectData.map((item, i) =>
                            item.fieldsList.map((item2, i) =>
                                <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            )

                        )
                    }
                </Select>
                <Select defaultValue="lucy" style={{ width: '75px', margin: '0 3px' }} disabled>
                    <Select.Option value="lucy">等于</Select.Option>
                </Select>
                <Select
                    showSearch={true}
                    optionFilterProp="children"
                    defaultValue={this.props.joinFields.joinField ? `${this.props.joinFields.joinTable.name}·-·${this.props.joinFields.joinField}` : ''}
                    style={{ width: '250px' }}
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
                        this.props.selectData.map((item, i) =>
                            item.fieldsList.map((item2, i) =>
                                <Select.Option value={`${item.name}·-·${item2.code}`} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            )

                        )
                    }
                </Select>
                {/* <AddAndSub type='sub' style={{float: 'right'}} /> */}

            </div>
        )
    }
}
FieldLeftJoin.proptypes = {
    selectData: PropTypes.array,
    joinFields: PropTypes.object,
    index: PropTypes.number,
    callBack: PropTypes.func,
    joinType: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
FieldLeftJoin.defaultProps = {
    selectData: [],
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
    joinType: ''
}
export default FieldLeftJoin