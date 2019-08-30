/*
 * @Author: zengzijian
 * @Date: 2018-08-22 16:41:34
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:10:45
 * @Description: 衍生变量保存页面级组件
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/ext/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import Form from '@/components/Form';
import FormItem from '@/components/FormItem';
import { message, Select, Input, Icon, Row, Col, Cascader } from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import variableService from '@/api/business/variableService';
import FunctionParams from '@/components/business/variable/derivation/FunctionParams';
import publicUtils from '@/utils/publicUtils';
import DateTimePicker from '@/components/DateTimePicker';
import FormBlock from '@/components/FormBlock';

function getCurrentTimeString() {
    var date = new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
    return Y + M + D;
}
@withRouter
@observer
class SaveFunc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            index: 0,
            dataTypeList: [],
            functionExpressionList: [],
            allVarsList: [],
            date: getCurrentTimeString(),
            time: '00:00:00'
        }
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.getExpressionVarTypeList = this.getExpressionVarTypeList.bind(this);
        this.getAllVarList = this.getAllVarList.bind(this);
        this.updateParam = this.updateParam.bind(this);
        this.verify = this.verify.bind(this);
        this.getExtVarById = this.getExtVarById.bind(this);
        this.testExtVar = this.testExtVar.bind(this);
        this.testDateTimeOnchange = this.testDateTimeOnchange.bind(this);
        this.save = this.save.bind(this);
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "type": 2,//类型 0计算变量 1正则变量 2函数变量
            "typeLabel": "函数变量",
            "defaultValue": "",
            "description": "",
            "category": '',
            "categoryName": "",
            "dataType": '',//数据类型
            "dataTypeLabel": '',//dataTypeLabel
            "param": null,
            "expandParam": null,
            "functionType": null,
            "requiredVars": null,
            "varType": ""
        }
        this.test = {
            value: '',
            result: ''
        }
    }
    componentWillReceiveProps(nextProp) {
        if (nextProp.match.params.id !== this.props.match.params.id) {
            this.getExtVarById(nextProp.match.params.id);
        }
    }
    componentDidMount() {
        this.resource = this.props.resource;
        sessionStorage.removeItem("tempEventSourceId");
        sessionStorage.removeItem("tempDimensionId");
        if (common.isEmpty(this.props.match.params.id)) {
            this.getInitDataList();
            this.getDataTypeList();
        } else {
            this.getExtVarById(this.props.match.params.id);
        }
        this.getExpressionVarTypeList();
    }
    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val + '·-·' + element.label,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }
    getExtVarById(id) {
        if (this.resource) this.handleResult(this.resource);
        else {
            variableService.getExtVarById(id).then(res => {
                if (!publicUtils.isOk(res)) return
                this.handleResult(res.data.result);
            })
        }

    }

    handleResult = result => {
        let data = common.deepClone(result);

        this.saveData = data;

        store.approvalSubmitParams.id = data.id;
        store.approvalSubmitParams.code = data.code;
        store.approvalSubmitParams.name = data.name;
        store.approvalSubmitParams.actionType = data.status == 0 ? 0 : 4;
        store.approvalSubmitParams.approvalStatus = common.isEmpty(data.approvalStatus) ? '' : data.approvalStatus;

        if (data.approvalStatus == 3) {
            store.setIsCanCommit(true);
        } else {
            store.setIsCanCommit(false);
        }

        if (!common.isEmpty(this.saveData.vars)) {
            let tempArray = [];
            data.vars.forEach(element => {
                let temp = {
                    value: element.type,
                    label: element.name,
                    children: []
                }
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code,
                        label: element2.name
                    });
                })
                tempArray.push(temp);
            })
            this.setState({
                allVarsList: tempArray
            })
            delete this.saveData.vars;
        }
        if (!common.isEmpty(this.saveData.dicts)) delete this.saveData.dicts;



        this.setState({
            index: Math.random()
        })
    }

    verify() {
        console.log(this.saveData);

        if (common.isEmpty(this.saveData.name)) {
            message.warning("基础信息 - 名称 不能为空");
            return false
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning("基础信息 - 名称 不能为空");
            return false
        }
        // if (this.saveData.code.indexOf("ev_d_") !== 0) {
        //     message.warning('基本信息 - 标识 必须以 ev_d_ 开头');
        //     return false
        // }
        if (common.isEmpty(this.saveData.eventSourceId)) {
            message.warning('基本信息 - 事件源 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.dimensionId)) {
            message.warning('基本信息 - 维度 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.type)) {
            message.warning('基本信息 - 数据类型 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.defaultValue)) {
            message.warning('基本信息 - 默认值 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.requiredVars)) {
            message.warning('函数表达式 选择变量不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.functionType)) {
            message.warning('函数表达式 选择函数类型不能为空');
            return false
        }
        switch (this.saveData.functionType) {
            case 0:
                if (common.isEmpty(this.saveData.param)) {
                    message.warning('函数表达式 请输入要替换的字符串');
                    return false
                }
                if (common.isEmpty(this.saveData.expandParam)) {
                    message.warning('函数表达式 请输入要替换的新字符串');
                    return false
                }
                break;
            case 4:
                if (common.isEmpty(this.saveData.param)) {
                    message.warning('函数表达式 请输入字符串截取的起始位置');
                    return false
                }
                if (common.isEmpty(this.saveData.expandParam)) {
                    message.warning('函数表达式 请输入字符串截取的结束位置');
                    return false
                }
                break;
            case 5:
                if (common.isEmpty(this.saveData.param)) {
                    message.warning('函数表达式 请输入需要查询的字符串');
                    return false
                }
                break;
            case 6:
                if (common.isEmpty(this.saveData.param)) {
                    message.warning('函数表达式 请输入需要转换的时间格式');
                    return false
                }
                if (common.isEmpty(this.saveData.expandParam)) {
                    message.warning('函数表达式 请输入完整需要修改的时间数量');
                    return false
                }
                break;

            default:
                break;
        }

        return true
        // message.warning("待完善");

    }

    save() {
        common.loading.show();
        variableService.saveExtVar(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.getExtVarById(res.data.result.id);
            this.props.history.push(`/business/variable/derivation/save-func/${res.data.result.id}`);
            if (res.data.result.approvalStatus == 3) {
                store.setIsCanCommit(true);
            }
        }).catch(() => {
            common.loading.hide();
        });
    }

    getInitDataList = () => {
        let self = this;
        variableService.getEventSourceSelectList(true).then(res => {
            if (!publicUtils.isOk(res)) return
            let array1 = [];
            let temp2 = {};
            res.data.result.forEach(element => {
                // if (element.dimensionVOS.length <= 0) return;
                let temp1 = {};

                let tempArray = [];
                temp1.code = element.eventSourceId + '·-·' + element.eventSourceName;
                temp1.value = element.eventSourceName;
                element.dimensionVOS.forEach(element1 => {
                    tempArray.push({ code: element1.id+ '·-·' + element1.name, value: element1.name })
                })
                temp2[element.eventSourceId + '·-·' + element.eventSourceName] = tempArray;
                array1.push(temp1);
            });
            // console.log(array1);
            // console.log(temp2);
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })
        })
    }

    getExpressionVarTypeList() {
        variableService.getEnumList("expressionFunctionType").then(res => {
            if (!publicUtils.isOk(res)) return
            if (!common.isEmpty(res.data.result)) {
                this.setState({
                    functionExpressionList: res.data.result
                })
            }
        });

    }
    getAllVarList() {
        variableService.getAllVarList('', 'ext').then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                let temp = {
                    value: element.type,
                    label: element.name,
                    children: []
                }
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code,
                        label: element2.name
                    });
                })
                tempArray.push(temp);
            })
            this.setState({
                allVarsList: tempArray
            })
        })
    }

    updateSaveData = (key, value, isBatch) => {
        if (key === 'name' || key === 'code') {
            value = common.stripscript(value);
        }
        console.log("data-change", key, value)
        if (isBatch) {
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                this.saveData[element] = value[i];
            }
            if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0) {
                this.saveData.dimensionId = '';
                this.saveData.dimensionName = '';
                this.setState({
                    dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                });

            }
            if (key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
                    sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
                    sessionStorage.tempDimensionId = this.saveData.dimensionId;
                    this.getAllVarList();
                }
            }
            if (key.indexOf('dataType') >= 0 || key.indexOf('dataTypeLabel') >= 0) {
                this.saveData.defaultValue = '';
            }
        } else {
            if (key === 'code') {
                this.saveData.code = value.replace(/[^\w_]/g, '');
            } else if (key === 'functionType') {
                this.saveData.param = '';
                this.saveData.expandParam = '';
                this.saveData[key] = value;
            } else {
                this.saveData[key] = value;
            }

        }



        this.setState({
            index: Math.random()
        })
    }

    updateParam(param, expandParam) {

        console.log("updateParam param", param);
        console.log("updateParam expandParam", expandParam);

        if (!common.isEmpty(param)) {
            if (this.saveData.functionType == 4) {
                if (!isNaN(param) && String(param).indexOf('.') == -1) {
                    this.saveData.param = param;
                }
            } else {
                this.saveData.param = param;
            }
            this.setState({
                index: Math.random()
            })
        }


        if (!common.isEmpty(expandParam)) {
            if (this.saveData.functionType == 4) {
                if (!isNaN(expandParam) && String(expandParam).indexOf('.') == -1) this.saveData.expandParam = expandParam;
            } else {
                this.saveData.expandParam = expandParam;
            }
            this.setState({
                index: Math.random()
            })
        }


        if (common.isEmpty(param) && common.isEmpty(expandParam)) {
            // this.saveData.expandParam = expandParam;
            if (this.saveData.functionType == 5) {
                this.saveData.expandParam = expandParam;
                this.saveData.param = param;

            }

            if (param !== null)//param = 空字符串的时候
                this.saveData.param = param;
            if (expandParam !== null)//expandParam = 空字符串的时候
                this.saveData.expandParam = expandParam;
            this.setState({
                index: Math.random()
            })
        }

    }

    testExtVar(checkValue, params) {
        if (this.saveData.functionType == 6) {
            checkValue = `${this.state.date} ${this.state.time}`;
        }
        common.loading.show();
        variableService.testExtVar(checkValue, params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            if (!common.isEmpty(res.data.result)) {
                this.test.result = res.data.result;
            } else {
                this.test.result = '';
            }
            this.setState({
                index: Math.random()
            })
        }).catch(() => {
            common.loading.hide();
        })
    }

    testDateTimeOnchange(name, value) {
        console.log(name, value)
        // let timeStamp = new Date(value).getTime();
        if (name === 'date') {
            this.setState({
                date: value
            })
        }
        if (name === 'time') {
            this.setState({
                time: value
            })
        }

    }

    render() {
        function filter(inputValue, path) {
            return (path.some(option => String(option.value).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                if (!common.isEmpty(this.props.match.params.id)) {
                    this.getExtVarById(this.props.match.params.id);
                }
                store.setStoreBus(0);//info再初始化一次
                break;

            default:
                break;
        };
        const disableEdit = !!this.resource;
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" >
                        <FormHeader title="函数变量" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                        <div style={{ marginTop: '20px' }}>
                            <FormBlock header="基本信息">
                                <Form>
                                    <FormItem name="名称" disabled={ disableEdit } type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                    <FormItem name="标识" placeHolder="请输入标识" disabled={this.props.match.params.id ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                    <FormItem name="事件源" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceName}></FormItem>
                                    <FormItem name="维度" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionName}></FormItem>
                                    <FormItem name="数据类型" type="select" disabled={this.props.match.params.id ? true : false} isNotNull={true} changeCallBack={this.updateSaveData} code={["dataType", "dataTypeLabel"]} selectData={this.state.dataTypeList} defaultValue={this.saveData.dataTypeLabel}></FormItem>
                                    <FormItem name="默认值" disabled={ disableEdit } type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="defaultValue" dataType={this.saveData.dataType} defaultValue={this.saveData.defaultValue}></FormItem>
                                    <FormItem name="类型" type="select" disabled={true} isNotNull={true} defaultValue={2} selectData={[{ code: 2, value: '函数变量' }]}></FormItem>
                                    <FormItem name="类别" disabled={ disableEdit } type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="ext" defaultValue={this.saveData.category + '·-·' + this.saveData.categoryName}></FormItem>
                                    <FormItem name="描述" disabled={ disableEdit } type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                                </Form>
                            </FormBlock>
                            <FormBlock header="函数表达式">
                                <Row style={{ border: '1px solid gainsboro', borderRadius: '5px' }}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={4} style={{ overflowX: 'auto', marginTop: '15px', textAlign: 'center', display: common.isEmpty(this.saveData.name) ? 'none' : 'block' }}>
                                        {this.saveData.name}  =
                                        </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={20}>
                                        <div style={{ float: 'left', padding: '10px', width: '100%' }}>
                                            <p style={{ margin: '0', width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', marginRight: '10px' }}>对</p>
                                            <Cascader style={{ width: '180px', float: 'left' }} displayRender={label => label[1]} value={[this.saveData.varType, this.saveData.requiredVars]} title={this.saveData.requiredVars} onChange={(value) => { this.updateSaveData('varType', value[0]); this.updateSaveData('requiredVars', value[1]); }} className="varList" options={this.state.allVarsList} placeholder="请选择" showSearch={{ filter }} />
                                            <p style={{width: 'fit-content', float: 'left', height: '32px', lineHeight: '32px', margin: '0 10px' }}>使用函数表达式</p>
                                            <Select style={{ width: '200px', float: 'left' }} value={this.saveData.functionType} onChange={(value) => { this.updateSaveData('functionType', value) }}>
                                                {
                                                    this.state.functionExpressionList.map((item, i) =>
                                                        <Select.Option value={item.val} key={i}>{item.label}</Select.Option>
                                                    )
                                                }
                                            </Select>
                                        </div>
                                        <FunctionParams val={this.saveData.functionType} param={this.saveData.param} expandParam={this.saveData.expandParam} updateParam={this.updateParam} />
                                    </Col>
                                </Row>
                            </FormBlock>
                            <FormBlock header="表达式测试">
                                <div className="clearfix">
                                    <div style={{ float: 'left', width: '350px', height: '83px', padding: '10px' }}>
                                        <p style={{ margin: '5px' }}>测试输入值</p>
                                        {this.saveData.functionType == 6 ?
                                            <DateTimePicker onChange={this.testDateTimeOnchange} date={this.state.date} time={this.state.time} />
                                            :
                                            <Input
                                                placeholder="请输入测试值"
                                                suffix={<Icon type="close-circle" onClick={() => {
                                                    this.userNameInput.focus();
                                                    this.test.value = '';
                                                    this.setState({ index: Math.random() })
                                                }} />}
                                                value={this.test.value}
                                                id="save-func-input"
                                                onChange={(e) => {
                                                    this.test.value = e.target.value;
                                                    this.setState({ index: Math.random() });
                                                }}
                                                ref={node => this.userNameInput = node}
                                            />
                                        }


                                    </div>

                                    <div style={{ float: 'left', width: '300px', height: '83px', padding: '10px' }}>
                                        <p style={{ margin: '5px' }}>输出结果</p>
                                        <Input.Search
                                            placeholder="输出结果"
                                            enterButton="测试"
                                            onSearch={() => { if (this.verify()) { this.testExtVar(this.test.value, this.saveData) } }}
                                            value={this.test.result}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </FormBlock>
                        </div>
                        {
                            publicUtils.isAuth("business:variable:ext:edit") ?
                                <FormButtonGroup
                                    cancelCallBack={() => disableEdit ? this.props.history.goBack(): this.props.history.push('/business/variable/derivation')}
                                    saveCallBack={() => { if (this.verify()) { this.save() } }}
                                    isShowSaveBtn={ !disableEdit }
                                />
                                : ''
                        }

                    </div>
                </div>
            </Provider >
        )
    }
}
export default SaveFunc;
