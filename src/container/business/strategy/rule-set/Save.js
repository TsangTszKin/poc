/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:32:22
 * @Description: 
 */
/* eslint-disable no-prototype-builtins */
import React, { Component } from 'react';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Icon, Button, message, Modal, Select } from 'antd';
import '@/styles/business/variable/real-time-query-edit.less';
import AddSub from '@/components/process-tree/AddSub';
import FormButtonGroupFor2_0 from '@/components/FormButtonGroupFor2_0';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import PageHeader2 from '@/components/PageHeader2';
import common from '@/utils/common';
import DragSortingTable from '@/components/DragSortingTable';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule-set/Save';



const columns = [
    {
        title: '序号',
        dataIndex: 'c1',
        key: 'c1',
        width: 100,
    },
    {
        title: '规则名',
        dataIndex: 'c2',
        key: 'c2',
    },
    {
        title: '版本',
        dataIndex: 'c6',
        key: 'c6',
    },
    {
        title: '规则标识',
        dataIndex: 'c3',
        key: 'c3',
    },
    {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: ' ',
        dataIndex: 'c5',
        key: 'c5',
        width: 100,
    }
];

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.addTempVar = this.addTempVar.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.formatTempVars = this.formatTempVars.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
        this.getRuleListByC_E_D = this.getRuleListByC_E_D.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.getRuleSetById = this.getRuleSetById.bind(this);
        this.ruleSortCallBackFunc = this.ruleSortCallBackFunc.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.saveRuleSetForNewVersion = this.saveRuleSetForNewVersion.bind(this);
        this.init = this.init.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            allRules: [],
            selectRulreList: [],
            index: 0
        }
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "description": "",
            "category": "",
            "categoryName": "",
            "type": this.props.match.params.type,
            "rules": [
                // {
                //     "id": ""
                // }
            ]


        }
    }

    componentDidMount() {
        this.init();
    }

    componentWillUpdate(){
        // this.init();
    }

    init() {
        if (!common.isEmpty(this.props.match.params.id)) {
            store.setId(this.props.match.params.id);
            store.allVersionForApi();
            this.getRuleSetById(this.props.match.params.id);
            // if (this.props.match.params.type === '1') {
            //     this.getRuleById(this.props.match.params.id);
            // } else {
            //     this.getRuleByTemplateId(this.props.match.params.id);
            // }
        } else {
            this.getInitDataList();
        }
    }

    componentWillUnmount() {
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }


    getRuleSetById(id) {
        strategyService.getRuleSetById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;

            store.approvalSubmitParams.code = data.code;
            store.approvalSubmitParams.id = data.id;
            store.approvalSubmitParams.name = data.name;
            store.approvalSubmitParams.version = data.version;
            store.approvalSubmitParams.remark = '';
            store.approvalSubmitParams.approvalStatus = common.isEmpty(data.approvalStatus) ? '' : data.approvalStatus;
            store.approvalSubmitParams.actionType = data.status == 0 ? 0 : 4;

            if (data.approvalStatus == 3) {
                store.setIsCanCommit(true);
            } else {
                store.setIsCanCommit(false);
            }


            this.saveData = data;

            // if (!common.isEmpty(data.rules)) {


            strategyService.getRuleListByC_E_D(data.dimensionId, data.eventSourceId, this.saveData.category, this.props.match.params.type).then(res2 => {
                if (!publicUtils.isOk(res2)) return
                this.setState({
                    selectRulreList: []
                })
                let tempArray = [];
                if (res2.data.result && typeof res2.data.result === 'object') {

                    res2.data.result.forEach(element => {
                        tempArray.push({
                            code: element.code,
                            name: element.name,
                            versions: element.versions
                        });
                    })
                    res.data.result.rules.forEach(element => {
                        tempArray.push({
                            code: element.code,
                            name: element.name,
                            versions: element.versions
                        });
                    })

                    console.log("tempArray", tempArray)

                    //去重
                    let noRepeatRuleObj = {};
                    let noRepeatRuleArray = [];
                    tempArray.forEach(element => {
                        if (!noRepeatRuleObj[element.code]) {
                            noRepeatRuleObj[element.code] = element;
                        }
                    })

                    for (const key in noRepeatRuleObj) {
                        if (noRepeatRuleObj.hasOwnProperty(key)) {
                            const element = noRepeatRuleObj[key];
                            noRepeatRuleArray.push(element);
                        }
                    }
                    this.setState({
                        allRules: noRepeatRuleArray
                    });

                }

                this.saveData.rules = data.rules;
                var tempArray2 = this.renderTable(this.saveData.rules);
                this.setState({
                    selectRulreList: tempArray2
                })

            })

            // }
            this.setState({
                dimensionList: this.state.dimensionListAll[data.eventSourceId + '·-·' + data.eventSourceName]
            })

            this.setState({ index: Math.random() });

            console.log("this.saveData = ", this.saveData);
        })
    }

    showConfirm(key, value, isBatch) {
        let self = this;
        console.log("this.saveData.eventSourceId 前", self.saveData.eventSourceId);
        Modal.confirm({
            title: '更改事件源或维度会清空规则集，是否确定更改？',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                self.saveData.rules = [];

                self.setState({
                    selectRulreList: []
                })
                if (isBatch) {
                    for (let i = 0; i < key.length; i++) {
                        const element = key[i];
                        self.saveData[element] = value[i];
                    }
                    if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0) {
                        self.saveData.dimensionId = '';
                        self.saveData.dimensionName = '';
                        self.setState({
                            dimensionList: self.state.dimensionListAll[value[0] + '·-·' + value[1]],
                        });
                    }
                } else {
                    self.saveData[key] = value;
                    if (key === 'eventSourceId') {
                        self.saveData.dimensionId = '';
                        self.saveData.dimensionName = '';
                        self.setState({
                            dimensionList: self.state.dimensionListAll[value],
                        });
                    }
                    if (key === 'dimensionId') {
                        self.getRuleListByC_E_D(value, self.saveData.eventSourceId);
                    }
                }

            },
            onCancel() {
                console.log('Cancel');
                self.setState({
                    index: self.state.index++
                })
                console.log("this.saveData.eventSourceId 后", self.saveData.eventSourceId);
            },
        });
    }

    save = () => {
        let params = common.deepClone(this.saveData);
        params.rules.forEach(element => {
            delete element.versions
        })
        common.loading.show();
        strategyService.saveRuleSet(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return

            message.success('保存成功');
            this.saveData.id = res.data.result.id;
            this.props.history.push(`/business/strategy/rule-set/save/${this.props.match.params.type}/${res.data.result.id}`);
            this.init();
            store.setCommitId(res.data.result.id);
        }).catch(() => {
            common.loading.hide();
        });
    }

    getRuleListByC_E_D(dimensionId, eventSourceId) {
        strategyService.getRuleListByC_E_D(dimensionId, eventSourceId, this.saveData.category, this.props.match.params.type).then(res => {
            if (!publicUtils.isOk(res)) return

            this.setState({
                selectRulreList: []
            })
            this.saveData.rules = [];
            if (res.data.result) {
                let tempArray = [];
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.code,
                        name: element.name,
                        versions: element.versions
                    });
                })
                this.setState({
                    allRules: tempArray
                });
            }

        })
    }

    verify() {
        console.log("this.saveData = ", this.saveData);
        if (common.isEmpty(this.saveData.name)) {
            message.warning('基本信息 - 名称 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning('基本信息 - 标识 不能为空');
            return false
        }
        // if (this.saveData.code.indexOf("rs_") !== 0) {
        //     message.warning('基本信息 - 标识 必须以 rs_ 开头');
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
            message.warning('基本信息 - 类型 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return false
        }
        if (common.isEmpty(this.saveData.rules)) {
            message.warning('规则集配置 - 请添加规则');
            return false
        }

        for (let i = 0; i < this.saveData.rules.length; i++) {
            const element = this.saveData.rules[i];
            if (element.code === 0) continue;
            if (common.isEmpty(element.id)) {
                message.warning('规则集配置 - 规则 不能为空');
                return false
            }
            for (let j = 0; j < this.saveData.rules.length; j++) {
                const element2 = this.saveData.rules[j];
                if (i === j) continue;
                if (element.id === element2.id) {
                    message.warning("请勿重复选择规则");
                    return false
                }
            }
        }
        return true
    }

    updateSaveData = (key, value, isBatch) => {
        console.log("data-change", key, value)
        if (isBatch) {
            if (key.indexOf('category') >= 0) {
                for (let i = 0; i < key.length; i++) {
                    const element = key[i];
                    this.saveData[element] = value[i];
                }
                this.getRuleListByC_E_D(this.saveData.dimensionId, this.saveData.eventSourceId);
                this.setState({
                    index: Math.random()
                })
            }

            if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0 || key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                if (this.saveData.rules && this.saveData.rules.length > 0) {
                    this.showConfirm(key, value, isBatch);
                } else {

                    for (let i = 0; i < key.length; i++) {
                        const element = key[i];
                        this.saveData[element] = value[i];
                        if (element === 'eventSourceId') {
                            this.saveData.dimensionId = '';
                            // console.log('test ------', this.state.dimensionListAll[value[0]]+ '·-·'+ this.state.dimensionListAll[value[1]])
                            this.setState({
                                dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                            });
                            this.saveData.dimensionId = '';
                            this.saveData.dimensionName = '';
                        }
                        if (element === 'dimensionId') {
                            this.getRuleListByC_E_D(value[i], this.saveData.eventSourceId);
                        }
                    }

                    this.setState({
                        index: Math.random()
                    })
                }
            }
        } else {
            if (key === 'eventSourceId' || key === 'dimensionId') {
                if (this.saveData.rules && this.saveData.rules.length > 0) {
                    this.showConfirm(key, value);
                } else {
                    this.saveData[key] = value;
                    if (key === 'eventSourceId') {
                        this.saveData.dimensionId = '';
                        this.setState({
                            dimensionList: this.state.dimensionListAll[value],
                        });
                    }
                    if (key === 'dimensionId') {
                        this.getRuleListByC_E_D(value, this.saveData.eventSourceId);
                    }
                }

            } else {
                if (key === 'code') {
                    this.saveData.code = value.replace(/[^\w_]/g, '');
                } else {
                    this.saveData[key] = value;
                }
            }
            switch (key) {
                case 'name':
                    this.saveData.name = common.stripscript(this.saveData.name.substr(0, 30));
                    break;
                case 'code':
                    this.saveData.code = common.stripscript(this.saveData.code.substr(0, 30));
                    break;
                case 'description':
                    this.saveData.description = this.saveData.description.substr(0, 255);
                    break;
                default:
                    break;
            }
        }
        this.setState({
            index: Math.random()
        })
    }

    addTempVar = () => {

        this.saveData.rules.push({
            "id": "",
            "name": '',
            "code": '',
            "versions": []
        })
        let tempArray = this.renderTable(this.saveData.rules);
        this.setState({
            selectRulreList: tempArray
        })
    }

    subTempVars = (key) => {
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.state.selectRulreList.length; i++) {
            const element = this.state.selectRulreList[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }

        this.saveData.rules.splice(arrayIndex, 1);

        var tempArray2 = this.renderTable(this.saveData.rules);
        this.setState({
            selectRulreList: tempArray2
        })
        console.log(tempArray2);
    }

    formatTempVars = (i, name, value) => {
        this.saveData.rules[i][name] = value;
        if (name === 'versions') {
            this.saveData.rules[i].id = '';
        }
        console.log(this.saveData.rules);
        var tempArray2 = this.renderTable(this.saveData.rules);
        this.setState({
            selectRulreList: tempArray2
        })
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
                    tempArray.push({ code: element1.id + '·-·' + element1.name, value: element1.name })
                })
                temp2[element.eventSourceId + '·-·' + element.eventSourceName] = tempArray;
                array1.push(temp1);
            });
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })

            // self.saveData.eventSourceId = array1[0].code;
            // self.saveData.dimensionId = temp2[array1[0].code];
            // if (!common.isEmpty(this.props.match.params.id)) {
            //     this.getRuleSetById(this.props.match.params.id);
            // }
        })
    }


    ruleSortCallBackFunc(dragIndex, hoverIndex) {

        let dataSource = common.deepClone(this.state.selectRulreList);
        let dataSourceAfter = common.deepClone(this.state.selectRulreList);
        let rules = common.deepClone(this.saveData.rules);
        console.log("before the rules sort is", rules);
        dataSourceAfter[dragIndex] = dataSource[hoverIndex];
        dataSourceAfter[hoverIndex] = dataSource[dragIndex];
        this.saveData.rules[dragIndex] = rules[hoverIndex];
        this.saveData.rules[hoverIndex] = rules[dragIndex];
        // this.setState({
        //     selectRulreList: dataSourceAfter
        // })
        console.log("after the rules sort is", this.saveData.rules);

        var tempArray2 = this.renderTable(this.saveData.rules);
        this.setState({
            selectRulreList: tempArray2
        })
    }

    renderTable(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: i + 1,
                c2: <Select style={{ width: '80%', minWidth: '210px' }} onChange={(value, option) => { this.formatTempVars(i, 'name', option.props.children); this.formatTempVars(i, 'code', option.props.code); this.formatTempVars(i, 'versions', option.props.versions); }} defaultValue={element.name} >
                    {
                        this.state.allRules.map((item, i) =>
                            <Select.Option key={i} value={item.code} code={item.code} versions={item.versions} >{item.name}</Select.Option>
                        )
                    }
                </Select>,
                c6: <Select style={{ width: '70%', minWidth: '110px' }} onChange={(value, option) => { this.formatTempVars(i, 'id', value); this.formatTempVars(i, 'description', option.props.description) }} defaultValue={element.id} >
                    {
                        element.versions.map((item, i) =>
                            <Select.Option key={i} value={item.id} description={item.description}>{item.version}</Select.Option>
                        )
                    }
                </Select>,
                c3: element.code,
                // c4: <div style={{ textAlign: 'center' }}><Status status={element.status} /></div>,
                c5: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>,
                category: element.categoryName
            })
        }

        return tempArray
    }

    saveRuleSetForNewVersion() {
        let params = common.deepClone(this.saveData);
        params.rules.forEach(element => {
            delete element.versions
        })

        common.loading.show();
        strategyService.saveRuleSetForNewVersion(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.props.history.push(`/business/strategy/rule-set/save/${res.data.result.type}/${res.data.result.id}`)
            store.setId(res.data.result.id);
            this.getRuleSetById(res.data.result.id);
            store.allVersionForApi();
        }).catch(() => common.loading.hide())
    }


    render() {
        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                this.getRuleSetById(store.getId);
                store.setStoreBus(2);//info再初始化一次
                break;

            default:
                break;
        }
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader2
                        meta={this.props.meta}
                        isShowBtns={false}
                        isShowSelect={!common.isEmpty(this.props.match.params.id)}
                        auth={{
                            test: false,
                            sql: false,
                            version: publicUtils.isAuth("business:strategy:rule:view"),
                        }}>
                        </PageHeader2>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <div style={{ marginTop: '20px', paddingTop: '16px' }}>
                            <FormBlock header="基本信息">
                                <Form>
                                    <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                    <FormItem name="标识" placeHolder="请输入标识" disabled={this.props.match.params.id ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                    <FormItem name="事件源" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceName}></FormItem>
                                    <FormItem name="维度" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionName}></FormItem>
                                    <FormItem name="匹配模式" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="type" selectData={[{ code: 1, value: '全规则模式' }, { code: 0, value: '优先级模式' }]} defaultValue={Number(this.props.match.params.type)} disabled={true}></FormItem>
                                    <FormItem name="类别" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="ruleSet" defaultValue={this.saveData.categoryName}></FormItem>
                                    <FormItem name="描述" type="textarea" placeHolder="请简单描述" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                                </Form>
                            </FormBlock>
                            <FormBlock header="规则集配置">
                                <DragSortingTable dataSource={this.state.selectRulreList} columns={columns} callBackFunc={this.ruleSortCallBackFunc} />
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addTempVar}><Icon type="plus" theme="outlined" />添加规则</Button>
                            </FormBlock>
                        </div>
                        {
                            publicUtils.isAuth("business:strategy:ruleSet:edit") ?
                                <FormButtonGroupFor2_0
                                    saveCallBack={() => {
                                        if (this.verify()) {
                                            this.save();
                                        }
                                    }}
                                    saveNewCallBack={() => {
                                        if (common.isEmpty(this.props.match.params.id)) {
                                            message.warn("请先保存");
                                            return
                                        } else {
                                            if (this.verify()) {
                                                this.saveRuleSetForNewVersion();
                                            }
                                        }
                                    }}
                                    cancelCallBack={() => this.props.history.push('/business/strategy/rule-set')}
                                />
                                : ''
                        }
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Save