import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Switch, Table, Button, Divider, Icon } from 'antd';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';

@withRouter
@inject('store')
@observer
class StepFour extends Component {
    constructor(props) {
        super(props);
        this.conditionComplete = this.conditionComplete.bind(this);
        this.conditionInComplete = this.conditionInComplete.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.conditionVO = conditionVODemo
    }

    componentDidMount() {
        this.props.store.juheInfo.table.set_fenzu_dataSource(this.props.store.renderFenzuTable(this.props.store.juheInfo.getData.groupFields))
        this.props.store.juheInfo.table.set_juhe_dataSource(this.props.store.renderJuheTable(this.props.store.juheInfo.getData.aggFields))
        this.conditionVO = this.props.store.juheInfo.getData.havingConditionVO;
        this.setState({ index: Math.random() })
    }

    componentWillUnmount() {
        this.props.store.juheInfo.data.havingConditionVO = this.conditionVO;
        console.log("第四步的信息集合", this.props.store.juheInfo.getData);
    }

    conditionComplete() {//conditionAll全部条件完整才会调用此方法
    }

    conditionInComplete() {//conditionAll全部条件一旦不完整才会调用此方法
    }

    updateConditionTree(conditions, refresh) {
        console.log("SteptFour 拿到 conditionsAll", conditions);
        this.conditionVO = conditions;
        this.props.store.juheInfo.set_modify(true);
        this.props.store.havingConditionVO = conditions;
        // 解决多级“并且或者”被覆盖问题的回调刷新同步
        if (refresh) this.setState({ index: Math.random() })
    }

    render() {
        const { store } = this.props;
        const { isResource } = this.props;
        const disableAll = isResource;
        return (
            <div >
                <Divider orientation="left">分组</Divider>
                <Table scroll={{ x: store.juheInfo.table.get_fenzu_dataSource.length > 0 ? 1000 : 'auto' }} dataSource={store.juheInfo.table.get_fenzu_dataSource} columns={store.juheInfo.table.get_fenzu_columns} pagination={false} />
                <Button disabled={disableAll} type="dashed" block style={{ marginTop: '10px' }} onClick={store.addOneRowForFenzu}><Icon
                    type="plus" theme="outlined" />添加分组字段</Button>

                <Divider orientation="left" style={{ marginTop: '50px' }}>聚合</Divider>
                <Table scroll={{ x: store.juheInfo.table.get_juhe_dataSource.length > 0 ? 1000 : 'auto' }} dataSource={store.juheInfo.table.get_juhe_dataSource} columns={store.juheInfo.table.get_juhe_columns} pagination={false} />
                <Button disabled={disableAll} type="dashed" block style={{ marginTop: '10px' }} onClick={store.addOneRowForJuhe}><Icon
                    type="plus" theme="outlined" />添加聚合字段</Button>

                <Divider orientation="left" style={style.step}>
                    筛选<Switch
                        style={{ marginLeft: '10px' }}
                        disabled={disableAll}
                        size="small"
                        onChange={(checked) => {
                            if (checked) {
                                this.conditionVO = conditionVODemo;
                                store.havingConditionVO = conditionVODemo;
                                store.juheInfo.updateData('havingConditionVO', conditionVODemo);
                            } else {
                                this.conditionVO = null;
                                store.havingConditionVO = null;
                                store.juheInfo.updateData('havingConditionVO', null);
                            }
                            store.juheInfo.set_verifyConditionVO(checked);
                        }}
                        checkedChildren="启用" unCheckedChildren="关闭" checked={store.juheInfo.get_verifyConditionVO} />
                </Divider>

                {
                    store.juheInfo.get_verifyConditionVO ?
                        <TreePanel
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
                                store.juheInfo.getData.groupFields.forEach(element => {
                                    if (element.selectCode) {
                                        fieldList.push({
                                            "code": element.selectCode,
                                            "defaultValue": null,
                                            "id": "",
                                            "name": element.name,
                                            "type": element.dataType,
                                            "tableAlias": 'G',
                                            "varJson": JSON.stringify(element)
                                        })
                                    }
                                })


                                return fieldList
                            })()}
                            conditionComplete={() => { }}
                            conditionInComplete={() => { }}
                            updateConditionTree={this.updateConditionTree}
                            treeData={this.conditionVO}
                            type="having"
                        />
                        : ''
                }

            </div>
        )
    }
}
StepFour.propTypes = {
}
StepFour.defaultProps = {
}
export default StepFour

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

const style = {
    step: {
        marginTop: '40px'
    }
}
