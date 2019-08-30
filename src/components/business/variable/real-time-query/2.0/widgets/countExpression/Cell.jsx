import React, { Component, Fragment } from 'react'
import { Popover, InputNumber, Cascader } from 'antd'
import '@/styles/components/CountExpression.less';
import PropTypes from 'prop-types';
import CellCopy from '@/components/business/variable/real-time-query/2.0/widgets/countExpression/Cell.jsx';
import common from '@/utils/common';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opt: '+',
            index: 0
        }
        this.changeOpt = this.changeOpt.bind(this);
        this.getOpt = this.getOpt.bind(this);
        this.add = this.add.bind(this);
        this.addOutSide = this.addOutSide.bind(this);
        this.sub = this.sub.bind(this);
        this.changeCate = this.changeCate.bind(this);
        this.changeData = this.changeData.bind(this);
        this.vo = {
            "computeVarVO": {
                "categoryType": 0,//0固定值，1变量
                "code": "",
                "tableAlias": "",
                "type": 0,
                "value": ""
            }
        }
        this.vo = this.props.vo;
    }
    componentWillReceiveProps(nextProps) {
        this.vo = nextProps.vo
    }
    componentDidMount() {
    }
    changeOpt(optType) {
        this.props.changeOpt(this.props.nodeKey, optType)
    }
    changeCate(cate) {
        this.props.changeCate(this.props.nodeKey, cate)
    }
    changeCategoryType() {
    }
    getOpt(computeOperator) {
        let result = '';
        switch (computeOperator) {
            case 'PLUS':
                result = '+';
                break;
            case 'MINUS':
                result = '-';
                break;

            case 'MULTIPLY':
                result = '×';
                break;

            case 'DIVIDE':
                result = '÷';
                break;

            default:
                result = '未知符号'
                break;
        }
        return result
    }
    add(computeOperator) {
        this.props.add(this.props.nodeKey, computeOperator);
    }
    addOutSide(computeOperator) {
        let nodeKey = (() => {
            if (this.props.nodeKey.indexOf('-') !== -1) {
                let key = this.props.nodeKey.split('-')
                key.pop()
                key = key.join('-')
                return key
            } else {
                return this.props.nodeKey
            }
        })()
        this.props.add(nodeKey, computeOperator);
    }
    sub(nodeKey) {
        this.props.sub(nodeKey);
    }
    changeData(name, value, nodeKey) {
        this.props.changeData(name, value, nodeKey);
        this.vo.computeVarVO[name] = value;
        this.setState({ index: Math.random() })
    }
    render() {
        const content = (
            <div className="expression-opt" >
                <p className="opt" onClick={() => this.changeOpt("PLUS")}>+</p>
                <p className="opt" onClick={() => this.changeOpt("MINUS")}>-</p>
                <p className="opt" onClick={() => this.changeOpt("MULTIPLY")}>×</p>
                <p className="opt" onClick={() => this.changeOpt("DIVIDE")}>÷</p>
                <p className="action" onClick={() => this.sub(this.props.nodeKey)}>删除</p>
            </div>
        );
        const content2 = (
            <div className="expression-opt" >
                <p className="opt" onClick={() => this.changeCate(0)}>固定值</p>
                <p className="opt" onClick={() => this.changeCate(1)}>变量</p>
                {/* <p className="opt" onClick={() => this.changeCate(-1)}>括号</p> */}
            </div>
        );
        const content3 = (
            <div className="expression-opt" >
                <p className="opt" onClick={() => this.add("PLUS")}>+</p>
                <p className="opt" onClick={() => this.add("MINUS")}>-</p>
                <p className="opt" onClick={() => this.add("MULTIPLY")}>×</p>
                <p className="opt" onClick={() => this.add("DIVIDE")}>÷</p>
                <p className="opt" onClick={() => this.add("()")}>括号</p>
            </div>
        );
        const content4 = (
            <div className="expression-opt" >
                <p className="opt" onClick={() => this.addOutSide("PLUS")}>+</p>
                <p className="opt" onClick={() => this.addOutSide("MINUS")}>-</p>
                <p className="opt" onClick={() => this.addOutSide("MULTIPLY")}>×</p>
                <p className="opt" onClick={() => this.addOutSide("DIVIDE")}>÷</p>
                <p className="opt" onClick={() => this.add("()")}>括号</p>
            </div>
        );
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        return (
            <div className="countExpression-cell-container clearfix">

                {
                    this.props.nodeKey !== '0' ?
                        (() => {
                            if (this.props.nodeKey.split('-').pop() !== '0') {
                                return <Popover content={content} title="更改操作符" trigger="click">
                                    <p className="row opt">
                                        {
                                            this.props.expressionHead ? '' : this.getOpt(this.props.vo.computeOperator)
                                        }
                                    </p>
                                </Popover>
                            }
                        })()
                        : ''
                }
                <p className="row">
                    {
                        this.props.vo.type === 2 && this.props.nodeKey !== '0' ? <span style={{ marginLeft: '20px' }}>(</span> : ''
                    }
                </p>
                {
                    this.props.vo.type === 2 ? '' :
                        <Popover content={content2} title="更换值类型" trigger="click" >
                            <p className="row type"></p>
                        </Popover>
                }
                {
                    (() => {
                        if (this.props.vo.type === 1) {
                            return <p className="row" >
                                {
                                    (() => {
                                        switch (this.props.vo.computeVarVO.categoryType) {
                                            case 0://固定值
                                                return <InputNumber size="small" style={{ width: '100px' }} onChange={value => {
                                                    if (!isNaN(value))
                                                        this.changeData('value', value, this.props.nodeKey)
                                                }}
                                                    // value={isNaN(this.props.vo.computeVarVO.value) ? '' : this.props.vo.computeVarVO.value}
                                                    value={this.props.vo.computeVarVO.value}
                                                    placeholder="请输入数值"
                                                />
                                            case 1://变量
                                                return common.isEmpty(this.props.vo.computeVarVO.type) || common.isEmpty(this.props.vo.computeVarVO.code) ?
                                                    <Cascader style={{ width: '73px' }} allowClear={false} size="small"
                                                        displayRender={label => label[1]}
                                                        onChange={(value, selectedOptions) => {
                                                            console.log('value, selectedOptions', value, selectedOptions)
                                                            this.changeData('type', selectedOptions[0].type, this.props.nodeKey)
                                                            this.changeData('code', selectedOptions[1].value, this.props.nodeKey)
                                                            this.changeData('selectCode', selectedOptions[1].code, this.props.nodeKey)
                                                            this.changeData('tableAlias', selectedOptions[1].tableAlias, this.props.nodeKey)
                                                            this.changeData('name', selectedOptions[1].name, this.props.nodeKey)
                                                            this.changeData('dataType', selectedOptions[1].type, this.props.nodeKey)
                                                        }}
                                                        className="varList varlist-empty"
                                                        options={this.props.VAR_SELECTION}
                                                        fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                        placeholder="请选择"
                                                        showSearch={{ filter }} />
                                                    :
                                                    <Cascader style={{ width: 'min-content' }} allowClear={false} size="small" value={[this.props.vo.computeVarVO.type, this.props.vo.computeVarVO.code]}
                                                        displayRender={label => label[1]}
                                                        onChange={(value, selectedOptions) => {
                                                            this.changeData('type', selectedOptions[0].type, this.props.nodeKey)
                                                            this.changeData('code', selectedOptions[1].value, this.props.nodeKey)
                                                            this.changeData('selectCode', selectedOptions[1].code, this.props.nodeKey)
                                                            this.changeData('tableAlias', selectedOptions[1].tableAlias, this.props.nodeKey)
                                                            this.changeData('name', selectedOptions[1].name, this.props.nodeKey)
                                                            this.changeData('dataType', selectedOptions[1].type, this.props.nodeKey)
                                                        }}
                                                        className="varList"
                                                        options={this.props.VAR_SELECTION}
                                                        fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                        placeholder="请选择"
                                                        showSearch={{ filter }}
                                                    />
                                            default:
                                                break;
                                        }
                                    })()
                                }

                            </p>
                        } else if (this.props.vo.type === 2) {
                            return this.props.vo.fieldList.map((item, i) =>
                                <CellCopy
                                    key={Math.random()}
                                    nodeKey={`${this.props.nodeKey}-${i}`}
                                    vo={item}
                                    add={this.props.add}
                                    sub={this.props.sub}
                                    changeOpt={this.props.changeOpt}
                                    changeCate={this.props.changeCate}
                                    changeData={this.props.changeData}
                                    VAR_SELECTION={this.props.VAR_SELECTION}
                                    expressionHead={this.props.vo.type === 2 && i === 0}
                                    expressionTail={this.props.vo.type === 2 && i === (this.props.vo.fieldList.length - 1)}
                                    nullList={item.type === 2 && item.fieldList.length === 0}
                                />
                            )
                        }
                    })()
                }
                {
                    this.props.vo.type !== 2 && this.props.nodeKey !== '0' ?
                        <Popover content={content3} title="添加1" trigger="click" >
                            <p className="row opt" title="添加">
                            </p>
                        </Popover>
                        : ''
                }
                {
                    this.props.vo.type === 2 && this.props.nodeKey !== '0' ?
                        <Fragment >
                            <p className="row">)</p>
                            <Popover content={content4} title="添加2" trigger="click" >
                                <p className="row opt" title="添加"></p>
                            </Popover>
                        </Fragment>
                        : ''
                }
            </div>
        )
    }
}
Cell.propTypes = {
    vo: PropTypes.object,//单条计算表达式VO（computeExpressionVO）
    add: PropTypes.func,//增加一条表达式
    changeOpt: PropTypes.func,//修改运算符
    changeCate: PropTypes.func,//修改表达式类型
    changeData: PropTypes.func,//修改表达式值
    sub: PropTypes.func,//删除一条表达式
    VAR_SELECTION: PropTypes.array,//变量下拉选择
    expressionHead: PropTypes.bool,//是否表达式括号的首部vo
    expressionTail: PropTypes.bool,//是否表达式括号的尾部vo
    nullList: PropTypes.bool//是否空表达式（用于控制形态显示）
}
Cell.defaultProps = {
    vo: computeExpressionVODemo,
    add: () => { },
    changeOpt: () => { },
    changeCate: () => { },
    changeData: () => { },
    sub: () => { },
    VAR_SELECTION: [],
    expressionHead: false,
    expressionTail: false,
    nullList: false
}
export default Cell

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
    "type": 2 //类型，1是计算变量， 2是计算表达式（有括号）
}
