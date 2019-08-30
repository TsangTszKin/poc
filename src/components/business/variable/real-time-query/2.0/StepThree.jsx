import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Divider } from 'antd';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';

@withRouter
@inject('store')
@observer
class StepThree extends Component {
    constructor(props) {
        super(props);
        this.conditionComplete = this.conditionComplete.bind(this);
        this.conditionInComplete = this.conditionInComplete.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.conditionVO = conditionVODemo;
    }


    componentDidMount() {
        this.conditionVO = this.props.store.filterInfo.getData.whereConditionVO;
        this.setState({ index: Math.random() })
    }

    componentWillUnmount() {
        this.props.store.filterInfo.data.whereConditionVO = this.conditionVO;
        console.log("第三步的信息集合", this.props.store.filterInfo.getData);
        this.props.store.packConfig();
    }
    
    conditionComplete() {//conditionAll全部条件完整才会调用此方法
    }

    conditionInComplete() {//conditionAll全部条件一旦不完整才会调用此方法
    }

    updateConditionTree(value, refresh) {
        this.props.store.filterInfo.updateData('whereConditionVO', value);
        this.conditionVO = value;
        this.props.store.filterInfo.set_modify(true);
        // 解决多级“并且或者”被覆盖问题的回调刷新同步
        if (refresh) this.setState({ index: Math.random() })
    }
    
    render() {
        const { store } = this.props;
        const { isResource } = this.props;
        const disableAll = isResource;
        return (
            <div >
                <Divider orientation="left">条件</Divider>
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
                        store.extInfo.getData.extendFields.forEach(element => {
                            element.tableAlias = 'E';
                            fieldList.push({
                                "code": element.code,
                                "defaultValue": element.defaultValue,
                                "id": "",
                                "name": element.name,
                                "type": element.dataType,
                                "tableAlias": 'E',
                                "varJson": JSON.stringify(element)
                            })
                        })
                        console.log("store.extInfo.getData.extendFields", store.extInfo.getData.extendFields)
                        console.log("fieldList", fieldList)
                        return fieldList
                    })()}
                    conditionComplete={() => { }}
                    conditionInComplete={() => { }}
                    updateConditionTree={this.updateConditionTree}
                    treeData={this.conditionVO}
                    disabled={ disableAll }
                />

                {/* <Divider orientation="left">SQL</Divider>
                <Code sqlCode={store.filterInfo.getData.sql} type={1} /> */}
            </div>
        )
    }
}
StepThree.propTypes = {
    // conditions: PropTypes.object
}
StepThree.defaultProps = {
    // conditions: conditionVODemo
}
export default StepThree

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
            "varParas": [
                // {
                //   "code": "string",
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ],

            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": "",
            "valueParas": [
                // {
                //   "code": "string",
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ],
        },
        "nodeType": 1
    }
    ]
}




