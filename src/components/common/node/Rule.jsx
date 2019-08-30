import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import Code from '@/components/Code';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import FieldCell from '@/components/common/node/FieldCell';
import CascadeWithTitle from '@/components/CascadeWithTitle';
import commonService from '@/api/business/commonService';
import strategyService from '@/api/business/strategyService';

@withRouter
@inject('store', 'editorStore')
@observer
class Rule extends Component {
    constructor(props) {
        super(props);
        this.checkIsFinish = this.checkIsFinish.bind(this);
        this.getCategoryList = this.getCategoryList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.state = {
            index: 0,
            secondSelectData: [],
            categoryList: []
        }
    }

    componentDidMount() {
        this.getCategoryList();
    }
    componentWillReceiveProps(nextProps) {

    }

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.rule.get_data.data.ruleNodeVO.name)) rs = false;
        if (common.isEmpty(this.props.editorStore.rule.get_data.data.ruleNodeVO.ruleExeId)) rs = false;
        if (common.isEmpty(this.props.editorStore.rule.get_data.data.ruleNodeVO.category)) rs = false;
        if (common.isEmpty(this.props.editorStore.rule.get_data.data.ruleNodeVO.ruleCode)) rs = false;
        return rs
    }

    getCategoryList() {
        commonService.getCategoryListByType("rule").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: Number(element.dataValue),
                        value: element.dataName
                    });
                    if (element.dataValue == this.props.editorStore.rule.get_data.data.ruleNodeVO.category) {
                        this.props.editorStore.getRuleListByC_E_DForApi(element.dataValue);
                    }
                })
                this.setState({
                    categoryList: tempArray
                })
            }
        })
    }

    updateSaveData = (key, value, options, i) => {
        console.log("updateSaveData  =", key, value, i);
        let ruleNodeVO = this.props.editorStore.rule.get_data.data.ruleNodeVO;
        switch (key) {
            case 'category':
                ruleNodeVO.category = value;
                ruleNodeVO.ruleExeId = '';
                ruleNodeVO.ruleCode = '';

                this.props.editorStore.getRuleListByC_E_DForApi(value);
                break;
            case 'ruleCode':
                this.props.editorStore.rule.updateHelper('versionList', options);
                ruleNodeVO.ruleCode = value;
                ruleNodeVO.ruleExeId = '';
                ruleNodeVO.description = '';
                break;
            case 'ruleExeId':
                ruleNodeVO.ruleExeId = value;
                break;
            case 'description':
                ruleNodeVO.description = value;
                break;
            default:
                break;
        }
        
        this.props.editorStore.rule.updatePropData('ruleNodeVO', ruleNodeVO);

        if (this.checkIsFinish()) {
            this.props.editorStore.rule.updateData('status', '1');
            this.props.editorStore.sendUiData(this.props.editorStore.rule.get_data);
        } else {
            this.props.editorStore.rule.updateData('status', '0');
            this.props.editorStore.sendUiData(this.props.editorStore.rule.get_data);
        }

    }


    render() {
        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>

                <Form>
                    <FormItem
                        name="名称"
                        type="input"
                        isNotNull={true}
                        changeCallBack={(key, value) => {
                            if (!common.isEmpty(value))
                                value = value.substr(0, 30);

                            this.props.editorStore.rule.updateData('title', value);
                            let ruleNodeVO = this.props.editorStore.rule.get_data.data.ruleNodeVO;
                            ruleNodeVO.name = value;
                            this.props.editorStore.rule.updatePropData('ruleNodeVO', ruleNodeVO);

                            if (this.checkIsFinish()) {
                                this.props.editorStore.rule.updateData('status', '1');
                                this.props.editorStore.sendUiData(this.props.editorStore.rule.get_data);
                            } else {
                                this.props.editorStore.rule.updateData('status', '0');
                                this.props.editorStore.sendUiData(this.props.editorStore.rule.get_data);
                            }
                        }}
                        code="name"
                        defaultValue={this.props.editorStore.rule.get_data.title}
                    ></FormItem>

                    <FieldCell name="选择需要添加的规则" >
                        <CascadeWithTitle style={{width: '200px'}} isVersions={true} changeCallBack={this.updateSaveData} firstCode="category" secondCode="ruleCode" firstValue={this.props.editorStore.rule.get_data.data.ruleNodeVO.category} secondValue={this.props.editorStore.rule.get_data.data.ruleNodeVO.ruleCode} firstSelectData={this.state.categoryList} secondSelectData={this.props.editorStore.rule.get_helper.ruleList} />
                    </FieldCell>

                    <div className="clearfix">
                        <p style={{ float: 'left', width: 'fit-content', height: '32px', lineHeight: '32px', padding: '0 8px', marginBottom: '5px' }}>版本</p>
                        <Select style={{ float: 'left', width: '150px', marginBottom: '5px' }}
                            value={this.props.editorStore.rule.get_data.data.ruleNodeVO.ruleExeId}
                            onChange={(value, option) => {
                                this.updateSaveData('ruleExeId', value)
                                this.updateSaveData('description', option.props.description)
                            }}>
                            {
                                this.props.editorStore.rule.get_helper.versionList.map((item, i) =>
                                    <Select.Option value={item.id} description={item.description}>{item.version}</Select.Option>
                                )
                            }
                        </Select>
                    </div>


                    <FormItem
                        name="规则描述"
                        type="textarea"
                        isNotNull={false}
                        readonly={true}
                        defaultValue={this.props.editorStore.rule.get_data.data.ruleNodeVO.description}
                    ></FormItem>
                </Form>
            </div>
        )
    }
}

Rule.propTypes = {
}
Rule.defaultProps = {
}

export default Rule

const style = {
    root: {
        style: {
            height: '100%', padding: '0', margin: '0', color: 'rgba(0, 0, 0, 0.847058823529412)', height: '30px', lineHeight: '30px'
        },
        title: {
            style: {
                textAlign: 'left',
                backgroundColor: 'rgba(249, 249, 249, 1)',
                borderColor: 'rgba(233, 233, 233, 1)',
                paddingLeft: '12px'
            }
        }
    }
}