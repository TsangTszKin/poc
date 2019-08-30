import React from 'react';
import { Input, Select, Table, Button, Icon, Divider } from 'antd';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import AddSub from '@/components/process-tree/AddSub';
import { inject, observer } from 'mobx-react';
import variableService from '@/api/business/variableService';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';
import PropTypes from 'prop-types';

@inject("editorStore")
@observer
class BranchConditionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.conditionComplete = this.conditionComplete.bind(this);
        this.conditionInComplete = this.conditionInComplete.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.conditionVO = conditionVODemo;
        this.state = {
            index: 0
        }
    }

    componentDidMount() {
        this.conditionVO  = this.props.editorStore.conditionVOTemp
        this.setState({
            index: Math.random()
        })
    }

    conditionComplete(conditionAll) {//conditionAll全部条件完整才会调用此方法
    }

    conditionInComplete() {//conditionAll全部条件一旦不完整才会调用此方法
    }

    updateConditionTree = (conditions, refresh) => {
        console.log("conditionPanel 拿到 conditionsAll", conditions);
        this.props.editorStore.conditionVOTemp = common.deepClone(conditions);
        this.conditionVO  = this.props.editorStore.conditionVOTemp
        // 解决多级“并且或者”被覆盖问题的回调刷新同步
        if (refresh) this.setState({ index: Math.random() })
    }




    render() {
        return (
            <div>
               <TreePanel
                    entityType={3}
                    eventSourceId={sessionStorage.tempEventSourceId}
                    dimensionId={sessionStorage.tempDimensionId}
                    conditionComplete={this.conditionComplete}
                    conditionInComplete={this.conditionInComplete}
                    updateConditionTree={this.updateConditionTree}
                    treeData={this.conditionVO}
                />
            </div>
        )
    }
}
export default BranchConditionPanel

BranchConditionPanel.propTypes = {
    conditions: PropTypes.object
}
BranchConditionPanel.defaultProps = {
    conditions: conditionVODemo
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