import React, { Component } from 'react';
import { Table } from "antd";
import '@/styles/components/ConfigurableTable.less';
import '@/styles/components/cross-table.less';
import common from "@/utils/common";
import { inject } from "mobx-react";
import ConditionViewer from "@/components/common/condition-viewer";
import variableService from "@/api/business/variableService";
import publicUtils from "@/utils/publicUtils";
import ThenWrapper from "@/components/business/strategy/table/ThenWrapper";
import commonService from "@/api/business/commonService";

@inject('store')
class StrategyCrossTableForView extends Component {
    state = {
        strategyTableName: '',
        conditionColumns: [],
        leftColumnCount: 0, // 条件列列数
        rightColumns: [],
        header: [],
        dataSource: [],

        optionTextList: {}, // 规则表达式选项中文对照表

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
            let fixVarSeletion = (data) => {
                return data;
            };
            let PARAMS_VAR_SELECTION_ALL = [], PARAMS_VAR_SELECTION_TIMESTAMP = [], PARAMS_VAR_SELECTION_VARCHAR = [],
                PARAMS_VAR_SELECTION_NUMBER = [];
            if (res.data.result.VAR_SELECTION_ALL) PARAMS_VAR_SELECTION_ALL = fixVarSeletion(res.data.result.VAR_SELECTION_ALL);
            if (res.data.result.VAR_SELECTION_NUMBER) PARAMS_VAR_SELECTION_NUMBER = fixVarSeletion(res.data.result.VAR_SELECTION_NUMBER);
            if (res.data.result.VAR_SELECTION_TIMESTAMP) PARAMS_VAR_SELECTION_TIMESTAMP = fixVarSeletion(res.data.result.VAR_SELECTION_TIMESTAMP);
            if (res.data.result.VAR_SELECTION_VARCHAR) PARAMS_VAR_SELECTION_VARCHAR = fixVarSeletion(res.data.result.VAR_SELECTION_VARCHAR);
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
                        // console.log('location_1', location_1);

                        obj.children = <ConditionViewer
                            conditionVO={ conditionVO }
                            optionTextList={ this.state.optionTextList }
                            isShowVarName={ true }
                        />;
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
        const { children, conditionVO } = columnItem;
        let columnIndex = this.currentColCount;

        let result = {
            conditionVO,
            title: <ConditionViewer conditionVO={ conditionVO } optionTextList={ this.state.optionTextList }
                                    isShowVarName={ true }/>
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
                    const treeData = record[`c${ columnIndex }`].conditionThen.conditions.map(item => item.expressionVO);
                    return <div className="then-wrapper">
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
                    </div>;
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
            console.log(111);
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
            </div>
        );
    }
}

StrategyCrossTableForView.propTypes = {};

StrategyCrossTableForView.defaultProps = {
    dataRows: [],
    header: [],
    tableName: '决策表名称'
};

export default StrategyCrossTableForView;
