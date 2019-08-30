import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import { message, Spin, Steps, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import StepOne from '@/components/business/variable/real-time-query/2.0/StepOne.jsx';
import StepTwo from '@/components/business/variable/real-time-query/2.0/StepTwo.jsx';
import StepThree from '@/components/business/variable/real-time-query/2.0/StepThree.jsx';
import StepFour from '@/components/business/variable/real-time-query/2.0/StepFour.jsx';
import StepFive from '@/components/business/variable/real-time-query/2.0/StepFive.jsx';
import FormButtonGroupShell from '@/components/business/variable/real-time-query/FormButtonGroupShell';

@withRouter
@inject('store')
@observer
class DesignPanel extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.saveRtq_config_2_0_forApi_finish = this.saveRtq_config_2_0_forApi_finish.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
    }

    componentWillUpdate(nextProps) {
        if (this.props.match.params.id != nextProps.match.params.id) {
            if (this.props.store.getCurrentStepIndex !== 0) {
                this.props.store.reset();
                if (!common.isEmpty(nextProps.match.params.id)) {
                    this.props.store.getRtqConfig_2_0_forApi(nextProps.match.params.id);
                }
            }
        }
    }

    init() {
        if (!common.isEmpty(this.props.match.params.id) && !this.props.isResource) {
            this.props.store.getRtqConfig_2_0_forApi(this.props.match.params.id);
        }
    }

    saveRtq_config_2_0_forApi_finish(params) {
        common.loading.show();
        variableService.saveRtq_config_2_0(params, 5).then(res => {
            let self = this;
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.props.store.init();
            this.props.store.baseInfo.updateData('state', 1);
            console.log("this.props.store.baseInfo.getData", this.props.store.baseInfo.getData)
            // message.success("保存成功");
            Modal.confirm({
                title: '保存成功',
                content: '是否返回列表页？',
                okText: "返回列表",
                cancelText: "取消",
                onOk() {
                    self.props.history.push('/business/variable/real-time-query');
                },
                onCancel() {

                }
            });
        }).catch(() => {
            common.loading.hide();
        })
    }

    saveRtq_config_2_0_newVersion_forApi(params, step) {
        common.loading.show();
        variableService.saveRtq_config_2_0_newVersion(params, step).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            if (res.data.result) {
                this.props.history.push(`/business/variable/real-time-query/save2.0/1/${res.data.result.rtqVarType}/${res.data.result.id}`)
                this.props.store.setId(res.data.result.id);
                this.props.store.allVersionForApi(res.data.result.id);
            }
        }).catch(() => {
            common.loading.hide();
        })
    }


    render() {
        const { store } = this.props;
        const { isResource } = this.props;
        const disableEdit = isResource;
        console.log(store.getCurrentStepIndex);
        const saveFunc = () => {
            let currentStepindex = store.getCurrentStepIndex;
            let save = currentStepindex => {
                if (disableEdit) {
                    // if (currentStepindex !== 5) next(currentStepindex);
                    next(currentStepindex);
                    return;
                }
                store.saveRtq_config_2_0_forApi(store.packConfig(), currentStepindex);
            }
            let next = currentStepindex => {
                if (currentStepindex === 5) {
                    store.setCurrentStepIndex(0);
                } else {
                    currentStepindex++;
                    store.setCurrentStepIndex(currentStepindex);
                }
            }
            switch (currentStepindex) {
                case 1:
                    if (store.verifyInputInfo()) {//验证通过
                        if (store.inputInfo.get_modify) {//有修改痕迹
                            save(currentStepindex);
                        } else {//无修改痕迹
                            next(currentStepindex);
                        }
                    }
                    break;
                case 2:
                    if (store.verifyExtInfo()) {//验证通过
                        if (store.extInfo.get_modify) {//有修改痕迹
                            save(currentStepindex);
                        } else {//无修改痕迹
                            next(currentStepindex);
                        }
                    }
                    break;
                case 3:
                    if (store.verifyFilterInfo()) {//验证通过
                        if (store.filterInfo.get_modify) {//有修改痕迹
                            save(currentStepindex);
                        } else {//无修改痕迹
                            next(currentStepindex);
                        }
                    }
                    break;
                case 4:
                    if (store.verifyJuheInfo()) {//验证通过
                        console.log("store.juheInfo.get_origin", store.juheInfo.get_origin)
                        // 现在有分组或者聚合
                        var now_has = !(common.isEmpty(store.juheInfo.getData.aggFields) && common.isEmpty(store.juheInfo.getData.groupFields));
                        // 历史有分组或者聚合
                        var his_has = !(common.isEmpty(store.juheInfo.get_origin.aggFields) && common.isEmpty(store.juheInfo.get_origin.groupFields));
                        if (his_has && now_has && store.juheInfo.get_modify) {//有修改痕迹 进入保存逻辑
                            let origin = {
                                aggFields: common.isEmpty(store.juheInfo.getData.aggFields) ? [] : common.deepClone(store.juheInfo.getData.aggFields),
                                groupFields: common.isEmpty(store.juheInfo.getData.groupFields) ? [] : common.deepClone(store.juheInfo.getData.groupFields)
                            }
                            store.juheInfo.set_origin(origin);
                            //如果有聚合字段或者分组字段，则清空输出字段，清空输出前，先校验是否被引用，引用集合在linkFieldList
                            if (!common.isEmpty(store.juheInfo.getData.groupFields) || !common.isEmpty(store.juheInfo.getData.aggFields)) {
                                let linkFieldList = store.helper.getData.linkFieldList;
                                let outFields = store.outputInfo.getData.outFields;
                                for (let i = 0; i < outFields.length; i++) {
                                    const element = outFields[i];
                                    if (linkFieldList.includes(element.wholeCode)) {
                                        message.warning(`${element.name}该字段已被其他地方引用，请先取消引用`);
                                        return
                                    }
                                }
                            }
                            store.outputInfo.updateData('outFields', [])
                            save(currentStepindex);
                        } else {//无修改痕迹
                            next(currentStepindex);
                        }
                    }
                    break;
                case 5:
                    if (store.verifyOutputInfo()) {//验证通过
                        this.saveRtq_config_2_0_forApi_finish(store.packConfig());
                    }
                    break;
                default:
                    break;
            }
        }
        return (
            <Spin spinning={store.getIsLoading} size="large">
                <div style={style.main} className="rtqvar-design">
                    <Steps current={this.props.currentStepIndex - 1} style={style.step}>
                        {
                            steptData.map((item, i) =>
                                <Steps.Step
                                    key={i}
                                    title={item.title}
                                    description={item.content}
                                    status={(() => {
                                        if (store.baseInfo.getData.state) {
                                            if (i === this.props.currentStepIndex - 1) return ""
                                            else return 'finish'
                                        } else {
                                            return ''
                                        }
                                    })()}
                                    onClick={() => {
                                        if (store.baseInfo.getData.state) {
                                            store.setCurrentStepIndex(i + 1);
                                        } else {
                                            message.warning("请先按顺序保存");
                                        }
                                    }}
                                />
                            )
                        }
                    </Steps>
                    {
                        (() => {
                            switch (store.getCurrentStepIndex) {
                                case 1:
                                    return <StepOne isResource={this.props.isResource} />
                                case 2:
                                    return <StepTwo isResource={this.props.isResource} />
                                case 3:
                                    return <StepThree isResource={this.props.isResource} />
                                case 4:
                                    return <StepFour isResource={this.props.isResource} />
                                case 5:
                                    return <StepFive isResource={this.props.isResource} />
                                default:
                                    break;
                            }
                        })()
                    }

                </div>
                <FormButtonGroupShell >
                    <Button
                        style={style.bottomBtn}
                        onClick={() => store.setCurrentStepIndex(0)}
                    >基本信息</Button>
                    <Button
                        style={style.bottomBtn}
                        onClick={() => this.props.history.push('/business/variable/real-time-query')}
                    >取消</Button>
                    {
                        store.getCurrentStepIndex === 5 && !disableEdit && store.baseInfo.getData.state === 1 ?
                            <Button
                                style={style.bottomBtn}
                                onClick={() => {
                                    if (store.verifyOutputInfo()) {//验证通过
                                        this.saveRtq_config_2_0_newVersion_forApi(store.packConfig(), 5);
                                    }
                                }} >保存新版本</Button>
                            : ''
                    }
                    {
                        //非第0，1步骤显示此按钮
                        store.getCurrentStepIndex !== 0 && store.getCurrentStepIndex !== 1 ?
                            <Button
                                style={style.bottomBtn}
                                onClick={() => {
                                    let currentStepindex = store.getCurrentStepIndex;
                                    currentStepindex--
                                    store.setCurrentStepIndex(currentStepindex)
                                }} >上一步</Button>
                            : ''
                    }
                    <Button
                        type="primary"
                        style={style.bottomBtn}
                        onClick={saveFunc}
                    >
                        {
                            store.getCurrentStepIndex === 5 ? '完成' : '下一步'
                        }
                    </Button>
                </FormButtonGroupShell>

            </Spin>
        )
    }
}
DesignPanel.propTypes = {
    currentStepIndex: PropTypes.number
}
DesignPanel.defaultProps = {
    currentStepIndex: 0,
    isResource: false,
}
export default DesignPanel

const steptData = [
    {
        title: '输入',
        content: '',
    },
    {
        title: '字段衍生',
        content: '',
    },
    {
        title: '过滤条件',
        content: '',
    },
    {
        title: '分组聚合',
        content: '',
    },
    {
        title: '输出',
        content: '',
    }
]

const style = {
    main: {
        padding: '20px'
    },
    step: {
        marginBottom: '40px'
    },
    bottomBtn: {
        marginRight: '24px'
    }
}