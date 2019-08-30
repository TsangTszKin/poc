import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message, Input } from 'antd';
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


@withRouter
@inject('store', 'editorStore')
@observer
class Start extends Component {
    constructor(props) {
        super(props);
        this.getInitDataList = this.getInitDataList.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.checkIsFinish = this.checkIsFinish.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            tempVars: [],
            index: 0,
            dataTypeList: [],
        }
    }

    componentDidMount() {
        this.getInitDataList();
        this.getDataTypeList();
    }
    componentWillReceiveProps(nextProps) {

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
            // console.log(array1);
            // console.log(temp2);
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })
            // self.saveData.eventSourceId = array1[0].code;
            // self.saveData.dimensionId = temp2[array1[0].code];
            // if (!common.isEmpty(this.props.match.params.id)) {
            //     this.getRtqVarById(this.props.match.params.id);
            // }
        })
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

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.strategyVO.get_data.name)) rs = false;
        if (common.isEmpty(this.props.editorStore.strategyVO.get_data.code)) rs = false;
        if (common.isEmpty(this.props.editorStore.strategyVO.get_data.category)) rs = false;
        if (common.isEmpty(this.props.editorStore.strategyVO.get_data.eventSourceId)) rs = false;
        if (common.isEmpty(this.props.editorStore.strategyVO.get_data.dimensionId)) rs = false;
        console.log(rs);
        return rs
    }


    render() {
        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                <Form>
                    <FormItem
                        name="名称"
                        type="input" isNotNull={true}
                        changeCallBack={(key, value) => {

                            this.props.editorStore.start.updateData('title', value);

                            this.props.editorStore.strategyVO.updateData('name', value);

                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);
                        }}
                        code="name"
                        defaultValue={this.props.editorStore.strategyVO.get_data.name}
                    ></FormItem>
                    <FormItem
                        name="标识"
                        type="input"
                        isNotNull={true}
                        disabled={this.props.editorStore.strategyVO.get_data.id && this.props.match.params.type != 2}
                        changeCallBack={(key, value) => {
                            value = value.replace(/[^\w_]/g, '');
                            this.props.editorStore.strategyVO.updateData('code', value);
                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);
                        }}
                        code="code"
                        defaultValue={this.props.editorStore.strategyVO.get_data.code}
                        placeHolder="请输入标识"
                    ></FormItem>
                    <FormItem
                        name="事件源"
                        disabled={this.props.editorStore.strategyVO.get_data.id && this.props.match.params.type != 2}
                        type="select"
                        isNotNull={true}
                        changeCallBack={(keys, values) => {
                            for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                if (key === 'eventSourceId') {
                                    this.props.editorStore.strategyVO.updateData('eventSourceId', values[i]);
                                    sessionStorage.tempEventSourceId = values[i];
                                }
                                if (key === 'eventSourceName') {
                                    this.props.editorStore.strategyVO.updateData('eventSourceName', values[i]);
                                }
                            }
                            this.setState({
                                dimensionList: this.state.dimensionListAll[values[0] + '·-·' + values[1]],
                            });

                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);
                        }}
                        code={["eventSourceId", "eventSourceName"]}
                        selectData={this.state.eventSourceList}
                        defaultValue={this.props.editorStore.strategyVO.get_data.eventSourceName}
                    ></FormItem>
                    <FormItem
                        name="维度"
                        disabled={this.props.editorStore.strategyVO.get_data.id && this.props.match.params.type != 2}
                        type="select"
                        isNotNull={true}
                        changeCallBack={(keys, values) => {
                            for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                if (key === 'dimensionId') {
                                    this.props.editorStore.strategyVO.updateData('dimensionId', values[i]);
                                    sessionStorage.tempDimensionId = values[i];
                                }
                                if (key === 'dimensionName') {
                                    this.props.editorStore.strategyVO.updateData('dimensionName', values[i]);
                                }
                            }

                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);

                        }}
                        code={["dimensionId", "dimensionName"]}
                        selectData={this.state.dimensionList}
                        defaultValue={this.props.editorStore.strategyVO.get_data.dimensionName}
                    ></FormItem>
                    <FormItem
                        name="类别"
                        type="select"
                        isNotNull={true}
                        changeCallBack={(keys, values) => {
                            console.log("keys, values", keys, values)
                            for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                if (key === 'category') {
                                    this.props.editorStore.strategyVO.updateData('category', values[i]);
                                }
                                if (key === 'categoryName') {
                                    this.props.editorStore.strategyVO.updateData('categoryName', values[i]);
                                }
                            }

                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);

                        }}
                        code={['category', 'categoryName']}
                        categoryType="strategy"
                        defaultValue={this.props.editorStore.strategyVO.get_data.categoryName}
                    ></FormItem>
                    <FormItem
                        name="描述"
                        type="textarea"
                        isNotNull={false}
                        changeCallBack={(key, value) => {
                            this.props.editorStore.strategyVO.updateData('description', value);
                            if (this.checkIsFinish()) {
                                this.props.editorStore.start.updateData('status', '1');
                            } else {
                                this.props.editorStore.start.updateData('status', '0');
                            }
                            this.props.editorStore.sendUiData(this.props.editorStore.start.get_data);
                        }}
                        code="description"
                        defaultValue={this.props.editorStore.strategyVO.get_data.description}></FormItem>
                </Form>
            </div>
        )
    }
}

Start.propTypes = {
}
Start.defaultProps = {
}

export default Start

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