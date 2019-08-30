/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:22:21
 * @Description: 
 */
import React, { Component } from 'react';
import PageHeader from '@/components/PageHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import FormHeader from '@/components/FormHeader';
import FormButtonGroup from '@/components/FormButtonGroup';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import strategyService from '@/api/business/strategyService';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/output/Save';


@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            dataTypeList: [],
        }
        this.saveData = {
            "name": "",
            "resultKey": "",
            "type": "",
            "typeLabel": ""
        }
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.verify = this.verify.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.getResultDetail = this.getResultDetail.bind(this);
    }

    componentDidMount() {
        this.getDataTypeList();
        if (!common.isEmpty(this.props.match.params.id)) {
            this.getResultDetail();
        }
    }

    verify() {
        if (common.isEmpty(this.saveData.name)) {
            message.warning("名称不能为空");
            return
        }
        if (common.isEmpty(this.saveData.resultKey)) {
            message.warning("标识不能为空");
            return
        }
        if (common.isEmpty(this.saveData.type)) {
            message.warning("数据类型不能为空");
            return
        }
        if (common.isEmpty(this.saveData.typeLabel)) {
            message.warning("数据类型不能为空");
            return
        }
        this.saveResult();
    }

    saveResult() {
        common.loading.show();
        strategyService.saveResult(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.props.history.push("/business/strategy/output");
        }).catch(() => { common.loading.hide(); })
    }

    updateSaveData = (key, value, isBatch) => {
        console.log("data-change", key, value)
        if (isBatch) {
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                this.saveData[element] = value[i];
            }
        } else {
            this.saveData[key] = value;
            switch (key) {
                case 'name':
                    this.saveData.name = this.saveData.name.substr(0, 30);
                    break;
                case 'code':
                    this.saveData.code = this.saveData.code.substr(0, 30);
                    break;
                default:
                    break;
            }
        }

        this.setState({
            index: Math.random()
        })
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

    getResultDetail() {
        strategyService.getResultById(this.props.match.params.id).then(res => {
            if (!publicUtils.isOk(res)) return
            this.saveData.id = res.data.result.id;
            this.saveData.name = res.data.result.name;
            this.saveData.resultKey = res.data.result.resultKey;
            this.saveData.type = res.data.result.type;
            this.saveData.typeLabel = res.data.result.typeLabel;
            if (!common.isEmpty(res.data.result.value)) {
                this.saveData.value = res.data.result.value
            }
            this.setState({
                index: Math.random()
            })
        })

    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <FormHeader title="信息维护" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                        <div style={{ marginTop: '20px' }}>
                            <FormBlock header="输出结果定义" key="1">
                                <Form>
                                    <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                    <FormItem name="标识" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="resultKey" defaultValue={this.saveData.resultKey}></FormItem>
                                    <FormItem name="数据类型" type="select" isNotNull={true} selectData={this.state.dataTypeList} changeCallBack={this.updateSaveData} code={["type", "typeLabel"]} defaultValue={this.saveData.type + '·-·' + this.saveData.typeLabel}></FormItem>
                                </Form>
                            </FormBlock>
                        </div>
                        <FormButtonGroup
                            cancelCallBack={() => this.props.history.push('/business/strategy/output')}
                            saveCallBack={this.verify}
                        />
                    </div>

                </div>
            </Provider>
        )
    }
}

export default Save