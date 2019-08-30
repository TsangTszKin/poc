/*
 * @Author: zengzijian
 * @Date: 2019-05-28 17:25:58
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:07:06
 * @Description: 
 */
import React from 'react';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import store from '@/store/business/variable/batch/Save';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import FormBlock from '@/components/FormBlock';
import variableService from '@/api/business/variableService';
import FormButtonGroup from '@/components/FormButtonGroup';
import { withRouter } from 'react-router-dom';
import { message } from "antd/lib/index";
import dimensionService from '@/api/system/config2/dimensionService';
import { inject } from "mobx-react/index";
import { action } from "mobx/lib/mobx";


@withRouter
@inject('GlobalStore')
@observer
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.getDimensionList = this.getDimensionList.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.verify = this.verify.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.getBatchVarCategory = this.getBatchVarCategory.bind(this);
        this.state = {
            dimensionNameList: [],
            dataTypeList: [],
            batchVarCategoryList: []
        }
    }

    componentDidMount() {
        // store.initData();
        this.getDimensionList();
        this.getDataTypeList();
        this.getBatchVarCategory();
        store.id = this.props.match.params.id;
        if (!common.isEmpty(this.props.match.params.id)) {
            window.document.querySelector("#event-source-details .pageContent").style.height = 'auto';
            store.id = this.props.match.params.id;
            store.getDetailsForApi();
        } else {
            store.initTable();
            store.id = ''
        }
    }

    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        if (key === 'code') {
            value = value.replace(/[^\w_]/g, '');
        }
        let data = common.deepClone(store.details.getData);
        if (key === 'name' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-名称不能是纯数字")
            }
        } else if (key === 'code' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-标识不能是纯数字")
            }
        } else {
            data[key] = value;
            console.log("data", data)
        }
        store.details.setData(data);
    }


    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }

    getDimensionList() {
        dimensionService.getDimensionNameList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    dimensionId: element.rtdDimensionId,
                    value: element.name,
                    code: `${element.rtdDimensionId}·-·${element.code}`
                });
            })
            this.setState({
                dimensionNameList: tempArray
            })
        })
    }

    getBatchVarCategory() {
        variableService.getBatchVarCategory().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    dataCode: element.dataCode,
                    value: element.dataName,
                    code: `${element.dataValue}·-·${element.dataName}`
                });
            })
            this.setState({
                batchVarCategoryList: tempArray
            })
        })
    }


    verify() {
        if (common.isEmpty(store.details.getData.name)) {
            message.warning('基本信息 -名称 不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.code)) {
            message.warning('基本信息 - 标识 不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.dimensionName)) {
            message.warning('基本信息 - 请选择 维度');
            return
        }
        if (common.isEmpty(store.details.getData.type)) {
            message.warning('基本信息 - 请选择 数据类型');
            return
        }
        if (common.isEmpty(store.details.getData.category)) {
            message.warning('基本信息 - 请选择 类别');
            return
        }
        if (common.isEmpty(store.details.getData.defaultValue)) {
            message.warning('基本信息 - 默认值 不能为空');
            return
        }
        this.saveForApi();
    }

    saveForApi() {
        let data = store.details.getData;
        console.log("data", data)
        common.loading.show();
        variableService.addBatchVar(data).then(this.saveForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound saveForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        this.props.history.push(`/business/variable/batch`);
    }

    render() {
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
                        <FormHeader title="批次变量" style={{ marginLeft: '24px' }}></FormHeader>
                        <FormBlock header="基本信息">
                            <Form>
                                <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData}
                                    code="name" defaultValue={store.details.getData.name}></FormItem>
                                <FormItem name="标识" type="input" placeHolder="请输入以bv_的标识"
                                    disabled={store.details.getData.id != null ? true : false} isNotNull={true}
                                    changeCallBack={this.updateSaveData} code="code"
                                    defaultValue={store.details.getData.code}></FormItem>
                                <FormItem name="维度" type="select" isNotNull={true} changeCallBack={
                                    (key, value) => {
                                        let dimensionId = value.split('·-·')[0];
                                        let code = value.split('·-·')[1];
                                        // this.updateSaveData('code', code);
                                        this.updateSaveData('dimensionName', code);
                                        this.updateSaveData('dimensionId', dimensionId);
                                    }
                                } code="dimensionName" defaultValue={store.details.getData.dimensionName}
                                    selectData={this.state.dimensionNameList}></FormItem>
                                <FormItem name="数据类型" isNotNull={true}
                                    disabled={this.props.match.params.id ? true : false} type="select"
                                    changeCallBack={this.updateSaveData} code="type"
                                    selectData={this.state.dataTypeList}
                                    defaultValue={store.details.getData.type}></FormItem>
                                <FormItem name="默认值" isNotNull={true} changeCallBack={this.updateSaveData}
                                    type="defaultValue" dataType={store.details.getData.type} code="defaultValue"
                                    defaultValue={store.details.getData.defaultValue}></FormItem>
                                <FormItem name="类别" isNotNull={true} type="select" changeCallBack={
                                    (key, value) => {
                                        let category = value.split('·-·')[0];
                                        let categoryName = value.split('·-·')[1];
                                        // this.updateSaveData('code', code);
                                        this.updateSaveData('category', category);
                                        this.updateSaveData('categoryLabel', categoryName);
                                        this.updateSaveData('categoryName', categoryName);
                                        this.updateSaveData('dataName', categoryName);
                                    }
                                } code="category" defaultValue={store.details.getData.categoryName}
                                    selectData={this.state.batchVarCategoryList}></FormItem>
                                <FormItem name="描述" type="textarea" isNotNull={false}
                                    changeCallBack={this.updateSaveData} code="description"
                                    defaultValue={store.details.getData.description}></FormItem>
                            </Form>
                        </FormBlock>
                    </div>
                    {
                        publicUtils.isAuth("system:eventSource:edit") ?
                            <FormButtonGroup
                                cancelCallBack={() => this.props.history.push('/business/variable/batch')}
                                saveCallBack={() => {
                                    this.verify()
                                }}
                            />

                            : ''
                    }
                </div>
            </Provider>
        )
    }
}

export default Details