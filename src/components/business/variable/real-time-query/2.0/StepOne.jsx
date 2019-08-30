import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Spin, Switch, Table, Select, Radio } from 'antd';
import common from '@/utils/common';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';

@withRouter
@inject('store')
@observer
class StepOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
        this.conditionVO = conditionVODemo;
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.packInFields = this.packInFields.bind(this);
        this.multiChnage = this.multiChnage.bind(this);
    }

    componentDidMount() {

        let timer = setInterval(() => {
            if (this.props.store.isLoaded) {
                console.log("this.props.store.inputInfo.getData.onConditionVO", this.props.store.inputInfo.getData.onConditionVO)
                this.conditionVO = this.props.store.inputInfo.getData.onConditionVO;
                window.clearInterval(timer);
                this.setState({ index: Math.random() })
            }
        }, 100);
    }

    componentWillUnmount() {
        // this.props.store.inputInfo.data.onConditionVO = common.deepClone(this.conditionVO);
        // console.log("第一步的信息集合", this.props.store.inputInfo.getData);
    }

    updateConditionTree(value, refresh) {
        console.log('stepOne updateConditionTree', value)
        this.conditionVO = value;
        this.props.store.inputInfo.set_modify(true);
        this.props.store.onConditionVO = value;
        // 解决多级“并且或者”被覆盖问题
        if (refresh) this.setState({ index: Math.random() })
    }


    packInFields() {
        console.log("packFields this.props.store.inputInfo.getData", this.props.store.inputInfo.getData)
        let inFields = [];
        if (this.props.store.inputInfo.getData.isMulti) {
            if (!common.isEmpty(this.props.store.inputInfo.table.get_l_selectKey)) {//左表
                let l_table = this.props.store.helper.getData.tableList.find(table => table.id === this.props.store.inputInfo.getData.leftTable.id);
                if (l_table) {
                    this.props.store.inputInfo.table.get_l_selectKey.forEach((index) => {
                        inFields.push({
                            "code": `L_${l_table.columnList[index].code}`,
                            "dataType": l_table.columnList[index].dataType,
                            "defaultValue": l_table.columnList[index].defaultValue,
                            "len": l_table.columnList[index].len,
                            "name": l_table.columnList[index].name,
                            "selectCode": l_table.columnList[index].selectCode,
                            "tableAlias": 'L'
                        })
                    })
                }
            }
            if (!common.isEmpty(this.props.store.inputInfo.table.get_r_selectKey)) {//右表

                let r_table = this.props.store.helper.getData.tableList.find(table => table.id === this.props.store.inputInfo.getData.rightTable.id);
                if (r_table) {
                    this.props.store.inputInfo.table.get_r_selectKey.forEach((index) => {
                        inFields.push({
                            "code": `R_${r_table.columnList[index].code}`,
                            "dataType": r_table.columnList[index].dataType,
                            "defaultValue": r_table.columnList[index].defaultValue,
                            "len": r_table.columnList[index].len,
                            "name": r_table.columnList[index].name,
                            "selectCode": r_table.columnList[index].selectCode,
                            "tableAlias": 'R'
                        })
                    })
                }
            }
        } else {
            if (!common.isEmpty(this.props.store.inputInfo.table.get_l_selectKey)) {//左表
                let l_table = this.props.store.helper.getData.tableList.find(table => table.id === this.props.store.inputInfo.getData.leftTable.id);
                if (l_table) {
                    this.props.store.inputInfo.table.get_l_selectKey.forEach((index) => {
                        inFields.push({
                            "code": `L_${l_table.columnList[index].code}`,
                            "dataType": l_table.columnList[index].dataType,
                            "defaultValue": l_table.columnList[index].defaultValue,
                            "len": l_table.columnList[index].len,
                            "name": l_table.columnList[index].name,
                            "selectCode": l_table.columnList[index].selectCode,
                            "tableAlias": 'L'
                        })
                    })
                }
            }
        }
        console.log("inFields", inFields)
        return inFields;
    }

    multiChnage(checked) {
        // this.props.store.inputInfo.table.l_selectKey = [];
        // this.props.store.inputInfo.table.r_selectKey = [];
        if (this.props.store.inputInfo.getData.isMulti) {//多表变单表

            // 校验 右表的字段是否被引用
            let r_fields = this.packInFields().filter((element) => element.tableAlias === 'R');
            console.log("r_fields", r_fields)
            for (let i = 0; i < r_fields.length; i++) {
                const r_field = r_fields[i];
                let field = {
                    code: `${r_field.code}`,
                    name: r_field.name
                }
                if (!this.props.store.scanning(field, 1, this.conditionVO)) return
            }

            this.props.store.inputInfo.table.setDataSource([]);
            this.props.store.helper.getData.tableList.forEach(element => {
                if (element.id === this.props.store.inputInfo.getData.leftTable.id) {
                    let columns = element.columnList;
                    columns.forEach((element, i) => {
                        element.key = i;
                    })
                    this.props.store.inputInfo.table.setDataSource(columns);
                }
            })

            this.conditionVO = conditionVODemo
            this.props.store.inputInfo.data.onConditionVO = conditionVODemo;
        } else {//单表变多表
            this.props.store.inputInfo.table.setDataSource([]);
            if (this.props.store.inputInfo.getRadioFortable === '0') {//左表
                this.props.store.helper.getData.tableList.forEach(element => {
                    if (element.id === this.props.store.inputInfo.getData.leftTable.id) {
                        let columns = element.columnList;
                        columns.forEach((element, i) => {
                            element.key = i;
                        })
                        this.props.store.inputInfo.table.setDataSource(columns);
                    }
                })
            }
            if (this.props.store.inputInfo.getRadioFortable === '1') {//右表
                this.props.store.helper.getData.tableList.forEach(element => {
                    if (element.id === this.props.store.inputInfo.getData.rightTable.id) {
                        let columns = element.columnList;
                        columns.forEach((element, i) => {
                            element.key = i;
                        })
                        this.props.store.inputInfo.table.setDataSource(columns);
                    }
                })
            }
        }
        this.props.store.inputInfo.updateData('isMulti', checked ? 1 : 0)
        this.props.store.inputInfo.setRadioFortable('0');
    }

    render() {
        const { store } = this.props;
        const { isResource } = this.props;
        const isShowSelection = !isResource;
        const rowSelection_l = isShowSelection ? {
            selectedRowKeys: store.inputInfo.table.get_l_selectKey,
            onChange: (selectedRowKeys) => {
                console.log("selectedRowKeys", selectedRowKeys)
                console.log("store.inputInfo.table.getDataSource", store.inputInfo.table.getDataSource)
                console.log("store.inputInfo.getData.inFields", store.inputInfo.getData.inFields)
                // 找出被删除的字段
                let del_indexs = [];
                store.inputInfo.table.get_l_selectKey.forEach(row_index => {
                    if (!selectedRowKeys.includes(row_index) && (() => {
                        //所选的当前行是否存在inFields中
                        let exist_in_inFields = false;
                        for (let i = 0; i < store.inputInfo.getData.inFields.length; i++) {
                            const inFields = store.inputInfo.getData.inFields[i];
                            if (inFields.tableAlias === 'L'
                                && inFields.code === store.inputInfo.table.getDataSource[row_index].code) exist_in_inFields = true
                        }
                        return exist_in_inFields
                    })()) del_indexs.push(row_index);
                })
                console.log("找出被删除的字段 del_indexs", del_indexs)
                for (let i = 0; i < del_indexs.length; i++) {
                    const index = del_indexs[i];
                    let field = {
                        code: `${store.inputInfo.table.getDataSource[index].code}`,
                        name: store.inputInfo.table.getDataSource[index].name
                    }
                    if (!store.scanning(field, 1)) return
                }

                store.inputInfo.table.l_selectKey = selectedRowKeys;
                store.inputInfo.set_modify(true);
            }
        } : null;

        const rowSelection_r = isShowSelection ? {
            selectedRowKeys: store.inputInfo.table.get_r_selectKey,
            onChange: (selectedRowKeys) => {

                console.log("selectedRowKeys", selectedRowKeys)
                console.log("store.inputInfo.table.getDataSource", store.inputInfo.table.getDataSource)
                console.log("store.inputInfo.getData.inFields", store.inputInfo.getData.inFields)
                // 找出被删除的字段
                let del_indexs = [];
                store.inputInfo.table.get_r_selectKey.forEach(row_index => {
                    if (!selectedRowKeys.includes(row_index) && (() => {
                        //所选的当前行是否存在inFields中
                        let exist_in_inFields = false;
                        for (let i = 0; i < store.inputInfo.getData.inFields.length; i++) {
                            const inFields = store.inputInfo.getData.inFields[i];
                            if (inFields.tableAlias === 'R'
                                && inFields.code === store.inputInfo.table.getDataSource[row_index].code) exist_in_inFields = true
                        }
                        return exist_in_inFields
                    })()) del_indexs.push(row_index);
                })
                console.log("找出被删除的字段 del_indexs", del_indexs)
                for (let i = 0; i < del_indexs.length; i++) {
                    const index = del_indexs[i];
                    let field = {
                        code: `${store.inputInfo.table.getDataSource[index].code}`,
                        name: store.inputInfo.table.getDataSource[index].name
                    }
                    if (!store.scanning(field, 1)) return
                }

                store.inputInfo.table.r_selectKey = selectedRowKeys;
                store.inputInfo.set_modify(true);
            }
        } : null;

        return (
            <div >
                <Spin size="large" spinning={!store.isLoaded}>
                    <div className="clearfix" style={style.row}>
                        <p style={style.label}>是否多表：</p>
                        <Switch size="small" checked={store.inputInfo.getData.isMulti === 1}
                            onChange={this.multiChnage} disabled={this.props.isResource} />
                    </div>
                    {
                        <div className="clearfix" style={style.row}>
                            {
                                store.inputInfo.getRadioFortable === '2' ?
                                    <div>
                                        <p style={style.label2}>连接方式：</p>
                                        <Select style={style.selectTable} placeholder="请选择连接方式"
                                            value={common.isEmpty(store.inputInfo.getData.joinType) ? undefined : store.inputInfo.getData.joinType}
                                            onChange={(value) => {
                                                store.inputInfo.updateData('joinType', value)
                                            }}
                                            disabled={this.props.isResource}
                                        >
                                            {
                                                store.helper.getData.joinTypeList.map((item, i) => {
                                                    return <Select.Option key={i} value={item.val} >
                                                        {item.label}
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                                    :
                                    <div>
                                        <p style={style.label2}>选择表：</p>
                                        <Select

                                            showSearch
                                            filterOption={(input, option) => String(option.props.name).toLowerCase().indexOf(input.toLowerCase()) >= 0 || String(option.props.code).toLowerCase().indexOf(input.toLowerCase()) >= 0 || String(option.props.selectCode).toLowerCase().indexOf(input.toLowerCase()) >= 0}

                                            style={style.selectTable}
                                            placeholder="请选择表"
                                            disabled={this.props.isResource}
                                            value={(() => {
                                                if (store.inputInfo.getData.isMulti) {
                                                    if (store.inputInfo.getRadioFortable === '0') {//左表
                                                        return common.isEmpty(store.inputInfo.getData.leftTable.id) ? undefined : store.inputInfo.getData.leftTable.id
                                                    }
                                                    if (store.inputInfo.getRadioFortable === '1') {//右表
                                                        return common.isEmpty(store.inputInfo.getData.rightTable.id) ? undefined : store.inputInfo.getData.rightTable.id
                                                    }
                                                } else {
                                                    return common.isEmpty(store.inputInfo.getData.leftTable.id) ? undefined : store.inputInfo.getData.leftTable.id
                                                }

                                            })()}
                                            onChange={(value, option) => {
                                                let del_indexs_L = store.inputInfo.table.get_l_selectKey;
                                                let del_indexs_R = store.inputInfo.table.get_r_selectKey;
                                                // let columns = option.props.columnList;
                                                let columns = common.deepClone(option.props.columnList);
                                                if (store.inputInfo.getData.isMulti) {
                                                    if (store.inputInfo.getRadioFortable === '0') {//左表

                                                        // 找出被删除的字段
                                                        console.log("找出被删除的字段 del_indexs_L", del_indexs_L)
                                                        for (let i = 0; i < del_indexs_L.length; i++) {
                                                            const index = del_indexs_L[i];
                                                            let field = {
                                                                code: `${store.inputInfo.table.getDataSource[index].code}`,
                                                                name: store.inputInfo.table.getDataSource[index].name
                                                            }
                                                            if (!store.scanning(field, 1)) return
                                                        }

                                                        // 更新
                                                        store.inputInfo.updateData('leftTable', {
                                                            code: option.props.code,
                                                            id: option.props.id,
                                                            name: option.props.name,
                                                            type: option.props.type//类型，1表2集合
                                                        })
                                                        store.inputInfo.table.l_selectKey = [];
                                                        columns.forEach(element => {
                                                            element.code = `L.${element.code}`
                                                        })
                                                    }
                                                    if (store.inputInfo.getRadioFortable === '1') {//右表

                                                        // 找出被删除的字段
                                                        console.log("找出被删除的字段 del_indexs_R", del_indexs_R)
                                                        for (let i = 0; i < del_indexs_R.length; i++) {
                                                            const index = del_indexs_R[i];
                                                            let field = {
                                                                code: `${store.inputInfo.table.getDataSource[index].code}`,
                                                                name: store.inputInfo.table.getDataSource[index].name
                                                            }
                                                            if (!store.scanning(field, 1)) return
                                                        }

                                                        // 更新
                                                        store.inputInfo.updateData('rightTable', {
                                                            code: option.props.code,
                                                            id: option.props.id,
                                                            name: option.props.name,
                                                            type: option.props.type//类型，1表2集合
                                                        })
                                                        store.inputInfo.table.r_selectKey = [];
                                                        columns.forEach(element => {
                                                            element.code = `R.${element.code}`
                                                        })
                                                    }
                                                } else {
                                                    // 找出被删除的字段
                                                    console.log("找出被删除的字段 del_indexs_L", del_indexs_L)
                                                    for (let i = 0; i < del_indexs_L.length; i++) {
                                                        const index = del_indexs_L[i];
                                                        let field = {
                                                            code: `${store.inputInfo.table.getDataSource[index].code}`,
                                                            name: store.inputInfo.table.getDataSource[index].name
                                                        }
                                                        if (!store.scanning(field, 1)) return
                                                    }

                                                    // 更新
                                                    store.inputInfo.updateData('leftTable', {
                                                        code: option.props.code,
                                                        id: option.props.id,
                                                        name: option.props.name,
                                                        type: option.props.type//类型，1表2集合
                                                    })
                                                    store.inputInfo.table.l_selectKey = [];
                                                    columns.forEach(element => {
                                                        element.code = `L.${element.code}`
                                                    })
                                                }


                                                columns.forEach((element, i) => {
                                                    element.key = i;
                                                })
                                                store.inputInfo.table.setDataSource(columns);
                                            }}
                                        >
                                            {
                                                store.helper.getData.tableList.map((item, i) => {
                                                    return <Select.Option key={i} value={item.id} code={item.code} selectCode={item.selectCode} id={item.id} name={item.name} type={item.type} columnList={item.columnList}>
                                                        {item.name}{common.isEmpty(item.version) ? '' : ' v' + item.version}
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                            }
                            {
                                store.inputInfo.getData.isMulti ?
                                    <Radio.Group style={style.radioTable}
                                        onChange={(e) => {
                                            store.inputInfo.setRadioFortable(e.target.value);
                                            store.inputInfo.table.setDataSource([]);
                                            switch (e.target.value) {
                                                case '0':
                                                    store.helper.getData.tableList.forEach(element => {
                                                        if (element.id === store.inputInfo.getData.leftTable.id) {
                                                            element.columnList.forEach((element, i) => {
                                                                element.key = i;
                                                            })
                                                            store.inputInfo.table.setDataSource(element.columnList);
                                                        }
                                                    })
                                                    break;
                                                case '1':
                                                    store.helper.getData.tableList.forEach(element => {
                                                        if (element.id === store.inputInfo.getData.rightTable.id) {
                                                            element.columnList.forEach((element, i) => {
                                                                element.key = i;
                                                            })
                                                            store.inputInfo.table.setDataSource(element.columnList);
                                                        }
                                                    })
                                                    break;
                                                default:

                                                    break;
                                            }
                                        }}
                                        value={store.inputInfo.getRadioFortable} >
                                        <Radio.Button value="0">左表</Radio.Button>
                                        <Radio.Button value="1">右表</Radio.Button>
                                        <Radio.Button value="2">连接</Radio.Button>
                                    </Radio.Group>
                                    : ''
                            }

                        </div>
                    }
                    {
                        store.inputInfo.getRadioFortable === '2' ?

                            (() => {
                                if (
                                    store.inputInfo.getData.joinType !== 7
                                    &&
                                    store.inputInfo.getData.joinType !== 5
                                    &&
                                    store.inputInfo.getData.joinType !== 6
                                ) {
                                    return <div className="clearfix">
                                        <p style={style.label3}>连接条件：</p>
                                        <div style={style.treePanelCell}>
                                            <TreePanel
                                                eventSourceId={store.baseInfo.getData.eventSourceId}
                                                dimensionId={store.baseInfo.getData.dimensionId}
                                                fieldList={(() => {
                                                    let fieldList = [];
                                                    let inFields = [];
                                                    if (store.inputInfo.getData.isMulti) {
                                                        if (!common.isEmpty(store.inputInfo.table.get_l_selectKey)) {//左表
                                                            store.helper.getData.tableList.forEach(table => {
                                                                if (table.id === store.inputInfo.getData.leftTable.id) {
                                                                    store.inputInfo.table.get_l_selectKey.forEach((index) => {
                                                                        inFields.push({
                                                                            "code": table.columnList[index].selectCode,
                                                                            "dataType": table.columnList[index].dataType,
                                                                            "defaultValue": table.columnList[index].defaultValue,
                                                                            "len": table.columnList[index].len,
                                                                            "name": table.columnList[index].name,
                                                                            "tableAlias": 'L',
                                                                            "varJson": JSON.stringify(table.columnList[index])
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                        if (!common.isEmpty(store.inputInfo.table.get_r_selectKey)) {//右表
                                                            store.helper.getData.tableList.forEach(table => {
                                                                if (table.id === store.inputInfo.getData.rightTable.id) {
                                                                    store.inputInfo.table.get_r_selectKey.forEach((index) => {
                                                                        inFields.push({
                                                                            "code": table.columnList[index].selectCode,
                                                                            "dataType": table.columnList[index].dataType,
                                                                            "defaultValue": table.columnList[index].defaultValue,
                                                                            "len": table.columnList[index].len,
                                                                            "name": table.columnList[index].name,
                                                                            "tableAlias": 'R',
                                                                            "varJson": JSON.stringify(table.columnList[index])
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    } else {
                                                        if (!common.isEmpty(store.inputInfo.table.get_l_selectKey)) {//左表
                                                            store.helper.getData.tableList.forEach(table => {
                                                                if (table.id === store.inputInfo.getData.leftTable.id) {
                                                                    store.inputInfo.table.get_l_selectKey.forEach((index) => {
                                                                        inFields.push({
                                                                            "code": table.columnList[index].selectCode,
                                                                            "dataType": table.columnList[index].dataType,
                                                                            "defaultValue": table.columnList[index].defaultValue,
                                                                            "len": table.columnList[index].len,
                                                                            "name": table.columnList[index].name,
                                                                            "tableAlias": 'L',
                                                                            "varJson": JSON.stringify(table.columnList[index])
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    }
                                                    inFields.forEach(element => {
                                                        fieldList.push({
                                                            "code": element.code,
                                                            "defaultValue": element.defaultValue,
                                                            "id": "",
                                                            "name": element.name,
                                                            "type": element.dataType,
                                                            "tableAlias": element.tableAlias,
                                                            "varJson": element.varJson
                                                        })
                                                    })
                                                    return fieldList
                                                })()}
                                                conditionComplete={() => { }}
                                                conditionInComplete={() => { }}
                                                updateConditionTree={this.updateConditionTree}
                                                treeData={this.conditionVO}
                                                extraType="connect"
                                            />
                                        </div>
                                    </div>
                                } else {
                                    return ''
                                }
                            })()

                            :
                            store.inputInfo.getData.isMulti ?
                                (() => {
                                    switch (store.inputInfo.getRadioFortable) {
                                        case '0':
                                            return <Table rowSelection={rowSelection_l} dataSource={(() => {
                                                let getDataSource = common.deepClone(store.inputInfo.table.getDataSource);
                                                getDataSource.forEach(element => {
                                                    element.dataType = (() => {
                                                        for (let i = 0; i < store.helper.getData.dataTypeList.length; i++) {
                                                            const element2 = store.helper.getData.dataTypeList[i];
                                                            if (element2.val == element.dataType) {
                                                                return element2.label
                                                            }
                                                        }
                                                        return ''
                                                    })()
                                                })
                                                return getDataSource
                                            })()} columns={store.inputInfo.table.getColumns} pagination={false} />

                                        case '1':
                                            return <Table rowSelection={rowSelection_r} dataSource={(() => {
                                                let getDataSource = common.deepClone(store.inputInfo.table.getDataSource);
                                                getDataSource.forEach(element => {
                                                    element.dataType = (() => {
                                                        for (let i = 0; i < store.helper.getData.dataTypeList.length; i++) {
                                                            const element2 = store.helper.getData.dataTypeList[i];
                                                            if (element2.val == element.dataType) {
                                                                return element2.label
                                                            }
                                                        }
                                                        return ''
                                                    })()
                                                })
                                                return getDataSource
                                            })()} columns={store.inputInfo.table.getColumns} pagination={false} />

                                        default:
                                            break;
                                    }
                                })()
                                :
                                <Table rowSelection={rowSelection_l} dataSource={(() => {
                                    let getDataSource = common.deepClone(store.inputInfo.table.getDataSource);
                                    getDataSource.forEach(element => {
                                        element.dataType = (() => {
                                            for (let i = 0; i < store.helper.getData.dataTypeList.length; i++) {
                                                const element2 = store.helper.getData.dataTypeList[i];
                                                if (element2.val == element.dataType) {
                                                    return element2.label
                                                }
                                            }
                                            return ''
                                        })()
                                    })
                                    return getDataSource
                                })()} columns={store.inputInfo.table.getColumns} pagination={false} />
                    }
                </Spin>


            </div>
        )
    }
}
StepOne.propTypes = {
}
StepOne.defaultProps = {
}
export default StepOne

const style = {
    label: {
        float: 'left',
        height: '22px',
        lineHeight: '22px',
        width: 'fit-content',
        marginRight: '5px'
    },
    label2: {
        float: 'left',
        height: '32px',
        lineHeight: '32px',
        width: 'fit-content',
        marginRight: '5px'
    },
    label3: {
        float: 'left',
        height: '32px',
        lineHeight: '32px',
        width: 'fit-content',
        margin: '7px 5px 0 0'
    },
    treePanelCell: {
        float: 'left',
        width: 'calc(100% - 80px)'
    },
    row: {
        margin: '30px 0'
    },
    selectTable: {
        float: 'left',
        minWidth: '150px'
    },
    radioTable: {
        float: 'right'
    }
}

const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCategoryType": 1,
            "varTableAlias": "",
            "varType": '',
            "varDataType": "",
            "varCode": "",
            "varName": "",
            "varDefaultValue": "",
            "varValue": "",

            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": ""
        },
        "nodeType": 1
    }
    ]
}