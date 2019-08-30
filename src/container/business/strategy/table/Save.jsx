import React, {Component, Fragment} from 'react';
import StrategyEasyTable from "@/components/common/StrategyEasyTable";
import {withRouter} from "react-router-dom";
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";
import store from '@/store/business/strategy/table/Save';
import PageHeader from '@/components/business/strategy-package/page-header';
import {observer, Provider} from "mobx-react";
import {Button, Col, Divider, Form, Input, Row, Select, Spin, message, Modal} from "antd";
import formRules from "@/utils/form-rules";
import FixedBottomBar from "@/components/common/FixedBottomBar";
import FormBlock from "@/components/FormBlock";
import '@/styles/business/strategy/Save.less';
import variableService from "@/api/business/variableService";
import strategyService from "@/api/business/strategyService";
import commonService from "@/api/business/commonService";
import StrategyCrossTable from "@/components/common/StrategyCrossTableNew";

@Form.create()
@withRouter
@observer
class Save extends Component {
    saveData = {
        name: '',
        category: 0,
        categoryName: '',
        // cellsArr: [],
        // cellsTitles: [],
        code: '',
        eventSourceId: '',
        eventSourceName: '',
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
        tableType: '0-简单决策表',

        // 以下是表格部分数据
        dataRows: [], // 处理之前的dataSource
        header: [], // 处理之前的columns
        res: {},
    };

    componentDidMount() {
        Promise.all([
            commonService.getCategoryListByType('decision'),
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
        this.id = props.match.params.id;
        this.isNew = common.isEmpty(this.id);
        if (this.isNew) {
            // store.clearTable();
            this.setState({isLoading: false});
            store.strategyTable.setIsLoading(false);
        } else {
            // 编辑的时候获取数据并赋值到表单上
            // strategyService.getCrossStrategyTableById() // 测试交叉表接口
            if (this.props.match.params.type === '2') {
                commonService.getTemplateDetails(this.props.match.params.id).then(data => {
                    console.log('这是的决策表模板的数据', data);
                    data.name = "";
                    data.code = "";
                    // if (!publicUtils.isOk(res)) return;
                    this.setState({res: data});
                    this.getDetails();
                })
            } else {
                strategyService.getStrategyTableById(this.id).then(data => {
                    console.log('这是的决策表编辑的数据', data);
                    // if (!publicUtils.isOk(res)) return;
                    this.setState({res: data});
                    this.getDetails();
                })
            }
        }
    }

    getDetails = (props = this.props) => {
        console.log('这是的决策表回显的数据', this.state.res.data.result);
        const {setFieldsValue} = props.form;
        const {
            name, code, dimensionId, eventSourceId, description,
            cellsTitles, cellsArr, version, tenantId, script
            , category, categoryName, type, typeName, inspectVarSet, verticalConditions
        } = this.state.res.data.result;
        this.saveData.name = name;
        this.saveData.code = code;
        this.saveData.version = version;
        this.saveData.type = type; // 决策表类型 0 简单决策表， 1交叉决策表
        this.saveData.tenantId = tenantId;
        this.saveData.category = category;
        this.saveData.categoryName = categoryName;
        this.handleChangeEventSource(eventSourceId);
        this.handleChangeDimension(dimensionId);
        setFieldsValue({
            name,
            code,
            dimension: dimensionId,
            type: `${type}-${typeName}`,
            category: `${category}-${categoryName}`,
            eventSource: eventSourceId,
            description: description,
        });
        store.crossTable.setName(name);
        if (type === 0) {
            store.strategyTable.setDataRows(cellsArr);
            store.strategyTable.setHeaders(cellsTitles);
        } else if (type === 1) {
            store.crossTable.setHeaders(verticalConditions);
            store.crossTable.setDataRows(cellsArr);
        }
        // store.strategyTable.setIsLoading(false);
        this.setState({
            isLoading: false,
            sqlCode: script,
            inspectVarSet,
            tableType: `${type}-${typeName}`,
        });
        // 获取版本列表
        strategyService.getStrategyTableVersions(code).then(res => {
            if (!publicUtils.isOk(res)) return;
            console.log(res.data.result);
            store.version.setList(res.data.result);
        });
    }

    componentWillReceiveProps(nextProps) {
        // 切换版本
        if (this.props.match.params.id !== nextProps.match.params.id) {
            // console.log('save.state', this.state);
            this.init(nextProps);
        }
    }

    componentWillUnmount() {
        store.reset();
    }


    handleChangeEventSource = eventSourceId => {
        const {setFieldsValue} = this.props.form;
        this.setState({
            dimensionList: [],
            varTypeList: [],
            rtqVarList: [],
        });
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
        store.clearTable();
        this.setState({dimensionList: selectedEventSource.dimensionVOS});
    }

    handleChangeDimension = selectedValue => {
        const selectedDimension = this.state.dimensionList.find(item => item.id === selectedValue);
        if (!selectedDimension) return;
        store.clearTable();
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
        // console.log(this.saveData);
    }

    handleChangeType = tableType => {
        this.setState({
            tableType
        });
    }

    save = (saveAsNewVersion = false) => {
        console.log(saveAsNewVersion ? '保存为新版本' : '更新当前版本');
        this.props.form.validateFields((err, values) => {
            // console.log('表单值: ', values);
            if (!err) {
                console.log('决策表表格的表头', [...store.leftColumns, ...store.rightColumns]);
                console.log('决策表表格的数据', store.dataSource);
                let [category, categoryName] = values.category.split('-');
                let [type, typeName] = values.type.split('-');
                let rightColumnLength = 0;
                // let hasConditionCellInvalid = false;
                // let emptyMessage = '有条件检验不通过';
                category = Number(category);
                type = Number(type);
                Object.assign(this.saveData, {
                    name: values.name,
                    code: values.code,
                    description: values.description,
                    type,
                    typeName,
                    category,
                    categoryName,
                });
                if (type === 0) {
                    this.saveData.cellsTitles = [...store.leftColumns, ...store.rightColumns];
                    rightColumnLength = store.rightColumns.length;
                } else if (type === 1) {
                    this.saveData.verticalConditions = store.rightColumns;
                    // 判断表头是否有条件不正确，并计数动作列列数（检测由后端实现）
                    let verifyAndGetColumnCount = verticalConditions => {
                        verticalConditions.forEach(columnItem => {
                            if (columnItem.children) {
                                verifyAndGetColumnCount(columnItem.children)
                            } else {
                                rightColumnLength += 1;
                            }
                            // 表头条件检测，现在由后端实现
                            // if (publicUtils.verifyConditionTree(columnItem.conditionVO)) return;
                            // hasConditionCellInvalid = true;
                            // emptyMessage = `表头的条件检验不通过`;
                        })
                    };
                    verifyAndGetColumnCount(store.rightColumns);
                }
                console.log('动作列列数', rightColumnLength);
                // 将表格数据转为保存的格式
                this.saveData.cellsArr = store.dataSource.map((dataRow, rowIndex) => {
                    let saveRow = dataRow.conditions;
                    // if (!hasConditionCellInvalid) hasConditionCellInvalid = dataRow.conditions.some(item => !publicUtils.verifyConditionTree(item.conditionVO));
                    // 条件检测，现在由后端实现
                    // if (!hasConditionCellInvalid) {
                    //     dataRow.conditions.forEach((item, colIndex) => {
                    //         if (hasConditionCellInvalid) return;
                    //         if (publicUtils.verifyConditionTree(item.conditionVO)) return;
                    //         hasConditionCellInvalid = true;
                    //         emptyMessage = `第${rowIndex + 1}行的第${colIndex + 1}列的条件检验不通过`;
                    //     })
                    // }
                    // 处理动作列数据
                    for (let i = 0; i < rightColumnLength; i++) {
                        const {cellsKey, conditionThen, type,} = dataRow[`c${i}`];
                        saveRow.push({
                            cellsKey,
                            type,
                            assignmentVO: conditionThen.conditions[0].expressionVO
                        })
                    }

                    return saveRow;
                });
                console.log('最后上传的表单', this.saveData);
                // if (hasConditionCellInvalid) {
                //     message.error(emptyMessage);
                //     return;
                // }
                // return ; // 测试用，中断保存
                common.loading.show();
                // 新建
                if (this.isNew) {
                    strategyService.saveStrategyTable(this.saveData).then(this.handleSaveResponse)
                } else {
                    this.saveData.id = this.id;
                    if (this.props.match.params.type === '2') this.saveData.id = "";
                    // 保存为新版本
                    if (saveAsNewVersion) {
                        strategyService.saveStrategyTableNewVersion(this.saveData).then(this.handleSaveResponse)
                    }
                    // 更新当前版本
                    else {
                        strategyService.saveStrategyTable(this.saveData).then(this.handleSaveResponse);
                    }
                }
            }
        });
    };

    handleSaveResponse = res => {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        this.props.history.push('/business/strategy/table');
        console.log('保存结果如下：', res.data);
        Modal.success({
            title: '系统提示',
            content: '保存成功'
        });
    }

    saveAsNew = () => this.save(true);

    cancel = () => {
        console.log('取消');
        this.props.history.push('/business/strategy/table');
    }

    render() {
        // console.log('Save state', this.state);
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const itemLayout = {};
        return (
            <Provider store={store}>
                <div className="panel">
                    <PageHeader
                        testParams={{
                            decisionTableId: this.props.match.params.id,
                        }}
                        meta={this.props.meta}
                        versions={store.version.list}
                        changePath="/business/strategy/table/save/"
                        sqlCode={this.state.sqlCode}
                        inspectVarSet={this.state.inspectVarSet}
                        // auth={{
                        //     test: publicUtils.isAuth("business:release:package:view"),
                        //     sql: publicUtils.isAuth("business:release:package:edit"),
                        //     version: publicUtils.isAuth("business:release:package:edit"),
                        // }}
                    >
                        {/*<div className="header-status">*/}
                        {/*    <Status statusCode={this.state.result.status} />*/}
                        {/*    <Divider type="vertical" />*/}
                        {/*    <Status statusCode={this.state.result.auditStatus} />*/}
                        {/*</div>*/}
                    </PageHeader>
                    <Spin spinning={this.state.isLoading}>
                        <div className="page-content" style={{paddingBottom: '74px'}}>
                            <FormBlock header="基本信息">
                                <Form>
                                    <Row gutter={25}>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="名称">
                                                {
                                                    getFieldDecorator('name', {
                                                        rules: formRules['name'],
                                                    })(
                                                        <Input/>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="标识">
                                                {
                                                    getFieldDecorator('code', {
                                                        rules: formRules['code'],
                                                    })(
                                                        <Input required
                                                               disabled={common.isEmpty(this.props.match.params.id) ? false : this.props.match.params.type === '2' ? false : true}/>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="事件源" required>
                                                {
                                                    getFieldDecorator('eventSource', {
                                                        rules: [
                                                            {required: true, message: '请选择事件源'},
                                                        ],
                                                    })(
                                                        <Select onChange={this.handleChangeEventSource} required
                                                                disabled={!this.isNew}>
                                                            {
                                                                this.state.eventSourceList.map(({eventSourceId, eventSourceName, eventSourceType}) =>
                                                                    <Select.Option
                                                                        value={eventSourceId}>{eventSourceName}</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="维度" required>
                                                {
                                                    getFieldDecorator('dimension', {
                                                        rules: [
                                                            {required: true, message: '请选择维度'},
                                                        ],
                                                    })(
                                                        <Select
                                                            onChange={this.handleChangeDimension}
                                                            placeholder={common.isEmpty(getFieldValue('eventSource')) ? '请先选择事件源' : ''}
                                                            required
                                                            disabled={!this.isNew}
                                                        >
                                                            {
                                                                this.state.dimensionList.map(({id, name}) =>
                                                                    <Select.Option value={id}>{name}</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="类型" required>
                                                {
                                                    getFieldDecorator('type', {
                                                        rules: [
                                                            {required: true, message: '请选择类型'},
                                                        ],
                                                        initialValue: '0-简单决策表'
                                                    })(
                                                        <Select
                                                            value={this.state.category}
                                                            onChange={this.handleChangeType}
                                                            required
                                                            disabled={!this.isNew}
                                                        >
                                                            <Select.Option value="0-简单决策表">简单决策表</Select.Option>
                                                            <Select.Option value="1-交叉决策表">交叉决策表</Select.Option>
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="类别" required>
                                                {
                                                    getFieldDecorator('category', {
                                                        rules: [
                                                            {required: true, message: '请选择类别'},
                                                        ],
                                                    })(
                                                        <Select
                                                            value={this.state.category}
                                                            onChange={this.handleChangeCategory}
                                                            required>
                                                            {
                                                                this.state.categoryList.map(item =>
                                                                    <Select.Option
                                                                        value={[item.dataValue, item.dataName].join('-')}>{item.dataName}</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Form.Item label="描述">
                                            {
                                                getFieldDecorator('description', {
                                                    initialValue: this.saveData.description
                                                })(
                                                    <Input.TextArea rows={4} placeholder="请简单描述"/>
                                                )
                                            }
                                        </Form.Item>
                                    </div>
                                </Form>
                            </FormBlock>
                            <FormBlock header="决策表">
                                <Spin spinning={store.strategyTable.isLoading}>
                                    {
                                        store.strategyTable.isLoading ?
                                            <span>loading</span>
                                            :
                                            this.state.tableType === '0-简单决策表' ?
                                                <StrategyEasyTable
                                                    headers={store.strategyTable.headers}
                                                    dataRows={store.strategyTable.dataRows}
                                                    dimensionId={this.saveData.dimensionId}
                                                    eventSourceId={this.saveData.eventSourceId}
                                                    varTypeList={this.state.varTypeList}
                                                    rtqVarList={this.state.rtqVarList}
                                                />
                                                :
                                                <StrategyCrossTable
                                                    tableName={store.crossTable.name}
                                                    headers={store.crossTable.headers}
                                                    dataRows={store.crossTable.dataRows}
                                                    dimensionId={this.saveData.dimensionId}
                                                    eventSourceId={this.saveData.eventSourceId}
                                                    varTypeList={this.state.varTypeList}
                                                    rtqVarList={this.state.rtqVarList}
                                                />
                                    }
                                </Spin>
                            </FormBlock>
                        </div>
                        <FixedBottomBar>
                            <Button onClick={this.cancel} htmlType="button">取消</Button>
                            <Button type="primary" onClick={() => this.save()} htmlType="button">保存</Button>
                            {
                                this.isNew ? ''
                                    : <Button onClick={() => this.saveAsNew()} htmlType="button">保存为新版本</Button>
                            }
                        </FixedBottomBar>
                    </Spin>
                </div>
            </Provider>
        );
    }
}

export default Save;