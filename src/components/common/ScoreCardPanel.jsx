import React, {Component} from 'react';
import StrategyEasyTableForView from "@/components/common/StrategyEasyTableForView";
import {withRouter} from "react-router-dom";
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";
import store from '@/store/business/strategy/table/Save';
import {observer, Provider} from "mobx-react";
import {Button, Col, Divider, Form, Input, Row, Select, Spin, message, Switch, Descriptions} from "antd";
import FormBlock from "@/components/FormBlock";
import '@/styles/business/strategy/Save.less';
import variableService from "@/api/business/variableService";
import strategyService from "@/api/business/strategyService";
import commonService from "@/api/business/commonService";
import Status from "@/components/business/strategy-package/status";
import PropTypes from 'prop-types'
import ScoreCardNewForView from "@/components/business/strategy/score-card/ScoreCardNewForView";

@Form.create()
@withRouter
@observer
class ScoreCardPanel extends Component {
    saveData = {
        name: '',
        category: 0,
        categoryName: '',
        cellsArr: [],
        cellsTitles: [],
        code: '',
        eventSourceId: '',
        eventSourceName: '',
        dimension: {
            id: '',
            name: '',
        },
        dimensionId: '',
        dimensionName: '',
        description: '',
        version: 1,
        type: 0,
    };

    state = {
        eventSourceList: [],
        dimensionList: [],
        categoryList: [],
        rtqVarList: [],
        category: '',
        isLoading: true,
        sqlCode: '',
        inspectVarSet: '',
        calculationList: [],
        // 以下是表格部分数据
        dataRows: [], // 处理之前的dataSource
        header: [], // 处理之前的columns
        calculation: 0
    };

    componentDidMount() {
        this.isResource = this.props.match.path === '/business/release/score-card/detail/:id';
        Promise.all([
            commonService.getCategoryListByType('scoreCard'),
            variableService.getEventSourceSelectList(true),
        ]).then(([res1, res2]) => {
            if (publicUtils.isOk(res1)) {
                let categoryList = res1.data.result;
                this.setState({categoryList});
            }
            if (publicUtils.isOk(res2)) {
                this.setState({
                    eventSourceList: res2.data.result
                })
            }
        }).then(this.init);
    }

    init = (props = this.props) => {
        store.reset();
        const {setFieldsValue} = props.form;
        this.id = props.id;
        this.isNew = common.isEmpty(this.id);
        commonService.getCategoryListByType('scoreCard').then(res => {
            if (!publicUtils.isOk(res)) return;
            let categoryList = res.data.result;
            this.setState({categoryList});
            console.log("categoryList???", categoryList)
        });
        commonService.getCategoryListByType('calculation').then(res => {
            if (!publicUtils.isOk(res)) return;
            let calculationList = res.data.result;
            this.setState({calculationList});
            console.log("calculationList???", calculationList)
        });
        commonService.getParamSelection().then(res => {
            if (!publicUtils.isOk(res)) return;
            let parameterIdList = res.data.result;
            this.setState({parameterIdList});
            console.log("parameterIdList???", parameterIdList)
        });
        strategyService.getScoreSQL(this.id).then(res => {
            console.log("res.data.resultMessage", res.data.resultMessage)
            if (!res.data.success) return;
            let sqlCode = res.data.result;
            this.setState({sqlCode});
        });
        variableService.getEventSourceSelectList(true).then(res => {
            if (!publicUtils.isOk(res)) return;
            this.setState({
                eventSourceList: res.data.result
            });
            // 编辑的时候获取数据并赋值到表单上
            if (this.isNew) {
                store.clearTable();
                this.setState({isLoading: false});
            } else {
                const getDataById = this.isResource ? strategyService.getResourceDetail : strategyService.getStrategyCardById;
                strategyService.getScoreSQL(this.id).then(res => {
                    if (!res.data.success) return;
                    let sqlCode = res.data.result;
                    this.props.onGetSql(sqlCode);
                });
                getDataById(this.id).then(res => {
                    if (!publicUtils.isOk(res)) return;
                    console.log('这是正在编辑的评分卡数据', res.data.result);
                    const {name, code, dimensionId, category, eventSourceId, description, scoreCellsList, parameterName, version, tenantId, categoryName, parameterId, calculation, script, inspectVarSet} = res.data.result;
                    this.saveData.version = version;
                    this.saveData.name = name;
                    this.saveData.code = code;
                    this.saveData.tenantId = tenantId;
                    this.saveData.category = category;
                    this.saveData.categoryName = categoryName;
                    this.saveData.parameterId = parameterId;
                    this.saveData.calculation = calculation;
                    this.saveData.scoreCellsList = scoreCellsList;
                    this.saveData.parameterName = parameterName;
                    this.saveData.description = description;
                    this.props.onGetTest(inspectVarSet);
                    for (let i = 0; i < this.state.calculationList.length; i++) {
                        if (calculation == this.state.calculationList[i].dataValue) {
                            this.saveData.calculationName = this.state.calculationList[i].dataName;
                        }
                    }
                    this.handleChangeEventSource(eventSourceId);
                    this.handleChangeDimension(dimensionId);
                    setFieldsValue({
                        name,
                        code,
                        calculation: calculation,
                        dimension: dimensionId,
                        category: `${categoryName}`,
                        eventSource: eventSourceId,
                        description: description,
                    });
                    store.strategyTable.setDataRows(scoreCellsList);
                    this.setState({
                        calculation: calculation,
                        isLoading: false,
                        sqlCode: script,
                        inspectVarSet,
                    });
                    // 获取版本列表
                    strategyService.showStrategyCardVersion(code).then(res => {
                        if (!publicUtils.isOk(res)) return;
                        console.log("获取版本列表", res.data.result);
                        store.version.setList(res.data.result);
                        this.props.onGetVersionList(res.data.result);
                    });
                })
            }
        });
    }


    componentWillReceiveProps(nextProps) {
        // 切换版本
        if (this.props.id !== nextProps.id) {
            console.log('save.state', this.state);
            this.init(nextProps);
        }
    }

    componentWillUnmount() {
        store.reset();
    }


    handleChangeEventSource = eventSourceId => {
        const {setFieldsValue} = this.props.form;
        this.setState({dimensionList: []});
        setFieldsValue({dimension: '',});
        // console.log(eventSourceId, this.state.eventSourceList);
        const selectedEventSource = this.state.eventSourceList.find(item => item.eventSourceId === eventSourceId);
        if (selectedEventSource) {
            this.saveData.eventSourceId = selectedEventSource.eventSourceId;
            this.saveData.eventSourceName = selectedEventSource.eventSourceName;
        } else {
            this.saveData.eventSourceId = eventSourceId;
            message.error('决策表出错了，找不到对应的事件源');
            this.props.history.push('/business/strategy/table');
            return;
        }
        store.reset();
        this.setState({dimensionList: selectedEventSource.dimensionVOS});
    }

    handleChangeDimension = selectedValue => {
        const selectedDimension = this.state.dimensionList.find(item => item.id === selectedValue);
        if (!selectedDimension) return;
        store.reset();
        this.saveData.dimensionId = selectedDimension.id;
        this.saveData.dimensionName = selectedDimension.name;
        Promise.all([
            commonService.getConditionData(selectedValue, this.saveData.eventSourceId, 4),
            strategyService.getRtqvarList(this.saveData.eventSourceId, selectedValue)
        ]).then(([res1, res2]) => {
            if (!publicUtils.isOk(res1)) return;
            if (!publicUtils.isOk(res2)) return;
            let varTypeList = res1.data.result.VAR_SELECTION_ALL;
            console.log('变量列表', varTypeList);
            console.log("实时查询变量列表", res2.data.result[0].list);

            this.setState({
                varTypeList,
                rtqVarList: res2.data.result[0].list
            }, () => {
                store.strategyTable.setIsLoading(false);
            });
        });
    }

    handleTableUpdate = tableData => {
        console.log('表格更新回调', tableData);
    }

    render() {
        return (
            <Provider store={store}>
                <Spin spinning={this.state.isLoading}>
                    {
                        (() => {
                            switch (this.props.from) {
                                case 'strategyFlow':
                                    return <Descriptions title="">
                                        <Descriptions.Item label="名称">{this.saveData.name}</Descriptions.Item>
                                        <Descriptions.Item label="标识">{this.saveData.code}</Descriptions.Item>
                                        <Descriptions.Item label="版本">v{this.saveData.version}</Descriptions.Item>
                                    </Descriptions>
                                    break;
                                case 'scoreCardView':
                                    return <FormBlock header="基本信息">
                                        <Descriptions title="">
                                            <Descriptions.Item label="名称">{this.saveData.name}</Descriptions.Item>
                                            <Descriptions.Item label="标识">{this.saveData.code}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="事件源">{this.saveData.eventSourceName}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="维度">{this.saveData.dimensionName}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="类别">{this.saveData.categoryName}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="描述">{this.saveData.description}</Descriptions.Item>
                                        </Descriptions>
                                    </FormBlock>
                                    break;
                                default:
                                    break;
                            }
                        })()
                    }

                    <FormBlock header="评分卡">
                        <Spin spinning={store.strategyTable.isLoading}>
                            <Descriptions title="">
                                <Descriptions.Item label="是否权重">
                                    {/* <Switch size="small" checked={this.state.isWeight === 1} /> */}
                                    {this.state.calculation === 1 ? '是' : '否'}
                                </Descriptions.Item>
                                <Descriptions.Item label="得分计算方式">
                                    {
                                        (() => {
                                            let rs = '';
                                            let target = this.state.calculationList.find(item => item.dataValue == this.saveData.calculation)
                                            if (target) {
                                                rs = target.dataName;
                                            }
                                            return rs
                                        })()
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="得分赋值给">{this.saveData.parameterName}</Descriptions.Item>
                            </Descriptions>
                            {
                                store.strategyTable.isLoading ?
                                    <span>loading</span>
                                    :
                                    <ScoreCardNewForView
                                        dataRows={this.saveData.scoreCellsList}
                                        dimensionId={this.saveData.dimensionId}
                                        eventSourceId={this.saveData.eventSourceId}
                                        varTypeList={this.state.varTypeList}
                                        rtqVarList={this.state.rtqVarList}
                                        updateCallBack={this.handleTableUpdate}
                                        calculation={this.state.calculation}
                                    />
                            }
                        </Spin>
                    </FormBlock>
                </Spin>
            </Provider>
        );
    }
}

ScoreCardPanel.propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.oneOf(['strategyFlow', 'scoreCardView'])//组件使用来源有：strategyFlow决策流, scoreCardView评分卡详情页
}
ScoreCardPanel.defaultProps = {
    from: 'strategyFlow',
    onGetVersionList: () => {
    },
    onGetSql: () => {
    },
    onGetTest: () => {
    }
}
export default ScoreCardPanel;