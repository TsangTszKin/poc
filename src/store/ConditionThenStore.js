/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-21 15:40:53
 * @Description: ** 条件树形组件的Store数据仓库 **
 */
import { observable, action, toJS, computed } from 'mobx';

class ConditionThenStore {

    constructor() {
    }

    /**
     * 条件树的数据
     */
    @observable conditionsAll = [elseDemo]

    @action.bound setConditionsAll(value) { this.conditionsAll = value }
    @computed get getConditionsAll() { return toJS(this.conditionsAll) }

    @action.bound addNode() {
        let temp = elseDemo
        let conditionsAll = this.getConditionsAll;
        conditionsAll.push(temp);
        this.setConditionsAll(conditionsAll);
    }

    @action.bound subNode(nodeKey) {
        let conditionsAll = this.getConditionsAll;
        conditionsAll.splice(nodeKey, 1);
        this.setConditionsAll(conditionsAll);
    }

    @action.bound updateNodeData = (nodeKey, name, value) => {
        console.log(`${nodeKey}  ${name} ${value}`);
        let conditionsAll = this.getConditionsAll;
        conditionsAll[nodeKey][name] = value;
        this.setConditionsAll(conditionsAll);
    }

}

export default new ConditionThenStore

const elseDemo = {
    "parameterId": "",
    "parameterName": '',
    "fixedValueType": "",
    "type": 0,
    "varType": "",//等号右边的变量
    "varDataType": '',//等号右边的变量
    "varName": "",//等号右边的变量
    "varCode": "",//等号右边的变量
    "fixedValue": "",//等号右边的固定值
    "computeExpression": {//计算类型才有
        "operators": [],
        "varList": [
            {
                "code": "",//变量CODE
                "varType": "",//变量 类型
                "dataType": ""//变量 数据类型
            }
        ]
    },
    "actionType": 0,
    "executionManner": 4,
    "rtqVarId": '',
    "rtqVarDataType": '',
    "parameterType": ''
}