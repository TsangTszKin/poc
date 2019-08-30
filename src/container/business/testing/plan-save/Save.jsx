/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/9 13:58
 * Description: 新建策略测试方案
 */

import React, { Component } from 'react';
import {observer, Provider} from "mobx-react";
import PageHeader from "@/components/PageHeader";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Icon,
    Input,
    Row,
    Select,
    Steps,
    Switch,
    Upload,
    message, Spin, Table, Radio
} from "antd";
import store from '@/store/business/testing/plan-save/Index'
import '@/styles/business/testing/index.less'
import {withRouter} from "react-router-dom";
import FixedBottomBar from "@/components/common/FixedBottomBar";
import strategyService from "@/api/business/strategyService";
import publicUtils from "@/utils/publicUtils";
import common from "@/utils/common";
import moment from 'moment';
import http from "@/config/http";
import formRules from "@/utils/form-rules";
import eventService from "@/api/analysis/eventService";
import Status from "@/components/Status";
import variableService from "@/api/business/variableService";

@Form.create()
@withRouter
@observer
class TestPlanSave extends Component {
    state = {
        current: '1',
        currentStep: 0,
        inputVisible: false,
        newFilterTag: '',
        selectedItems: '',
        options: [],
        hasDownload: false,
        isShowReDownload: false,
        fileList: [],
        fieldJson: '',
        isLoading: true,
        dataTypeList: {},
    };
    saveData = {

    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log(111);
        this.testId = this.props.match.params.testId;
        this.id = this.props.match.params.id;
        const { setFieldsValue } = this.props.form;
        // TODO 获取选项接口
        strategyService.getQuickTestField(this.testId).then(res => {
            if (!publicUtils.isOk(res)) return ;
            const options = res.data.result.map(item => item.name);
            // console.log(options);
            this.setState({ options });
        });
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return ;
            const dataTypeList = {};
            res.data.result.forEach(item => {
                dataTypeList[String(item.val)] = item.label;
            });
            this.setState({ dataTypeList });
        });
        if (!this.props.match.params.id) {
            this.setState({ isLoading: false });
            return ;
        }
        strategyService.getTestPlanById(this.id).then(res => {
            if (!publicUtils.isOk(res)) {
                message.error('获取信息失败');
                this.props.history.push(`/business/testing/list/${ this.testId }/plan`);
                return ;
            }
            // console.log(res.data);
            const { exeTime, exeNum, name, description, fieldJson } = res.data.result;
            setFieldsValue({
                exeNum,
                name,
                description,
            });
            if (exeTime) {
                store.setCanSelectTime(true);
                setFieldsValue({
                    exeTime: moment(exeTime)
                });
            }
            this.setState({
                isLoading: false,
                fieldJson
            });
        });
        // TODO 获取历史数据列表
    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.match.params.id !== this.props.match.params.id) {
    //         store.initStore();
    //     }
    // }

    changeTime = (value) => store.setStartTime(value);

    onChangeRadio = e => this.setState({ current: e.target.value });

    prevStep = () => {
        const currentStep = this.state.currentStep - 1;
        this.setState({ currentStep });
    };

    nextStep = () => {
        const currentStep = this.state.currentStep + 1;
        this.setState({ currentStep });
    };

    submit = () => {
        if (common.isEmpty(this.state.fieldJson)) {
            message.error('请先上传文件');
            return ;
        }
        this.saveData.fieldJson = this.state.fieldJson;
        const expFields = store.filterTags.join(',');
        // TODO 获取报文字段
        eventService.getPlanFieldByTestId(this.testId, expFields).then(res => {
            if (!publicUtils.isOk(res)) return ;
            console.log(res.data);
            store.testTable.setDataSource(res.data.result);
        });
        // TODO 获取上传数据列表
        this.nextStep();
    };

    handleClose = (removedTag) => {
        const tags = store.filterTags.filter(tag => tag !== removedTag);
        store.setFilterTags(tags);
    };

    handleChangeTags = selectedItems => {
        store.setFilterTags(selectedItems);
        if (this.state.hasDownload) {
            console.log(666);
            this.setState({ isShowReDownload: !common.isEmpty(store.filterTags) })
        }
    };

    // 记录Input组件的dom
    saveInputRef = input => { this.input = input };

    // 处理上传文件的变化，移除和上传等
    handleFileChange = info => {
        console.log(info);
        let { file, fileList } = info;
        const status = file.status;
        if (['error', 'removed'].includes(status)) {
            this.setState({
                fieldJson: '',
                fileList: []
            });
        }
        else this.setState({ fileList: [file] });
    };

    downloadTemplate = () => {
        // console.log(666);
        const expFields = store.filterTags.join(',');
        console.log(expFields);
        strategyService.downloadTestPlanTemplate(this.testId, expFields).then(res => {
            // if (!publicUtils.isOk(res)) return ;
            console.log(res);
            const blob = new Blob([res.data]);
            common.downloadFile(blob, '模板.csv')
        });
        this.setState({
            hasDownload: true,
            isShowReDownload: false
        });
    };

    toPlanList = () => this.props.history.push(`/business/testing/list/${ this.testId }/plan`);

    save = () => {
        if (common.isEmpty(this.state.fieldJson)) {
            message.error('请先上传数据');
            return ;
        }
        console.log('保存');
        this.props.form.validateFields((err, value) => {
            if (err) return ;
            const { name, exeNum, exeTime, description } = value;
            const saveData = {
                name,
                exeNum,
                description,
                testId: this.testId,
                fieldJson: this.state.fieldJson
            };
            if (store.canSelectTime) {
                // saveData['exeTime'] = exeTime.format('YYYY-MM-DD HH:mm:ss');
                if (exeTime.isBefore()) {
                    message.error('不能选择当前时间之前的时间');
                    return ;
                }
                saveData['exeTime'] = exeTime.format();
            }
            if (this.id) {
                saveData.id = this.id;
            }
            console.log('上传数据', saveData);
            strategyService.saveTestPlan(saveData).then(res => {
                if (!publicUtils.isOk(res, true)) return ;
                this.toPlanList();
            })
        })
    };

    render() {
        const testColumns = [
            {
                title: '序号',
                key: 'index',
                dataIndex: 'index',
                render: (_, __, rowIndex) => rowIndex + 1
            },
            {
                title: '名称',
                key: 'name',
                dataIndex: 'name',
                sorter: common.tableSorter('name')
            },
            {
                title: '标识',
                key: 'code',
                dataIndex: 'code',
                sorter: common.tableSorter('code')
            },
            {
                title: '事件源',
                key: 'eventSourceName',
                dataIndex: 'eventSourceName',
                sorter: common.tableSorter('eventSourceName')
            },
            {
                title: '数据类型',
                key: 'type',
                dataIndex: 'type',
                render: text => this.state.dataTypeList[text] || text
            },
            {
                title: '默认值',
                key: 'defaultValue',
                dataIndex: 'defaultValue',
            },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                render: text => <Status status={ text } />
            },
            {
                title: '描述',
                key: 'description',
                dataIndex: 'description',
            },
        ];

        const historyColumns = [
            {
                title: '序号',
                key: 'index',
                dataIndex: 'index',
                render: (_, __, rowIndex) => rowIndex + 1
            },
            {
                title: '流水号',
                key: 'flowNumber',
                dataIndex: 'flowNumber',
            },
            {
                title: '卡号',
                key: 'cardNo',
                dataIndex: 'cardNo',
            },
            {
                title: '事件源',
                key: 'eventSourceName',
                dataIndex: 'eventSourceName',
            },
            {
                title: '事件发生时间',
                key: 'createTime',
                dataIndex: 'createTime',
            },
            {
                title: '决策结果',
                key: 'status',
                dataIndex: 'status',
            },
            {
                title: '决策耗时',
                key: 'timeCost',
                dataIndex: 'timeCost',
            },
        ];

        const { options } = this.state;
        const filteredOptions = options.filter(o => !store.filterTags.includes(o));
        const itemLayout = { labelCol: { span: 4, offset: 6 }, wrapperCol: { span: 12 } };
        const supportFileTypeText = '支持扩展名：.xls .xlsx .csv';
        const { getFieldDecorator } = this.props.form;
        const _this = this;
        const uploadProps = {
            // withCredentials: true,
            accept: '.xls,.xlsx,.csv',
            fileList: this.state.fileList,
            // disabled: !common.isEmpty(this.state.fileList),
            onChange: (info) => this.handleFileChange(info),
            onSuccess(res, file) {
                if (!publicUtils.isOk(res)) return ;
                console.log('onSuccess', res, file);
                _this.setState({ fieldJson: res.data.result });
                _this.setState({ fileList: [file] });
            },
            onProgress({ percent }, file) {
                console.log('onProgress', `${percent}%`, file.name);
            },
            customRequest({
                              file,
                              filename,
                              onError,
                              onProgress,
                              onSuccess,
                              withCredentials,
                          }) {
                // EXAMPLE: post form-data with 'axios'
                const formData = new FormData();
                // if (data) {
                //     Object.keys(data).map(key => {
                //         formData.append(key, data[key]);
                //     });
                // }
                formData.append(filename, file);

                strategyService.uploadTestPlan(formData, _this.testId).then(res => {
                    onSuccess(res, file);
                });

                return {
                    abort() {
                        console.log('upload progress is aborted.');
                    },
                };
            },
        };

        const steps = [{
            title: '下载模板',
            content: (
                <div className="step-content">
                    <Form layout={ { formLayout: 'horizontal' } }>
                        <Form.Item className="step-form-item" { ...itemLayout } label="过滤字段">
                            <Select
                                mode="multiple"
                                showArrow={ true }
                                placeholder="请选择或输入关键字搜索"
                                value={ store.filterTags }
                                onChange={ this.handleChangeTags }
                                style={ { width: '100%' } }
                            >
                                { filteredOptions.map(item => (
                                    <Select.Option key={ item } value={ item }>
                                        { item }
                                    </Select.Option>
                                )) }
                            </Select>
                        </Form.Item>
                        <Form.Item className="step-form-item" { ...itemLayout } label="下载模板">
                            <Button htmlType="button" onClick={ this.downloadTemplate }>
                                <Icon type="download"/>下载模板
                            </Button>
                            {
                                this.state.isShowReDownload ?
                                    <p style={ { color: 'red' } }>*模板已更新，请重新下载模板</p>
                                    : ''
                            }
                        </Form.Item>
                    </Form>

                    <Button type="primary" onClick={ this.nextStep } htmlType="button">下一步</Button>
                </div>
            ),
        }, {
            title: '上传文件',
            content: (
                <div className="step-content">
                    <div className="upload-wrapper">
                        <Upload.Dragger
                            { ...uploadProps }
                        >
                            <p className="ant-upload-drag-icon"><Icon type="inbox"/></p>
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                            <p className="ant-upload-hint">{ supportFileTypeText }</p>
                        </Upload.Dragger>
                    </div>
                    <div>
                        <Button type="primary" onClick={ this.submit } htmlType="button">提交</Button>
                        <Button className="previous-step-btn" type="default" onClick={ this.prevStep }
                                htmlType="button">上一步</Button>
                    </div>
                </div>
            ),
        }, {
            title: '完成',
            content: (
                <div className="step-content">
                    <Table
                        scroll={ { x: 'max-content' } }
                        columns={ testColumns }
                        dataSource={ store.testTable.dataSource }
                    />
                </div>
            ),
        }];

        return (
            <Provider store={ store }>
                <div className="panel">
                    <PageHeader meta={ this.props.meta }/>
                    <Spin spinning={ this.state.isLoading }>
                        <div className="pageContent">
                            <Divider orientation="left">基本信息</Divider>
                            <Form>
                                <Row gutter={ 25 }>
                                    <Col lg={ 6 }>
                                        <Form.Item label="方案名称" colon={ false } required>
                                            {
                                                getFieldDecorator('name',
                                                    {
                                                        rules: formRules.name
                                                    }
                                                )(
                                                    <Input required placeholder="请输入名称" />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col lg={ 6 }>
                                        <Form.Item label="执行次数" colon={ false } required>
                                            {
                                                getFieldDecorator('exeNum',
                                                    {
                                                        rules: [
                                                            { required: true, message: '请输入执行次数' },
                                                            ...formRules.range(1, 10000, true)
                                                        ],
                                                    }
                                                )(
                                                    <Input required placeholder="请输入次数" />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col lg={ 6 }>
                                        <Form.Item label="选择执行时间" colon={ false }>
                                            <Switch checked={ store.canSelectTime } onChange={ store.changeSelectTime }/>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={ 6 }>
                                        { store.canSelectTime ?

                                            (
                                                <Form.Item label="执行时间" colon={ false } required>
                                                    {
                                                        getFieldDecorator('exeTime',
                                                            {
                                                                rules: [
                                                                    { required: true, message: '请选择时间' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            if (value.isBefore()) {
                                                                                callback('不能选择当前时间之前的时间');
                                                                            }
                                                                            callback();
                                                                        }
                                                                    },
                                                                ],
                                                            }
                                                        )(
                                                            <DatePicker showTime />
                                                        )
                                                    }
                                                </Form.Item>
                                            ) : ''
                                        }
                                    </Col>
                                </Row>
                                <Form.Item label="描述">
                                    {
                                        getFieldDecorator('description', {
                                            initialValue: ''
                                        })(
                                            <Input.TextArea className="save-textarea" rows={ 3 } autosize={ false }
                                                            placeholder="请简单描述" />
                                        )
                                    }
                                </Form.Item>
                                <Divider orientation="left">测试数据</Divider>
                                {/*<Menu mode="horizontal" onClick={ this.onChangeRadio } selectedKeys={ [this.state.current] }>*/}
                                {/*    <Menu.Item key="1">*/}
                                {/*        <div>上传数据</div>*/}
                                {/*    </Menu.Item>*/}
                                {/*    <Menu.Item key="2">*/}
                                {/*        <div>历史数据</div>*/}
                                {/*    </Menu.Item>*/}
                                {/*</Menu>*/}
                                <div>
                                    <label>
                                        选择数据：
                                        <Radio.Group style={ { marginLeft: '8px' } } onChange={ this.onChangeRadio } defaultValue="1">
                                            <Radio.Button value="1">上传数据</Radio.Button>
                                            <Radio.Button value="2">历史数据</Radio.Button>
                                        </Radio.Group>
                                    </label>
                                </div>
                                {
                                    this.state.current === '1' ? (
                                        <div className="test-save-content">
                                            <div className="plan-save-step">
                                                <Steps current={ this.state.currentStep }>
                                                    <Steps.Step title="下载模板"/>
                                                    <Steps.Step title="上传数据"/>
                                                    <Steps.Step title="完成"/>
                                                </Steps>
                                            </div>
                                            { steps[this.state.currentStep].content }
                                        </div>
                                    ) : ''
                                }
                                {
                                    this.state.current === '2' ?
                                        <div className="test-save-content">
                                            <Table
                                                size="small"
                                                columns={ historyColumns }
                                                dataSource={ store.historyTable.dataSource }
                                            />
                                        </div>
                                        : ''
                                }
                            </Form>
                        </div>
                        <FixedBottomBar>
                            <Button htmlType="button" onClick={ this.toPlanList }>取消</Button>
                            {
                                this.state.currentStep === 2 ?
                                    <Button htmlType="button" type="primary" onClick={ this.save }>保存</Button>
                                    : ''
                            }

                        </FixedBottomBar>
                    </Spin>
                </div>
            </Provider>
        )
    }

}

export default TestPlanSave;