import React, { Component } from 'react'
import '@/styles/components/CountExpression.less';
import Cell from '@/components/business/variable/real-time-query/2.0/widgets/countExpression/Cell.jsx';
import common from '@/utils/common';
import commonService from '@/api/business/commonService';
import publicUtils from '@/utils/publicUtils';
import PropTypes from 'prop-types';

class CountExpression extends Component {
    constructor(props) {
        super(props);
        this.changeOpt = this.changeOpt.bind(this);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
        this.changeCate = this.changeCate.bind(this);
        this.changeData = this.changeData.bind(this);
        this.findNode = this.findNode.bind(this);
        this.resetNodeKey = this.resetNodeKey.bind(this);
        this.state = {
            VAR_SELECTION: [],
            index: 0
        }
        this.computeExpressionVO = this.props.computeExpressionVO
    }
    componentDidMount() {
        // ConditionTreeStore.reset();
        this.getComputeExpressionData(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.computeExpressionVO = nextProps.computeExpressionVO
    }
    getComputeExpressionData(props) {
        commonService.getComputeExpressionData(props.dimensionId, props.eventSourceId, props.fieldList).then(res => {
            if (!publicUtils.isOk(res)) return
            let VAR_SELECTION = [];
            let fixVarSeletion = (data) => {
                data.forEach(element => {
                    element.value = element.type;
                    element.list.forEach(element2 => {
                        element2.value = element2.code;
                        if (element.type === 0) {//数据库字段
                            element2.value = `${element2.tableAlias}_${element2.code}`;
                            element2.code = `${element2.code}`;
                            element2.name = `${(() => {
                                switch (element2.tableAlias) {
                                    case 'L':
                                        return '左表'
                                    case 'R':
                                        return '右表'
                                    case 'E':
                                        return '衍生'
                                    case 'G':
                                        return '分组'
                                    case 'A':
                                        return '聚合'
                                    default:
                                        break;
                                }
                            })()}.${element2.name}`;
                        }
                    })
                })
                return data
            }
            if (res.data.result.VAR_SELECTION) VAR_SELECTION = fixVarSeletion(res.data.result.VAR_SELECTION);
            this.setState({ loading: false, VAR_SELECTION })
        }).catch(() => { this.setState({ loading: false }) })
    }
    findNode(node, nodeKey) {
        if (node.key === nodeKey) {
            return node
        } else {
            if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                for (let i = 0; i < node.fieldList.length; i++) {
                    this.findNode(node.fieldList[i], nodeKey)
                }
            }
        }
    }
    resetNodeKey(node, parent_key) {
        node.key = `${parent_key}`;
        if (node.type === 2 && !common.isEmpty(node.fieldList)) {
            for (let i = 0; i < node.fieldList.length; i++) {
                this.resetNodeKey(node.fieldList[i], `${parent_key}-${i}`)
            }
        }
    }
    changeCate(nodeKey, cate) {
        let computeExpressionVO = this.computeExpressionVO;
        let match_node = null
        let findNode = (node) => {
            if (node.key === nodeKey) {
                match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode(node.fieldList[i])
                    }
                }
            }
        }
        findNode(computeExpressionVO);
        if (match_node) {
            match_node.computeVarVO = {
                "categoryType": cate,//0固定值，1变量
                "code": "",
                "tableAlias": "",
                "type": 0,
                "value": ""
            }
            this.props.update(this.computeExpressionVO);
            this.setState({ index: Math.random() })
        }

    }

    changeOpt(nodeKey, optType) {

        let computeExpressionVO = this.computeExpressionVO;
        let match_node = null
        let findNode = (node) => {
            if (node.key === nodeKey) {
                match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode(node.fieldList[i])
                    }
                }
            }
        }
        findNode(computeExpressionVO);
        if (match_node) {
            match_node.computeOperator = optType
            this.props.update(this.computeExpressionVO);
            this.setState({ index: Math.random() })
        }

    }

    add(nodeKey, optType) {
        console.log("nodeKey, optType", nodeKey, optType)
        let computeExpressionVO = this.computeExpressionVO;
        let match_node = null
        let findNode = (node) => {
            if (node.key === nodeKey) {
                match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode(node.fieldList[i])
                    }
                }
            }
        }
        findNode(computeExpressionVO);

        let tempArray = nodeKey.split('-');
        let last_key = tempArray.pop();
        let parent_nodeKey = tempArray.join('-');
        let match_node_parent = null
        let findNode2 = (node) => {
            if (node.key === parent_nodeKey) {
                match_node_parent = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode2(node.fieldList[i])
                    }
                }
            }
        }
        findNode2(computeExpressionVO);
        // 匹配到node节点
        if (match_node) {
            console.log("match_node", match_node)
            if (optType === '()') {//添加括号

                // 匹配到父节点
                if (match_node_parent) {
                    match_node_parent.type = 2;
                    // 当最后索引+1小于本身fieldList长度时候，可以用splice函数，否则直接push元素即可
                    if (Number(last_key + 1) < match_node_parent.fieldList.length) {
                        match_node_parent.fieldList.splice(Number(last_key) + 1, 0, {
                            "key": ``,
                            "computeOperator": 'PLUS',
                            "computeVarVO": {
                                "categoryType": 1,//0固定值，1变量
                                "code": "",
                                "tableAlias": "",
                                "type": 0,
                                "value": ""
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
                            "type": 2 //类型，1是计算变量， 2是计算表达式（有括号）
                        })
                    } else {
                        match_node_parent.fieldList.push({
                            "key": ``,
                            "computeOperator": 'PLUS',
                            "computeVarVO": {
                                "categoryType": 1,//0固定值，1变量
                                "code": "",
                                "tableAlias": "",
                                "type": 0,
                                "value": ""
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
                            "type": 2 //类型，1是计算变量， 2是计算表达式（有括号）
                        })
                    }
                } else {
                    //在顶部的组在操作的话, 直接在顶部的对象降级
                    let computeExpressionVO_BK = common.deepClone(computeExpressionVO);
                    computeExpressionVO.fieldList = [computeExpressionVO_BK];
                    computeExpressionVO.fieldList.push({
                        "key": ``,
                        "computeOperator": 'PLUS',
                        "computeVarVO": {
                            "categoryType": 1,//0固定值，1变量
                            "code": "",
                            "tableAlias": "",
                            "type": 0,
                            "value": ""
                        },
                        "fieldList": [],
                        "type": 2 //类型，1是计算变量， 2是计算表达式（有括号）
                    })
                }
            } else {//添加计算变量
                if (match_node.type === 2) {//计算表达式
                    // 降级，并且降级后的同级加一个对象
                    match_node.fieldList.splice(Number(last_key == 0 ? match_node.fieldList.length : last_key) + 1, 0, {
                        "key": `${nodeKey}-${match_node.fieldList.length}`,
                        "computeOperator": optType,
                        "computeVarVO": {
                            "categoryType": 1,//0固定值，1变量
                            "code": "",
                            "tableAlias": "",
                            "type": 0,
                            "value": ""
                        },
                        "fieldList": [],
                        "type": 1 //类型，1是计算变量， 2是计算表达式（有括号）
                    })

                } else {//计算变量
                    let tempArray = nodeKey.split('-');
                    let last_key = tempArray.pop();
                    let parent_nodeKey = tempArray.join('-');
                    let match_node_parent = null
                    let findNode2 = (node) => {
                        if (node.key === parent_nodeKey) {
                            match_node_parent = node
                        } else {
                            if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                                for (let i = 0; i < node.fieldList.length; i++) {
                                    findNode2(node.fieldList[i])
                                }
                            }
                        }
                    }
                    findNode2(computeExpressionVO);
                    if (match_node_parent) {
                        match_node_parent.fieldList.splice(Number(last_key) + 1, 0, {
                            "key": ``,
                            "computeOperator": optType,
                            "computeVarVO": {
                                "categoryType": 1,//0固定值，1变量
                                "code": "",
                                "tableAlias": "",
                                "type": 0,
                                "value": ""
                            },
                            "fieldList": [],
                            "type": 1 //类型，1是计算变量， 2是计算表达式（有括号）
                        })
                    }
                }
            }


            this.resetNodeKey(computeExpressionVO, '0');
            console.log("computeExpressionVO", computeExpressionVO)
            this.props.update(this.computeExpressionVO);
            this.setState({ index: Math.random() })
        }
    }

    sub(nodeKey) {
        console.log("nodeKey", nodeKey)
        console.log("this.computeExpressionVO", this.computeExpressionVO)
        let tempArray = nodeKey.split('-');
        let last_key = tempArray.pop();
        let parent_nodeKey = tempArray.join('-');

        let computeExpressionVO = this.computeExpressionVO;
        let match_node = null
        let findNode = (node) => {
            if (node.key === nodeKey) {
                match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode(node.fieldList[i])
                    }
                }
            }
        }
        findNode(computeExpressionVO);
        let p_match_node = null
        let findNode_p = (node) => {
            if (node.key === parent_nodeKey) {
                p_match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode_p(node.fieldList[i])
                    }
                }
            }
        }
        findNode_p(computeExpressionVO);

        if (match_node) {
            console.log("match_node", match_node)
            if (match_node.type === 2) {
                match_node.fieldList.splice(last_key, 1);
                if (p_match_node) {
                    console.log("p_match_node", p_match_node)
                    p_match_node.fieldList.splice(last_key, 1);
                }
            } else {
                if (p_match_node) {
                    console.log("p_match_node", p_match_node)
                    p_match_node.fieldList.splice(last_key, 1);
                }
            }

            this.resetNodeKey(computeExpressionVO, '0');
            this.props.update(this.computeExpressionVO);
            this.setState({ index: Math.random() })
        }
    }

    changeData(name, value, nodeKey) {
        console.log("name, value, nodeKey", name, value, nodeKey);
        let computeExpressionVO = this.computeExpressionVO;
        let match_node = null
        let findNode = (node) => {
            if (node.key === nodeKey) {
                match_node = node
            } else {
                if (node.type === 2 && !common.isEmpty(node.fieldList)) {
                    for (let i = 0; i < node.fieldList.length; i++) {
                        findNode(node.fieldList[i])
                    }
                }
            }
        }
        findNode(computeExpressionVO);
        // 匹配到node节点
        if (match_node) {
            match_node.computeVarVO[name] = value;
            this.props.update(this.computeExpressionVO);
            // this.setState({ index: Math.random() })
        }
    }

    render() {
        return (
            <div className="countExpression-cell-container">
                <Cell
                    nodeKey='0'
                    vo={this.computeExpressionVO}
                    add={this.add}
                    sub={this.sub}
                    changeOpt={this.changeOpt}
                    changeCate={this.changeCate}
                    changeData={this.changeData}
                    VAR_SELECTION={this.state.VAR_SELECTION}
                    expressionHead={true}
                    expressionTail={false}
                    nullList={this.computeExpressionVO.type === 2 && this.computeExpressionVO.fieldList.length === 0}
                />
            </div>
        )
    }
}
CountExpression.propTypes = {
    entityType: PropTypes.oneOf([1, 2, 3]),//实体类型 1实时查询变量，2规则，3策略
    eventSourceId: PropTypes.string, //事件源id
    dimensionId: PropTypes.string,// 事件源id
    fieldList: PropTypes.array,// 数据库字段列表（用于下拉选择）
    update: PropTypes.func,//更新computeExpressionVO
    computeExpressionVO: PropTypes.object//计算表达式VO
}
CountExpression.defaultProps = {
    entityType: 1,
    eventSourceId: sessionStorage.tempEventSourceId ? sessionStorage.tempEventSourceId : '',
    dimensionId: sessionStorage.tempDimensionId ? sessionStorage.tempDimensionId : '',
    fieldList: [],
    update: () => { },
    computeExpressionVO: computeExpressionVODemo
}
export default CountExpression

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