import React, { Component, Fragment } from 'react';
import { Dropdown, Menu, message, Modal, Table } from "antd";
import '@/styles/components/ConfigurableTable.less';
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";
import store from "@/store/business/strategy/rule/Save";
import TreePanel from "@/components/condition-tree/TreePanel2.0";
import variableService from "@/api/business/variableService";
import commonService from "@/api/business/commonService";
import { inject } from "mobx-react";
import ThenWrapper from '@/components/business/strategy/table/ThenWrapper';
import ConditionViewer from "@/components/common/condition-viewer";

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

const defaultCellContent = {
    cellsKey: '',
    type: 1,
    conditionThen: {
        nodeType: 2,
        relType: 0,
        conditions: [{
            nodeType: 1,
            relType: 0,
            expressionVO: new ThenExpressionVO()
        }]
    }

};

// 条件demo，不要引用，留着做参考
// const conditionVODemo = {
//     relType: 0,
//     nodeType: 2,
//     conditions: [{
//         relType: 0,
//         expressionVO: {
//             varCategoryType: 1,
//             varTableAlias: '',
//             varType: '',
//             varDataType: '',
//             varCode: '',
//             varName: '',
//             varDefaultValue: '',
//             varValue: '',
//             varParas: [],
//             optType: 0,
//
//             valueCategoryType: 0,//固定值
//             valueTableAlias: '',
//             valueType: '',
//             valueDataType: '',
//             valueCode: '',
//             valueName: '',
//             valueDefaultValue: '',
//             value: '',
//             valueParas: []
//         },
//         nodeType: 1
//     }]
// };

// 那么demo，不要引用，留着做参考
// const conditionThenVODemo = {
//     "relType": 0,
//     "nodeType": 2,
//     "conditions": [{
//         "relType": 0,
//         "expressionVO": {
//             "fixedValueType": "",
//             "parameterId": "",
//             "parameterName": '',
//             "type": 0,
//             "varType": "",//等号右边的变量
//             "varDataType": '',//等号右边的变量
//             "varName": "",//等号右边的变量
//             "varCode": "",//等号右边的变量
//             "fixedValue": "",//等号右边的固定值
//             "computeExpression": {//计算类型才有
//                 "operators": [],
//                 "varList": [
//                     {
//                         "code": "",//变量CODE
//                         "varType": "",//变量 类型
//                         "dataType": ""//变量 数据类型
//                     }
//                 ]
//             },
//             "actionType": 0,
//             "executionManner": 4,
//             "rtqVarId": ''
//         },
//         "nodeType": 1
//     }]
// };

const CellDropdown = props => (
    <Fragment>
        <Dropdown { ...props } trigger={ ['contextMenu'] }>
            <div className="full-cell-dropdown" />
        </Dropdown>
        <div className="cell-dropdown-text">
            { props.children }
        </div>
    </Fragment>
);

@inject('store')
class StrategyEasyTableNew extends Component {
    // leftColumns是属性列表头，rightColumns是动作列表头，在原数据里分别是type：0和type：1
    // 一般行列数不变的情况下，可以直接修改dataSource状态，
    // 如果行列有变动的，或者表头有变化的，需要使用updateColumns方法，目的是更新表格的渲染方式
    state = {
        isShowConfig: false,
        isShowConfig2: false,
        currentCondition: null,
        leftColumns: [], // 左边表格格式
        rightColumns: [], // 右边表格格式
        header: [], // 表格格式
        dataRows: [], // 原始数据
        dataSource: [], // 表格数据
        optionTextList: {}, // 规则表达式选项中文对照表
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

    componentDidMount() {
        // 渲染组件之前，请确保传入的这四个值是非空的
        this.initTableData(this.props);
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
            });
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
        if (
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

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    initTableData = props => {
        const {
            dataRows, // 接口获得的body数据，分为type 0（左边）和type 1（右边）
            headers, // 接口获得的body数据，type同上
            varTypeList, // 下拉菜单内容
            rtqVarList, // 下拉菜单内容
            eventSourceId,
            dimensionId,
        } = props;
        // console.log('从props接收到的数据', varTypeList);
        // 0是条件列 1是赋值或者动作
        let leftColumns = headers.filter(item => item.type === 0);
        let rightColumns = headers.filter(item => item.type === 1);
        this.setState({
            dataRows,
            varTypeList,
            rtqVarList,
        }, () => {
            // 先formatDataSource处理接口获得的数据转为dataSource格式，然后更新表格的columns和dataSource
            this.updateColumns(this.formatDataSource(dataRows), leftColumns, rightColumns);
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

    // 将从接口获取的数据格式化，可以放到save页面去，传进来就是dataSource格式
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

    updateDataSource = dataSource => {
        this.setState({ dataSource });
        this.props.store.setDataSource(dataSource);
    };

    updateColumns = (dataSource = this.state.dataSource, leftColumns = this.state.leftColumns, rightColumns = this.state.rightColumns) => {
        // 将更新的表格数据传回save页面
        this.props.store.setDataSource(dataSource);
        this.props.store.setLeftColumns(leftColumns);
        this.props.store.setRightColumns(rightColumns);
        let conditionTree = this.generateConditionTree(dataSource);
        let location_1 = conditionTree;
        // 根据计算好的树状数据，生成侧表头（表格左边条件列）
        let conditionColumns = leftColumns.map((item, index) => {
            const headerTitle = common.isEmpty(item.name) ? '请选择变量' : item.name;
            // console.log('varTypeList', this.state.varTypeList);
            let menu = <Menu>

                {
                    common.isEmpty(this.state.varTypeList) ? '' :
                        this.state.varTypeList.map(typeItem =>
                            common.isEmpty(typeItem.list) ?
                                <Menu.Item>{ typeItem.name }</Menu.Item>
                                : <Menu.SubMenu title={ typeItem.name }>
                                    {
                                        typeItem.list.map(varItem =>
                                            <Menu.Item
                                                onClick={ () => this.handleChangeCondition(index, typeItem, varItem) }>{ varItem.name }</Menu.Item>
                                        )
                                    }
                                </Menu.SubMenu>
                        )
                }
                <Menu.Divider/>
                <Menu.SubMenu title="插入列">
                    <Menu.Item onClick={ () => this.addFrontCondition(index) }>前</Menu.Item>
                    <Menu.Item onClick={ () => this.addBackCondition(index) }>后</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item onClick={ () => this.deleteConditionCol(index) }>删除列</Menu.Item>
            </Menu>;

            return {
                title: <CellDropdown overlay={ menu }>
                    { headerTitle }
                </CellDropdown>,
                key: `conditions[${ index }]`,
                dataIndex: `conditions[${ index }]`,
                className: `condition-cell${ index === leftColumns.length - 1 ? ' last-condition-cell' : '' }`,
                width: 80,
                render: (text, record, cIndex) => {
                    // console.log(cIndex, record);
                    const conditionItem = record.conditions[index];
                    const { conditionVO } = conditionItem;
                    // console.log(conditionVO);
                    if (index === 0) location_1 = conditionTree;
                    let conditionIndex = location_1.conditions.findIndex(item =>
                        item.cellsKey === conditionItem.cellsKey && item.childrenRows.includes(cIndex));
                    location_1 = location_1.conditions[conditionIndex];
                    // console.log(conditionIndex, conditionItem, location_1);
                    let obj = {
                        props: {},
                    };
                    if (cIndex === location_1.rowSpanIndex) {
                        const currentRowSpan = location_1.childrenRows.length;
                        // console.log('location_1', location_1);
                        let menu = <Menu>
                            <Menu.Item onClick={ () => this.configCondition({
                                conditionIndex: index,
                                rowIndex: cIndex,
                                rowSpan: currentRowSpan,
                            }) }>配置条件</Menu.Item>
                            <Menu.Item onClick={ () => this.clearSideCondition({
                                conditionIndex: index,
                                rowIndex: cIndex,
                                rowSpan: currentRowSpan,
                            }) }>清空条件</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item onClick={ () => this.addDateRow(cIndex, index, currentRowSpan) }>添加行</Menu.Item>
                            <Menu.Item onClick={ () => this.deleteConditionRow({
                                rowIndex: cIndex,
                                rowSpan: currentRowSpan,
                            }) }>删除行</Menu.Item>

                        </Menu>;

                        // 单元格文字内容, TODO 等后端返回中文表达式


                        obj.children = <CellDropdown overlay={ menu } onClick={ () => this.configCondition({
                            conditionIndex: index,
                            rowIndex: cIndex,
                            rowSpan: currentRowSpan,
                        }) }>
                            <ConditionViewer
                                conditionVO={ conditionVO }
                                optionTextList={ this.state.optionTextList }
                            />
                        </CellDropdown>;
                        obj.props.rowSpan = location_1.childrenRows.length;
                    } else obj.props.rowSpan = 0;
                    return obj;
                }
            };
        });
        const actionColumns = rightColumns.map((columnItem, columnIndex) => {
            let context = [columnIndex];
            let menu = <Menu>
                <Menu.Item onClick={ () => this.handleChangeActionType({ value: 0, columnIndex }) }>参数赋值</Menu.Item>
                <Menu.Item onClick={ () => this.handleChangeActionType({ value: 1, columnIndex }) }>执行方法</Menu.Item>
                <Menu.Divider/>
                <Menu.SubMenu title="插入列">
                    <Menu.Item onClick={ () => this.addHeaderCol({
                        columnItem,
                        columnIndex,
                        context,
                        isAddBack: false
                    }) }>前</Menu.Item>
                    <Menu.Item onClick={ () => this.addHeaderCol({
                        columnItem,
                        columnIndex,
                        context,
                        isAddBack: true
                    }) }>后</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item onClick={ () => this.deleteHeaderCol({ columnItem, columnIndex, context }) }>删除列</Menu.Item>
            </Menu>;
            return {
                title: <CellDropdown overlay={ menu }>
                    <div>{ rightColumns[columnIndex].actionType === 0 ? '参数赋值' : '执行方法' }</div>
                </CellDropdown>,
                key: `c${ columnIndex }`,
                dataIndex: `c${ columnIndex }`,
                className: 'action-cell',
                render: (text, record, rowIndex) => {
                    // console.log('渲染动作列', rowIndex, columnIndex, record);
                    // console.log('传的treeData', record[`c${ columnIndex }`].conditionThen);

                    let actionCellMenu = <Menu>
                        <Menu.Item onClick={ () => this.configAction({
                            rowIndex,
                            columnIndex,
                        }) }>配置内容</Menu.Item>
                        <Menu.Item onClick={ () => this.clearActionCell({
                            rowIndex,
                            columnIndex,
                        }) }>清空内容</Menu.Item>
                    </Menu>;
                    const treeData = record[`c${ columnIndex }`].conditionThen.conditions.map(item => item.expressionVO);

                    return <CellDropdown overlay={ actionCellMenu }
                                         onClick={ () => this.configAction({ rowIndex, columnIndex, data: record }) }>
                        <div className="then-wrapper">
                            {/*<ThenWrapper2*/ }
                            {/*    key={ `r${ rowIndex }c${ columnIndex }` }*/ }
                            {/*    rtqVarList={ this.props.rtqVarList }*/ }
                            {/*    optTypeList={ this.state.optTypeList }*/ }
                            {/*    valueTypeList={ this.state.valueTypeList }*/ }
                            {/*    varTypeOfField={ this.state.varTypeOfField }*/ }
                            {/*    paramList={ this.state.paramList }*/ }
                            {/*    cascadeData={ this.state.cascadeData }*/ }
                            {/*    cascadeDataNumber={ this.state.cascadeDataNumber }*/ }
                            {/*    // updateConditionThen={ conditionsAll => this.handleChangeThen(conditionsAll, rowIndex, columnIndex) }*/ }
                            {/*    treeData={ record[`c${ columnIndex }`].conditionThen }*/ }
                            {/*    p_relType={ record[`c${ columnIndex }`].conditionThen.relType }*/ }
                            {/*    extraType="easyStrategyTable"*/ }
                            {/*    disabled*/ }
                            {/*/>*/ }
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
        });

        // 组装成antd table用的columns
        let header = [
            ...conditionColumns, // 属性列
            ...actionColumns, // 动作列
        ];
        console.log('表头结构', header);
        this.setState({
            header,
            dataSource,
            leftColumns,
            rightColumns,
        });
    };

    // 生成条件的带有层级关系的树状条件对象
    // childRows用来记录哪几行是他的children（其length就是合并的行数）, rowSpanIndex是需要显示条件的行数
    generateConditionTree = dataSource => {
        let conditionTree = { conditions: [] };
        // 记录当前层级
        dataSource.forEach((dataRow, rowIndex) => {
            const { conditions } = dataRow;
            let location = conditionTree;
            conditions.forEach((conditionItem) => {
                // 对key相同的行进行合并行
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
                        name: conditionItem.varName,
                        cellsKey: conditionItem.cellsKey,
                        childrenRows: [rowIndex],
                        rowSpanIndex: rowIndex,
                        conditions: []
                    });
                    location = location.conditions[location.conditions.length - 1];
                }
            });
        });
        return conditionTree;
    };

    // 配置侧表头条件，同时清空这一列所有行的条件
    handleChangeCondition = (conditionIndex, selectedVarType, selectedVar) => {
        console.log(conditionIndex, selectedVarType, selectedVar);
        let dataSource = common.deepClone(this.state.dataSource);
        let leftColumns = common.deepClone(this.state.leftColumns);
        leftColumns[conditionIndex].name = selectedVar.name;
        leftColumns[conditionIndex].selectId = selectedVar.code;
        dataSource.forEach(rowData => {
            rowData.conditions[conditionIndex].conditionVO = {
                relType: 0,
                nodeType: 2,
                conditions: [{
                    relType: 0,
                    conditions: [],
                    expressionVO: new ConditionExpressionVO({
                        varType: selectedVarType.type,
                        varDataType: selectedVar.type,
                        varCode: selectedVar.code,
                        varName: selectedVar.name,
                    }),
                    nodeType: 1
                }]
            };
        });
        // console.log('配置属性表头之后', leftColumns, dataSource);
        console.log('配置属性表头之后', dataSource);
        this.updateColumns(dataSource, leftColumns, this.state.rightColumns);
    };

    // 表头添加列
    addHeaderCol = options => {
        // 限制列数，不超过10列
        if (this.state.rightColumns.length === 10) {
            message.error('最多10列');
            return;
        }
        const { columnIndex, isAddBack = true } = options;
        let rightColumns = common.deepClone(this.state.rightColumns);
        const moveColumnCount = isAddBack ? 1 : 0;
        // 插入列的index
        let dataColumnIndex = columnIndex + moveColumnCount;
        rightColumns.splice(options.columnIndex + moveColumnCount, 0, {
            name: "",
            selectId: "",
            actionType: 0,
            type: 1
        });
        // 初始化该列数据，并对该列之后其他列全部后移一列
        let dataSource = common.deepClone(this.state.dataSource);
        dataSource.forEach((dataRow) => {
            // 从最后一列开始获取前一列的数据
            for (let i = rightColumns.length - 1; i > dataColumnIndex; i--) {
                // console.log(i);
                dataRow[`c${ i }`] = common.deepClone(dataRow[`c${ i - 1 }`]);
            }
            // 在插入位置添上默认数据(defaultCellContent)
            // dataRow[`c${ dataColumnIndex }`] = common.deepClone(defaultCellContent);
            dataRow[`c${ dataColumnIndex }`] = {
                cellsKey: '',
                type: 1,
                conditionThen: {
                    nodeType: 2,
                    relType: 0,
                    conditions: [{
                        nodeType: 1,
                        relType: 0,
                        expressionVO: new ThenExpressionVO()
                    }]
                }

            };
        });
        console.log('插入列的dataSource', dataSource);
        this.updateColumns(dataSource, this.state.leftColumns, rightColumns);
    };

    // 删除表头列，
    deleteHeaderCol = options => {
        if (this.state.rightColumns.length === 1) {
            message.error('最少1列');
            return;
        }
        Modal.confirm({
            title: '系统提示',
            content: '是否删除此列？',
            onOk: () => {
                const { columnIndex } = options;
                let rightColumns = common.deepClone(this.state.rightColumns);
                // 删除列的index
                let dataColumnIndex = columnIndex;
                // 初始化该列数据，并对该列之后其他列全部前移一列
                let dataSource = common.deepClone(this.state.dataSource);
                dataSource.forEach((dataRow) => {
                    // 从选择列开始获取后一列的数据
                    for (let i = dataColumnIndex; i < rightColumns.length - 1; i++) {
                        // console.log('更新第' + i + '列');
                        dataRow[`c${ i }`] = common.deepClone(dataRow[`c${ i + 1 }`]);
                    }
                    // 删除多余的最后一列
                    delete dataRow[`c${ rightColumns.length - 1 }`];
                });
                rightColumns.splice(columnIndex, 1);
                console.log('删除动作列', rightColumns, dataSource);
                this.updateColumns(dataSource, this.state.leftColumns, rightColumns);
            }
        });
    };

    // 向前增加条件
    addFrontCondition = index => this.addCondition(index, false);
    // 向后增加条件
    addBackCondition = index => this.addCondition(index, true);

    // 插入条件列
    addCondition = (index, isAddAfter) => {
        if (this.state.leftColumns.length === 5) {
            message.error('属性列最多 5 列');
            return;
        }
        let leftColumns = common.deepClone(this.state.leftColumns);
        let dataSource = common.deepClone(this.state.dataSource);
        // 插入位置
        let insertIndex = isAddAfter ? index + 1 : index;
        leftColumns.splice(insertIndex, 0, {
            name: '',
            selectId: '',
            type: 0
        });

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
        // this.setState({ leftColumns, dataSource });
        console.log('插入条件列后', dataSource);
        this.updateColumns(dataSource, leftColumns, this.state.rightColumns);
    };

    // 删除条件列
    deleteConditionCol = colIndex => {
        if (this.state.leftColumns.length === 1) {
            message.error('不能再删了');
            return;
        }
        Modal.confirm({
            title: '系统提示',
            content: '是否删除此列？',
            onOk: () => {
                let leftColumns = common.deepClone(this.state.leftColumns);
                let dataSource = common.deepClone(this.state.dataSource);
                leftColumns.splice(colIndex, 1);
                // if (colIndex === this.state.leftColumns.length - 1) console.log('删除的是最后一列');
                dataSource.forEach(item => {
                    // 如果删除的是最后一列，要将前一列的全部合并单元格全部拆开
                    if (colIndex === this.state.leftColumns.length - 1) {
                        item.conditions[colIndex - 1].cellsKey = common.randomKey();
                    }
                    item.conditions.splice(colIndex, 1);
                });
                console.log('删除之后', leftColumns, dataSource);
                this.updateColumns(dataSource, leftColumns, this.state.rightColumns);
            }
        });

    };

    // 添加侧表头条件行
    addDateRow = (rowIndex, conditionIndex, rowSpan) => {
        console.log('添加条件行', rowIndex, conditionIndex, rowSpan);
        let dataSource = common.deepClone(this.state.dataSource);
        const selectedRow = dataSource[rowIndex];
        // 限制单个单元最多合并三行
        // 如果是第一行就不需要限制
        // 先遍历dataSource
        // 如果dataSource[i].conditions[conditionIndex - 1].cellsKey === selectedRow.conditions[conditionIndex - 1].cellsKey, 就计数+1，
        // 达到3就中断遍历，提前返回，提示错误
        // 因为合并的单元格cellsKey都是连续相同的，如果不为0且cellsKey不相同，可以中断遍历继续下面的代码
        let canAddRow = true; // 是否允许添加行
        if (conditionIndex > 0) {
            let count = 0;
            let shouldStop = false;
            for (let i = 0; i < dataSource.length && count < 3 && !shouldStop; i++) {
                if (dataSource[i].conditions[conditionIndex - 1].cellsKey === selectedRow.conditions[conditionIndex - 1].cellsKey) {
                    count += 1;
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
        for (let i = 0; i < this.state.rightColumns.length; i++) {
            newItem[`c${ i }`] = common.deepClone(defaultCellContent);
            // 根据所在动作列title赋值actionType
            newItem[`c${ i }`].conditionThen.conditions[0].expressionVO.actionType =
                // dataSource[0][`c${ i }`].conditionThen.conditions[0].expressionVO.actionType;
                this.state.rightColumns[i].actionType;
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
        this.updateColumns(dataSource, this.state.leftColumns, this.state.rightColumns);
    };

    // 删除侧表头条件行
    deleteConditionRow = rowData => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除此行？',
            onOk: () => {
                const { rowIndex, rowSpan, } = rowData;
                let dataSource = common.deepClone(this.state.dataSource);
                // 最少保留一行数据
                if (rowSpan >= dataSource.length) {
                    message.error('最少保留一行');
                    return;
                }
                dataSource.splice(rowIndex, rowSpan);
                this.updateColumns(dataSource, this.state.leftColumns, this.state.rightColumns);
            }
        });
    };

    // 弹窗，配置属性列表格条件，只允许修改value
    configCondition = params => {
        console.log('配置条件', this.state.leftColumns);
        const { conditionIndex, rowIndex, rowSpan, } = params;
        if (common.isEmpty(this.props.dimensionId) || common.isEmpty(this.props.eventSourceId)) {
            message.error('请先选择维度');
            return;
        }
        if (common.isEmpty(this.state.leftColumns[conditionIndex].selectId)) {
            message.error('请先选择变量');
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
        this.updateDataSource(dataSource);
        this.setState({
            currentCondition: null,
            isShowConfig: false,
            lastEditConditionVO: null
        });
    };

    // 关闭配置条件弹窗
    handleCancel = () => {
        // console.log(this.state.currentCondition);
        this.setState({ currentCondition: null, isShowConfig: false, lastEditConditionVO: null });
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

    // ThenWrapper2的回调，是ThenWrapper的简化版，
    // handleModalChangeThen2 = (name, value) => {
    //     console.log('%c 实际更新', 'color: #00f', name, value);
    //     this.lastEditConditionThen.conditions[0].expressionVO[name] = value;
    //     console.log(this.lastEditConditionThen);
    // };

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
            lastEditConditionThen: null,
            isShowConfig2: false,
        });
    };

    // 清除侧表头条件
    clearSideCondition = params => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除内容？',
            onOk: () => {
                const { conditionIndex, rowIndex, rowSpan, } = params;
                let dataSource = this.state.dataSource;
                for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
                    let { varName, varCode, varType, varDataType, } = dataSource[i].conditions[conditionIndex].conditionVO.conditions[0].expressionVO;
                    let tempExpressionVO = new ConditionExpressionVO();
                    // 复制选中行的变量作为新行的变量
                    Object.assign(tempExpressionVO, {
                        varName,
                        varCode,
                        varType,
                        varDataType,
                    });
                    // 只保留一个条件
                    dataSource[i].conditions[conditionIndex].conditionVO.conditions = [{
                        relType: 0,
                        conditions: [], // 清理联合条件
                        expressionVO: tempExpressionVO, // 清理条件值，但保留变量
                        nodeType: 1
                    }];
                }
                this.updateDataSource(dataSource);
            }
        });
    };

    // 表头动作列选择动作
    handleChangeActionType = params => {
        const { columnIndex, value, } = params;
        let rightColumns = common.deepClone(this.state.rightColumns);
        let dataSource = common.deepClone(this.state.dataSource);
        console.log(columnIndex, value, rightColumns);
        rightColumns[columnIndex].actionType = value;
        dataSource.forEach(row => {
            // row[`c${ columnIndex }`].conditionThen.conditions[0].expressionVO.actionType = value;
            row[`c${ columnIndex }`].conditionThen.conditions[0].expressionVO = new ThenExpressionVO({
                actionType: value,
            });
        });
        console.log('选择动作后', dataSource);
        this.updateColumns(dataSource, this.state.leftColumns, rightColumns);
    };

    // 清除动作单元格内容
    // 同更新动作列
    clearActionCell = params => {
        Modal.confirm({
            title: '系统提示',
            content: '是否删除内容？',
            onOk: () => {
                const { columnIndex, rowIndex } = params;
                const actionType = this.state.rightColumns[columnIndex].actionType;
                let defaultConditions = [{
                    expressionVO: new ThenExpressionVO({
                        actionType
                    }),
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
                                    extraType="easyStrategyTable"
                                    conditionComplete={ () => {
                                    } }
                                    conditionInComplete={ () => {
                                    } }
                                    updateConditionTree={ this.updateConditionTree }
                                    treeData={ this.state.currentCondition.conditionVO }
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
                        <div>
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
                                    extraType="easyStrategyTable"

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

StrategyEasyTableNew.propTypes = {};

export default StrategyEasyTableNew;
