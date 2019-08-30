import React, { Component } from 'react';
import { Table } from "antd";
import '@/styles/components/ConfigurableTable.less';
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";
import store from "@/store/business/strategy/rule/Save";
import variableService from "@/api/business/variableService";
import commonService from "@/api/business/commonService";
import { inject } from "mobx-react";
import ThenWrapper2 from '@/components/business/strategy/table/ThenWrapperWithoutMobx';
import ConditionViewer from "@/components/common/condition-viewer";
import ThenWrapper from "@/components/business/strategy/table/ThenWrapper";

@inject('store')
class StrategyEasyTableForView extends Component {
    // leftColumns是属性列表头，rightColumns是动作列表头，在原数据里分别是type：0和type：1
    // 一般行列数不变的情况下，可以直接修改dataSource状态，
    // 如果行列有变动的，或者表头有变化的，需要使用updateColumns方法，目的是更新表格的渲染方式
    state = {
        isShowConfig: false,
        isShowConfig2: false,
        currentCondition: null,
        tableFormHasChange: false,
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
    };

    componentDidMount() {
        // 渲染组件之前，请确保传入的这四个值是非空的
        const {
            dataRows, // 接口获得的body数据，分为type 0（左边）和type 1（右边）
            headers, // 接口获得的body数据，type同上
            varTypeList, // 下拉菜单内容
            rtqVarList // 下拉菜单内容
        } = this.props;
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
        variableService.getAllVarList('', 'strategy').then(res => {
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
        variableService.getAllVarList('', 'strategy', true).then(res => {
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
            // console.log("tempArray", tempArray)
        });
    }

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

    updateColumns = (dataSource, leftColumns, rightColumns) => {
        let conditionTree = this.generateConditionTree(dataSource);
        let location_1 = conditionTree;
        // 根据计算好的树状数据，生成侧表头（表格左边条件列）
        let conditionColumns = leftColumns.map((item, index) => {
            const headerTitle = common.isEmpty(item.name) ? '请选择变量' : item.name;
            return {
                title: headerTitle,
                key: `conditions[${ index }]`,
                dataIndex: `conditions[${ index }]`,
                className: `condition-cell${ index === leftColumns.length - 1 ? ' last-condition-cell' : '' } viewer`,
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
                        // 单元格文字内容, TODO 等后端返回中文表达式， 有个renderConditionCell写了一半
                        obj.children = <ConditionViewer
                            conditionVO={ conditionVO }
                            optionTextList={ this.state.optionTextList }
                            depth={ 0 }
                        />;
                        obj.props.rowSpan = location_1.childrenRows.length;
                    } else obj.props.rowSpan = 0;
                    return obj;
                }
            };
        });
        const actionColumns = rightColumns.map((columnItem, columnIndex) => {
            return {
                title: rightColumns[columnIndex].actionType === 0 ? '参数赋值' : '执行方法',
                key: `c${ columnIndex }`,
                dataIndex: `c${ columnIndex }`,
                // className: 'action-cell',
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
            </div>
        );
    }
}

StrategyEasyTableForView.propTypes = {};

export default StrategyEasyTableForView;
