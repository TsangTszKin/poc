import React, {Component} from 'react';
import ScoreCardNew from "@/components/business/strategy/score-card/ScoreCardNew";
import {withRouter} from "react-router-dom";
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";
import store from '@/store/business/strategy/score-card/Save';
import PageHeader from '@/components/business/strategy-package/page-header';
import {inject, observer, Provider} from "mobx-react";
import {Button, Col, Form, Divider, Input, message, Modal, Row, Select, Spin, Switch} from "antd";
import formRules from "@/utils/form-rules";
import FixedBottomBar from "@/components/common/FixedBottomBar";
import FormBlock from "@/components/FormBlock";
import '@/styles/business/strategy/Save.less';
import variableService from "@/api/business/variableService";
import strategyService from "@/api/business/strategyService";
import commonService from "@/api/business/commonService";

@Form.create()
@withRouter
@observer
class Save extends Component {
    saveData = {
        name: '',
        category: 1,
        categoryName: '',
        scoreCellsList: [],
        code: '',
        // eventSource: {
        //     eventSourceId: '',
        //     eventSourceName: '',
        //     eventSourceType: '',
        // },
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
        parameterCode: "",
        parameterDefaultValue: "",
        parameterType: ""
    };

    state = {
        eventSourceList: [],
        dimensionList: [],
        calculationList: [],
        parameterIdList: [],
        categoryList: [],
        rtqVarList: [],
        varTypeList: [],
        category: '',
        calculation: '',
        parameterId: '',
        isLoading: false,
        sqlCode: '',
        inspectVarSet: '',
        res: {},

        // 以下是表格部分数据
        dataRows: [], // 处理之前的dataSource
        header: [], // 处理之前的columns
    };


    componentDidMount() {
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
        this.id = props.match.params.id;
        this.isNew = common.isEmpty(this.id);
        store.setCalculation(0);
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
            if (common.isEmpty(this.props.match.params.id)) {
                if (this.props.match.params.type === '3') {
                    this.setState({res: this.props.location.state.data});
                    if (!common.isEmpty(this.props.location.state.data)) {
                        this.getDetails();
                    }
                    console.log("导入的数据", this.props.location.state.data, this.state.res)
                } else {
                    store.clearTable();
                    this.setState({isLoading: false});
                    store.strategyTable.setIsLoading(false);
                }
            } else {
                if (this.props.match.params.type === '2') {
                    commonService.getTemplateDetails(this.props.match.params.id).then(data => {
                        data.name = "";
                        data.code = "";
                        console.log('这是的评分卡模板的数据', data);
                        // if (!publicUtils.isOk(res)) return;
                        this.setState({res: data});
                        this.getDetails();
                    })
                } else {
                    strategyService.getStrategyCardById(this.id).then(data => {
                        console.log('这是的评分卡编辑的数据', data);
                        // if (!publicUtils.isOk(res)) return;
                        this.setState({res: data});
                        this.getDetails();
                    })
                }
            }
        });
    }

    getDetails = (props = this.props) => {
        const {setFieldsValue} = props.form;
        console.log('这是的评分卡数据', this.state.res);
        const {name, code, dimensionId, category, eventSourceId, description, scoreCellsList, parameterName, version, tenantId, categoryName, parameterId, calculation, parameterCode, parameterType, parameterDefaultValue, inspectVarSet} = this.state.res.data.result;
        this.saveData.version = version;
        this.saveData.name = name;
        this.saveData.code = code;
        this.saveData.tenantId = tenantId;
        this.saveData.category = category;
        this.saveData.categoryName = categoryName;
        this.saveData.parameterId = parameterId;
        this.saveData.calculation = calculation;
        this.saveData.scoreCellsList = scoreCellsList;
        this.saveData.parameterCode = parameterCode;
        this.saveData.parameterType = parameterType;
        this.saveData.parameterDefaultValue = parameterDefaultValue;
        store.setCalculation(this.saveData.calculation);
        this.saveData.parameterName = parameterName;
        console.log('this.saveData', this.saveData);
        for (let i = 0; i < this.state.calculationList.length; i++) {
            if (calculation == this.state.calculationList[i].dataValue) {
                this.saveData.calculationName = this.state.calculationList[i].dataName;
            }
        }
        console.log("this.saveData.calculationName", this.saveData.calculationName)
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
            inspectVarSet,
        });
        // 获取版本列表
        strategyService.showStrategyCardVersion(code).then(res => {
            if (!publicUtils.isOk(res)) return;
            console.log("获取版本列表", res.data.result);
            store.version.setList(res.data.result);
        });
    }


    componentWillReceiveProps(nextProps) {
        // 切换版本
        if (this.props.match.params.id !== nextProps.match.params.id) {
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
        const selectedEventSource = this.state.eventSourceList.find(item => item.eventSourceId === eventSourceId);
        if (selectedEventSource) {
            this.saveData.eventSourceId = selectedEventSource.eventSourceId;
            this.saveData.eventSourceName = selectedEventSource.eventSourceName;
        } else {
            this.saveData.eventSourceId = eventSourceId;
            console.error('评分表出错了，找不到对应的事件源！');
            this.props.history.push('/business/strategy/card');
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
        // params: dimensionId, eventSourceId, entityType, fieldList
        Promise.all([
            commonService.getConditionData(selectedValue, this.saveData.eventSourceId, 5),
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
            // console.log(this.saveData);
        });
    }

    handleChangeCalculation = calculation => {
        console.log("calculation", calculation);
        this.saveData.calculation = calculation;
        store.setCalculation(calculation);
        this.setState({
            calculation: calculation,
        });
    }
    /*    handleChangeIsWeight = IsWeight => {
            if (IsWeight) {
                this.saveData.calculation = 1;
                this.setState({
                    calculation: 1,
                });
                store.setCalculation(1);
            } else {
                this.saveData.calculation = 0;
                this.setState({
                    calculation: 0,
                });
                store.setCalculation(0);
            }
        }*/
    handleChangeParameterId = parameterId => {
        console.log(parameterId);
        let [id, name, code, type, defaultValue] = parameterId.split('-');
        this.saveData.parameterCode = code;
        this.saveData.parameterType = type;
        this.saveData.parameterDefaultValue = defaultValue;
        this.saveData.parameterId = id;
        this.saveData.parameterName = name;
    }

    handleChangeCategory = categoryAndName => {
        console.log(categoryAndName);
        let [category, categoryName] = categoryAndName.split('-');
        this.saveData.category = category;
        this.saveData.categoryName = categoryName;
    }

    save = (saveAsNewVersion = false) => {
        console.log(saveAsNewVersion ? '保存为新版本' : '更新当前版本');
        this.props.form.validateFields((err, values) => {
            Object.assign(this.saveData, {
                name: values.name,
                code: values.code,
                description: values.description,
            });
        });
        console.log("this.saveData", this.saveData, store.dataSource)
        let saveDataSource = common.deepClone(store.dataSource)
        for (let i = 0; i < saveDataSource.length; i++) {
            console.log("saveDataSource", saveDataSource)
            for (let j = 0; j < saveDataSource[i].conditionVO.conditions.length; j++) {
                saveDataSource[i].conditionVO.conditions[j].expressionVO.varDefaultValue = saveDataSource[i].selectValue;
            }
            if (common.isEmpty(saveDataSource[i].selectName)) {
                message.error('请选择属性！');
                return;
            }
            if (store.calculation == 1 && common.isEmpty(saveDataSource[i].weight)) {
                message.error('请填写权重！');
                return;
            }
            if (store.calculation != 1) {
                saveDataSource[i].weight = "";
                console.log("权重被清除了", saveDataSource[i].weight)
            }
           /* if (common.isEmpty(saveDataSource[i].conditionVO.conditions[0].expressionVO.valueCode)) {
                message.error('请填写完整条件！');
                return;
            }*/
            if (common.isEmpty(saveDataSource[i].score)) {
                message.error('请填写分数！');
                return;
            }
        }
        ;
        store.setDataSource(saveDataSource);
        let hasEmptyConditionCell = false;
        // 将表格数据转为保存的格式
        if (!hasEmptyConditionCell) hasEmptyConditionCell = store.dataSource.some(dataRow => {
            !publicUtils.verifyConditionTree(dataRow.conditionVO)
        });
        console.log("hasEmptyConditionCell", hasEmptyConditionCell)

        if (hasEmptyConditionCell) {
            message.error('条件不能为空');
            return;
        }

        // 将表格数据转为保存的格式
        this.saveData.scoreCellsList = store.dataSource;
        console.log("保存的this.saveData.scoreCellsList", store.dataSource);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                common.loading.show();
                // 新建
                if (this.isNew) {
                    strategyService.saveStrategyCard(this.saveData).then(this.handleSaveResponse)
                } else {
                    this.saveData.id = this.id;
                    if (this.props.match.params.type === '2') this.saveData.id = "";
                    // 保存为新版本
                    if (saveAsNewVersion) {
                        strategyService.saveStrategyCardNewVersion(this.saveData).then(this.handleSaveResponse)
                    }
                    // 更新当前版本
                    else {
                        strategyService.saveStrategyCard(this.saveData).then(this.handleSaveResponse);
                    }
                }
            }
        });
        console.log("要保存的数据", this.saveData, this.saveData.calculation)
    };

    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        this.saveData[key] = value;
    }

    handleSaveResponse = res => {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        this.props.history.push('/business/strategy/card');
        console.log('保存结果如下：', res.data);
        Modal.success({
            title: '系统提示',
            content: '保存成功'
        });
    }

    saveAsNew = () => this.save(true);

    cancel = () => {
        console.log('取消');
        this.props.history.push('/business/strategy/card');
    }

    render() {
        // console.log('Save state', this.state);
        const {getFieldDecorator} = this.props.form;
        const itemLayout = {};
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 24},
                md: {span: 8},
                lg: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 24},
                md: {span: 16},
                lg: {span: 16}
            },
        };
        return (
            <Provider store={store}>
                <div className="panel">
                    <PageHeader
                        testParams={{scoreCardId: this.props.match.params.id}}
                        meta={this.props.meta}
                        versions={store.version.list}
                        changePath="/business/strategy/card/save/"
                        sqlCode={this.state.sqlCode}
                        inspectVarSet={this.state.inspectVarSet}
                    />
                    <Spin spinning={this.state.isLoading}>
                        <div className="page-content" style={{paddingBottom: '74px'}}>
                            <FormBlock header="基本信息">
                                <Form layout="horizontal">
                                    <Row gutter={25}>
                                        <Col lg={8} md={3}>
                                            <Form.Item {...itemLayout} label="名称">
                                                {
                                                    getFieldDecorator('name', {
                                                        rules: [
                                                            {
                                                                pattern: /^([^?!`~!@#$^&%*()=|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]+)$/,
                                                                message: '不可以输入特殊字符'
                                                            },
                                                            {required: true, message: '请输入名称'},
                                                            {max: 30, message: '最大长度30'}
                                                        ],
                                                        initialValue: ''
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
                                                        initialValue: ''
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
                                                        initialValue: ''
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
                                                        initialValue: ''
                                                    })(
                                                        <Select onChange={this.handleChangeDimension} required
                                                                disabled={!this.isNew}>
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
                                            <Form.Item {...itemLayout} label="类别" required>
                                                {
                                                    getFieldDecorator('category', {
                                                        rules: [
                                                            {required: true, message: '请选择类别'},
                                                        ],
                                                        initialValue: ''
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
                            <FormBlock header="评分卡">
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col span={12}>
                                            <div>{console.log("得分计算方式calculation", this.saveData.calculationName, this.state.calculation, store.calculation, this.saveData.calculation)}</div>
                                            <Form.Item {...itemLayout} label="得分计算方式" required>
                                                {
                                                    getFieldDecorator('calculationName', {
                                                        rules: [
                                                            {required: true, message: '请选得分计算方式'},
                                                        ],
                                                        initialValue: this.saveData.calculationName
                                                    })(
                                                        <Select
                                                            style={{width: 'fit-content', minWidth: '200px'}}
                                                            onChange={this.handleChangeCalculation} required>
                                                            {
                                                                this.state.calculationList.map(({dataValue, dataName}) =>
                                                                    <Select.Option
                                                                        value={dataValue}>{dataName}</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item {...itemLayout} label="得分赋值给" required>
                                                {
                                                    getFieldDecorator('parameterId', {
                                                        rules: [
                                                            {required: true, message: '请选择'},
                                                        ],
                                                        initialValue: this.saveData.parameterName
                                                    })(
                                                        <Select
                                                            style={{width: 'fit-content', minWidth: '200px'}}
                                                            // value={this.state.parameterId}
                                                            onChange={this.handleChangeParameterId}
                                                            required>
                                                            {
                                                                common.isEmpty(this.state.parameterIdList) ? "" : this.state.parameterIdList.map(item =>
                                                                    // console.log("parameter",item)
                                                                    <Select.Option
                                                                        value={[item.id, item.name, item.code, item.type, item.defaultValue].join('-')}>{item.name}</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>


                                <div>
                                    {/* {console.log("是的呢？", this.saveData.cellsArr)}*/}
                                </div>
                                <Spin spinning={store.strategyTable.isLoading}>
                                    {
                                        store.strategyTable.isLoading ?
                                            <span>loading</span>
                                            : <ScoreCardNew
                                                dataRows={this.saveData.scoreCellsList}
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
                                this.props.match.params.type === '2' ? '' : this.isNew ? ''
                                    : <Button onClick={() => this.saveAsNew()} htmlType="button">保存为新版本</Button>
                            }
                        </FixedBottomBar>
                    </Spin>
                </div>
            </Provider>
        );
    }
}

const style = {
    label: {
        float: 'left',
        height: '22px',
        lineHeight: '22px',
        width: 'fit-content',
        marginRight: '5px',
        color: 'rgba(0,0,0,.85)'
    }, label2: {
        float: 'left',
        height: '32px',
        lineHeight: '32px',
        width: 'fit-content',
        marginRight: '5px'
    }, row: {
        margin: '6px 110px',
    }
}


export default Save;