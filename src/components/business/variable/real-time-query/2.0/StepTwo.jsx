import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Table, Button, Select, Divider, Icon, Cascader } from 'antd';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';
import CountExpression from '@/components/countExpression/Panel.jsx';
import Guide from '@/components/countExpression/Guide.jsx';

@withRouter
@inject('store')
@observer
class StepTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guideVisible: false,
            guideCurrentStep: 1,
            VAR_SELECTION_ALL: [],//字符串
            VAR_SELECTION_DECIMAL: [],//单双精度
            VAR_SELECTION_INTEGER: [],//整型，长整型
            VAR_SELECTION_NUMBER: [],//浮点型
            VAR_SELECTION_TIMESTAMP: [],//时间类型
            VAR_SELECTION_VARCHAR: []//变量
        }
        this.updateExpressionTree = this.updateExpressionTree.bind(this);
        this.computeExpressionVO = computeExpressionVODemo
    }

    componentDidMount() {
        this.props.store.extInfo.table.setDataSource(this.props.store.renderExtTable(this.props.store.extInfo.getData.extendFields));
    }

    componentWillUnmount() {
        console.log("第二步的信息集合", this.props.store.extInfo.getData);
    }

    updateExpressionTree(value) {
        // let computeExpressionVO = this.props.store.extInfo.get_editData.computeExpressionVO;
        this.computeExpressionVO = value;
        // this.props.store.extInfo.updateEditData('computeExpressionVO', computeExpressionVO);
    }

    render() {
        const { isResource } = this.props;
        const disableAll = isResource;
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        const { store } = this.props;

        let extendFields = store.extInfo.getData.extendFields;

        return (
            <div >
                <Divider orientation="left">衍生</Divider>
                <Table scroll={{ x: store.extInfo.table.getDataSource.length > 0 ? 1200 : 'auto' }} dataSource={store.extInfo.table.getDataSource} columns={store.extInfo.table.getColumns} pagination={false} />
                <Button disabled={disableAll} type="dashed" block style={{ marginTop: '10px' }} onClick={store.addOneRowForExt}><Icon
                    type="plus" theme="outlined" />添加字段</Button>

                {
                    common.isEmpty(store.extInfo.get_editIndex) ? '' :
                        <div>
                            <Modal
                                title="函数"
                                visible={store.extInfo.modal.func.value}
                                onOk={() => {

                                    if (!store.scanning({ code: `${extendFields[store.extInfo.get_editIndex].code}`, name: extendFields[store.extInfo.get_editIndex].name }, 2)) return

                                    store.extInfo.modal.func.hide();
                                    extendFields[store.extInfo.get_editIndex].func = store.extInfo.get_editData.func;
                                    store.extInfo.updateData('extendFields', extendFields)
                                    store.extInfo.set_modify(true);
                                }}
                                onCancel={() => {
                                    store.extInfo.modal.func.hide();
                                }}
                                wrapClassName="params-modal"
                                destroyOnClose={true}
                            >

                                <div >
                                    <Divider orientation="left">选择函数</Divider>
                                    <Select style={{ minWidth: '200px' }}
                                        size="small"
                                        value={store.extInfo.get_editData.func.fun}
                                        onChange={(value, option) => {
                                            let func = store.extInfo.get_editData.func;
                                            func.fun = value;
                                            func.paraList = option.props.params;
                                            store.extInfo.updateEditData('func', func);

                                            // extendFields[store.extInfo.get_editIndex].func = func;
                                            // store.extInfo.updateData('extendFields', extendFields)
                                            // console.log("store.extInfo.getData.extendFields[store.extInfo.get_editIndex]", store.extInfo.getData.extendFields[store.extInfo.get_editIndex])
                                            // store.extInfo.set_modify(true);
                                        }}
                                    >
                                        {/* {
                                            (() => {
                                                let functionComputeTypeList = [];
                                                store.helper.getData.functionComputeTypeList.forEach(element => {
                                                    let base = store.extInfo.get_editData.base;
                                                    let datatype = base.dataType;
                                                    if (publicUtils.getVarDataType(datatype) === 'int' || publicUtils.getVarDataType(datatype) === 'float') {
                                                        if (publicUtils.getVarDataType(element.dataTypeOrdinal) === 'int' || publicUtils.getVarDataType(element.dataTypeOrdinal) === 'float') {
                                                            functionComputeTypeList.push(element)
                                                        }
                                                    } else {
                                                        if (element.dataTypeOrdinal === datatype) {
                                                            functionComputeTypeList.push(element)
                                                        }
                                                    }
                                                })
                                                return functionComputeTypeList
                                            })().map((item, i) =>
                                                <Select.Option value={item.val} key={i} label={item.label} params={item.params}>{item.label}</Select.Option>
                                            )
                                        } */}
                                        {/* 达明给的修改需求是： 不做类型限制，全部都能选 */}
                                        {
                                            store.helper.getData.functionComputeTypeList.map((item, i) =>
                                                <Select.Option value={item.val} key={i} label={item.label} params={item.params}>{item.label}</Select.Option>
                                            )
                                        }
                                    </Select>
                                    <Divider orientation="left" style={{ marginTop: '40px' }}>选择参数</Divider>
                                    {
                                        store.extInfo.get_editData.func.paraList.map((item, i) =>
                                            (() => {
                                                switch (item.formType) {
                                                    case 1:
                                                        return <div style={style.paramsCell}> {item.name}：
                                                            <FixedValue
                                                                key={i}
                                                                style={{ width: item.dataType === 'DATE' ? '165px' : 'fit-content' }}
                                                                size="small" type="tree"
                                                                value={item.value}
                                                                changeData={(name, value) => {
                                                                    // let paraList = store.extInfo.getData.extendFields[store.extInfo.get_editIndex].func.paraList;
                                                                    // paraList[i].value = value;
                                                                    // store.extInfo.updateData('extendFields', store.extInfo.getData.extendFields);

                                                                    let func = store.extInfo.get_editData.func;
                                                                    func.paraList[i].value = value;
                                                                    store.extInfo.updateEditData('func', func);
                                                                }}
                                                                dataType={(() => {
                                                                    switch (item.dataType) {
                                                                        case 'STRING':
                                                                            return 12
                                                                        case 'OBJECT':
                                                                            return 12
                                                                        case 'INTEGER':
                                                                            return 5
                                                                        case 'FLOAT':
                                                                            return 3
                                                                        case 'DATE':
                                                                            return 93
                                                                        default:
                                                                            return ''
                                                                    }
                                                                })()} />
                                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                let newItem = common.deepClone(item);
                                                                newItem.value = '';
                                                                newItem.varType = '';
                                                                paraList.splice(i + 1, 0, newItem);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                paraList.splice(i, 1);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                        </div>
                                                    case 2:
                                                        return <div style={style.paramsCell}>
                                                            {item.name}：<Select key={i} style={{ minWidth: '100px', width: 'fit-content' }} size="small" placeholder="请选择参数"
                                                                onChange={(value, option) => {
                                                                    let func = store.extInfo.get_editData.func;
                                                                    func.paraList[i].value = option.props.val;
                                                                    store.extInfo.updateEditData('func', func);
                                                                }}
                                                                value={common.isEmpty(item.value) ? undefined : item.value}
                                                            >
                                                                {
                                                                    item.dataSources.map((item2, j) =>
                                                                        <Select.Option key={j} value={item2.val} val={item2.val} label={item2.label}>{item2.label}</Select.Option>
                                                                    )
                                                                }
                                                            </Select>
                                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                let newItem = common.deepClone(item);
                                                                newItem.value = '';
                                                                newItem.varType = '';
                                                                paraList.splice(i + 1, 0, newItem);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                paraList.splice(i, 1);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                        </div>
                                                    case 3:
                                                        return <div style={style.paramsCell}> {item.name}：<Cascader style={{ minWidth: '100px', width: 'fit-content' }} allowClear={false} size="small"
                                                            displayRender={label => label[1]}
                                                            onChange={(value, selectedOptions) => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                paraList[i].varType = selectedOptions[0].type;
                                                                paraList[i].value = selectedOptions[1].value;
                                                                paraList[i].dbDataType = selectedOptions[1].type;
                                                                paraList[i].defaultValue = selectedOptions[1].defaultValue;
                                                                paraList[i].tableAlias = selectedOptions[1].tableAlias;
                                                                paraList[i].name = selectedOptions[1].name;
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }}
                                                            options={(() => {
                                                                switch (item.dataType) {
                                                                    case 'STRING':
                                                                        return store.helper.getData.VAR_SELECTION_VARCHAR
                                                                    case 'OBJECT':
                                                                        return store.helper.getData.VAR_SELECTION_VARCHAR
                                                                    case 'INTEGER':
                                                                        return store.helper.getData.VAR_SELECTION_NUMBER
                                                                    case 'FLOAT':
                                                                        return store.helper.getData.VAR_SELECTION_NUMBER
                                                                    case 'DATE':
                                                                        return store.helper.getData.VAR_SELECTION_TIMESTAMP
                                                                    case 'UNLIMITED':
                                                                        return store.helper.getData.VAR_SELECTION_ALL
                                                                    default:
                                                                        console.warn("未知数据类型");
                                                                        return []
                                                                }
                                                            })()}
                                                            fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                            placeholder="请选择参数"
                                                            showSearch={{ filter }}
                                                            value={[item.varType, item.value]}
                                                        />
                                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                let newItem = common.deepClone(item);
                                                                newItem.value = '';
                                                                newItem.varType = '';
                                                                paraList.splice(i + 1, 0, newItem);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                                let func = store.extInfo.get_editData.func;
                                                                let paraList = func.paraList;
                                                                paraList.splice(i, 1);
                                                                func.paraList = paraList;
                                                                store.extInfo.updateEditData('func', func);
                                                            }} />
                                                        </div>
                                                    default:
                                                        return <div></div>
                                                }
                                            })()

                                        )

                                    }
                                </div>

                            </Modal>

                            <Modal
                                title={
                                    <Fragment>
                                        计算公式编辑<Icon type="question-circle" style={{ marginLeft: '10px', cursor: 'pointer' }} title="操作指引" onClick={() => this.setState({ guideVisible: true })} />
                                    </Fragment>
                                }
                                visible={store.extInfo.modal.count.value}
                                onOk={() => {

                                    if (!store.scanning({ code: `${extendFields[store.extInfo.get_editIndex].code}`, name: extendFields[store.extInfo.get_editIndex].name }, 2)) {
                                        store.extInfo.table.setDataSource(store.renderExtTable(store.extInfo.getData.extendFields));
                                        return
                                    }


                                    extendFields[store.extInfo.get_editIndex].computeExpressionVO = store.extInfo.get_editData.computeExpressionVO;
                                    store.extInfo.updateData('extendFields', extendFields)
                                    store.extInfo.set_modify(true);


                                    if (!store.verifyExtConfig(extendFields[store.extInfo.get_editIndex].extendType, extendFields[store.extInfo.get_editIndex])) return false
                                    store.extInfo.updateEditData('computeExpressionVO', this.computeExpressionVO);
                                    store.extInfo.modal.count.hide();
                                }}
                                onCancel={() => {
                                    store.extInfo.modal.count.hide();
                                }}
                                destroyOnClose={true}
                                style={{ height: '300px', width: '700px' }}
                                width={700}
                            >
                                <div style={{ overflowX: 'auto' }}>
                                    <div className="clearfix" style={{ width: '2000px', marginTop: '5px' }}>
                                        <CountExpression
                                            eventSourceId={store.baseInfo.getData.eventSourceId}
                                            dimensionId={store.baseInfo.getData.dimensionId}
                                            fieldList={(() => {
                                                let fieldList = [];

                                                store.inputInfo.getData.inFields.forEach(element => {
                                                    fieldList.push({
                                                        "code": element.selectCode,
                                                        "defaultValue": element.defaultValue,
                                                        "id": "",
                                                        "name": element.name,
                                                        "type": element.dataType,
                                                        "tableAlias": element.tableAlias,
                                                        "varJson": JSON.stringify(element)
                                                    })
                                                })

                                                return fieldList
                                            })()}
                                            update={this.updateExpressionTree}
                                            computeExpressionVO={store.extInfo.get_editData.computeExpressionVO}
                                            entityType={1}
                                        />
                                    </div>
                                </div>

                            </Modal>

                            <Modal
                                title='操作指引'
                                visible={this.state.guideVisible}
                                onOk={() => this.setState({ guideVisible: false, guideCurrentStep: 1 })}
                                onCancel={() => this.setState({ guideVisible: false, guideCurrentStep: 1 })}
                                destroyOnClose={true}
                                style={{ height: '300px', width: '700px' }}
                                width={815}
                                // footer={[
                                //     this.state.guideCurrentStep !== 1 ?
                                //         <Button key="back" onClick={() => {
                                //             let current = this.state.guideCurrentStep;
                                //             current -= 1
                                //             this.setState({ guideCurrentStep: current })
                                //         }}>
                                //             上一步
                                //     </Button>
                                //         : ''
                                //     ,
                                //     this.state.guideCurrentStep !== 3? 
                                //     <Button key="submit" type="primary" onClick={() => {
                                //         let current = this.state.guideCurrentStep;
                                //         current += 1
                                //         this.setState({ guideCurrentStep: current })
                                //     }}>
                                //         下一步
                                //     </Button>
                                //     :
                                //     <Button key="submit" type="primary" onClick={() => {
                                //         this.setState({ guideVisible: false, guideCurrentStep: 1 })
                                //     }}>
                                //         关闭
                                //     </Button>
                                // ]}
                                footer={[
                                    <Button key="submit" type="primary" onClick={() => {
                                        this.setState({ guideVisible: false, guideCurrentStep: 1 })
                                    }}>
                                        关闭
                                    </Button>
                                ]}
                            >
                                <Guide current={this.state.guideCurrentStep} />
                            </Modal>

                        </div>
                }

            </div>
        )
    }
}
StepTwo.propTypes = {
}
StepTwo.defaultProps = {
}
export default StepTwo

const style = {
    paramsCell: {
        marginBottom: '10px'
    }
}
const computeExpressionVODemo = {
    "key": "0",
    "computeOperator": "PLUS",
    "computeVarVO": {
        "categoryType": 1,//0固定值，1变量
        "code": "",
        "tableAlias": "",
        "type": 0,
        "value": "",
        "name": "",
        "dataType": ""
    },
    "fieldList": [{
        "key": "0-0",
        "computeOperator": "PLUS",
        "computeVarVO": {
            "categoryType": 1,//0固定值，1变量
            "code": "",
            "tableAlias": "",
            "type": 0,
            "value": "",
            "name": "",
            "dataType": ""
        },
        "fieldList": [],
        "type": 1 //类型，1是计算变量， 2是计算表达式（或有括号）
    }],
    "type": 2 //类型，1是计算变量， 2是计算表达式（或有括号）
}