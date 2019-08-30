import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Then from "@/components/business/strategy/table/ThenWithoutMobx";

// 这个就是ThenPanel组件复制过来的，因为需要用到多个这个组件，
// 去掉了componentDidMount中获取接口代码，在上层组件获取然后通过props传入
// 还去掉了很多用不到的功能
class ThenWrapper extends Component {
    constructor(props) {
        super(props);
    }

    // 只有一个节点, 添加节点删除节点的方法都去掉了，
    // 仅保留了接收修改回调，
    // Then里面修改的回调也全部注释了
    updateNodeData = (nodeKey, name, value) => {
        // alert(nodeKey)
        console.log(`${nodeKey}  ${name} ${value}`);
        this.props.updateConditionThen(name, value);
    }

    render() {
        return (
            <div>
                {/*<p>varName { this.props.treeData.conditions[0].expressionVO.varName }</p>*/}
                {/*<p>actionType { this.props.treeData.conditions[0].expressionVO.actionType }</p>*/}
                {/*<p>parameterName { this.props.treeData.conditions[0].expressionVO.parameterName }</p>*/}
                {/*<p>computeJson { this.props.treeData.conditions[0].expressionVO.computeJson }</p>*/}
                {/*<p>fixedValueType { this.props.treeData.conditions[0].expressionVO.fixedValue }</p>*/}
                {/*<p>fixedValueType { this.props.treeData.conditions[0].expressionVO.fixedValueType }</p>*/}
                {
                    // 简单决策表只有一个节点，交叉决策表和评分卡
                    <Then
                        rtqVarList={ this.props.rtqVarList }
                        key={ Math.random() }
                        optTypeList={ this.props.optTypeList }
                        // verifyConditionTreeFinish={ this.verifyConditionTreeFinish }
                        valueTypeList={ this.props.valueTypeList }
                        varTypeOfField={ this.props.varTypeOfField }
                        paramList={ this.props.paramList }
                        cascadeData={ this.props.cascadeData }
                        cascadeDataNumber={ this.props.cascadeDataNumber }
                        type="control"
                        updateConditionThen={ this.props.updateConditionThen }
                        node={ this.props.treeData.conditions[0] }
                        p_relType={ this.props.p_relType }
                        nodeKey={ 0 }
                        extraType={ this.props.extraType }
                        updateNodeData={ this.updateNodeData }
                        disabled={ this.props.disabled }
                    />
                }
            </div>
        );
    }
}

ThenWrapper.propTypes = {};

export default ThenWrapper;
