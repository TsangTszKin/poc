import React, { Component, Fragment } from 'react'
import { Popover, InputNumber, Cascader, Row, Col, Button, Divider, Modal, message } from 'antd'
import '@/styles/components/CountExpression.less';
import PropTypes from 'prop-types';
import CellCopy from '@/components/countExpression/Cell.jsx';
import common from '@/utils/common';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            computeFunctionModal: false,
            currentFunctionObj: {}
        }
        this.changeOpt = this.changeOpt.bind(this);
        this.getOpt = this.getOpt.bind(this);
        this.add = this.add.bind(this);
        this.addOutSide = this.addOutSide.bind(this);
        this.sub = this.sub.bind(this);
        this.changeCate = this.changeCate.bind(this);
        this.changeData = this.changeData.bind(this);
        this.changeTempData = this.changeTempData.bind(this);
        this.vo = voDemo
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
    changeTempData(name, value) {
        let currentFunctionObj = this.state.currentFunctionObj;
        currentFunctionObj[name] = value
        this.setState({ currentFunctionObj })
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
                {//衍生变量有函数
                    this.props.entityType === 0 ? <p className="opt" onClick={() => this.changeCate(2)}>函数</p> : ''
                }
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
                                                return <InputNumber
                                                    size="small"
                                                    style={{ width: '100px' }}
                                                    onChange={value => {
                                                        if (!isNaN(value))
                                                            this.changeData('value', value, this.props.nodeKey)
                                                    }}
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
                                            case 2: //函数
                                                return <p
                                                    className="row function"
                                                    onClick={() => {
                                                        this.setState({
                                                            currentFunctionObj: common.deepClone(this.vo.computeVarVO),
                                                            computeFunctionModal: true
                                                        })
                                                    }}
                                                >
                                                    {
                                                        (() => {

                                                            if (common.isEmpty(this.vo.computeVarVO.computeFunction)) {
                                                                return '未定义函数'
                                                            } else {
                                                                const target = this.props.computeFunction.find(el => el.val === this.vo.computeVarVO.computeFunction);
                                                                if (target) {
                                                                    let params = [];
                                                                    this.vo.computeVarVO.params.forEach(el => {
                                                                        let parmaLabel = '';
                                                                        if (el.categoryType === 0) {//固定值
                                                                            parmaLabel = el.value;
                                                                        } else if (el.categoryType === 1) {//变量
                                                                            parmaLabel = el.name;
                                                                        }
                                                                        params.push(common.isEmpty(parmaLabel) ? '未定义参数' : parmaLabel);
                                                                    })
                                                                    return `${target.name} ${common.isEmpty(params) ? '' : `（${params.join('，')}）`}`;
                                                                }
                                                            }
                                                        })()
                                                    }
                                                </p>
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
                                    computeFunction={this.props.computeFunction}
                                    entityType={this.props.entityType}
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
                <Modal
                    title="函数类型"
                    visible={this.state.computeFunctionModal}
                    width={348}
                    onOk={() => {

                        // 校验 start
                        const { categoryType, code, selectCode, type, value, computeFunction, params } = this.state.currentFunctionObj
                        let result = true;
                        if (common.isEmpty(computeFunction)) {
                            result = false
                        }
                        for (let i = 0; i < params.length; i++) {
                            const el = params[i];
                            if (el.categoryType === 0) {//固定值
                                if (common.isEmpty(el.value)) result = false
                                //校验后端返回的min和not
                                const target = this.props.computeFunction.find(el => el.val === computeFunction);
                                if (target) {
                                    if (!common.isEmpty(target.params[i].not)) {
                                        if (el.value === target.params[i].not) {
                                            message.warning(`${target.label}的${target.params[i].name}不能等于${target.params[i].not}`);
                                            return
                                        }
                                    }
                                    if (!common.isEmpty(target.params[i].min)) {
                                        if (el.value < target.params[i].min) {
                                            message.warning(`${target.label}的${target.params[i].name}不能小于${target.params[i].min}`);
                                            return
                                        }
                                    }
                                }
                            } else if (el.categoryType === 1) {// 变量
                                if (common.isEmpty(el.code) || common.isEmpty(el.selectCode) || common.isEmpty(el.type)) {
                                    result = false
                                }
                            }
                        }
                        if (categoryType === 1) {//变量
                            if (common.isEmpty(code) || common.isEmpty(selectCode) || common.isEmpty(type)) {
                                result = false
                            }
                        } else if (categoryType === 0) {//固定值
                            if (common.isEmpty(value)) {
                                result = false
                            }
                        }
                        if (!result) {
                            message.warning(`衍生变量的计算公式未配置完成，请配置`);
                            return
                        }



                        // 校验 end
                        this.changeData('computeFunction', computeFunction, this.props.nodeKey)
                        this.changeData('params', params, this.props.nodeKey)
                        this.setState({ computeFunctionModal: false, currentFunctionObj: {} })
                    }}
                    onCancel={() => {
                        this.setState({ computeFunctionModal: false, currentFunctionObj: {} })
                    }}
                    wrapClassName="params-modal"
                    destroyOnClose={true}
                >
                    <FunctionPanel
                        vo={this.state.currentFunctionObj}
                        VAR_SELECTION={this.props.VAR_SELECTION}
                        nodeKey={this.props.nodeKey}
                        computeFunction={this.props.computeFunction}
                        computeFunctionSelected={this.state.currentFunctionObj.computeFunction}
                        changeData={this.changeTempData}
                    />
                </Modal>
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
    nullList: PropTypes.bool,//是否空表达式（用于控制形态显示）
    computeFunction: PropTypes.array, //函数列表
    entityType: PropTypes.number.isRequired
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
    nullList: false,
    computeFunction: []
}
export default Cell



// 函数组件
class FunctionPanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        return (
            <div className="countExpression-cell-container-functiont">
                <Divider orientation="left">选择函数</Divider>

                <Col>
                    <Row className="function" type="flex" justify="space-around" align="middle" >
                        {
                            this.props.computeFunction.map((item, i) =>
                                <Button
                                    title={item.label}
                                    style={{
                                        width: '50px',
                                        height: '30px',
                                        backgroundColor: '#F3F3F3',
                                        fontSize: '15px',
                                        marginBottom: '5px',
                                        color: item.val === this.props.computeFunctionSelected ? '#bd353c' : 'inherit',
                                        borderColor: item.val === this.props.computeFunctionSelected ? '#bd353c' : '#d9d9d9',
                                    }}
                                    key={i}
                                    onClick={() => {
                                        let params = [];
                                        for (let index = 0; index < item.params.length; index++) {
                                            params.push(voDemo.computeVarVO)
                                        }
                                        this.props.changeData('computeFunction', item.val, this.props.nodeKey);
                                        this.props.changeData('params', params, this.props.nodeKey);
                                    }}>{item.name}</Button>
                            )
                        }
                    </Row>
                </Col>
                {
                    (() => {
                        let current_vo_computeFunction = this.props.vo.computeFunction
                        if (!common.isEmpty(current_vo_computeFunction)) {
                            const target = this.props.computeFunction.find(el => el.val === current_vo_computeFunction);
                            if (target) {
                                return <div>
                                    {
                                        !common.isEmpty(target.params) ?
                                            <Divider orientation="left" style={{ marginTop: '30px' }}>选择参数</Divider>
                                            : ''
                                    }
                                    {
                                        target.params.map((item, i) =>
                                            <div key={i} style={style.paramsCell}>
                                                <span className="params-name"> {item.name}：</span>
                                                <Popover
                                                    content={<div className="expression-opt" >
                                                        <p className="opt"
                                                            onClick={() => {
                                                                let params = common.deepClone(this.props.vo.params);
                                                                params[i].categoryType = 0;
                                                                params[i].computeFunction = null;
                                                                params[i].type = '';
                                                                params[i].code = '';
                                                                params[i].selectCode = '';
                                                                params[i].tableAlias = '';
                                                                params[i].name = '';
                                                                params[i].dataType = '';
                                                                params[i].value = '';
                                                                params[i].params = [];
                                                                this.props.changeData('params', params, this.props.nodeKey)
                                                            }}>固定值</p>
                                                        <p className="opt" onClick={() => {
                                                            let params = common.deepClone(this.props.vo.params);
                                                            params[i].categoryType = 1;
                                                            params[i].computeFunction = null;
                                                            params[i].type = 0;
                                                            params[i].code = '';
                                                            params[i].selectCode = '';
                                                            params[i].tableAlias = '';
                                                            params[i].name = '';
                                                            params[i].dataType = '';
                                                            params[i].value = '';
                                                            params[i].params = [];
                                                            this.props.changeData('params', params, this.props.nodeKey)
                                                        }}>变量</p>
                                                    </div>}
                                                    title="更换值类型"
                                                    trigger="click"
                                                >
                                                    <p className="params-type"></p>
                                                </Popover>
                                                {
                                                    (() => {
                                                        switch (this.props.vo.params[i].categoryType) {
                                                            case 0: //固定值
                                                                return <InputNumber size="small" style={{ width: '100px' }} onChange={value => {
                                                                    if (!isNaN(value)) {
                                                                        let params = common.deepClone(this.props.vo.params);
                                                                        params[i].value = value;
                                                                        this.props.changeData('params', params, this.props.nodeKey)
                                                                    }
                                                                }}
                                                                    value={this.props.vo.params[i].value}
                                                                    placeholder="请输入数值"
                                                                />
                                                            case 1://变量
                                                                return common.isEmpty(this.props.vo.params[i].type) || common.isEmpty(this.props.vo.params[i].code) ?
                                                                    <Cascader style={{ width: '100px' }} allowClear={false} size="small"
                                                                        displayRender={label => label[1]}
                                                                        onChange={(value, selectedOptions) => {
                                                                            console.log('value, selectedOptions', value, selectedOptions)

                                                                            let params = common.deepClone(this.props.vo.params);
                                                                            params[i].type = selectedOptions[0].type;
                                                                            params[i].code = selectedOptions[1].value;
                                                                            params[i].selectCode = selectedOptions[1].code;
                                                                            params[i].tableAlias = selectedOptions[1].tableAlias;
                                                                            params[i].name = selectedOptions[1].name;
                                                                            params[i].dataType = selectedOptions[1].type;
                                                                            this.props.changeData('params', params, this.props.nodeKey)
                                                                        }}
                                                                        className="varList varlist-empty"
                                                                        options={this.props.VAR_SELECTION}
                                                                        fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                                        placeholder="请选择变量"
                                                                        showSearch={{ filter }} />
                                                                    :
                                                                    <Cascader style={{ width: 'min-content', minWidth: '100px' }} allowClear={false} size="small" value={[this.props.vo.params[i].type, this.props.vo.params[i].code]}
                                                                        displayRender={label => label[1]}
                                                                        onChange={(value, selectedOptions) => {
                                                                            let params = common.deepClone(this.props.vo.params);
                                                                            params[i].type = selectedOptions[0].type;
                                                                            params[i].code = selectedOptions[1].value;
                                                                            params[i].selectCode = selectedOptions[1].code;
                                                                            params[i].tableAlias = selectedOptions[1].tableAlias;
                                                                            params[i].name = selectedOptions[1].name;
                                                                            params[i].dataType = selectedOptions[1].type;
                                                                            this.props.changeData('params', params, this.props.nodeKey)
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
                                            </div>
                                        )
                                    }

                                </div>
                            }
                        }
                    })()
                }
            </div>
        )
    }
}
FunctionPanel.propTypes = {
    computeFunction: PropTypes.array,//函数
    computeFunctionSelected: PropTypes.string,//当前所选函数
    changeData: PropTypes.func, //改变函数的回调函数
    vo: PropTypes.object,
    VAR_SELECTION: PropTypes.array,
    nodeKey: PropTypes.string
}
FunctionPanel.defaultProps = {
    computeFunction: [],
    computeFunctionSelected: '',
    changeData: () => { },
    vo: voDemo,
    VAR_SELECTION: [],
    nodeKey: '0'
}

const style = {
    button1: {
    },
    paramsCell: {
        marginBottom: '10px'
    }
}

const voDemo = {
    "computeVarVO": {
        "categoryType": 0,//0固定值，1变量，2函数（衍生变量）
        "code": "",
        "tableAlias": "",
        "type": 0,
        "value": "",
        "computeFunction": null,
        "params": []
    }
}


const computeExpressionVODemo = {
    "key": "0",
    "computeOperator": "PLUS",
    "computeVarVO": {
        "categoryType": 1,//0固定值，1变量，2函数（衍生变量）
        "code": "",
        "tableAlias": "",
        "type": 0,
        "value": "",
        "name": "",
        "dataType": "",
        "computeFunction": null,
        "params": []
    },
    "fieldList": [{
        "key": "0-0",
        "computeOperator": "PLUS",
        "computeVarVO": {
            "categoryType": 1,//0固定值，1变量，2函数（衍生变量）
            "code": "",
            "tableAlias": "",
            "type": 0,
            "value": "",
            "name": "",
            "dataType": "",
            "computeFunction": null,
            "params": []
        },
        "fieldList": [],
        "type": 1 //类型，1是计算变量， 2是计算表达式（或有括号）
    }],
    "type": 2 //类型，1是计算变量， 2是计算表达式（有括号）
}