/*
 * @Author: zengzijian
 * @Date: 2019-01-16 17:15:06
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:40:20
 * @Description: 
 */
import React from 'react';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import store from '@/store/system/event-source/Details';
import eventSourceService from '@/api/system/eventSourceService';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import FormBlock from '@/components/FormBlock';
import FormTitle from '@/components/FormTitle';
import {Table, Select, InputNumber, Modal, Button, Icon, Upload} from 'antd';
import FormButtonGroupForEventSource from '@/components/FormButtonGroupForEventSource';
import { withRouter } from 'react-router-dom';
import { message } from "antd/lib/index";
import iconConfig from '@/config/iconConfig';
import { inject } from "mobx-react/index";
import FormCell from '@/components/FormCell';

@withRouter
@inject('GlobalStore')
@observer
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleNumberChange2 = this.handleNumberChange2.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleCurrencyChange2 = this.handleCurrencyChange2.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);
        this.verify = this.verify.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.state = {
            fileList: [],
            importZIP: false,
            info: {},
            importData:{},
        };
    }

    componentDidMount() {
        store.id = this.props.match.params.id;
        if (!common.isEmpty(this.props.match.params.id)) {
            window.document.querySelector("#event-source-details .pageContent").style.height = 'auto';
            store.id = this.props.match.params.id;
            store.getDataTypeList();
        } else {
            store.id = ''
            // todo
            store.initTable();
            store.getDataTypeList();
        }
    }


    handleChange = info => {
        console.log("info", info);
        let fileList = [...info.fileList];
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);
        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        /*if(info.fileList && info.fileList.length !== 0){
           store.uploadPlugin(info.fileList);
        }*/
        this.setState = {
            fileList: fileList,
        };
    };

    verify() {
        let data = common.deepClone(store.details.getData);
        console.log("verify", data)
        if (common.isEmpty(store.details.getData.eventSourceName)) {
            message.warning('基本信息 -名称 不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.eventSourceType)) {
            message.warning('基本信息 - 标识 不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.decisionFlowType)) {
            message.warning('基本信息 -请选择 模式选择');
            return
        }
        if (common.isEmpty(store.details.getData.dataSourceType)) {
            message.warning('基本信息 -请选择 输入选择');
            return
        }
        if (!common.isEmpty(store.details.getData.mqInputAddr)) {
            let result = store.details.getData.mqInputAddr.split(",");
            let Port = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9])):(?:(?:6[0-5][0-5][0-3][0-5])|(?:[1-5][0-9][0-9][0-9][0-9])|(?:[1-9][0-9][0-9][0-9])|(?:[1-9][0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
            let IP = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
            let PortIsNotNull = new RegExp(Port);
            let PortIsNull = new RegExp(IP);
            for (let i = 0; i < result.length; i++) {
                if (!PortIsNotNull.test(result[i])) {
                    if (!PortIsNull.test(result[i])) {
                        message.warning('基本信息 -输入KAFKA   请填写有效的IP地址,若有多个请用 "," 分隔');
                        return
                    }
                }
            }
        }
        if (!common.isEmpty(store.details.getData.mqOutputAddr)) {
            let result = store.details.getData.mqOutputAddr.split(",");
            let Port = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9])):(?:(?:6[0-5][0-5][0-3][0-5])|(?:[1-5][0-9][0-9][0-9][0-9])|(?:[1-9][0-9][0-9][0-9])|(?:[1-9][0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
            let IP = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
            let PortIsNotNull = new RegExp(Port);
            let PortIsNull = new RegExp(IP);
            for (let i = 0; i < result.length; i++) {
                if (!PortIsNotNull.test(result[i])) {
                    if (!PortIsNull.test(result[i])) {
                        message.warning('基本信息 -输出KAFKA   请填写有效的IP地址,若有多个请用 "," 分隔');
                        return
                    }
                }
            }
        }
        if (common.isEmpty(store.details.getData.rtqWindowKeepDataTimeLengthSec)) {
            message.warning('基本信息 -最长保留时间  不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.rtqWindowDeleteTimeIntervalSec)) {
            message.warning('基本信息 -清理周期  不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.rtqWindowDeleteChunkSize)) {
            message.warning('基本信息 -最大条数  不能为空');
            return
        }

        if (store.details.getData.dataSourceType !== 1) {
            data.mqInputAddr = '';
            data.mqInputId = '';
            store.details.setData(data);
        }
        if (store.details.getData.dataSinkType !== 1) {
            data.mqOutputAddr = '';
            data.mqOutputId = '';
            store.details.setData(data);
        }
        if (store.details.getData.dataSourceType === 1) {
            if (common.isEmpty(store.details.getData.mqInputAddr)) {
                message.warning('基本信息 -输入KAFKA 不能为空');
                return
            } else if (common.isEmpty(store.details.getData.mqInputId)) {
                message.warning('基本信息 -输入TOPIC 不能为空');
                return
            }
        }
        if (store.details.getData.dataSinkType === 1) {
            if (common.isEmpty(store.details.getData.mqOutputAddr)) {
                message.warning('基本信息 -输出KAFKA 不能为空');
                return
            } else if (common.isEmpty(store.details.getData.mqOutputId)) {
                message.warning('基本信息 -输出TOPIC 不能为空');
                return
            }
        }

        /*if (store.details.getData.decisionFlowType == 128) {
            message.warning('请上传插件');
            return
        } else {
            data.fiFarmerCustomExecutorPluginPath == '';
            store.details.setData(data)
        }*/
        console.log("verify", store.table.reportField.getData)
        for (let i = 0; i < store.table.reportField.getData.length; i++) {
            const element = store.table.reportField.getData[i];
            if (common.isEmpty(element.name)) {
                message.warning('报文字段定义 - 名称 不能为空');
                return
            }
            if (common.isEmpty(element.type)) {
                message.warning('报文字段定义 - 类型 不能为空');
                return
            }
            if (common.isEmpty(element.description)) {
                message.warning('报文字段定义 - 描述 不能为空');
                return
            }
        }


        this.saveForApi();
    }

    saveForApi() {
        common.loading.show();
        let data = store.details.getData;
        data.eventFieldVOs = store.table.reportField.getData;
        eventSourceService.save(data).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            //sessionStorage.rootProcessTreeName = store.saveData.name;
            if (common.isEmpty(this.props.match.params.id)) {
                message.success('保存成功', 1, () => this.props.history.replace({ pathname: '/system/config2/eventSource/eventSourceDetailsMapping/' + res.data.result.id }));
            } else {
                message.success('保存成功');
                store.getDataTypeList();
            }
            this.props.history.push(`/system/config2/eventSource/eventSourceDetailsMapping/${res.data.result.id}`)
        });
    }


    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        let data = common.deepClone(store.details.getData);
        if (key === 'eventSourceType') {
            if (value.length <= 16) {
                value = value.replace(/[^\w_]/g, '');
                data[key] = value;
            } else {
                message.warn("基本信息 - 标识请输入长度1到16个字符")
            }
        } else if (key === 'voltdbAlias') {
            if (value.length <= 30) {
                value = value.replace(/[^\w_]/g, '');
                data[key] = value;
            } else {
                message.warn("基本信息 - DB别名请输入长度1到30个字符")
            }
        } else if (key === 'dataSourceType') {
            data.mqInputAddr = '';
            data.mqInputId = '';
            data[key] = value;
        } else if (key === 'dataSinkType') {
            data.mqOutputAddr = '';
            data.mqOutputId = '';
            data[key] = value;
        } else if (key === 'eventSourceName' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-名称不能是纯数字")
            }
        } else if (key === 'eventSourceType' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-标识不能是纯数字")
            }
        } else {
            data[key] = value;
        }
        store.details.setData(data);
    }

    handleNumberChange = (value) => {
        console.log(`rtqWindowKeepDataTimeLengthSec${value}`);
        if (String(value).indexOf('.') !== -1) {
            value = value.split('.')[0];
        }
        let data = common.deepClone(store.details.getData);
        data.rtqWindowKeepDataTimeLengthSec = value;
        store.details.setData(data);

        this.setState({
            number: {
                value
            },
        });
    }

    handleNumberChange2 = (value) => {
        console.log("value2", value)
        if (String(value).indexOf('.') !== -1) {
            value = value.split('.')[0];
        }
        let data = common.deepClone(store.details.getData);
        data.rtqWindowDeleteTimeIntervalSec = value;
        store.details.setData(data);
        this.setState({
            number: {
                value,
            },
        });
    }
    handleCurrencyChange = (value, option) => {
        console.log("value, option", value, option)
        let data = common.deepClone(store.details.getData);
        data.keepType = value;
        store.details.setData(data);

        store.min_max.data.zuichangbaoliushijian.min = option.props.min;
        store.min_max.data.zuichangbaoliushijian.max = option.props.max;


        this.setState({
            number: {
                value,
            },
        });
    }
    handleCurrencyChange2 = (value, option) => {
        let data = common.deepClone(store.details.getData);
        data.delType = value;
        store.details.setData(data);

        store.min_max.data.qinglizhouqi.min = option.props.min;
        store.min_max.data.qinglizhouqi.max = option.props.max;

        this.setState({
            number: {
                value,
            },
        });
    }

    downloadTemplate = () => {
        console.log("store.details",store.details)
        eventSourceService.download(store.details.data.id).then(res => {
            common.loading.hide();
            const type = 'xls'
            const blob = new Blob([res.data], {type: type})
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', store.details.data.eventSourceName+".xls");
            document.body.appendChild(link);
            link.click();
            message.success('下载成功');
        });
    };
    handleFileChange = info => {
        console.log("handleFileChange", info);
        this.setState({
            info: info
        });
        let {file, fileList} = info;
        const status = file.status;
        if (['error', 'removed'].includes(status)) {
            this.setState({
                fieldJson: '',
                fileList: [],
            });
        } else this.setState({fileList: [file]});
    };

    render() {
        let selectData = [];
        iconConfig.forEach(element => {
            selectData.push({ code: element, value: element })
        })
        const supportFileTypeText = '支持扩展名：.xls';
        const _this = this;
        const uploadProps = {
            accept: '.xls',
            fileList: this.state.fileList,
            onChange: (info) => this.handleFileChange(info),
            onSuccess(res, file) {
                if (!publicUtils.isOk(res)) return;
                console.log('onSuccess', res, file);
                _this.setState({fieldJson: res.data.result});
                _this.setState({fileList: [file]});
            },
            onProgress({percent}, file) {
                console.log('onProgress', `${percent}%`, file.name);
            },
            customRequest({
                              file,
                              filename,
                              onSuccess,
                          }) {
                const formData = new FormData();
                formData.append(filename, file);
                let data = store.details.getData;
                data.eventFieldVOs = store.table.reportField.getData;
                let eventSourceVO = JSON.stringify(data)
                eventSourceService.upload(formData,eventSourceVO).then(res => {
                    console.log("上传的数据：",res)
                    if (!publicUtils.isOk(res)) {
                        message.success('上传失败');
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        _this.setState({importZIP: false})
                        return;
                    } else {
                        console.log("上传的数据：", res)
                        onSuccess(res, file);
                        message.success('上传成功');
                        store.uploadDetails.setData(res);
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        _this.setState({importData: res, importZIP: false})
                        store.getDetailsByUpload()
                    }
                });

                return {
                    abort() {
                        console.log('upload progress is aborted.');
                    },
                };
            },
        };
        return (
            <Provider store={store}>
                <div className='panel' id="event-source-details">
                    <PageHeader
                        meta={this.props.meta}
                        isShowBtns={false}
                        isShowSelect={false}
                        auth={{
                            test: false,
                            sql: false,
                            version: false,
                        }}
                    ></PageHeader>
                    <div className="pageContent" style={{ padding: '24px 0px' }}>
                        <FormHeader title="事件源定义" style={{ marginLeft: '24px' }}></FormHeader>
                        <FormBlock header="基本信息">
                            <Form style={{ padding: '10px 32px 0px', marginLeft: '40px' }}>
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormItem name="名称" type="input" isNotNull={true}
                                    changeCallBack={this.updateSaveData}
                                    code="eventSourceName"
                                    defaultValue={store.details.getData.eventSourceName}></FormItem>
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormItem name="标识" type="input"
                                    disabled={store.details.getData.id != null ? true : false}
                                    isNotNull={true}
                                    changeCallBack={this.updateSaveData} code="eventSourceType"
                                    defaultValue={store.details.getData.eventSourceType}></FormItem>
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<FormItem name="模式选择" type="select" isNotNull={true} disabled={true}
                                          changeCallBack={this.updateSaveData} code="decisionFlowType"
                                          defaultValue={store.details.getData.decisionFlowType}
                                          selectData={store.getDecisionFlowTypeList}></FormItem>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormItem name="输入选择" type="select" isNotNull={true}
                                    changeCallBack={this.updateSaveData} code="dataSourceType"
                                    disabled={store.details.getData.id != null ? true : false}
                                    defaultValue={store.details.getData.dataSourceType}
                                    selectData={store.getDataSourceTypeList}></FormItem>
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                {(store.details.getData.dataSourceType === 1) ?
                                    <FormItem name="输入KAFKA" type="input" isNotNull={true}
                                        changeCallBack={this.updateSaveData} code="mqInputAddr"
                                        defaultValue={store.details.getData.mqInputAddr}></FormItem>
                                    : ""
                                }

                                {/*</Col>*/}
                                {/*<Col span={8}>*/}
                                {(store.details.getData.dataSourceType === 1) ?
                                    <FormItem name="输入TOPIC" type="input" isNotNull={true}
                                        changeCallBack={this.updateSaveData} code="mqInputId"
                                        defaultValue={store.details.getData.mqInputId}></FormItem>
                                    : ""
                                }
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormItem name="输出选择" type="select" isNotNull={false}
                                    disabled={store.details.getData.id != null ? true : false}
                                    changeCallBack={this.updateSaveData} code="dataSinkType"
                                    defaultValue={store.details.getData.dataSinkType}
                                    selectData={store.getDataSinkTypeList}></FormItem>
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                {(store.details.getData.dataSinkType === 1) ?
                                    <FormItem name="输出KAFKA" type="input" isNotNull={true}
                                        changeCallBack={this.updateSaveData} code="mqOutputAddr"
                                        defaultValue={store.details.getData.mqOutputAddr}></FormItem>
                                    : ""
                                }
                                {/*</Col>*/}
                                {/*<Col span={8}>*/}
                                {(store.details.getData.dataSinkType === 1) ?
                                    <FormItem name="输出TOPIC" type="input" isNotNull={true}
                                        changeCallBack={this.updateSaveData} code="mqOutputId"
                                        defaultValue={store.details.getData.mqOutputId}></FormItem>
                                    : ""
                                }
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/* <FormItem name="调试配置项" type="select" isNotNull={false}
                                          changeCallBack={this.updateSaveData} code="traceFlag"
                                          defaultValue={store.details.getData.traceFlag}
                                          selectData={store.getTraceFlagList}></FormItem>*/}
                                {/*<div style={{ width: '300px', padding: '10px' }}>
                                <FormTitle isNotNull={false} name="调试配置项"></FormTitle>
                                <Select onChange={(value) => { this.updateSaveData('traceFlag', value); }} value={store.details.getData.traceFlag} style={{ marginTop: '10px', minWidth: '280px' }} mode="multiple">
                                    {store.getTraceFlagList.map((item, i) =>
                                        <Select.Option value={item.code}>{item.value}</Select.Option>
                                    )}
                                </Select>
                                </div>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <div style={{ height: '83px', width: '300px', padding: '10px' }}>
                                    <FormTitle isNotNull={true} name="最长保留时间"></FormTitle>
                                    <div style={{ marginTop: '10px' }}>
                                        <InputNumber
                                            type="text"
                                            placeholder="7"
                                            // size={size}
                                            code='rtqWindowKeepDataTimeLengthSec'
                                            value={store.details.getData.rtqWindowKeepDataTimeLengthSec}
                                            // defaultValue={}
                                            // disabled={true}
                                            onChange={this.handleNumberChange}
                                            style={{ width: '65%', marginRight: '3%' }}
                                            min={store.min_max.getData.zuichangbaoliushijian.min}
                                            max={store.min_max.getData.zuichangbaoliushijian.max}
                                        />
                                        <Select
                                            // value={state.currency}
                                            // size={size}
                                            defaultValue={store.details.getData.keepType}
                                            style={{ width: '32%' }}
                                            onChange={this.handleCurrencyChange}
                                        // disabled={true}
                                        >
                                            {
                                                store.getTimeList.map((item, i) =>
                                                    <Select.Option
                                                        key={i}
                                                        value={item.code} max={item.max}
                                                        min={item.min}>{item.value}</Select.Option>
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                {/*</Col>*/}
                                {/*<Col span={8}>*/}
                                <div style={{ height: '83px', width: '300px', padding: '10px' }}>
                                    <FormTitle isNotNull={true} name="清理周期"></FormTitle>
                                    <div style={{ marginTop: '10px' }}>
                                        <InputNumber
                                            type="text"
                                            placeholder="30"
                                            // size={size}
                                            value={store.details.getData.rtqWindowDeleteTimeIntervalSec}
                                            // defaultValue={1}
                                            onChange={this.handleNumberChange2}
                                            style={{ width: '65%', marginRight: '3%' }}
                                            // disabled={true}
                                            min={store.min_max.getData.qinglizhouqi.min}
                                            max={store.min_max.getData.qinglizhouqi.max}
                                        />
                                        <Select
                                            // value={state.currency}
                                            // size={size}
                                            defaultValue={store.details.getData.delType}
                                            style={{ width: '32%' }}
                                            onChange={this.handleCurrencyChange2}
                                        // disabled={true}
                                        >
                                            {
                                                store.getTimeList.map((item, i) =>
                                                    <Select.Option
                                                        key={i}
                                                        value={item.code} max={item.max}
                                                        min={item.min}>{item.value}</Select.Option>
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormCell name="最大条数" isNotNull={true}>
                                    <InputNumber style={style.formCell} placeholder="请输入"
                                        value={store.details.getData.rtqWindowDeleteChunkSize}
                                        min={100}
                                        max={10000}
                                        onChange={(value) => {
                                            store.details.updateData("rtqWindowDeleteChunkSize", value)
                                        }} />
                                </FormCell>
                                {/*</Col>*/}
                                {/*<Col span={8}>*/}
                                {/*<FormItem name="DB别名" type="input" isNotNull={false}
                                          changeCallBack={this.updateSaveData}
                                          code="voltdbAlias"
                                          defaultValue={store.details.getData.voltdbAlias}></FormItem>*/}
                                {/*</Col>*/}
                                {/*</Row>*/}
                                {/*<Row>*/}
                                {/*<Col span={8}>*/}
                                <FormItem name="描述" type="textarea" isNotNull={false}
                                    placeHolder="请简单描述"
                                    changeCallBack={this.updateSaveData} code="description"
                                    defaultValue={store.details.getData.description}></FormItem>
                                {/*</Col>*/}
                                {/*</Row>*/}

                            </Form>
                        </FormBlock>
                        <FormBlock header="报文字段定义">
                            <div>
                                <Button style={{display:common.isEmpty(this.props.match.params.id) ? "none" : "",marginBottom: "20px", marginTop: "-15px"}}
                                        onClick={() => this.downloadTemplate()}>下载报文字段
                                </Button>
                                <Button style={{marginBottom: "20px", marginTop: "-15px",marginLeft: "10px"}}
                                        onClick={() => this.setState({importZIP: true})}>上传报文字段
                                </Button>
                            </div>
                            <Table dataSource={store.table.reportField.getDataSource}
                                columns={store.table.reportField.getColumns} pagination={false} />
                            <Button type="dashed" block style={{ marginTop: '10px' }} onClick={store.addTempVar1}><Icon
                                type="plus" theme="outlined" />添加报文字段</Button>
                            {/* <Button type="dashed" block style={{ marginTop: '10px' }} onClick={() => { }}><Icon type="plus" theme="outlined" />添加报文字段</Button> */}
                            {/* <div style={{
                                marginTop: '20px',
                                display: 'flex',
                                width: '135px',
                                justifyContent: 'space-between'
                            }}>
                                <Button style={{marginRight: '15%'}}>导出</Button><Button type="primary">导入</Button>
                            </div> */}
                        </FormBlock>
                        {/* <FormBlock header="维度映射">
                            <Table dataSource={store.table.dimensionMapping.getDataSource}
                                   columns={store.table.dimensionMapping.getColumns} pagination={false}/>
                            <Button type="dashed" block style={{marginTop: '10px'}} onClick={store.addTempVar2}><Icon
                                type="plus" theme="outlined"/>添加维度映射</Button>
                        </FormBlock> */}
                    </div>

                    {
                        publicUtils.isAuth("system:eventSource:edit") ?
                            <FormButtonGroupForEventSource
                                cancelCallBack={() => this.props.history.push('/system/config2/eventSource')}
                                saveCallBack={() => {
                                    this.verify()
                                }}
                            />

                            : ''
                    }
                    <Modal
                        title="字段映射"
                        visible={store.modal.fieldMap.getIsShow}
                        onOk={() => {
                            // if (store.tableFields.verify()) {
                            store.modal.fieldMap.setDataSource(store.renderTable3(store.modal.fieldMap.getData))
                            store.modal.fieldMap.setIsShow(false);
                            console.log("store.modal.fieldMap.getData", store.modal.fieldMap.getData);
                            // }
                        }}
                        onCancel={() => store.modal.fieldMap.setIsShow(false)}
                        width="500px"
                    >
                        <Table columns={store.modal.fieldMap.getColumns} dataSource={store.modal.fieldMap.getDataSource}
                            pagination={false} scroll={{ x: 300, y: 400 }} />

                    </Modal>
                    <Modal
                        title="导入报文字段定义"
                        visible={this.state.importZIP}
                        width={500}
                        footer={null}
                        onCancel={() => {
                            this.setState({importZIP: false});
                        }}
                    >
                        <div style={{marginBottom: 20, marginTop: 10}}>
                            <Upload.Dragger
                                {...uploadProps}
                            >
                                <p className="ant-upload-drag-icon"><Icon type="inbox"/></p>
                                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                                <p className="ant-upload-hint">{supportFileTypeText}</p>
                            </Upload.Dragger>
                        </div>
                    </Modal>
                    {/*{
                        publicUtils.isAuth("system:edit") ?
                            <Modal
                                title="----"
                                visible={store.modal.save.getIsShow}
                                onOk={this.modalSaveOk}
                                onCancel={() => { store.modal.share.setIsShow(false); }}
                                keyboard
                                destroyOnClose={true}
                            >
                                <FormData ref="FormData" tree={this.state.tree} />
                            </Modal>
                            :
                            <Modal
                                title="------"
                                visible={store.modal.save.getIsShow}
                                onOk={this.modalSaveOk}
                                onCancel={() => { store.modal.share.setIsShow(false); }}
                                keyboard
                                destroyOnClose={true}
                                footer={null}
                            >
                                <FormData ref="FormData" tree={this.state.tree} />
                            </Modal>
                    }*/}
                </div>
            </Provider>
        )
    }
}

export default Details

const style = {
    formCell: {
        marginTop: '10px',
        width: '100%'
    }
}