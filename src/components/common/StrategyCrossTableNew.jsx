import React, { Component, Fragment } from 'react';
import { Dropdown, Menu, Modal, Table, message } from "antd";
import '@/styles/components/ConfigurableTable.less';
import '@/styles/components/cross-table.less';
import common from "@/utils/common";
import { inject } from "mobx-react";
import ConditionViewer from "@/components/common/condition-viewer";
import variableService from "@/api/business/variableService";
import publicUtils from "@/utils/publicUtils";
import ThenWrapper from "@/components/business/strategy/table/ThenWrapper";
import commonService from "@/api/business/commonService";
import TreePanel from "@/components/condition-tree/TreePanel2.0";

const ThenExpressionVO = props => Object.assign({}, {
    actionType: 0,
    computeJson: '',
    executionManner: 4,
    fixedValue: '',
    fixedValueType: 0,
    parameterId: '',
    parameterName: '',
    type: 2,
    varCode: '',
    varName: '',
    varType: 0,
    computeExpression: {
        operators: [],
        varList: [
            {
                code: '',//变量CODE
                varType: '',//变量 类型
                dataType: ''//变量 数据类型
            }
        ]
    }
}, props);

const ConditionExpressionVO = props => Object.assign({}, {
    varCategoryType: 1,
    varTableAlias: '',
    varType: '',
    varDataType: '',
    varCode: '',
    varName: '',
    varDefaultValue: '',
    varValue: '',
    varParas: [],
    optType: 0,

    valueCategoryType: 0,//固定值
    valueTableAlias: '',
    valueType: '',
    valueDataType: '',
    valueCode: '',
    valueName: '',
    valueDefaultValue: '',
    value: '',
    valueParas: []
}, props);

const EmptyThenVO = () => ({
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "fixedValueType": "",
            "parameterId": "",
            "parameterName": '',
            "type": 2,
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
            "rtqVarId": ''
        },
        "nodeType": 1
    }]
});

const EmptyConditionVO = () => ({
    relType: 0,
    nodeType: 2,
    conditions: [{
        relType: 0,
        expressionVO: {
            varCategoryType: 1,
            varTableAlias: '',
            varType: '',
            varDataType: '',
            varCode: '',
            varName: '',
            varDefaultValue: '',
            varValue: '',
            varParas: [],
            optType: 0,

            valueCategoryType: 0,//固定值
            valueTableAlias: '',
            valueType: '',
            valueDataType: '',
            valueCode: '',
            valueName: '',
            valueDefaultValue: '',
            value: '',
            valueParas: []
        },
        nodeType: 1
    }]
});

let HeaderCell = (props) => (Object.assign({}, {
    conditionVO: new EmptyConditionVO(),
}, props));

const CellDropdown = props => (
    <Fragment>
        <Dropdown { ...props } trigger={ ['contextMenu'] }>
            <div className="full-cell-dropdown"/>
        </Dropdown>
        <div className="cell-dropdown-text">
            { props.children }
        </div>
    </Fragment>
);

@inject('store')
class StrategyCrossTable extends Component {
    state = {
        strategyTableName: '',
        conditionColumns: [],
        leftColumnCount: 0, // 条件列列数
        rightColumns: [],
        header: [],
        dataSource: [],

        optionTextList: {}, // 规则表达式选项中文对照表
        // 条件弹窗
        isShowConfig: false,
        currentCondition: null,
        // 表头条件配置
        currentHeaderCondition: null,
        // Then弹窗
        isShowConfig2: false,
        currentActionCell: null,

        // Then组件的
        varTypeList: [],
        optTypeList: [],
        valueTypeList: [],
        varTypeOfField: '',
        cascadeData: [],
        cascadeDataNumber: [],
        // 优化追加
        VAR_SELECTION_ALL: [],
        VAR_SELECTION_TIMESTAMP: [],
        VAR_SELECTION_VARCHAR: [],
        VAR_SELECTION_NUMBER: [],
        PARAMS_VAR_SELECTION_TIMESTAMP: [],
        PARAMS_VAR_SELECTION_VARCHAR: [],
        PARAMS_VAR_SELECTION_NUMBER: [],
        PARAMS_VAR_SELECTION_ALL: []
    };
    lastEditConditionVO = null;
    lastEditConditionThen = null;
    lastEditConditionVO2 = null;

    componentDidMount() {
        // console.log(this.state.dataSource);

        // 获取表达式类型
        variableService.getOptTypeList().then(res => {
            if (!publicUtils.isOk(res)) return;
            // console.log(res.data.result);
            let optionTextList = {};
            let optTypeList = [];
            if (common.isEmpty(res.data.result)) return;
            res.data.result.forEach(opt => {
                optionTextList[opt.val] = opt.label;
                optTypeList.push({
                    code: opt.val,
                    value: opt.label
                });
            });
            // console.log(optionTextList);
            this.setState({
                optionTextList,
                optTypeList
                // }, this.init);
            }, () => this.initTableData(this.props));
        });
        // 获取表达式变量类型列表
        variableService.getEnumList("expressionVarType").then(res => {
            if (!publicUtils.isOk(res)) return;
            const temp = res.data.result.find(element => element.mode === 'columnField');
            if (temp) this.setState({ varTypeOfField: temp.val });
        });
        // 下面四个接口都是获取ThenWrapper里面的Then组件所需要的数据
        variableService.getExpressionValueTypeList().then(res => {
            if (!publicUtils.isOk(res)) return;
            let valueTypeList = [{
                code: 'var',
                value: '变量'
            }];
            res.data.result.forEach(element => {
                if (['value', 'fun'].includes(element.mode)) {
                    valueTypeList.push({
                        code: element.val,
                        value: element.label
                    });
                }
            });
            this.setState({ valueTypeList });
        });
        commonService.getParamSelection().then(res => {
            if (!publicUtils.isOk(res)) return;
            let paramList = res.data.result.map(element => ({
                // id: element.id,
                value: element.id,
                name: element.name,
                search: `${ element.name }${ element.id }`,
                type: element.type,
                defaultValue: element.defaultValue,
                code: element.code,
            }));
            this.setState({ paramList });
        });
        commonService.getAllParamsSelection().then(res => {
            if (!publicUtils.isOk(res)) return;
            // let fixVarSelection = (data) => {
            //     data.forEach(element => {
            //         const { id, name, type, defaultValue, code, } = element;
            //         tempArray.push({
            //             // id,
            //             name,
            //             search: `${ name }${ id }`,
            //             type,
            //             defaultValue,
            //             code,
            //             value: id,
            //         });
            //     });
            //     return data;
            // };
            let PARAMS_VAR_SELECTION_ALL = [], PARAMS_VAR_SELECTION_TIMESTAMP = [], PARAMS_VAR_SELECTION_VARCHAR = [],
                PARAMS_VAR_SELECTION_NUMBER = [];
            if (res.data.result.VAR_SELECTION_ALL) PARAMS_VAR_SELECTION_ALL = res.data.result.VAR_SELECTION_ALL;
            if (res.data.result.VAR_SELECTION_NUMBER) PARAMS_VAR_SELECTION_NUMBER = res.data.result.VAR_SELECTION_NUMBER;
            if (res.data.result.VAR_SELECTION_TIMESTAMP) PARAMS_VAR_SELECTION_TIMESTAMP = res.data.result.VAR_SELECTION_TIMESTAMP;
            if (res.data.result.VAR_SELECTION_VARCHAR) PARAMS_VAR_SELECTION_VARCHAR = res.data.result.VAR_SELECTION_VARCHAR;
            this.setState({
                PARAMS_VAR_SELECTION_ALL,
                PARAMS_VAR_SELECTION_TIMESTAMP,
                PARAMS_VAR_SELECTION_VARCHAR,
                PARAMS_VAR_SELECTION_NUMBER
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log('props更新', nextProps, this.props);
        // 防止多次初始化表格耗费性能,
        // 防止保存时候更新表格导致数据丢失
        console.log('nextProps', nextProps);
        if (
            nextProps.tableName === this.props.tableName &&
            nextProps.dataRows === this.props.dataRows &&
            nextProps.headers === this.props.headers &&
            nextProps.varTypeList === this.props.varTypeList &&
            nextProps.rtqVarList === this.props.rtqVarList &&
            nextProps.eventSourceId === this.props.eventSourceId &&
            nextProps.dimensionId === this.props.dimensionId
        ) return;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('重新初始化表格');
            this.initTableData(nextProps);
        }, 200);
    }

    initTableData = props => {
        console.log('initTableData props', props);
        const {
            dataRows, // 接口获得的body数据，分为type 0（左边）和type 1（右边）
            headers, // 接口获得的body数据，type同上
            varTypeList, // 下拉菜单内容
            rtqVarList, // 下拉菜单内容
            eventSourceId,
            dimensionId,
            tableName,
        } = props;
        if (common.isEmpty(dataRows) || common.isEmpty(headers)) return;
        // console.log('从props接收到的数据', varTypeList);
        const rightColumns = headers;
        this.setState({
            varTypeList,
            rtqVarList,
            headers,
            strategyTableName: tableName
        }, () => {
            // 先formatDataSource处理接口获得的数据转为dataSource格式，然后更新表格的columns和dataSource
            this.updateColumns(this.formatDataSource(dataRows), rightColumns);
        });
        if (common.isEmpty(dimensionId)) return;
        console.log('有dimensionId, 可以获取变量列表');
        variableService.getAllVarList2(eventSourceId, dimensionId, 4, false).then(res => {
            if (!publicUtils.isOk(res)) return;
            let cascadeData = res.data.result.map(element => ({
                value: String(element.type),
                label: element.name,
                children: element.list.map(element2 => ({
                    value: element2.code + '·-·' + element2.type,
                    label: element2.name,
                    defaultValue: element2.defaultValue,
                    id: element2.id
                }))
            }));
            this.setState({ cascadeData });
        });
        variableService.getAllVarList2(eventSourceId, dimensionId, 4, true).then(res => {
            if (!publicUtils.isOk(res)) return;
            let cascadeDataNumber = res.data.result.map(element => ({
                value: String(element.type),
                label: element.name,
                children: element.list.map(element2 => ({
                    value: element2.code + '·-·' + element2.type,
                    label: element2.name,
                    defaultValue: element2.defaultValue,
                    id: element2.id
                }))
            }));
            this.setState({ cascadeDataNumber });
        });
        let fixVarSelection = (data) => {
            let tempArray = [];
            data.forEach(element => {
                let temp = {
                    value: String(element.type),
                    label: element.name,
                    children: []
                };
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code + '·-·' + element2.type,
                        label: element2.name,
                        defaultValue: element2.defaultValue,
                        id: element2.id
                    });
                });
                tempArray.push(temp);
            });
            return tempArray;
        };
        commonService.getAllVarSelection(dimensionId, eventSourceId, 4).then(res => {
            if (!publicUtils.isOk(res)) return;
            let VAR_SELECTION_ALL = [], VAR_SELECTION_TIMESTAMP = [], VAR_SELECTION_VARCHAR = [],
                VAR_SELECTION_NUMBER = [];
            if (res.data.result.VAR_SELECTION_ALL) VAR_SELECTION_ALL = fixVarSelection(res.data.result.VAR_SELECTION_ALL);
            if (res.data.result.VAR_SELECTION_NUMBER) VAR_SELECTION_NUMBER = fixVarSelection(res.data.result.VAR_SELECTION_NUMBER);
            if (res.data.result.VAR_SELECTION_TIMESTAMP) VAR_SELECTION_TIMESTAMP = fixVarSelection(res.data.result.VAR_SELECTION_TIMESTAMP);
            if (res.data.result.VAR_SELECTION_VARCHAR) VAR_SELECTION_VARCHAR = fixVarSelection(res.data.result.VAR_SELECTION_VARCHAR);
            this.setState({
                VAR_SELECTION_ALL,
                VAR_SELECTION_TIMESTAMP,
                VAR_SELECTION_VARCHAR,
                VAR_SELECTION_NUMBER
            });
        });
    };

    // 初始化或重绘表格
    init = () => {
        this.updateColumns(this.state.dataSource);
    };

    formatDataSource = dataRows => {
        let dataSource = [];
        if (common.isEmpty(dataRows)) return;
        dataRows.forEach((_dataRow) => {
            const dataRow = {
                conditions: [],
            };
            let colCount = 0; // 记录当前行有多少列
            _dataRow.forEach(item => {
                if (item.type === 0) {
                    dataRow.conditions.push(item);
                } else if (item.type === 1) {
                    item.conditionThen = {
                        nodeType: 2,
                        relType: 0,
                        conditions: [{
                            nodeType: 1,
                            relType: 0,
                            expressionVO: item.assignmentVO
                        }]
                    };
                    dataRow[`c${ colCount }`] = item;
                    colCount += 1;
                }
            });
            dataSource.push(dataRow);
        });
        console.log('数据格式化', dataSource);
        return dataSource;
    };

    // 只更新dataSource
    updateDataSource = dataSource => {
        this.props.store.setDataSource(dataSource);
        this.setState({ dataSource });
    };

    // 更新dataSource和columns
    updateColumns = (dataSource = this.state.dataSource, rightColumns = this.state.rightColumns) => {
        // 将更新的表格数据传回save页面
        this.props.store.setDataSource(dataSource);
        this.props.store.setRightColumns(rightColumns);
        const conditionTree = this.generateConditionTree(dataSource);
        let location_1 = conditionTree;
        // 根据计算好的树状数据，生成侧表头（表格左边条件列）
        // 根据dataSource的conditions生成伪条件列columns
        const leftColumnCount = dataSource[0].conditions.length;
        let conditionColumns = dataSource[0].conditions.map((item, index) => {
            return {
                title: this.state.strategyTableName,
                key: index,
                dataIndex: index,
                className: 'condition-cell',
                width: 80,
                render: (text, record, rowIndex) => {
                    // console.log(record);
                    const conditionItem = record.conditions[index];
                    const { conditionVO } = conditionItem;
                    if (index === 0) location_1 = conditionTree;
                    let conditionIndex = location_1.conditions.findIndex(item =>
                        item.cellsKey === conditionItem.cellsKey && item.childrenRows.includes(rowIndex));
                    // console.log('conditionIndex', conditionIndex);
                    location_1 = location_1.conditions[conditionIndex];
                    // console.log(conditionIndex, conditionItem, location_1);
                    let obj = {
                        props: {},
                    };
                    if (rowIndex === location_1.rowSpanIndex) {
                        const currentRowSpan = location_1.childrenRows.length;
                        // console.log('location_1', location_1);
                        let menu = <Menu>
                            <Menu.Item onClick={ () => this.configCondition({
                                conditionIndex: index,
                                rowIndex: rowIndex,
                                rowSpan: currentRowSpan,
                            }) }>配置条件</Menu.Item>
                            <Menu.SubMenu title="插入列">
                                <Menu.Item onClick={ () => this.addFrontCondition(index) }>前</Menu.Item>
                                <Menu.Item onClick={ () => this.addBackCondition(index) }>后</Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item
                                onClick={ () => this.addDateRow(rowIndex, index, currentRowSpan) }>添加行</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item onClick={ () => this.clearSideCondition({
                                conditionIndex: index,
                                rowIndex: rowIndex,
                                rowSpan: currentRowSpan,
                            }) }>清空条件</Menu.Item>
                            <Menu.Item onClick={ () => this.deleteConditionCol(index) }>删除列</Menu.Item>
                            <Menu.Item onClick={ () => this.deleteConditionRow({
                                rowIndex: rowIndex,
                                rowSpan: currentRowSpan,
                            }) }>删除行</Menu.Item>
                        </Menu>;
                        let content = <ConditionViewer
                            conditionVO={ conditionVO }
                            optionTextList={ this.state.optionTextList }
                            isShowVarName={ true }
                        />;
                        obj.children = <CellDropdown overlay={ menu } onClick={ () => this.configCondition({
                            conditionIndex: index,
                            rowIndex: rowIndex,
                            rowSpan: currentRowSpan,
                        }) }>
                            { content }
                        </CellDropdown>;
                        obj.props.rowSpan = location_1.childrenRows.length;
                    } else obj.props.rowSpan = 0;
                    // console.log(obj);
                    return obj;
                    // return record.conditions[index];
                }
            };
        });
        this.currentColCount = 0; // 全局变量，记录已分配的列
        // 处理上表头结构，分配对应的key和dataIndex
        const rightColumnsWithDataIndex = rightColumns.map((columnItem, index) =>
            this.generateColumns(columnItem, index, [index]));
        console.log('动作列columns', rightColumnsWithDataIndex);
        let header = [
            ...conditionColumns,
            ...rightColumnsWithDataIndex,
        ];
        this.setState({
            header,
            dataSource,
            rightColumns: rightColumnsWithDataIndex,
            leftColumnCount
        }, () => {
            // 选择表头属性列的单元格，合并表头第一个单元格
            let ths = document.querySelectorAll('th.condition-cell');
            // console.log(ths);
            ths.forEach((th, thIndex) => {
                if (thIndex === 0) th.colSpan = ths.length;
                else {
                    th.style.display = 'none';
                }
            });
        });
    };

    // 根据dataSource中的conditions计算侧表头的行合并
    generateConditionTree = dataSource => {
        if (common.isEmpty(dataSource)) return;
        let conditionTree = { conditions: [] };
        dataSource.forEach((dataRow, rowIndex) => {
            const { conditions } = dataRow;
            let location = conditionTree; // 浮标记录当前层级
            conditions.forEach((conditionItem) => {
                // 找cellsKey相同的，且连续的进行合并行
                let currentConditionIndex = location.conditions.findIndex(item =>
                    // 每行数据必须要有key作为判断条件，否则无法清空条件
                    item.cellsKey === conditionItem.cellsKey && item.childrenRows[item.childrenRows.length - 1] === rowIndex - 1
                );
                if (currentConditionIndex !== -1) {
                    // console.log('%c isChild', 'color: #00f');
                    if (!location.conditions[currentConditionIndex].childrenRows.includes(rowIndex)) location.conditions[currentConditionIndex].childrenRows.push(rowIndex);
                    location = location.conditions[currentConditionIndex];
                } else {
                    // console.log('%c notChild', 'color: #f00');
                    // childRows用来记录哪几行是他的children, rowSpanIndex是需要显示条件的行数
                    location.conditions.push({
                        name: conditionItem,
                        cellsKey: conditionItem.cellsKey,
                        childrenRows: [rowIndex],
                        rowSpanIndex: rowIndex,
                        conditions: []
                    });
                    location = location.conditions[location.conditions.length - 1];
                }
            });
        });
        console.log('生成conditionTree', conditionTree);
        return conditionTree;
    };

    // 处理上表头右边数据部分结构，分配key和dataIndex, context记录层级
    generateColumns = (columnItem, itemIndex, context) => {
        const { children, conditionVO, cellsKey } = columnItem;
        let columnIndex = this.currentColCount;
        let menu = <Menu>
            <Menu.Item onClick={ () => this.configHeaderCondition({ context }) }>配置条件</Menu.Item>
            <Menu.SubMenu title="插入列">
                <Menu.Item onClick={ () => this.addHeaderCol({
                    columnItem,
                    itemIndex,
                    context,
                    isAddBack: false
                }) }>前</Menu.Item>
                <Menu.Item onClick={ () => this.addHeaderCol({
                    columnItem,
                    itemIndex,
                    context,
                    isAddBack: true
                }) }>后</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item onClick={ () => this.addHeaderRow({ depth: context.length }) }>添加行</Menu.Item>
            <Menu.Divider/>
            <Menu.Item onClick={ () => this.clearHeaderColConditions({
                context
            }) }>清空内容</Menu.Item>
            <Menu.Item onClick={ () => this.deleteHeaderCol({ columnItem, itemIndex, context }) }>删除列</Menu.Item>
            <Menu.Item onClick={ () => this.deleteHeaderRow({ context }) }>删除行</Menu.Item>
        </Menu>;
        let result = {
            conditionVO,
            cellsKey,
            title: <CellDropdown overlay={ menu }>
                <ConditionViewer conditionVO={ conditionVO } optionTextList={ this.state.optionTextList }
                                 isShowVarName={ true }/>
            </CellDropdown>
        };
        // console.log(`第${ context }列`, this.currentColCount);
        if (!children) {
            result = {
                ...result,
                key: `c${ this.currentColCount }`,
                dataIndex: `c${ this.currentColCount }`,
                columnIndex: this.currentColCount,
                className: 'cross-table-right-column',
                render: (text, record, rowIndex) => {
                    let cellMenu = <Menu>
                        <Menu.Item onClick={ () => this.configAction({
                            rowIndex,
                            columnIndex,
                            data: record
                        }) }>配置内容</Menu.Item>
                        <Menu.Item onClick={ () => this.clearThenContent({
                            columnIndex,
                            rowIndex,
                        }) }>清空内容</Menu.Item>
                    </Menu>;
                    const treeData = record[`c${ columnIndex }`].conditionThen.conditions.map(item => item.expressionVO);
                    return <CellDropdown overlay={ cellMenu }
                                         onClick={ () => this.configAction({ rowIndex, columnIndex, data: record }) }>
                        <div className="then-wrapper">
                            <ThenWrapper
                                key={ `r${ rowIndex }c${ columnIndex }` }
                                rtqVarList={ this.props.rtqVarList }
                                optTypeList={ this.state.optTypeList }
                                valueTypeList={ this.state.valueTypeList }
                                varTypeOfField={ this.state.varTypeOfField }
                                paramList={ this.state.paramList }
                                cascadeData={ this.state.cascadeData }
                                cascadeDataNumber={ this.state.cascadeDataNumber }
                                // updateConditionThen={ conditionsAll => this.handleChangeThen(conditionsAll, rowIndex, columnIndex) }
                                treeData={ treeData }
                                p_relType={ record[`c${ columnIndex }`].conditionThen.relType }
                                extraType="easyStrategyTable"
                                disabled

                                // 优化追加
                                VAR_SELECTION_ALL={ this.state.VAR_SELECTION_ALL }
                                VAR_SELECTION_TIMESTAMP={ this.state.VAR_SELECTION_TIMESTAMP }
                                VAR_SELECTION_VARCHAR={ this.state.VAR_SELECTION_VARCHAR }
                                VAR_SELECTION_NUMBER={ this.state.VAR_SELECTION_NUMBER }
                                PARAMS_VAR_SELECTION_ALL={ this.state.PARAMS_VAR_SELECTION_ALL }
                                PARAMS_VAR_SELECTION_TIMESTAMP={ this.state.PARAMS_VAR_SELECTION_TIMESTAMP }
                                PARAMS_VAR_SELECTION_VARCHAR={ this.state.PARAMS_VAR_SELECTION_VARCHAR }
                                PARAMS_VAR_SELECTION_NUMBER={ this.state.PARAMS_VAR_SELECTION_NUMBER }
                            />
                        </div>
                    </CellDropdown>;
                }
            };
            this.currentColCount += 1;
        } else {
            result = {
                ...result,
                children: children.map((item, index) => this.generateColumns(item, index, [...context, index]))
            };
        }
        return result;
    };

    // 配置动作列表格内容，弹窗修改
    configAction = params => {
        const { columnIndex, rowIndex, } = params;
        const currentActionCell = {
            rowIndex,
            columnIndex,
            conditionThen: this.state.dataSource[rowIndex][`c${ columnIndex }`].conditionThen
        };
        this.lastEditConditionThen = common.deepClone(this.state.dataSource[rowIndex][`c${ columnIndex }`].conditionThen);
        console.log('currentActionCell', currentActionCell);
        this.setState({
            currentActionCell,
            isShowConfig2: true
        });
    };

    // ThenWrapper的回调
    handleModalChangeThen = (conditionAll, rowIndex, columnIndex) => {
        console.log('%c 实际更新', 'color: #00f', rowIndex, columnIndex, conditionAll);
        // 用setState会丢失焦点，更新dataSource太频繁难以控制
        this.lastEditConditionThen.conditions = conditionAll.map(item => ({
            expressionVO: item,
            nodeType: 1,
            relType: 0
        }));
    };

    // 确认配置动作内容
    handleConfirm2 = () => {
        console.log('确认配置动作内容', this.state.currentActionCell, this.lastEditConditionThen);
        let dataSource = common.deepClone(this.state.dataSource);
        const { rowIndex, columnIndex } = this.state.currentActionCell;
        dataSource[rowIndex][`c${ columnIndex }`].conditionThen = this.lastEditConditionThen;
        this.updateDataSource(dataSource);
        this.setState({
            currentActionCell: null,
            isShowConfig2: false
        });
        this.lastEditConditionThen = null;
        console.log('存储数据的的DS', dataSource);
    };

    handleCancel2 = () => {
        this.setState({
            currentActionCell: null,
            isShowConfig2: false
        });
        this.lastEditConditionThen = null;
    };

    // 表头配置条件
    configHeaderCondition = params => {
        const { context, } = params;
        let rightColumns = common.deepClone(this.state.rightColumns);
        let location = { children: rightColumns };
        if (common.isEmpty(context)) return;
        context.forEach(key => {
            location = location.children[key];
        });
        console.log('location', location);
        this.lastEditConditionVO2 = common.deepClone(location.conditionVO);
        const currentHeaderCondition = {
            context,
            conditionVO: location.conditionVO
        };
        this.setState({
            currentHeaderCondition,
            isShowConfig3: true
        });
    };

    // 接受动作配置内容的回调的传回
    updateConditionTree2 = (lastEditConditionVO, refresh) => {
        console.log('表头条件更新', refresh, lastEditConditionVO);
        this.lastEditConditionVO2 = lastEditConditionVO;
    };

    // 关闭配置条件弹窗
    handleCancel3 = () => {
        this.setState({
            currentHeaderCondition: null,
            isShowConfig3: false,
        });
        this.lastEditConditionVO2 = null;
    };

    // 确认配置条件
    handleConfirm3 = () => {
        console.log('确认配置条件', this.state.currentHeaderCondition, this.lastEditConditionVO2);
        const { context } = this.state.currentHeaderCondition;
        if (common.isEmpty(context)) return;
        let rightColumns = common.deepClone(this.state.rightColumns);
        let location = { children: rightColumns };
        context.forEach(key => {
            location = location.children[key];
        });
        location.conditionVO = this.lastEditConditionVO2;
        console.log('配置表头条件后', rightColumns);
        this.updateColumns(this.state.dataSource, rightColumns);
        this.setState({
            currentHeaderCondition: null,
            isShowConfig3: false,
        });
        this.lastEditConditionVO2 = null;
    };

    // 表头添加列, 新增的列应该保留与选择列的层级相同
    addHeaderCol = options => {
        // 限制列数，不超过10列
        if (this.currentColCount === 10) {
            message.error('最多10列');
            return;
        }
        // itemIndex是item在children中的index
        const { itemIndex, context, isAddBack = true } = options;
        console.log('itemIndex', itemIndex);
        const colFix = isAddBack ? 1 : 0;
        console.log('rightColumns', this.state.rightColumns);
        let rightColumns = common.deepClone(this.state.rightColumns); // 这是已经分配了dataIndex和columnIndex,和context的，不对其直接修改
        let dataLocation = { children: rightColumns }; // 通过这个浮标找到选中的单元格
        let tempItem; // 递归找选中的columnItem
        for (let i = 0; i < context.length; i++) {
            if (i !== 0) {
                // location = location.children[context[i - 1]];
                dataLocation = dataLocation.children[context[i - 1]];
            }
            tempItem = dataLocation.children[context[i]];
            console.log('tempItem', tempItem);
        }

        // 找到选中单元格的最后一个子列
        const findLastChildOfSelectedCell = (item) => {
            if (item.children) {
                return findLastChildOfSelectedCell(item.children[item.children.length - 1]);
            } else {
                return item;
            }
        };
        let lastChildOfSelectedCell = findLastChildOfSelectedCell(tempItem);
        console.log('lastChildOfSelectedCell', lastChildOfSelectedCell);
        let dataColumnIndex = lastChildOfSelectedCell.columnIndex + colFix;
        console.log('插入列的Index', dataColumnIndex);

        // 根据选中的列生成一个跟它层级数一样的列 TODO 这里联调的时候要根据 VO
        let newItem = this.generateSingleCol({
            item: common.deepClone(tempItem)
        });
        dataLocation.children.splice(itemIndex + colFix, 0, newItem);
        // 初始化该列数据，并对该列之后其他列全部后移一列, tempColumns是从api获取的非表头部分数据
        let dataSource = common.deepClone(this.state.dataSource);
        // this.currentColCount是之前init记录的最大列数
        dataSource.forEach((dataRow) => {
            // 从最后一列开始获取前一列的数据
            for (let i = this.currentColCount; i > dataColumnIndex; i--) {
                // console.log(i);
                dataRow[`c${ i }`] = common.deepClone(dataRow[`c${ i - 1 }`]);
            }
            dataRow[`c${ dataColumnIndex }`] = {
                type: 1,
                conditionThen: new EmptyThenVO()
            };
        });
        console.log('表头添加列之后', dataSource, rightColumns);
        this.updateColumns(dataSource, rightColumns);
    };

    // 删除表头列
    deleteHeaderCol = options => {
        const { itemIndex, context, isShowConfirm = true } = options;
        console.log('context', itemIndex, context, isShowConfirm);
        let rightColumns = common.deepClone(this.state.rightColumns);
        let dataLocation = { children: rightColumns };
        let tempItem; // 递归找选中的columnItem
        for (let i = 0; i < context.length; i++) {
            if (i !== 0) {
                dataLocation = dataLocation.children[context[i - 1]];
            }
            tempItem = dataLocation.children[context[i]];
            console.log('tempItem', tempItem);
        }

        // 这个需要找到选中的cell下对应的最后一列dataIndex, +1就是下一列要插入的地方
        // 如果删除父级,子级也会被删除，最后删除多列
        let deleteColumns = this.flattenHeaderColItem({
            item: tempItem
        });
        console.log('deleteColumns', deleteColumns);
        let deleteCount = deleteColumns.length;
        if (deleteCount >= this.currentColCount) {
            message.error('最少1列');
            return;
        }
        // 因为这个方法有递归的地方，如果是第一次执行的时候一般需要弹窗提示，后续删除子列的时候会递归删除父级就不需要弹窗了
        let onOk = () => {
            // console.log('deleteColumns', deleteColumns);
            let deleteStartIndex = Number(deleteColumns[0].dataIndex.split('c')[1]);
            // console.log(deleteStartIndex);


            // 只有1个子列不可以直接删除，删不了子列就删除父级，索引不能倒回去，只能重新找一边它的父级，如果父级也是只有一个子列继续往上找
            // console.log(location);
            if (dataLocation.children.length > 1) {
                dataLocation.children.splice(itemIndex, 1);
            } else {
                let fatherOptions = {
                    itemIndex: context[context.length - 2],
                    context: context.slice(0, context.length - 1),
                    isShowConfirm: false
                };
                // 最少一个子列，删不了儿子就删他爹，后面就不用执行了
                this.deleteHeaderCol(fatherOptions);
                return;
            }
            // 初始化该列数据，并对该列之后其他列全部前移 n 列, tempColumns是从api获取的非表头部分数据
            let dataSource = common.deepClone(this.state.dataSource);
            // this.currentColCount是之前init记录的最大列数
            dataSource.forEach((dataRow) => {
                for (let i = deleteStartIndex; i < this.currentColCount - deleteCount; i++) {
                    // console.log('更新第' + i + '列');
                    dataRow[`c${ i }`] = common.deepClone(dataRow[`c${ i + 1 }`]);
                }
                // 删除多余的最后一列
                delete dataRow[`c${ this.currentColCount - 1 }`];
            });
            this.updateColumns(dataSource, rightColumns);
        };
        if (isShowConfirm) {
            Modal.confirm({
                title: '系统提示',
                content: '是否删除此列？',
                onOk,
            });
        } else {
            onOk();
        }
    };

    // 清除表头条件
    clearHeaderColConditions = params => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除内容？',
            onOk: () => {
                const { context } = params;
                let rightColumns = common.deepClone(this.state.rightColumns);
                let dataLocation = { children: rightColumns };
                let selectedItem; // 递归找选中的columnItem
                for (let i = 0; i < context.length; i++) {
                    if (i !== 0) {
                        dataLocation = dataLocation.children[context[i - 1]];
                    }
                    selectedItem = dataLocation.children[context[i]];
                }
                selectedItem.conditionVO = new EmptyConditionVO();
                this.updateColumns(this.state.dataSource, rightColumns);
            }
        });
    };

    // 动作列Then清空内容
    clearThenContent = params => {
        const { rowIndex, columnIndex, } = params;
        Modal.confirm({
            title: '系统提示',
            content: '是否删除内容？',
            onOk: () => {
                let defaultConditions = [{
                    expressionVO: new ThenExpressionVO(),
                    nodeType: 1,
                    relType: 0
                }];
                console.log('%c 清空内容', 'color: #00f', rowIndex, columnIndex);
                let dataSource = common.deepClone(this.state.dataSource);
                // let dataSource = common.deepClone(this.state.dataSource);
                dataSource[rowIndex][`c${ columnIndex }`].conditionThen.conditions = defaultConditions;
                this.updateDataSource(dataSource);
            }
        });
    };

    // 表头添加行
    addHeaderRow = params => {
        let { depth } = params; // 选中单元格的深度
        let rightColumns = common.deepClone(this.state.rightColumns);
        // 获取指定深度的全部子列
        let flatColumns = this.flattenHeaderColItem({
            item: { children: common.deepClone(this.state.rightColumns) },
            depth,
        });
        console.log('flatColumns', flatColumns);
        flatColumns.forEach(column => {
            let location = { children: rightColumns };
            column.context.forEach(colIndex => {
                location = location.children[colIndex];
            });
            let newChild = new HeaderCell({
                cellsKey: common.randomKey()
            });
            if (location.children) newChild.children = common.deepClone(location.children);
            console.log('newChild', newChild);
            location.children = [newChild];
        });
        // console.log(flatColumns);
        console.log('添加行之后', rightColumns);
        this.updateColumns(this.state.dataSource, rightColumns);
    };

    // 表头删除行
    deleteHeaderRow = params => {
        // 先获取选中行的父级们
        let { context, rightColumns = common.deepClone(this.state.rightColumns), isShowConfirm = true } = params; // 选中单元格的深度
        console.log('删除的context', context);
        const depth = context.length;
        let isLastRow = false;
        if (depth === 1 && !rightColumns[0].children) {
            message.error('不能少于1行');
            return;
        }

        let onOk = () => {
            // 获取指定深度的全部子列
            let flatColumns = this.flattenHeaderColItem({
                item: { children: common.deepClone(this.state.rightColumns) },
                depth: depth - 1,
            });
            // console.log('flatColumns', flatColumns);
            flatColumns.forEach(column => {
                let location = { children: rightColumns };
                column.context.forEach(colIndex => {
                    location = location.children[colIndex];
                });
                // console.log('location', location);
                // 如果是第一行
                if (depth === 1) {
                    let newChildren = [];
                    // 将子级的children合并成为新的children
                    location.children.forEach((child) => {
                        newChildren.push(...common.deepClone(child.children));
                    });
                    // 将新的children赋值给父级
                    rightColumns = newChildren;
                }
                // 判断是否中间的行
                else if (location.children[0].children) {
                    let newChildren = [];
                    // 将子级的children合并成为新的children
                    location.children.forEach((child) => {
                        newChildren.push(...common.deepClone(child.children));
                    });
                    // 将新的children赋值给父级
                    location.children = newChildren;
                }
                // 如果是最后一行，且父级有列合并就不能直接删除，需要先拆开
                // 直接删除（delete location.children）会导致数据对不上
                // 逻辑很简单，但是操作较复杂
                // 目前的做法是先将父级的conditionVO赋值给子列（这样子列就会保留了其对应的dataIndex而且继承了父级的conditionVO），再将父级删除
                // 判断是否有列合并做法跟当前逻辑有冲突，所以现在不论是否有列合并都相同操作
                // 这样做的好处就是可以保证dataSource的数据能对得上原本的列，否则需要对dataSource删列处理
                else {
                    // delete location.children;
                    if (!isLastRow) isLastRow = true;
                    location.children.forEach(child => {
                        child.conditionVO = common.deepClone(location.conditionVO);
                    });
                }
            });
            if (isLastRow) {
                this.deleteHeaderRow({
                    context: context.slice(0, context.length - 1),
                    rightColumns,
                    isShowConfirm: false,
                });
                return;
            }
            console.log('删除行之后', rightColumns);
            this.updateColumns(this.state.dataSource, rightColumns);
        };
        if (isShowConfirm) {
            Modal.confirm({
                title: '系统提示',
                content: '是否要删除此行？',
                onOk,
            });
        } else {
            onOk();
        }
    };

    // 计算表头选中列的子列总数
    calHeaderColCount = options => {
        const { selectedItem, count } = options;
        let currentCount = count;
        if (selectedItem.children) {
            selectedItem.children.forEach(child => {
                currentCount += this.calHeaderColCount({
                    selectedItem: child,
                    currentCount
                });
            });
        } else {
            currentCount = count + 1;
        }
        return currentCount;
    };

    /*
    获取表头选中单元格(item)指定深度的整行全部column，
    currentDeep 初始深度，
    depth 目标深度，默认无限，
    context 初始context
    */
    flattenHeaderColItem = ({ item, currentDeep = 0, depth, context = [] }) => {
        item.deep = currentDeep;
        item.context = context;
        if (item.children && currentDeep !== depth) {
            return item.children.map((child, index) => this.flattenHeaderColItem({
                item: child,
                currentDeep: currentDeep + 1,
                depth,
                context: [...context, index]
            })).flat();
        } else {
            return [item];
        }
    };

    // 计算rowSpan
    calcCellRowSpan = item => {
        let sum = 0;
        if (item.children) {
            item.children.forEach(child => {
                sum += this.calcCellRowSpan(child);
            });
            return sum;
        } else {
            return 1;
        }
    };

    // 向前增加条件
    addFrontCondition = index => this.addCondition(index, false);
    // 向后增加条件
    addBackCondition = index => this.addCondition(index, true);

    // 插入条件列
    addCondition = (index, isAddAfter) => {
        if (this.state.leftColumnCount >= 5) {
            message.error('属性列最多 5 列');
            return;
        }
        let dataSource = common.deepClone(this.state.dataSource);
        // 插入位置
        let insertIndex = isAddAfter ? index + 1 : index;

        // 先看选中那一列的cellsKey是否跟上一行的cellsKey相同，如果相同就分配相同的随机key，如果不相同就重新生成随机Key
        let lastKey,
            randomKey = common.randomKey();
        dataSource.forEach(item => {
            let selectedColCellsKey = item.conditions[index].cellsKey;
            if (lastKey !== selectedColCellsKey) {
                randomKey = common.randomKey();
            }
            lastKey = selectedColCellsKey;
            item.conditions.splice(insertIndex, 0, {
                cellsKey: randomKey,
                conditionVO: {
                    relType: 0,
                    nodeType: 2,
                    conditions: [{
                        relType: 0,
                        conditions: [],
                        expressionVO: new ConditionExpressionVO(),
                        nodeType: 1
                    }
                    ]
                },
                type: 0
            });
        });
        console.log('插入条件列后', dataSource);
        this.updateColumns(dataSource);
    };

    // 删除条件列
    deleteConditionCol = colIndex => {
        if (this.state.leftColumnCount === 1) {
            message.error('不能再删了');
            return;
        }
        Modal.confirm({
            title: '系统提示',
            content: '是否要删除内容',
            onOk: () => {
                let dataSource = common.deepClone(this.state.dataSource);
                dataSource.forEach(item => {
                    // 如果删除的是最后一列，要将前一列的全部合并单元格全部拆开
                    if (colIndex === this.state.leftColumnCount - 1) {
                        item.conditions[colIndex - 1].cellsKey = common.randomKey();
                    }
                    item.conditions.splice(colIndex, 1);
                });

                console.log('删除之后', dataSource);
                this.updateColumns(dataSource);
            }
        });
    };

    // 添加侧表头条件行
    addDateRow = (rowIndex, conditionIndex, rowSpan) => {
        console.log('添加条件行', rowIndex, conditionIndex, rowSpan);
        let dataSource = common.deepClone(this.state.dataSource);
        const selectedRow = dataSource[rowIndex];
        // 限制单个单元最多合并三行
        // 如果是第一列就不需要限制
        // 先遍历dataSource
        // 如果dataSource[i].conditions[conditionIndex - 1].cellsKey === selectedRow.conditions[conditionIndex - 1].cellsKey, 就计数+1，
        // 达到3就中断遍历，提前返回，提示错误
        // 因为合并的单元格cellsKey都是连续相同的，如果不为0且cellsKey不相同，可以中断遍历继续下面的代码
        let canAddRow = true; // 是否允许添加行
        if (conditionIndex > 0) {
            let count = 0;
            let shouldStop = false;
            for (let i = 0; i < dataSource.length && count < 3 && !shouldStop; i++) {
                // 如果前一列的cellsKey和当前行的同列的cellsKey相同
                if (dataSource[i].conditions[conditionIndex - 1].cellsKey === selectedRow.conditions[conditionIndex - 1].cellsKey) {
                    if (i === 0) {
                        count += 1;
                    } else {
                        // 而且当前选中列的那一行和上一行的cellsKey不一样（也就是当列行的交界处))，计算+1
                        if (dataSource[i].conditions[conditionIndex].cellsKey !== dataSource[i - 1].conditions[conditionIndex].cellsKey) {
                            count += 1;
                        }
                    }
                } else {
                    if (count !== 0) shouldStop = true;
                }
            }
            canAddRow = count < 3;
        }
        if (!canAddRow) {
            message.error('每个单元格最多合并三行');
            return;
        }
        let newItem = {};
        for (let i = 0; i < this.currentColCount; i++) {
            newItem[`c${ i }`] = {
                type: 1,
                conditionThen: new EmptyThenVO(),
            };
        }
        // 新的行先复制选中行的条件，然后再从选中列开始清空值，只保留变量
        let newItemConditions = common.deepClone(selectedRow.conditions);

        newItemConditions.forEach((colCondition, i) => {
            // let colCondition = newItem.conditions[i];
            console.log('colCondition', colCondition);
            let { varName, varCode, varType, varDataType, } = colCondition.conditionVO.conditions[0].expressionVO;
            // 复制选中行的变量作为新行的变量

            // 从选中列开始生成独立的key
            if (i >= conditionIndex) {
                colCondition.conditionVO.conditions = [{
                    relType: 0,
                    conditions: [],
                    expressionVO: new ConditionExpressionVO({
                        varName,
                        varCode,
                        varType,
                        varDataType,
                    }),
                    nodeType: 1
                }];
                colCondition.cellsKey = common.randomKey();
            }
        });
        console.log(newItemConditions);
        newItem.conditions = newItemConditions;
        // 算上合并的行，在合并行的结尾插入新的行


        dataSource.splice(rowIndex + rowSpan, 0, newItem);
        console.log('添加行后dataSource', dataSource);
        this.updateColumns(dataSource, this.state.rightColumns);
    };

    // 删除侧表头条件行
    deleteConditionRow = rowData => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除此行？',
            onOk: () => {
                const { rowIndex, rowSpan, } = rowData;
                console.log(rowIndex, rowSpan);
                // 最少保留一行数据
                if (rowSpan >= this.state.dataSource.length) {
                    message.error('不能再删了');
                    return;
                }
                let dataSource = common.deepClone(this.state.dataSource);
                dataSource.splice(rowIndex, rowSpan);
                this.updateColumns(dataSource);
            }
        });
    };

    // 弹窗，配置属性列表格条件，只允许修改value
    configCondition = params => {
        const { conditionIndex, rowIndex, rowSpan, } = params;
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择维度');
            return;
        }
        const currentCondition = {
            rowIndex,
            rowSpan,
            conditionIndex,
            conditionVO: this.state.dataSource[rowIndex].conditions[conditionIndex].conditionVO
        };
        this.lastEditConditionVO = this.state.dataSource[rowIndex].conditions[conditionIndex].conditionVO;
        console.log('currentCondition', currentCondition);
        this.setState({
            currentCondition,
            isShowConfig: true
        });
    };

    // 接受动作配置内容的回调的传回
    updateConditionTree = (lastEditConditionVO, refresh) => {
        console.log('updateConditionTree', refresh, lastEditConditionVO);
        this.lastEditConditionVO = lastEditConditionVO;
        // 解决多级“并且或者”被覆盖问题的回调刷新同步
        // if (refresh) this.setState({ index: Math.random() })
    };

    // 确认配置条件
    handleConfirm = () => {
        console.log('确认配置条件', this.state.currentCondition, this.lastEditConditionVO);

        let dataSource = common.deepClone(this.state.dataSource);
        const { rowIndex, rowSpan, conditionIndex, } = this.state.currentCondition;
        for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
            Object.assign(dataSource[i].conditions[conditionIndex].conditionVO, common.deepClone(this.lastEditConditionVO));
        }
        console.log('配置条件之后', dataSource);
        this.updateColumns(dataSource);
        this.setState({
            currentCondition: null,
            isShowConfig: false,
            lastEditConditionVO: null
        });
    };

    // 关闭配置条件弹窗
    handleCancel = () => {
        // console.log(this.state.currentCondition);
        this.setState({
            currentCondition: null,
            isShowConfig: false,
            lastEditConditionVO: null
        });
    };

    // 清除侧表头条件
    clearSideCondition = params => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除内容？',
            onOk: () => {
                const { conditionIndex, rowIndex, rowSpan, } = params;
                let dataSource = common.deepClone(this.state.dataSource);
                for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
                    let tempExpressionVO = new ConditionExpressionVO();
                    // 只保留一个条件
                    dataSource[i].conditions[conditionIndex].conditionVO.conditions = [{
                        relType: 0,
                        conditions: [], // 清理联合条件
                        expressionVO: tempExpressionVO, // 清理条件值
                        nodeType: 1
                    }];
                }
                this.updateDataSource(dataSource);
            }
        });
    };

    // 表头添加列-根据选中列生成同级数的列
    generateSingleCol = params => {
        let { item } = params;
        item.cellsKey = common.randomKey();
        item.conditionVO = new EmptyConditionVO();
        console.log('generateSingleCol', item);
        if (!common.isEmpty(item.children)) {
            item.children = [this.generateSingleCol({
                item: item.children[0]
            })];
        }
        return item;
    };

    render() {
        return (
            <div className="strategy-cross-table">
                <Table
                    className="config-table config-cross-table"
                    scroll={ { x: true } }
                    bordered={ true }
                    columns={ this.state.header }
                    dataSource={ this.state.dataSource }
                    pagination={ false }
                    // onHeaderRow={ (record, index) => {
                    //     return { onClick: e => this.handleHeaderClick(e, record, index) }
                    // }}
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
                            {/*<p>当前条件:*/ }
                            {/*    第{ this.state.currentCondition.rowIndex + 1 }行,*/ }
                            {/*    第{ this.state.currentCondition.conditionIndex + 1 }列,*/ }
                            {/*    共{ this.state.currentCondition.rowSpan }行*/ }
                            {/*</p>*/ }
                            <div>
                                <TreePanel
                                    eventSourceId={ this.props.eventSourceId }
                                    dimensionId={ this.props.dimensionId }
                                    entityType={ 4 }
                                    conditionComplete={ () => {
                                    } }
                                    conditionInComplete={ () => {
                                    } }
                                    updateConditionTree={ this.updateConditionTree }
                                    treeData={ this.state.currentCondition.conditionVO }
                                    extraType="crossTable"
                                />
                            </div>
                        </div>
                        : ''
                    }
                </Modal>

                <Modal
                    title="配置表头条件"
                    width={ 700 }
                    visible={ this.state.isShowConfig3 }
                    onOk={ this.handleConfirm3 }
                    onCancel={ this.handleCancel3 }
                >
                    { this.state.currentHeaderCondition ?
                        <div>
                            {/*<p>当前条件:*/ }
                            {/*    第{ this.state.currentCondition.rowIndex + 1 }行,*/ }
                            {/*    第{ this.state.currentCondition.conditionIndex + 1 }列,*/ }
                            {/*    共{ this.state.currentCondition.rowSpan }行*/ }
                            {/*</p>*/ }
                            <div>
                                <TreePanel
                                    eventSourceId={ this.props.eventSourceId }
                                    dimensionId={ this.props.dimensionId }
                                    entityType={ 4 }
                                    conditionComplete={ () => {
                                    } }
                                    conditionInComplete={ () => {
                                    } }
                                    updateConditionTree={ this.updateConditionTree2 }
                                    treeData={ this.state.currentHeaderCondition.conditionVO }
                                    extraType="crossTable"
                                />
                            </div>
                        </div>
                        : ''
                    }
                </Modal>

                <Modal
                    title="配置内容"
                    width={ 700 }
                    visible={ this.state.isShowConfig2 }
                    onOk={ this.handleConfirm2 }
                    onCancel={ this.handleCancel2 }
                >
                    { this.state.currentActionCell !== null ?
                        <div style={ { overflow: 'auto' } }>
                            {/*<p>当前动作:*/ }
                            {/*    第{ this.state.currentActionCell.rowIndex + 1 }行,*/ }
                            {/*    第{ this.state.currentActionCell.columnIndex + 1 }列,*/ }
                            {/*</p>*/ }
                            <div>
                                <ThenWrapper
                                    rtqVarList={ this.props.rtqVarList }
                                    optTypeList={ this.state.optTypeList }
                                    // verifyConditionTreeFinish={ this.verifyConditionTreeFinish }
                                    valueTypeList={ this.state.valueTypeList }
                                    varTypeOfField={ this.state.varTypeOfField }
                                    paramList={ this.state.paramList }
                                    cascadeData={ this.state.cascadeData }
                                    cascadeDataNumber={ this.state.cascadeDataNumber }
                                    updateConditionThen={ conditionsAll =>
                                        this.handleModalChangeThen(conditionsAll, this.state.currentActionCell.rowIndex,
                                            this.state.currentActionCell.columnIndex) }
                                    // updateConditionThen={ (name, value) => this.handleModalChangeThen2(name, value) }
                                    treeData={ this.state.currentActionCell.conditionThen.conditions.map(item => item.expressionVO) }
                                    p_relType={ this.state.currentActionCell.conditionThen.relType }
                                    extraType="crossTable"

                                    // 优化追加
                                    VAR_SELECTION_ALL={ this.state.VAR_SELECTION_ALL }
                                    VAR_SELECTION_TIMESTAMP={ this.state.VAR_SELECTION_TIMESTAMP }
                                    VAR_SELECTION_VARCHAR={ this.state.VAR_SELECTION_VARCHAR }
                                    VAR_SELECTION_NUMBER={ this.state.VAR_SELECTION_NUMBER }
                                    PARAMS_VAR_SELECTION_ALL={ this.state.PARAMS_VAR_SELECTION_ALL }
                                    PARAMS_VAR_SELECTION_TIMESTAMP={ this.state.PARAMS_VAR_SELECTION_TIMESTAMP }
                                    PARAMS_VAR_SELECTION_VARCHAR={ this.state.PARAMS_VAR_SELECTION_VARCHAR }
                                    PARAMS_VAR_SELECTION_NUMBER={ this.state.PARAMS_VAR_SELECTION_NUMBER }
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

StrategyCrossTable.propTypes = {};

StrategyCrossTable.defaultProps = {
    dataRows: [],
    header: [],
    tableName: '决策表名称'
};

export default StrategyCrossTable;
