import React, { Component, Fragment, useEffect, useState } from 'react';
import { Dropdown, Table, message, Menu, Input, Row, InputNumber, Modal, Cascader } from "antd";
import strategyService from "@/api/business/strategyService";
import TreePanel from "@/components/condition-tree/TreePanel2.0";
import common from "@/utils/common";
import publicUtils from '@/utils/publicUtils';
import variableService from '@/api/business/variableService';
import '@/styles/business/strategy/score-card.less';
import { inject } from "mobx-react";
import ConditionViewer from "@/components/common/condition-viewer";

const defaultVO = { //一行数据
    flag: true,
    cellsKey: '',
    score: 0, //分值
    selectId: "", //属性ID
    selectName: "", //属性名称
    type: 0, //这个暂时没有用
    weight: 0,//如果选了权重（isWeight：true），每一行就要填写权重
    conditions: [{
        nodeType: 1,
        relType: 0,
        expressionVO: {
            actionType: 0,
            computeJson: '',
            executionManner: 0,
            fixedValue: '',
            fixedValueType: 0,
            parameterId: '',
            parameterName: "",
            type: 0,
            varCode: "",
            varName: "",
            varType: 0,
            computeExpression: {
                operators: [],
                varList: [
                    // {code: "", varType: 0}
                ],
            }
        }
    }]
};

const CellDropdown = props => (
    <Fragment>
        <Dropdown { ...props } trigger={ ['contextMenu'] }>
            <div className="full-cell-dropdown"></div>
        </Dropdown>
        <div className="cell-dropdown-text">
            { props.children }
        </div>
    </Fragment>
);


const defaultBasicData = { //基础信息
    flag: true,
    cellsKey: '',
    calculation: 1,
    category: 1,
    categoryName: "",
    code: "",
    createdTime: "",
    description: "",
    dimensionId: "",
    dimensionName: "",
    eventSourceId: "",
    eventSourceName: "",
    id: "",
    // modifiedTime: "",
    // modifiedUser: "",
    name: "",
    // parameterCode: "",
    // parameterDefaultValue: "",
    parameterId: "",
    parameterName: "",
    // parameterType: 4,
    scoreCellsList: [{
        cellsKey: "",
        conditionVO: {
            conditions: [{
                conditions: [],
                expressionVO: {
                    optType: 0,
                    value: "",
                    valueCategoryType: 0,
                    valueCode: "",
                    valueDefaultValue: "",
                    valueName: "",
                    valueTableAlias: "",
                    varCategoryType: 1,
                    varCode: "",
                    varDataType: '',
                    varDefaultValue: "",
                    varName: "",
                    varTableAlias: "",
                    varType: ''
                },
                nodeType: 1,
                relType: 0
            }],
            nodeType: 1,
            relType: 0
        },
        score: '',
        selectId: "",
        selectName: "",
        type: '',
        weight: ''
    }],
    tenantId: "",
    type: 0,
    version: 1,

};

const defaultconditionsVO = {//初始化数据一行
    cellsKey: '',
    conditionVO: {
        nodeType: 1,
        relType: 0,
        conditions: [{
            nodeType: 1,
            relType: 0,
            expressionVO: {
                actionType: 0,
                computeJson: '',
                executionManner: 0,
                fixedValue: '',
                fixedValueType: 0,
                parameterId: '',
                parameterName: "",
                type: 0,
                varCode: "",
                varName: "",
                varType: 0,
                computeExpression: {
                    operators: [],
                    varList: [
                        // {code: "", varType: 0}
                    ],
                }
            }
        }]
    },
    flagCondition: false,
    flagSelect: false,
    score: '',
    selectId: '',
    selectName: '',
    type: '',
    weight: '',
};
const expressionVODemo = defaultVO['conditions'][0]['expressionVO'];


class ConditionVO {
    constructor(props) {
        { //一行数据
            const defaultConditionVO = {
                cellsKey: common.randomKey(),
                flagCondition: false,
                flagSelect: false,
                score: 0, //分值
                selectId: "", //属性ID
                selectName: "", //属性名称
                selectValue: "",
                type: 0, //这个暂时没有用
                weight: 0,//如果选了权重（isWeight：true），每一行就要填写权重
                conditions: [{
                    nodeType: 1,
                    relType: 0,
                    expressionVO: {
                        actionType: 0,
                        computeJson: '',
                        executionManner: 0,
                        fixedValue: '',
                        fixedValueType: 0,
                        parameterId: '',
                        parameterName: "",
                        type: 0,
                        varCode: "",
                        varName: "",
                        varType: 0,
                        computeExpression: {
                            operators: [],
                            varList: [
                                // {code: "", varType: 0}
                            ],
                        }
                    }
                }]
            };
        }
        let newProps;
        if (props) {
            newProps = {};
            for (let key in defaultConditionVO) {
                if (defaultConditionVO.hasOwnProperty(key)) {
                    newProps[key] = props[key] || defaultConditionVO[key];
                }
            }
        } else newProps = defaultConditionVO;
        // let newProps = Object.assign({}, defaultConditionVO, props);
        console.log('newProps', newProps);
        this.selectName = newProps.selectName;
        this.type = newProps.type;
        this.value = newProps.value;
        this.cellsKey = newProps.cellsKey;
    }
}

// 分值输入组件
const ScoreInput = props => {
    const [isShowInput, setIsShowInput] = useState(false);
    let InputRef;
    const handleOnBlur = () => {
        setIsShowInput(false);
    };
    const handleOnBlur2 = (value) => {
        props.onBlur(value);
    };
    const clickText = () => {
        setIsShowInput(true);
    };
    useEffect(() => {
        if (isShowInput && InputRef) {
            InputRef.focus();
            // InputRef.select();
        }
    }, [isShowInput]);
    if (props.value === undefined || props.value === null) {
        props.value = "";
    }
    return isShowInput ? <InputNumber
            className="score-input-2"
            ref={ ref => InputRef = ref }
            defaultValue={ props.value }
            onChange={ (value) => {
                handleOnBlur2(value);
            } }
            min={ props.min }
            max={ props.max }
            onBlur={ handleOnBlur }
            // onChange={e => setInputValue(e.target.value)}
            // onPressEnter={handleOnBlur}
        />
        : props.value !== "" ? <a style={ { color: "#0069BC" } } onClick={ clickText }>{ props.value }</a> :
            <a style={ { color: "rgba(226, 10, 29, 0.79)" } } onClick={ clickText }>{ "请填写" }</a>;
};

function filter(inputValue, path) {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

// 选择属性组件
const ScoreSelect = props => {
    const [isShowSelect, setIsShowSelect] = useState(false);
    const [isShowPopup, setIsShowPopup] = useState(false);
    {
        console.log("props.value", props.value);
    }
    let InputRef;
    const handleOnBlur = (label, value) => {
        props.onBlur(label, value);
        setIsShowSelect(false);
    };
    const handleOnBlur2 = (value) => {
        props.onBlur2();
        if (!value) {
            setIsShowSelect(false);
        }
    };
    const clickText = () => {
        setIsShowSelect(true);
    };
    useEffect(() => {
        if (isShowSelect && InputRef) {
            console.log(InputRef);
            InputRef.focus();
            setIsShowPopup(true);
        }
    }, [isShowSelect]);
    if (props.myValue === undefined) {
        props.myValue = "";
    }
    return isShowSelect ?
        <div>
            <Cascader className="select-input-2 varList"
                      ref={ ref => InputRef = ref }
                      displayRender={ label => label[1] }
                      fieldNames={ props.fieldNames }
                      onPopupVisibleChange={ (value) => {
                          handleOnBlur2(value);
                      } }
                      showSearch={ filter }
                      onChange={ (label, value) => {
                          console.log("label, value", label, value);
                          handleOnBlur(label, value);
                      } }
                      popupVisible={ isShowPopup }
                      options={ props.options }
                      placeholder={ props.myValue }/>
        </div>
        : props.myValue !== "" ? <a style={ { color: "#0069BC" } } onClick={ clickText }>{ props.myValue }</a> :
            <a style={ { color: "rgba(226, 10, 29, 0.79)" } } onClick={ clickText }>{ "请选择属性" }</a>;
};

@inject('store')
class ScoreCard extends Component {
    lastEditConditionVO = null;
    state = {
        header: [],
        index: 0,
        dataSource: [],
        currentDataIndex: [],
        currentCondition: [],
        allVarsList: [],
        varTypeList: [],
        isShowConfig: false,
        leftColumns: [],
        optionTextList: {}, // 规则表达式选项中文对照表
        rightColumn: {
            title: '分值',
            dataIndex: 'score',
            key: 'score',
            width: '300px',
            render: (text, record, rowIndex) => {
                let menu = <Menu>
                    <Menu.Item onClick={ () => this.clearCellContent({ rowIndex }) }>清空内容</Menu.Item>
                </Menu>;
                return (
                    <Dropdown overlay={ menu } trigger={ ['contextMenu'] }>
                        <div>
                            <ScoreInput
                                value={ text }
                                min={ 1 }
                                max={ 1999999999 }
                                onBlur={ value => this.handleChangeScore(value, rowIndex) }
                            />
                        </div>
                    </Dropdown>
                );
            },

        },
    };

    componentDidMount() {
        const { dataRows, varTypeList } = this.props;
        console.log("this.props, dataRows", this.props, dataRows);
        let dataRowsCopy = common.deepClone(dataRows);
        this.props.store.setDataSource(dataRowsCopy);
        this.setState({
            dataSource: dataRowsCopy,
            varTypeList: varTypeList,
        }, () => this.init(dataRowsCopy));
        // 获取表达式类型
        variableService.getOptTypeList().then(res => {
            if (!publicUtils.isOk(res)) return;
            // console.log(res.data.result);
            let optionTextList = {};
            let tempArray = [];
            this.optionTypeList = res.data.result;
            this.optionTypeList.forEach(opt => {
                optionTextList[opt.val] = opt.label;
                tempArray.push({
                    code: opt.val,
                    value: opt.label
                });
            });
            // console.log(optionTextList);
            this.setState({
                optionTextList,
                optTypeList: tempArray
            });
        });
        this.getAllVarList();
        if (!common.isEmpty(dataRowsCopy)) {
            for (let i = 0; i < dataRowsCopy.length; i++) {
                dataRowsCopy[i].flagCondition = false; //标记条件
                dataRowsCopy[i].flagSelect = false; //标记属性
            }
        } else {
            this.addDateRow(0, 1, false);
        }
        // this.init();
    }

    getAllVarList() {
        variableService.getAllVarList('', 'card').then(res => {
            console.log("res", res);
            if (!publicUtils.isOk(res)) return;
            let tempArray = [];
            res.data.result.forEach(element => {
                let temp = {
                    value: element.type,
                    label: element.name,
                    children: []
                };
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code,
                        label: element2.name,
                        id: element2.id,
                        type: element2.type
                    });
                });
                tempArray.push(temp);
            });
            this.setState({
                allVarsList: tempArray
            });
            console.log("this.state.allVarsList", this.state.allVarsList);
        });
    }

    // 配置侧表头条件（第二行）
    configCondition = params => {
        console.log('配置条件');
        const { rowIndex, rowSpan, } = params;
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择事件源和维度');
            return;
        }
        if (common.isEmpty(this.state.dataSource[rowIndex].selectName)) {
            message.error('请先选择属性');
            return;
        }
        const currentCondition = {
            rowIndex,
            rowSpan,
            conditionVO: this.state.dataSource[rowIndex].conditionVO
        };
        console.log('currentCondition', currentCondition);
        this.lastEditConditionVO = this.state.dataSource[rowIndex].conditionVO;
        this.setState({
            currentCondition: currentCondition,
            isShowConfig: true
        });
        this.updateConditionColumns(this.state.dataSource);
    };

    updateConditionTree = (lastEditConditionVO) => {
        console.log('updateConditionTree', lastEditConditionVO);
        this.lastEditConditionVO = lastEditConditionVO;
        // if (refresh) this.setState({index: Math.random()})
    };

    // 删除条件行
    deleteConditionRow = rowData => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除此行条件？',
            onOk: () => {
                const { rowIndex, rowSpan } = rowData;
                let dataSource = this.state.dataSource;
                // 最少保留一行数据
                if (rowSpan >= dataSource.length) {
                    message.error('最少保留一行');
                    return;
                }
                dataSource.splice(rowIndex, rowSpan);
                this.setState({ dataSource });
                this.init();
                this.updateConditionColumns(dataSource);
                console.log("删除后的数据dataSource", dataSource);
            }
        });
    };

    // 添加属性行
    addDateRow = (rowIndex, rowSpan, isChildren) => {
        console.log(rowIndex, rowSpan);
        let dataSource = common.deepClone(this.state.dataSource);
        console.log("dataSource, rowIndex, rowSpan, isChildren", dataSource, rowIndex, rowSpan, isChildren);
        let item = dataSource[rowIndex];
        if (!isChildren) {
            item = defaultconditionsVO;
        } else {
        }
        let newItem = common.deepClone(item);
        console.log('item', item);
        let newItemConditions = common.deepClone(item.conditionVO);
        let { varName, varCode, varType, varDataType, } = newItemConditions.conditions[0].expressionVO;
        // let tempExpressionVO = common.deepClone(expressionVODemo);
        // 复制选中行的变量作为新行的变量
        console.log(' newItemConditions, varName, varCode, varType, varDataType', newItemConditions, varName, varCode, varType, varDataType);
        newItemConditions.conditions = [{
            relType: 0,
            conditions: [],
            expressionVO: {
                varName,
                varCode,
                varType,
                varDataType,
                varCategoryType: 1,
                varTableAlias: "",
                varDefaultValue: "",
                varValue: "",
                varParas: [],
                optType: 0,
                valueCategoryType: 0,//固定值
                valueTableAlias: "",
                valueType: '',
                valueDataType: '',
                valueCode: "",
                valueName: "",
                valueDefaultValue: "",
                value: "",
                valueParas: []
            },
            nodeType: 1
        }];
        if (!isChildren) {
            newItem.cellsKey = common.randomKey();
            newItem.conditionVO = newItemConditions;
            newItem.selectName = "";
        } else {
            // 从选中列开始生成独立的key
            newItemConditions.cellsKey = common.randomKey();
            // newItem.weight = "";
            newItem.score = "";
            newItem.conditionVO = newItemConditions;
            newItem.flagSelect = true;//这个没啥用了
            newItem.flagCondition = true;//这个没啥用了
        }
        // newItem.conditions.splice(conditionIndex, 1, `新条件+++++`);
        console.log('newItem', newItem);
        dataSource.splice(rowIndex + rowSpan, 0, newItem);
        console.log('添加行后', dataSource, rowIndex + rowSpan, newItem);
        this.updateConditionColumns(dataSource);
    };

    // 删除侧表头条件行
    deleteConditionRow2 = rowData => {
        Modal.confirm({
            title: '系统提示',
            content: '是否要删除内容',
            onOk: () => {
                const { rowIndex, rowSpan, } = rowData;
                // 最少保留一行数据
                if (rowSpan >= this.state.dataSource.length) {
                    message.error('不能再删了');
                    return;
                }
                let dataSource = common.deepClone(this.state.dataSource);
                console.log("rowIndex,rowSpan", rowIndex, rowSpan);
                dataSource.splice(rowIndex, rowSpan);
                this.updateConditionColumns(dataSource);
            }
        });
    };

    // 清除条件
    clearSideCondition = params => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除该条件内容？',
            onOk: () => {
                const { rowIndex, rowSpan } = params;
                let dataSource = common.deepClone(this.state.dataSource);
                console.log("dataSource, rowIndex, rowSpan", dataSource, rowIndex, rowSpan);
                let item = dataSource[rowIndex];
                let newItem = common.deepClone(item);
                console.log('item', item);
                let newItemConditions = common.deepClone(item.conditionVO);
                let { varName, varCode, varType, varDataType, } = newItemConditions.conditions[0].expressionVO;
                // let tempExpressionVO = common.deepClone(expressionVODemo);
                // 复制选中行的变量作为新行的变量
                console.log(' newItemConditions, varName, varCode, varType, varDataType', newItemConditions, varName, varCode, varType, varDataType);
                newItemConditions.conditions = [{
                    relType: 0,
                    conditions: [],
                    expressionVO: {
                        varName,
                        varCode,
                        varType,
                        varDataType,
                        varCategoryType: 1,
                        varTableAlias: "",
                        varDefaultValue: "",
                        varValue: "",
                        varParas: [],
                        optType: 0,
                        valueCategoryType: 0,//固定值
                        valueTableAlias: "",
                        valueType: '',
                        valueDataType: '',
                        valueCode: "",
                        valueName: "",
                        valueDefaultValue: "",
                        value: "",
                        valueParas: []
                    },
                    nodeType: 1
                }];
                // 从选中列开始生成独立的key
                newItemConditions.cellsKey = common.randomKey();
                newItem.score = "";
                newItem.conditionVO = newItemConditions;
                dataSource[rowIndex] = newItem;
                this.setState({ dataSource });
                this.init();
                this.updateConditionColumns(dataSource);
            }
        });
    };

    //重新选择属性
    handleChangeCondition = (conditionIndex, selectedVarType, selectedVar, rowSpan) => {
        console.log("重新选择属性", conditionIndex, selectedVarType, selectedVar, rowSpan);
        let dataSource = common.deepClone(this.state.dataSource);
        if (selectedVarType.length > 1) {
            for (let i = 0; i < dataSource.length; i++) {
                console.log("dataSource[" + i + "]", dataSource[i]);
            }
            dataSource[conditionIndex].selectName = selectedVar[1].name;
            dataSource[conditionIndex].flagCondition = true;
            dataSource[conditionIndex].flagSelect = true;
            dataSource[conditionIndex].selectId = selectedVar[1].id;
            dataSource[conditionIndex].selectCode = selectedVar[1].code;
            // dataSource[conditionIndex].conditionVO = defaultconditionsVO;
            dataSource[conditionIndex].selectValue = selectedVar[1].defaultValue;
            dataSource[conditionIndex].score = '';
            dataSource[conditionIndex].conditionVO = {
                relType: 0,
                nodeType: 2,
                conditions: [{
                    relType: 0,
                    conditions: [],
                    expressionVO: {
                        varCategoryType: 1,
                        varTableAlias: "",
                        varType: selectedVar[0].type,
                        varDataType: selectedVar[1].type,
                        varCode: selectedVar[1].code,
                        varName: selectedVar[1].name,
                        varDefaultValue: "",
                        varValue: "",
                        varParas: [],
                        optType: 0,
                        valueCategoryType: 0,//固定值
                        valueTableAlias: "",
                        valueType: '',
                        valueDataType: '',
                        valueCode: "",
                        valueName: "",
                        valueDefaultValue: selectedVar[1].defaultValue,
                        value: "",
                        valueParas: []
                    },
                    nodeType: 1
                }]
            };
        }

        dataSource.splice(conditionIndex + 1, rowSpan - 1);
        console.log('配置属性表头之后', dataSource);
        this.setState({ dataSource });
        this.init();
        this.updateConditionColumns(dataSource);
    };

    handleChangeCondition2 = () => {
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择事件源和维度');
            return;
        }
    };

    // 清除单元格内容
    clearCellContent = params => {
        const { rowIndex } = params;
        let dataSource = common.deepClone(this.state.dataSource);
        dataSource[rowIndex].score = '';
        this.updateDataSource(dataSource);
    };

    updateDataSource = dataSource => {
        this.setState({ dataSource });
        this.props.store.setDataSource(dataSource);
    };

    // 一般结构没变的可以直接setState({ dataSource})更新表格,如果不行就用这个重新生成columns
    // 表头虽然一样，但是render方法不一样，render方法是根据conditionTree的
    updateConditionColumns = dataSource => {
        this.props.store.setDataSource(dataSource);
        let conditionTree = this.getConditionTree(dataSource);
        let conditionColumns = this.generateConditionColumns(conditionTree);
        this.setState({
            header: [
                ...conditionColumns,
                this.state.rightColumn,
            ],
            dataSource
        });
        this.updateDataSource(dataSource);
        this.props.store.setDataSource(dataSource);
    };

    getConditionTree = dataSource => {
        if (common.isEmpty(dataSource)) return;
        let conditionTree = { conditions: [] };
        dataSource.forEach((dataRow, rowIndex) => {
            const { conditionVO } = dataRow;
            // 记录当前层级
            let location = conditionTree;
            let conditionItem = conditionVO;
            console.log(location);
            let currentConditionIndex = location.conditions.findIndex(item =>
                // 判断是否需要合并行，
                item.cellsKey === dataRow.cellsKey && item.childrenRows[item.childrenRows.length - 1] === rowIndex - 1
            );
            if (currentConditionIndex !== -1) {
                // console.log('%c isChild', 'color: #00f');
                if (!location.conditions[currentConditionIndex].childrenRows.includes(rowIndex)) location.conditions[currentConditionIndex].childrenRows.push(rowIndex);
                // location = location.conditions[currentConditionIndex];
            } else {
                // console.log('%c notChild', 'color: #f00');
                // childRows用来记录哪几行是他的children, rowSpanIndex是需要显示条件的行数
                location.conditions.push({
                    selectName: conditionItem.selectName,
                    cellsKey: dataRow.cellsKey,
                    childrenRows: [rowIndex],
                    rowSpanIndex: rowIndex,
                    conditions: []
                });
                // location = location.conditions[location.conditions.length - 1];
            }
        });
        console.log('侧边属性列树状结构', conditionTree);
        return conditionTree;
    };

    filter(inputValue, path) {
        return (path.some(option => String(option.value).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    generateConditionColumns = conditionTree => {
        // 根据计算好的树状数据，生成侧表头（表格左边条件列）
        let conditionColumns = [
            {
                title: '属性',
                key: 'selectName',
                dataIndex: 'selectName',
                width: '300px',
                render: (text, record, rowIndex) => {
                    console.log("text, record, rowIndex", text, record, rowIndex);
                    console.log("this.props.store.calculation", this.props.store.calculation)
                    let data = common.deepClone(this.state.varTypeList);
                    for (let i = 0; i < data.length; i++) {
                        data[i].code = data[i].type;
                    }
                    const conditionItem = record.conditionVO;
                    // location_1 = conditionTree;
                    let conditionIndex = conditionTree.conditions.findIndex(item =>
                        item.cellsKey === record.cellsKey && item.childrenRows.includes(rowIndex));
                    if (conditionIndex === -1) {
                        console.log('出错');
                        return;
                    }
                    let location_1 = conditionTree.conditions[conditionIndex];
                    let obj = {
                        props: {},
                    };
                    if (rowIndex === location_1.rowSpanIndex) {
                        // 当前单元格的合并行数
                        const currentRowSpan = location_1.childrenRows.length;
                        let menu = <Menu>
                            {/*<Menu.Item onClick={ () => this.addDateRow(rowIndex, 1, true) }>添加条件行</Menu.Item>*/}
                            {/*<Menu.Divider/>*/}
                            <Menu.Item onClick={ () => this.addDateRow(rowIndex, currentRowSpan) }>添加属性行</Menu.Item>
                            <Menu.Item onClick={ () => this.deleteConditionRow2({
                                rowIndex: rowIndex,
                                rowSpan: currentRowSpan,
                            }) }>删除属性行</Menu.Item>
                        </Menu>;

                        obj.children = <Fragment>
                            <Dropdown overlay={ menu } trigger={ ['contextMenu'] }>
                                <div className="full-cell-dropdown">
                                    <div style={ { textAlign: 'center' } }>
                                        <ScoreSelect
                                            displayRender={ label => label[1] }
                                            fieldNames={ { label: 'name', value: 'code', children: 'list' } }
                                            myValue={ this.state.dataSource[rowIndex].selectName }
                                            index={ rowIndex }
                                            options={ data }
                                            // options={this.state.allVarsList}
                                            onBlur={ (label, value) => {
                                                console.log("label, value,allVarsList,varTypeList", label, value, this.state.allVarsList, this.state.varTypeList);
                                                this.handleChangeCondition(rowIndex, label, value, currentRowSpan);
                                            } }
                                            onBlur2={ () => {
                                                this.handleChangeCondition2();
                                            } }
                                        />
                                    </div>
                                    <div style={ { display: Number(this.props.store.calculation) === 1 ? '' : 'none' } }>
                                        <div className={ "weight-label" }>权重：</div>
                                        <ScoreInput
                                            value={ record.weight }
                                            min={ 1 }
                                            max={ 100 }
                                            onBlur={ (value) => {
                                                {
                                                    console.log("权重：", value, record.weight);
                                                    this.handleChangeWeight(value, rowIndex);
                                                }
                                            } }
                                        />
                                    </div>
                                </div>
                            </Dropdown>
                        </Fragment>
                        ;

                        obj.props.rowSpan = location_1.childrenRows.length;
                    } else obj.props.rowSpan = 0;
                    return obj;
                }
            },
            {
                title: '条件',
                dataIndex: 'conditionVO',
                key: 'conditionVO',
                render: (text, record, rowIndex) => {
                    console.log("text, record, rowIndex", text, record, rowIndex);
                    const conditionItem = record.conditionVO;
                    const conditionVO = conditionItem;
                    console.log("conditionVO, conditionItem", conditionVO, conditionItem);
                    let obj = {
                        props: {},
                    };
                    let menu = <Menu>
                        <Menu.Item onClick={ () => this.configCondition({
                            rowIndex: rowIndex,
                            rowSpan: 1,
                        }) }>配置条件</Menu.Item>
                        <Menu.Item onClick={ () => this.clearSideCondition({
                            rowIndex: rowIndex,
                            rowSpan: 1,
                            isChildren: true
                        }) }>清空条件</Menu.Item>
                        <Menu.Divider/>
                        <Menu.Item onClick={ () => this.addDateRow(rowIndex, 1, true) }>添加条件行</Menu.Item>
                        <Menu.Item onClick={ () => this.deleteConditionRow({
                            rowIndex: rowIndex,
                            rowSpan: 1,
                            type: 1
                        }) }>删除条件行</Menu.Item>
                    </Menu>;

                    obj.children = <CellDropdown overlay={ menu } onClick={ () => this.configCondition({
                        rowIndex: rowIndex,
                        rowSpan: 1,
                    }) }>
                        <ConditionViewer
                            conditionVO={ conditionVO }
                            optionTextList={ this.state.optionTextList }
                        />
                    </CellDropdown>;
                    return obj;
                }
            }
        ];
        return conditionColumns;
    };

    handleChangeScore = (value, rowIndex) => {
        console.log('修改分值', value, rowIndex);
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择事件源和维度');
            return;
        }
        let dataSource = common.deepClone(this.state.dataSource);
        dataSource[rowIndex].score = value;
        this.setState({ dataSource });
        this.updateConditionColumns(dataSource);
    };
    handleChangeWeight = (value, rowIndex) => {
        console.log('修改权重', value, rowIndex);
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择事件源和维度');
            return;
        }
        let dataSource = common.deepClone(this.state.dataSource);
        dataSource[rowIndex].weight = value;
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[rowIndex].cellsKey == dataSource[i].cellsKey) {
                dataSource[i].weight = value;
            }
        }
        this.setState({ dataSource });
        this.updateConditionColumns(dataSource);
    };

    init = () => {
        console.log('this.state.dataSource', this.state.dataSource);
        const conditionTree = this.getConditionTree(this.state.dataSource);

        let conditionColumns = this.generateConditionColumns(conditionTree);

        // console.log(conditions);
        this.setState({
            // leftColumns: conditions,
            currentDataIndex: 0 // 全局变量，记录已分配的列
        });

        // // 组装成antd table用的columns
        let antColumns = [
            ...conditionColumns, // 属性列，包括属性和条件共两列
            this.state.rightColumn, // 动作列
        ];
        this.setState({ header: antColumns });
        console.log('表头结构', antColumns);
        console.log('表格数据结构', this.state.dataSource);
    };

    // 确认配置条件
    handleConfirm = () => {
        console.log('确认配置条件', this.state.currentCondition, this.lastEditConditionVO);
        // TODO test表达式
        strategyService.getSqlCodeByCondition(this.lastEditConditionVO).then(res => {
            // if (!publicUtils.isOk(res)) return ;
            console.log(res.data.result);
        });
        // test TODO 修改显示表达式
        let dataSource = this.state.dataSource;
        const { rowIndex, rowSpan } = this.state.currentCondition;
        for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
            Object.assign(dataSource[i].conditionVO, common.deepClone(this.lastEditConditionVO));
        }
        console.log('配置条件之后', dataSource);
        this.updateConditionColumns(dataSource);
        this.setState({
            currentCondition: null,
            isShowConfig: false,
            lastEditConditionVO: null
        });

    };

    handleCancel = () => {
        // console.log(this.state.currentCondition);
        this.setState({ currentCondition: null, isShowConfig: false, lastEditConditionVO: null });
    };


    render() {
        return (
            <div className="strategy-cross-table">
                <Table
                    className="config-table"
                    scroll={ { x: true } }
                    bordered={ true }
                    columns={ this.state.header }
                    dataSource={ this.state.dataSource }
                    pagination={ false }
                />

                <Modal
                    title="配置条件"
                    width={ 700 }
                    visible={ this.state.isShowConfig }
                    onOk={ this.handleConfirm }
                    onCancel={ this.handleCancel }
                >
                    { this.state.currentCondition ?
                        <div>
                            {/*<p>当前条件:
                                第{this.state.currentCondition.rowIndex + 1}行,
                                第{this.state.currentCondition.conditionIndex + 1}列,
                                共{this.state.currentCondition.rowSpan}行
                            </p>*/ }
                            <div>
                                <TreePanel
                                    eventSourceId={ this.props.eventSourceId }
                                    dimensionId={ this.props.dimensionId }
                                    entityType={ 5 }
                                    extraType="easyStrategyTable"
                                    updateConditionTree={ this.updateConditionTree }
                                    treeData={ this.state.currentCondition.conditionVO }
                                />
                            </div>
                        </div>
                        : ''
                    }
                </Modal>

            </div>
        );
    }
}

ScoreCard.propTypes = {};

export default ScoreCard;
