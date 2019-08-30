import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import { message, Spin, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import Code from '@/components/Code';
import FormBlock from '@/components/FormBlock'
import Form from '@/components/Form';
import FormButtonGroupCommon from '@/components/FormButtonGroupCommon';
import FormCell from '@/components/FormCell';
import FixedValue from '@/components/condition-tree/FixedValue';

@withRouter
@inject('store')
@observer
class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.saveRtq_info_2_0_forApi = this.saveRtq_info_2_0_forApi.bind(this);
    }

    componentDidMount() {
        this.props.store.setIsLoading(false);
        this.props.store.init();
    }

    componentWillUnmount() {
    }


    saveRtq_info_2_0_forApi(params) {
        common.loading.show();
        variableService.saveRtq_info_2_0(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success('保存成功');
            this.props.store.init();
            if (common.isEmpty(this.props.match.params.id)) {
                this.props.history.push(`/business/variable/real-time-query/save2.0/1/${this.props.store.baseInfo.getData.rtqVarType}/${res.data.result.id}`)
            }else if(this.props.match.params.type === '2'){
                this.props.history.push(`/business/variable/real-time-query/save2.0/1/${this.props.store.baseInfo.getData.rtqVarType}/${res.data.result.id}`)
                console.log("res.data.result",res.data.result)
                switch (this.props.store.baseInfo.getData.rtqVarType) {
                    case 'RTQQUERY'://实时集合
                        this.props.store.setCurrentStepIndex(1);
                        break;
                    case 'RTQVAR'://实时变量
                        this.props.store.setCurrentStepIndex(1);
                        break;
                    // case 'RTQVAR'://脚本变量
                    //     break;
                    default: break;
                }
            } else {
                switch (this.props.store.baseInfo.getData.rtqVarType) {
                    case 'RTQQUERY'://实时集合
                        this.props.store.setCurrentStepIndex(1);
                        break;
                    case 'RTQVAR'://实时变量
                        this.props.store.setCurrentStepIndex(1);
                        break;
                    // case 'RTQVAR'://脚本变量
                    //     break;
                    default: break;
                }
            }

        }).catch(() => common.loading.hide())
    }

    render() {
        const { isResource } = this.props;
        return (
            <Spin spinning={this.props.store.getIsLoading} size="large">
                <FormBlock header="基本信息">
                    <Form>
                        <FormCell name="名称" isNotNull={true}>
                            <Input disabled={ isResource } style={style.formCell} placeholder="请输入" value={this.props.store.baseInfo.getData.name} onChange={(e) => this.props.store.baseInfo.updateData('name', common.stripscript(e.target.value).substr(0, 30))} />
                        </FormCell>
                        <FormCell name="标识" isNotNull={true}>
                            <Input style={style.formCell} placeholder="请输入" value={this.props.store.baseInfo.getData.code} onChange={(e) => this.props.store.baseInfo.updateData('code', common.stripscript(e.target.value).substr(0, 30))} disabled={ this.props.match.params.type =='2' ? false : this.props.match.params.id || isResource } />
                        </FormCell>
                        <FormCell name="事件源" isNotNull={true}>
                            <Select style={style.formCell} value={this.props.store.baseInfo.getData.eventSourceName} onChange={(value, option) => {
                                this.props.store.baseInfo.updateData('eventSourceId', option.props.eventSourceId);
                                this.props.store.baseInfo.updateData('eventSourceName', option.props.eventSourceName);
                                this.props.store.baseInfo.updateData('dimensionId', '');
                                this.props.store.baseInfo.updateData('dimensionName', '');
                                this.props.store.helper.updateData('dimensionList', option.props.dimensionVOS);
                            }} disabled={ this.props.match.params.id || isResource } placeholder="请选择">
                                {
                                    this.props.eventSourceList.map((item, i) =>
                                        <Select.Option key={i} value={item.eventSourceId} eventSourceId={item.eventSourceId} eventSourceName={item.eventSourceName} dimensionVOS={item.dimensionVOS} >{item.eventSourceName}</Select.Option>
                                    )
                                }
                            </Select>
                        </FormCell>
                        <FormCell name="维度" isNotNull={true}>
                            <Select style={style.formCell} value={this.props.store.baseInfo.getData.dimensionName} onChange={(value, option) => {
                                this.props.store.baseInfo.updateData('dimensionId', option.props.rtdDimensionId);
                                this.props.store.baseInfo.updateData('dimensionName', option.props.name);
                            }} disabled={ this.props.match.params.id || isResource } placeholder="请选择">
                                {
                                    this.props.dimensionList.map((item, i) =>
                                        <Select.Option key={i} value={item.rtdDimensionId} rtdDimensionId={item.rtdDimensionId} name={item.name} >{item.name}</Select.Option>
                                    )
                                }
                            </Select>
                        </FormCell>
                        {
                            this.props.store.baseInfo.getData.rtqVarType !== 'RTQQUERY' ?
                                <FormCell name="数据类型" isNotNull={true}>
                                    <Select style={style.formCell} value={this.props.store.baseInfo.getData.dataType} onChange={(value, option) => {
                                        this.props.store.baseInfo.updateData('dataType', option.props.val);
                                        this.props.store.baseInfo.updateData('dataTypeName', option.props.label);
                                        this.props.store.baseInfo.updateData('defaultValue', '');
                                    }} disabled={ this.props.match.params.id || isResource } placeholder="请选择">
                                        {
                                            this.props.dataTypeList.map((item, i) =>
                                                <Select.Option key={i} value={item.val} val={item.val} label={item.label} >{item.label}</Select.Option>
                                            )
                                        }
                                    </Select>
                                </FormCell>
                                : ''
                        }
                        {
                            this.props.store.baseInfo.getData.rtqVarType !== 'RTQQUERY' ?
                                <FormCell name="默认值" isNotNull={true}>
                                    <FixedValue
                                        disabled={ isResource }
                                        style={{ width: '100%', marginTop: '10px' }}
                                        type="defaultValue" value={this.props.store.baseInfo.getData.defaultValue}
                                        changeData={(key, value) => {
                                            this.props.store.baseInfo.updateData('defaultValue', value);
                                        }}
                                        dataType={this.props.store.baseInfo.getData.dataType} />
                                </FormCell>
                                : ''
                        }
                        <FormCell name="类型" isNotNull={true}>
                            <Select style={style.formCell} value={this.props.store.baseInfo.getData.rtqVarType} onChange={() => {
                            }} disabled={true} placeholder="请选择">
                                {
                                    this.props.rtqVarTypeList.map((item, i) =>
                                        <Select.Option key={i} value={item.val} val={item.val} label={item.label} >{item.label}</Select.Option>
                                    )
                                }
                            </Select>
                        </FormCell>
                        <FormCell name="类别" isNotNull={true}>
                            <Select style={style.formCell} value={this.props.store.baseInfo.getData.categoryName} onChange={(value, option) => {
                                this.props.store.baseInfo.updateData('category', option.props.dataValue);
                                this.props.store.baseInfo.updateData('categoryName', option.props.dataName);
                            }} disabled={ isResource || this.props.match.params.id } placeholder="请选择">
                                {
                                    this.props.categoryList.map((item, i) =>
                                        <Select.Option key={i} value={item.id} dataValue={item.dataValue} dataName={item.dataName} >{item.dataName}</Select.Option>
                                    )
                                }
                            </Select>
                        </FormCell>
                        <FormCell name="描述" isNotNull={false} textArea={true}>
                            <Input.TextArea disabled={ isResource }  autosize={{ minRows: 3, maxRows: 6 }} style={style.formCell} placeholder="请简单描述" value={this.props.store.baseInfo.getData.description} onChange={(e) => this.props.store.baseInfo.updateData('description', e.target.value.substr(0, 255))} />
                        </FormCell>
                    </Form>
                </FormBlock>
                {
                    this.props.store.baseInfo.getData.rtqVarType === 'SCRIPTVAR' ?
                        <FormBlock header="SQL">
                            <Code sqlCode={this.props.store.baseInfo.getData.script} type={ isResource ? 1: 2}
                                  changeCode={(value) => {
                                      console.log('value', value)
                                      this.props.store.baseInfo.updateData('script', value)
                                      console.log("this.props.store.baseInfo.getData", this.props.store.baseInfo.getData)
                                  }}
                            />
                        </FormBlock>
                        : ''
                }

                <FormButtonGroupCommon
                    cancelCallBack={() => {
                        this.props.history.push('/business/variable/real-time-query');
                    }}
                    saveCallBack={() => {
                        if (!this.props.store.verifyBaseInfo()) return
                        console.log(this.props.store.baseInfo.getData);
                        if (this.props.store.baseInfo.get_modify) {
                            this.saveRtq_info_2_0_forApi(this.props.store.baseInfo.getData);
                        } else {
                            if (this.props.match.params.rtqVarType !== 'SCRIPTVAR') {
                                this.props.store.setCurrentStepIndex(1);
                            }
                        }
                    }}
                    isShowSaveBtn={ !isResource }
                    saveText={this.props.store.baseInfo.getData.rtqVarType !== 'SCRIPTVAR' ? '保存并进入设计' : '保存'}
                />

            </Spin>
        )
    }
}
Info.propTypes = {
    eventSourceList: PropTypes.array,
    dimensionList: PropTypes.array,
    rtqVarTypeList: PropTypes.array,
    dataTypeList: PropTypes.array,
    categoryList: PropTypes.array
}
Info.defaultProps = {
    eventSourceList: [],
    dimensionList: [],
    rtqVarTypeList: [],
    dataTypeList: [],
    categoryList: [],
    isResource: false,
}
export default Info

const style = {
    formCell: {
        marginTop: '10px',
        width: '100%'
    }
}