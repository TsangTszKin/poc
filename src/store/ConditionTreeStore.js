/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:44:49
 * @Description: ** 条件树形组件的Store数据仓库 **
 */
import { observable, action, toJS, computed } from 'mobx';
import common from '@/utils/common';

class ConditionTreeStore {

    constructor() {
    }

    /**
     * 条件树的数据
     *
     * @memberof ConsitionTreeStore
     */
    @observable conditionTreeJson = null;
    @observable conditionsAll = {
        "relType": 0,
        "nodeType": 1,
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
                "varDefaultValue": '',
                "valueDefaultValue": '',
                
            },
            "nodeType": 1
        }
        ]
    }

    @action.bound setConditionsAll(value) { this.conditionsAll = value }
    @computed get getConditionsAll() { return toJS(this.conditionsAll) }


    /**
     * 更新processTreeJson
     *
     * @param {*} value
     * @memberof ConsitionTreeStore
     */
    @action updateConditionTreeJson(value) {
        // console.log("updateConditionTreeJson value", value);
        this.conditionTreeJson = value;
        this.packData();
        // console.log("updateConditionTreeJson conditionTreeJson", this.conditionTreeJson);
    }

    @action addNode(nodeKey, type, isBranch) {
        let self = this;
        let temp = {
            expressionVO: {
                "varCode": "",
                "varName": "",
                "varType": "",
                "optType": "",
                "value": "",
                "valueType": 0,
                "valueCode": "",
                "valueName": "",
                "varDefaultValue": '',
                "valueDefaultValue": '',
                
            },
            relType: type === 'and' ? 0 : 1,
            nodeType: 1
        }
        let keyArray = [];
        if (!isBranch) {
            //点击节点的加号
            nodeKey == 0 ?
                self.conditionTreeJson.push(temp)
                :
                (() => {
                    keyArray = nodeKey.split('·-·');
                    switch (keyArray.length) {
                        case 2:
                            self.conditionTreeJson[keyArray[0]].conditions.push(temp);
                            break;
                        case 3:
                            if (keyArray[0] == 0 && keyArray[1] == 0 && keyArray[2] == 0) {
                                self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                            } else {
                                if (keyArray[1] == keyArray[2] && keyArray[1] == 0) self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                                else {
                                    self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                                }
                            }

                            break;
                        case 4:
                            self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro ? self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro.push(temp) : self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro = [temp];
                            break;
                        default:
                            break;
                    }
                })()
        } else {
            //点击表达式的加号
            // alert(nodeKey)
            // return
            if (isNaN(nodeKey)) {//非第一层
                keyArray = nodeKey.split('·-·');
                switch (keyArray.length) {
                    case 2:
                        // console.log(toJS(self.conditionTreeJson))
                        self.conditionTreeJson[keyArray[0]].conditions.push({
                            conditions: [temp],
                            relType: type === 'and' ? 0 : 1,
                            nodeType: 2
                        });
                        break;
                    case 3:
                        // console.log(toJS(self.conditionTreeJson))
                        self.conditionTreeJson[keyArray[0]].conditions.push({
                            conditions: [temp],
                            relType: type === 'and' ? 0 : 1,
                            nodeType: 2
                        });
                        break;
                    default:
                        break;
                }

            } else {//start位置的添加联合条件
                self.conditionTreeJson.push({
                    conditions: [temp],
                    relType: type === 'and' ? 0 : 1,
                    nodeType: 2
                })
                //把最开始的节点的nodeType改为2（节点类型）
                let conditionsAll = common.deepClone(toJS(this.conditionsAll));
                conditionsAll.nodeType = 2;
                this.setConditionsAll(conditionsAll);
            }
        }
        this.packData();
    }

    @action.bound packData() {

        let conditionsAll = common.deepClone(toJS(this.conditionsAll));
        conditionsAll.conditions = toJS(this.conditionTreeJson);
        this.setConditionsAll(conditionsAll);
        // console.log("toJS(this.conditionsAll)", toJS(this.conditionsAll))
    }

    @action subNode(nodeKey) {
        // alert(nodeKey)
        let keyArray;
        let size;
        // console.log(toJS(this.conditionTreeJson))
        if (isNaN(nodeKey)) {
            keyArray = nodeKey.split('·-·');
            switch (keyArray.length) {
                case 2:
                    size = this.conditionTreeJson[keyArray[0]].conditions.length;
                    if (size > 2) {
                        this.conditionTreeJson[keyArray[0]].conditions.splice(keyArray[1], 1);
                    } else if (size == 2) {
                        if (keyArray[1] == 0) {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[1];
                            this.conditionTreeJson[keyArray[0]].conditions = [tempNode];
                        } else {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[0];
                            this.conditionTreeJson[keyArray[0]].conditions = [tempNode];
                        }
                    } else {//只有一个的时候
                        this.conditionTreeJson.splice(keyArray[0], 1);
                    }
                    break;
                case 3:
                    size = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.length;
                    if (size > 2) {
                        this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.splice(keyArray[2], 1);
                    } else if (size == 2) {
                        if (keyArray[2] == 0) {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[1];
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions = [tempNode];
                        } else {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[0];
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions = [tempNode];
                        }
                    } else {//只有一个的时候
                        this.conditionTreeJson[keyArray[0]].conditions.splice(keyArray[1], 1);
                    }
                    break;

                default:
                    break;
            }
        } else {//删除key为‘0’节点
            this.conditionTreeJson.splice(nodeKey, 1);
        }
        this.packData();
    }

    @action updateNodeData = (nodeKey, name, value) => {
        // alert(nodeKey)
        console.log(`${nodeKey}  ${name} ${value}`);
        let conditionsAll = common.deepClone(toJS(this.conditionsAll));

        if (name !== 'relType') {
            //修改值    
            if (isNaN(nodeKey)) {
                let keyArray = [];
                keyArray = nodeKey.split('·-·');
                switch (keyArray.length) {
                    case 2:
                        this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].expressionVO[name] = value;
                        break;
                    case 3:
                        this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[keyArray[2]].expressionVO[name] = value;
                        break;

                    default:
                        break;
                }
            } else {//修改最开始的节点的(不是修改节点的关系类型)
                // if (name === 'relType' && nodeKey !== 0)
                this.conditionTreeJson[nodeKey].expressionVO[name] = value;
            }
        } else {

            if (isNaN(nodeKey)) {
                let keyArray2 = [];
                keyArray2 = nodeKey.split('·-·');
                switch (keyArray2.length) {
                    case 2:
                        conditionsAll.conditions[keyArray2[0]].relType = value;
                        // conditionsAll.conditions[keyArray2[0]].relType = value
                        // conditionsAll.conditions[keyArray2[0]].conditions.forEach(element => {
                        //     // if (element.nodeType == 1) {//表达式
                        //     //     element.relType = value
                        //     // }
                        //     element.relType = value
                        // })
                        break;
                    case 3:
                        conditionsAll.conditions[keyArray2[0]].conditions[keyArray2[1]].relType = value
                        // conditionsAll.conditions[keyArray2[0]].conditions[keyArray2[1]].conditions.forEach(element => {
                        //     // if (element.nodeType == 1) {//表达式
                        //     //     element.relType = value
                        //     // }
                        //     element.relType = value
                        // })
                        break;
                    default:
                        break;
                }
            } else {//修改最开始的节点的(修改节点的关系类型)

                conditionsAll.relType = value
                console.log("conditionsAll", conditionsAll)
                // console.log("conditionsAll.relType", conditionsAll.relType)
                // conditionsAll.conditions.forEach(element => {
                //     // if (element.nodeType == 1) {//表达式
                //     //     element.relType = value
                //     // }
                //     element.relType = value
                // })
            }
            this.setConditionsAll(conditionsAll);
            this.updateConditionTreeJson(conditionsAll.conditions);
        }

        this.packData();
        // console.log("updateNodeData", toJS(this.conditionTreeJson));
    }

}

export default new ConditionTreeStore