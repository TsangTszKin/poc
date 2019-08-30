import React from 'react';
import { Input, Select, Table, Button, Icon, Switch } from 'antd';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import AddSub from '@/components/process-tree/AddSub';
import { inject, observer } from 'mobx-react';
import variableService from '@/api/business/variableService';
import FormBlock from '@/components/FormBlock';

const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": "",
            "table": {
                "aliasName": "",
                "name": "",
                "joinType": 0,
            }
        },
        "nodeType": 1
    }
    ]
}

const optTypeConstList = [
    {
        "code": 0,
        "value": "等于"
    },
    {
        "code": 1,
        "value": "大于"
    },
    {
        "code": 2,
        "value": "小于"
    },
    {
        "code": 3,
        "value": "不等于"
    },
    {
        "code": 4,
        "value": "大于等于"
    },
    {
        "code": 5,
        "value": "小于等于"
    },
    {
        "code": 8,
        "value": "is null"
    },
    {
        "code": 9,
        "value": "is not null"
    }];

const functionListForString = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    }];
const functionListForBoolean = [
    { "val": '', "label": '无' }];
const functionListForDate = [
    { "val": '', "label": '无' },
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
    { "val": '', "label": '无' },
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
    { "val": '', "label": '无' }];
const functionListForAll = [
    { "val": '', "label": '无' },
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

@inject("editorStore")
@observer
class VarMappingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.addMappings = this.addMappings.bind(this);
        this.subMappings = this.subMappings.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.controlNodeTranslateToSql = this.controlNodeTranslateToSql.bind(this);
        this.isQueryFieldsFinish = this.isQueryFieldsFinish.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.formatTables = this.formatTables.bind(this);
        this.state = {
            index: 0,
            tempVarList: [],
            mappings: [],
            fieldList: [],
            orderFieldsValue: []
        }
        this.saveData = {
            "varType": 0,
            "name": "",
            "parentId": "",
            'sqlCode': "",
            "mappingType": 1,//0实时查询变量映射，1临时变量映射
            "tables": [
                // {
                //     "aliasName": "",
                //     "name": "",
                //     "joinType": 0
                // }
            ],
            "orderFields": [
                // {
                //     "field": "",
                //     "order": "asc",
                //     "table": {
                //         "aliasName": "",
                //         "name": ""
                //     }
                // }
            ],
            "queryFields": [
                //     {
                //     "field": "money",
                //     "fieldName": "交易金额",
                //     "table": {
                //         "aliasName": "c",
                //         "name": "customer"
                //     },
                //     "varCode": "v_code",
                //     "varName": "映射变量中文名",
                //     "functionType": 1,
                //     "functionCode": "SUM",
                //     "secondFunctionType": 1,
                //     "secondFunctionCode": "1"
                // }
            ],
            "joinFields": [
                // {
                //     "field": "string",
                //     "joinField": "string",
                //     "joinTable": {
                //         "aliasName": "string",
                //         "name": "string",
                //     },
                //     "table": {
                //         "aliasName": "string",
                //         "name": "string"
                //     }
                // }
            ],
            "secondType": 2,
            "type": 1,
            "groupFields": [],
            "havingConditionVO": {}
        }
    }

    componentDidMount() {
    }

    addMappings = () => {
        let tempArray = this.state.mappings;
        this.saveData.queryFields.push({
            "field": "",
            "fieldName": "",
            "table": {
                "aliasName": "",
                "name": ""
            },
            "varCode": "",
            "varName": "",
            "functionType": "",
            "functionCode": "",
            "fieldDistinct": 0,
            "mappingType": 1
        })
        let mappings = this.renderTable(this.saveData.queryFields);
        this.setState({
            mappings
        })
    }

    renderTable(list) {
        console.log("renderTable list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: this.saveData.mappingType == 1 ? <Select showSearch={true} optionFilterProp="search" defaultValue={element.varName} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'varCode', value.split('·-·')[0]); this.tableDataChange(i, 'varName', option.props.children) }}>
                    {this.state.tempVarList.map((item, j) =>
                        <Select.Option search={`${item.code}${item.value}`} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select> : sessionStorage.rootProcessTreeName,
                c2: <Select showSearch={true} optionFilterProp="search" defaultValue={element.field ? `${element.table.name}·-·${element.field}` : ''} style={{ width: '300px' }} onChange={(value, option) => { this.tableDataChange(i, 'field', option.props.field); this.tableDataChange(i, 'fieldName', option.props.fieldName); this.tableDataChange(i, 'varDataType', option.props.varDataType); this.tableDataChange(i, 'table', { "aliasName": "", name: option.props.table }); }}>
                    {this.state.fieldList.map((item, j) =>
                        item.fieldsList.map((item2, i) =>
                            // <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item2.value}</Select.Option>
                        )
                        // < Select.Option varDataType = { item.varDataType } value = {`${item.name}·-·${item2.code}`}>{item.value}</Select.Option>
                    )
                    }
                </Select >,
                c3: (() => {
                    switch (this.getVarDataType(element.varDataType)) {
                        case 'string':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForString.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'int':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'float':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'boolean':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForBoolean.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'time':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForDate.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        default:
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNull.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                    }
                })(),
                c4: <Switch checkedChildren="开" disabled={common.isEmpty(element.functionCode) ? true : false} defaultChecked={this.saveData.queryFields[i].fieldDistinct == 1 ? true : false} unCheckedChildren="关" onChange={(checked) => { this.tableDataChange(i, 'fieldDistinct', checked ? 1 : 0); }} />,
                c5: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
            })
        }

        return tempArray
    }

    getVarDataType = (dataType) => {
        let rs = null;
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

    formatTables(tables) {
        let tempArray = [];
        if (common.isEmpty(tables)) return ''
        return tables[0].name

    }

    subMappings = (key) => {
        let arrayIndex;
        let field;
        for (let i = 0; i < this.state.mappings.length; i++) {
            const element = this.state.mappings[i];
            if (element.key === key) {
                arrayIndex = i;
                field = this.saveData.queryFields[i].field;
                continue
            }
        }
        this.saveData.queryFields.splice(arrayIndex, 1);
        let mappings = this.renderTable(this.saveData.queryFields);
        // this.fillGroupFields();

        let tempArray1 = [];
        let tempArray2 = [];
        this.state.orderFieldsValue.forEach(element => {
            if (element.field !== field) tempArray1.push(element)
        })
        this.saveData.orderFields.forEach(element => {
            if (element.field !== field) tempArray2.push(element)
        })
        this.saveData.orderFields = tempArray2;
        this.setState({
            mappings,
            orderFieldsValue: tempArray1
        })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }
    }

    controlNodeTranslateToSql() {
        variableService.sqlQueryNode(this.saveData).then(res => {
            if (res.data) {
                this.saveData.sqlCode = res.data.result;
                /* this.setState({ index: this.state.index++ })*/
                this.code.changeCode(this.saveData.sqlCode);
            }
        })
    }

    isQueryFieldsFinish() {
        let rs = true;
        for (let i = 0; i < this.saveData.queryFields.length; i++) {
            const element = this.saveData.queryFields[i];
            if (common.isEmpty(element.field)) {
                rs = false;
            }
            if (common.isEmpty(element.fieldName)) {
                rs = false;
            }
            if (common.isEmpty(element.varCode)) {
                rs = false;
            }
            if (common.isEmpty(element.varName)) {
                rs = false;
            }
        }
        return rs
    }

    renderTable(list) {
        console.log("renderTable list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: this.saveData.mappingType == 1 ? <Select showSearch={true} optionFilterProp="search" defaultValue={element.varName} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'varCode', value.split('·-·')[0]); this.tableDataChange(i, 'varName', option.props.children) }}>
                    {this.state.tempVarList.map((item, j) =>
                        <Select.Option search={`${item.code}${item.value}`} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select> : sessionStorage.rootProcessTreeName,
                c2: <Select showSearch={true} optionFilterProp="search" defaultValue={element.field ? `${element.table.name}·-·${element.field}` : ''} style={{ width: '300px' }} onChange={(value, option) => { this.tableDataChange(i, 'field', option.props.field); this.tableDataChange(i, 'fieldName', option.props.fieldName); this.tableDataChange(i, 'varDataType', option.props.varDataType); this.tableDataChange(i, 'table', { "aliasName": "", name: option.props.table }); }}>
                    {this.state.fieldList.map((item, j) =>
                        item.fieldsList.map((item2, i) =>
                            // <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item2.value}</Select.Option>
                        )
                        // < Select.Option varDataType = { item.varDataType } value = {`${item.name}·-·${item2.code}`}>{item.value}</Select.Option>
                    )
                    }
                </Select >,
                c3: (() => {
                    switch (this.getVarDataType(element.varDataType)) {
                        case 'string':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForString.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'int':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'float':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'boolean':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForBoolean.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'time':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForDate.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        default:
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNull.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                    }
                })(),
                c4: <Switch checkedChildren="开" disabled={common.isEmpty(element.functionCode) ? true : false} defaultChecked={this.saveData.queryFields[i].fieldDistinct == 1 ? true : false} unCheckedChildren="关" onChange={(checked) => { this.tableDataChange(i, 'fieldDistinct', checked ? 1 : 0); }} />,
                c5: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
            })
        }

        return tempArray
    }

    tableDataChange = (i, name, value) => {
        console.log(` i, name, value = ${i} ${name} ${value}`);
        // console.log(this.saveData.queryFields);
        this.saveData.queryFields[i][name] = value;
        if (name === 'field' || name === 'fieldName' || name === 'varDataType') {
            if (this.saveData.tables && this.saveData.tables.length > 0) {
                // this.saveData.queryFields[i].table = {
                //     "aliasName": "",
                //     "name": ""
                // };
            } else {
                message.warning("请先选择表");
                return
            }
            if (name === 'varDataType') {
                this.saveData.queryFields[i].functionType = '';
                this.saveData.queryFields[i].functionCode = '';
                let mappings = this.renderTable(this.saveData.queryFields);
                this.setState({
                    mappings
                })
            }

        }
        if (name === 'functionType') {
            this.saveData.orderFields = [];
            this.setState({
                orderFieldsValue: []
            })
        }
        if (name === 'functionCode') {
            this.saveData.queryFields[i].fieldDistinct = 0;
            let mappings = this.renderTable(this.saveData.queryFields);
            this.setState({
                mappings
            })
        }
        if (name === 'table') {
            let mappings = this.renderTable(this.saveData.queryFields);
            this.setState({
                mappings
            })
        }
        if (this.checkQueryFieldsFinish()) {
        }
        this.setState({ index: this.state.index++ })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }

    }


    render() {
        let dataSource = common.isEmpty(this.saveData.queryFields) ? [] : this.renderTable(this.saveData.queryFields);

        const columns = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }];

        const columns2 = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }, {
            title: '',
            dataIndex: 'c5',
            key: 'c5',
        }];

        return (
            <div>
                {
                    this.saveData.mappingType == 0 ?
                        <FormBlock header="添加实时变量映射">
                            <Table dataSource={dataSource} columns={columns} pagination={false} />
                        </FormBlock>
                        :
                        <FormBlock header="添加临时变量映射">
                            <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                            <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addMappings}><Icon type="plus" theme="outlined" />添加映射</Button>
                        </FormBlock>
                }

            </div>
        )
    }
}
export default VarMappingPanel

