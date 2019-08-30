import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { message, Icon, Switch, Button, Transfer, Divider } from 'antd';
import common from '@/utils/common';
import DragSortingTable from '@/components/DragSortingTable';

@withRouter
@inject('store')
@observer
class StepFive extends Component {
    constructor(props) {
        super(props);
        this.changeKey = this.changeKey.bind(this);
        this.dragSortCallBackFunc = this.dragSortCallBackFunc.bind(this);
    }

    
    componentDidMount() {
        let aggFields = common.deepClone(this.props.store.juheInfo.getData.aggFields);
        let groupFields = common.deepClone(this.props.store.juheInfo.getData.groupFields);

        if (this.props.store.baseInfo.getData.rtqVarType === 'RTQVAR') {//实时变量

        } else {//实时集合
            if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合
                // this.props.store.outputInfo.updateData('outFields', [...groupFields, ...aggFields]);
            } else {
                // this.props.store.outputInfo.updateData('outFields', [...inFields, ...extendFields]);
            }
        }


        this.props.store.outputInfo.table.setDataSource(this.props.store.renderOrderTable(this.props.store.outputInfo.getData.orderFields));
        console.log("this.props.store.outputInfo.table.getDataSource", this.props.store.outputInfo.table.getDataSource)
    }

    componentWillUnmount() {
        console.log("第五步的信息集合", this.props.store.outputInfo.getData);
    }

    changeKey(keys) {
        console.log("keys", keys)
        let data = [];
        let inFields = common.deepClone(this.props.store.inputInfo.getData.inFields);
        let extendFields = common.deepClone(this.props.store.extInfo.getData.extendFields);
        let aggFields = common.deepClone(this.props.store.juheInfo.getData.aggFields);
        let groupFields = common.deepClone(this.props.store.juheInfo.getData.groupFields);

        // 加工数据
        inFields.forEach(element => {
            element.wholeCode = element.wholeCode ? element.wholeCode : `${element.code}`;
        })
        aggFields.forEach(element => {
            element.wholeCode = element.wholeCode ? element.wholeCode : `${element.selectCode}`
            element.selectCode = element.wholeCode;
            element.aggFieldVO = {
                code: element.code,
                dataType: element.dataType,
                defaultValue: element.defaultValue,
                fun: element.fun,
                len: element.len,
                name: element.name,
                selectCode: element.selectCode,
                tableAlias: element.tableAlias,
                wholeCode: element.wholeCode
            }
        })
        extendFields.forEach(element => {
            element.wholeCode = element.wholeCode ? element.wholeCode : `${element.code}`;
            element.selectCode = element.wholeCode;
            element.extendFieldVO = {
                code: element.code,
                dataType: element.dataType,
                defaultValue: element.defaultValue,
                func: element.func,
                len: '',
                name: element.name,
                selectCode: element.selectCode,
                tableAlias: element.tableAlias,
                wholeCode: element.wholeCode,
                expression: '',
                expressionDesc: '',
                extendType: element.extendType,
                mappingList: [],
                computeExpressionVO: element.computeExpressionVO
            }
        })
        groupFields.forEach(element => {
            element.wholeCode = element.wholeCode ? element.wholeCode : `${element.tableAlias}.${element.code}`;
            element.groupFieldVO = {
                code: element.code,
                dataType: element.dataType,
                defaultValue: element.defaultValue,
                len: '',
                name: element.name,
                selectCode: element.selectCode,
                tableAlias: element.tableAlias,
                wholeCode: element.wholeCode
            }
        })

        if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合
            if (this.props.store.baseInfo.getData.rtqVarType === 'RTQVAR') {//实时变量
                //输入，衍生 此时都要做数据类型的过滤
                //过滤
                for (let i = 0; i < keys.length; i++) {
                    const element = keys[i];
                    let dataType = this.props.store.baseInfo.getData.dataType;
                    if (dataType !== [...groupFields, ...aggFields][element].dataType) {
                        let dataTypeName = '';
                        this.props.store.helper.getData.dataTypeList.forEach(element2 => {
                            if (element2.val === dataType) {
                                dataTypeName = element2.label;
                            }
                        })
                        message.warning(`只能选择输出${dataTypeName}的字段`);
                        return
                    }
                }
            } else {//实时集合
                // todo  暂无限制
            }

            //赋值
            keys.forEach(element => {
                data.push([...groupFields, ...aggFields][element]);
            })
        } else {
            if (this.props.store.baseInfo.getData.rtqVarType === 'RTQVAR') {//实时变量
                //输入，衍生 此时都要做数据类型的过滤
                //过滤
                for (let i = 0; i < keys.length; i++) {
                    const element = keys[i];
                    let dataType = this.props.store.baseInfo.getData.dataType;
                    if (dataType !== [...inFields, ...extendFields][element].dataType) {
                        let dataTypeName = '';
                        this.props.store.helper.getData.dataTypeList.forEach(element2 => {
                            if (element2.val === dataType) {
                                dataTypeName = element2.label;
                            }
                        })
                        message.warning(`只能选择输出${dataTypeName}的字段`);
                        return
                    }
                }
            } else {//实时集合
                // todo  暂无限制
            }

            //赋值
            keys.forEach(element => {
                data.push([...inFields, ...extendFields][element]);
            })
        }
        console.log("data", data)
        this.props.store.outputInfo.updateData('outFields', data);
    }

    dragSortCallBackFunc(dragIndex, hoverIndex) {
        console.log("dragIndex, hoverIndex", dragIndex, hoverIndex);
        //sort数组排序 start
        let sort = common.deepClone(this.props.store.outputInfo.getData.orderFields);
        let sortBK = common.deepClone(this.props.store.outputInfo.getData.orderFields);
        sortBK.splice(dragIndex, 1);//删除
        sortBK.splice(hoverIndex, 0, sort[dragIndex]);//增加
        this.props.store.outputInfo.updateData('orderFields', sortBK);
        this.props.store.outputInfo.table.setDataSource(this.props.store.renderOrderTable(this.props.store.outputInfo.getData.orderFields));
        // end
        console.log("branchMapNew", sortBK)
    }

    render() {
        const { store } = this.props;
        const { isResource } = this.props;
        const disableAll = isResource;
        return (<div >
            <Divider orientation="left">输出</Divider>
            <Transfer
                disabled={ disableAll }
                dataSource={(() => {
                    let dataSource = [];
                    let inFields = common.deepClone(store.inputInfo.getData.inFields);
                    let extendFields = common.deepClone(store.extInfo.getData.extendFields);
                    let aggFields = common.deepClone(store.juheInfo.getData.aggFields);
                    let groupFields = common.deepClone(store.juheInfo.getData.groupFields);
                    console.log("[...groupFields, ...aggFields]", [...groupFields, ...aggFields])
                    if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合
                        groupFields.forEach(element => {
                            element.name_cn = `分组.${element.name}`;
                        })
                        aggFields.forEach(element => {
                            // element.name_cn = `聚合.${element.fun}(${element.tableAlias}.${element.name})`;
                            element.name_cn = (() => {
                                for (let i = 0; i < store.helper.getData.functionTypeList.length; i++) {
                                    const element2 = store.helper.getData.functionTypeList[i];
                                    if (element2.val === element.fun) {
                                        let fun = store.helper.getData.functionTypeList.find(item => item.val === element.fun)
                                        let funName = '未知函数'
                                        if (fun) {
                                            funName = fun.label
                                        }
                                        return `聚合.${funName}(${element.name})`
                                    }
                                }
                            })()
                        })
                        dataSource = [...groupFields, ...aggFields];
                        dataSource.forEach((element, i) => {
                            element.key = i;
                        })
                    } else {
                        dataSource = [...inFields, ...extendFields];
                        dataSource.forEach((element, i) => {
                            element.key = i;
                            switch (element.tableAlias) {
                                case 'L':
                                    element.name_cn = '左表.' + element.name;
                                    break;
                                case 'R':
                                    element.name_cn = '右表.' + element.name;
                                    break;
                                default:
                                    element.name_cn = '衍生.' + element.name;
                                    break;
                            }
                        })
                    }

                    console.log("dataSource", dataSource)
                    return dataSource
                })()}
                showSearch
                listStyle={{
                    width: 334,
                    height: 500,
                }}
                operations={['加入', '移除']}
                targetKeys={(() => {
                    let targetKeys = [];
                    store.outputInfo.getData.outFields.forEach((element) => {

                        let inFields = common.deepClone(store.inputInfo.getData.inFields);
                        let extendFields = common.deepClone(store.extInfo.getData.extendFields);
                        let aggFields = common.deepClone(store.juheInfo.getData.aggFields);
                        let groupFields = common.deepClone(store.juheInfo.getData.groupFields);
                        console.log("aggFields", aggFields)
                        if (store.baseInfo.getData.rtqVarType === 'RTQVAR') {//实时变量
                            if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合

                                [...groupFields, ...aggFields].forEach((element2, j) => {
                                    if (element.code === element2.code && element.tableAlias === element2.tableAlias) {
                                         if (element2.tableAlias === 'A') {
                                            if (element.aggFieldVO.fun === element2.fun) {
                                                targetKeys.push(j)
                                            }
                                        } else {
                                            targetKeys.push(j)
                                        }
                                    }
                                })
                            } else {

                                [...inFields, ...extendFields].forEach((element2, j) => {
                                    if (element.code === element2.code && element.tableAlias === element2.tableAlias) {
                                        targetKeys.push(j)
                                    }
                                })
                            }
                        } else {//实时集合
                            if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合

                                [...groupFields, ...aggFields].forEach((element2, j) => {
                                    if (element.code === element2.code && element.tableAlias === element2.tableAlias) {
                                        if (element2.tableAlias === 'A') {
                                            if (element.aggFieldVO.fun === element2.fun) {
                                                targetKeys.push(j)
                                            }
                                        } else {
                                            targetKeys.push(j)
                                        }
                                    }
                                })
                            } else {

                                [...inFields, ...extendFields].forEach((element2, j) => {
                                    if (element.code === element2.code && element.tableAlias === element2.tableAlias) {
                                        targetKeys.push(j)
                                    }
                                })
                            }
                        }



                    })
                    console.log("targetKeys", targetKeys)
                    return targetKeys
                })()}
                onChange={this.changeKey}
                render={item => `${item.name_cn}`}
            />

            <div style={style.order}>
                是否排序
                    <Switch disabled={ disableAll } style={style.kaiguan} size="small" checked={store.outputInfo.get_isOrder} onChange={(checked) => {
                    if (checked) {
                        store.outputInfo.set_isOrder(checked);
                    } else {
                        store.outputInfo.updateData('orderFields', []);
                        store.outputInfo.set_isOrder(false);
                    }
                }} />
            </div>

            {
                store.outputInfo.get_isOrder ?
                    <div>
                        <DragSortingTable
                            dataSource={store.outputInfo.table.getDataSource}
                            columns={orderColumns}
                            callBackFunc={this.dragSortCallBackFunc}
                        />
                        <Button type="dashed" block style={{ marginTop: '10px' }} onClick={store.addOneRowForOrder}><Icon
                            type="plus" theme="outlined" />添加输出字段</Button>
                    </div> : ''
            }



        </div>
        )
    }
}
StepFive.propTypes = {
}
StepFive.defaultProps = {
}
export default StepFive

const style = {
    order: {
        margin: '30px 0'
    },
    kaiguan: {
        marginLeft: '10px'
    }
}


const orderColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '50px',
        key: 'index',
    },
    {
        title: '字段名称',
        dataIndex: 'name',
        width: '200px',
        key: 'name',
    },
    {
        title: '标识',
        dataIndex: 'code',
        width: '150px',
        key: 'code',
    },
    {
        title: '数据类型',
        dataIndex: 'dataType',
        width: '100px',
        key: 'dataType',
    },
    {
        title: '长度',
        dataIndex: 'len',
        width: '80px',
        key: 'len',
    },
    {
        title: '类型',
        dataIndex: 'from',
        width: '150px',
        key: 'from',
    },
    {
        title: '排序方式',
        dataIndex: 'order',
        width: '150px',
        key: 'order',
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: '100px',
        // fixed: 'right',
        key: 'action',
    }
]

