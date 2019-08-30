import React from 'react';
import { Input, Select, Table, Button, Icon, Divider } from 'antd';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import AddSub from '@/components/process-tree/AddSub';
import { inject, observer } from 'mobx-react';
import variableService from '@/api/business/variableService';

const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type',
}, {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
}, {
    title: '',
    dataIndex: 'action',
    key: 'action',
}];

@inject("editorStore")
@observer
class TempVarPanel extends React.Component {
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.addTempVar = this.addTempVar.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.state = {
            tempVars: [],
            index: 0,
            dataTypeList: []
        }
    }

    componentDidMount() {
        this.getDataTypeList();
        let tempVars = this.renderTable(this.props.editorStore.baseInfo.getTempVar);
        console.log("componentDidMount tempVars", tempVars);
        this.setState({
            tempVars: tempVars
        })
    }

    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }

    tableDataChange = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        let tempVars = this.props.editorStore.baseInfo.getTempVars;
        if (name === 'code') {
            tempVars[i][name] = value.replace(/[^\w_]/g, '');
        } else {
            tempVars[i][name] = value;
        }
        if (name === 'type') {
            tempVars[i].defaultValue = '';
            this.setState({
                tempVars: this.renderTable(tempVars)
            })
        }
        this.props.editorStore.baseInfo.setTempVars(tempVars);
        this.setState({
            index: this.state.index++
        })
    }

    addTempVar = () => {
        let tempArray = this.state.tempVars;
        const key = tempArray.length;
        let uuid = common.getGuid();
        tempArray.push({
            key: uuid,
            name: <Input style={{ width: '120px' }} onChange={(e) => this.tableDataChange(key, 'name', e.target.value)} />,
            code: <Input style={{ width: 'auto' }} onChange={(e) => this.tableDataChange(key, 'code', e.target.value)} />,
            type: <Select style={{ width: '109px' }} onChange={(value) => this.tableDataChange(key, 'type', value)}>
                {this.state.dataTypeList.map((item, i) =>
                    <Select.Option value={item.code}>{item.value}</Select.Option>
                )}
            </Select>,
            defaultValue: <FixedValue type="defaultValueForList" changeData={this.tableDataChange} index={key} />,
            action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
        });
        let tempVars = this.props.editorStore.baseInfo.getTempVars;
        tempVars.push({
            "code": "",
            "defaultValue": "",
            "name": "",
            "type": ""
        })
        this.props.editorStore.baseInfo.setTempVars(tempVars);
        this.setState({
            tempVars: tempArray
        })
    }

    subTempVars = (key) => {
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.state.tempVars.length; i++) {
            const element = this.state.tempVars[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }
        let tempVars = this.props.editorStore.baseInfo.getTempVars;
        tempVars.splice(arrayIndex, 1);
        this.props.editorStore.baseInfo.setTempVars(tempVars);
        var tempArray2 = this.renderTable(tempVars);
        this.setState({
            tempVars: tempArray2
        })
    }

    renderTable(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        let tempVars = this.props.editorStore.baseInfo.getTempVars;
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                name: <Input defaultValue={element.name} style={{ width: '120px' }} onChange={(e) => this.tableDataChange(i, 'name', e.target.value)} />,
                code: <Input disabled={common.isEmpty(tempVars[i].id) ? false : true} style={{ width: 'auto' }} title={element.code} defaultValue={element.code} onChange={(e) => this.tableDataChange(i, 'code', e.target.value)} />,
                type: <Select defaultValue={element.type} style={{ width: '109px' }} onChange={(value) => this.tableDataChange(i, 'type', value)} >
                    {this.state.dataTypeList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>,
                defaultValue: <FixedValue type="defaultValueForList" value={element.defaultValue} changeData={this.tableDataChange} dataType={element.type} index={i} />,
                action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
            })
        }
        return tempArray
    }

    render() {
        return (
            <div>
                <Divider orientation="left">临时变量</Divider>
                <Table dataSource={this.state.tempVars} columns={columns} pagination={false} />
                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addTempVar}><Icon type="plus" theme="outlined" />添加临时变量</Button>

            </div>
        )
    }
}
export default TempVarPanel