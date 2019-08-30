import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import common from "@/utils/common";
import '@/styles/components/condition-viewer.less';

class ConditionViewer extends Component {
    render() {
        const { conditionVO, className, optionTextList, depth, isShowVarName } = this.props;
        // console.log('视图里的conditionVO', conditionVO);
        return (
            <div className={ className } style={{ paddingLeft: depth === 0 ? 0: '2em', whiteSpace: 'nowrap', textAlign: 'left' }}>
                {
                    conditionVO ?
                        conditionVO.conditions.map((item, index) =>
                            <Fragment>
                                <div>
                                    {
                                        index === 0 ? '':
                                            <span className="condition-connect">{ conditionVO.relType === 0 ? '且' : '或' }</span>
                                    }
                                    {
                                        item.nodeType === 1 ?
                                            <Fragment>
                                                {
                                                    isShowVarName ?
                                                        <span className="condition-name">{ item.expressionVO.varName }</span>
                                                        : ''
                                                }
                                                <span
                                                    className="condition-type">{ optionTextList[item.expressionVO.optType] }</span>
                                                {
                                                    ['8', '9'].includes(String(item.expressionVO.optType)) ? '' :
                                                        <span className="condition-value">
                                                    {
                                                        // Tree2.0里的getParamName有分common和having类型的，这里省略了
                                                        item.expressionVO.valueCategoryType === 0 ? `${ item.expressionVO.value }` : // 固定值
                                                            item.expressionVO.valueCategoryType === 1 ? `${ item.expressionVO.valueName }` : // 变量
                                                                item.expressionVO.valueCategoryType === 2 ?
                                                                    <Fragment>
                                                                        函数 { item.expressionVO.valueName }
                                                                        {
                                                                            !common.isEmpty(item.expressionVO.valueParas) ?
                                                                                <span className="condition-params">
                                                                                        ({ item.expressionVO.valueParas.map(param => param.formType === 3 ? param.name : param.value).join(', ') })
                                                                                    </span>
                                                                                : ''
                                                                        }
                                                                    </Fragment>
                                                                    : ''
                                                    }
                                                </span>
                                                }
                                            </Fragment>
                                            :
                                            // 联合条件相当于一个独立的conditionTree（VO）
                                            item.nodeType === 2 ?
                                                <span>
                                                    (
                                                        <ConditionViewer conditionVO={ item } optionTextList={ optionTextList } depth={ depth + 1 } />
                                                    )
                                                </span>
                                                : ''
                                    }
                                </div>
                            </Fragment>
                        )
                        : ''
                }
            </div>
        );
    }
}

ConditionViewer.propTypes = {
    conditionVO: PropTypes.object.isRequired,
    className: PropTypes.string,
    optionTextList: PropTypes.array.isRequired,
    depth: PropTypes.number,
    isShowVarName: PropTypes.bool,

};
ConditionViewer.defaultProps = {
    depth: 0,
    isShowVarName: false
};

export default ConditionViewer;
