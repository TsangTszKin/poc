import React, { Component } from 'react';
import { Modal } from 'antd';
import ConditionPanel from '@/components/common/ConditionPanel.jsx';
import { inject, observer } from 'mobx-react'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

@inject('editorStore')
@observer
class ModalControl extends Component {
    constructor(props){
        super(props);
        this.okCallBack = this.okCallBack.bind(this);
        this.cancelCallBack = this.cancelCallBack.bind(this);
    }

    okCallBack () {
        if (publicUtils.verifyConditionTree(this.props.editorStore.conditionVOTemp, true)) {
            this.props.editorStore.control.updateData('status', '1');
            let conditionNodeVO = this.props.editorStore.control.get_data.data.conditionNodeVO;
            conditionNodeVO.conditionVO = common.deepClone(this.props.editorStore.conditionVOTemp);
            this.props.editorStore.control.updatePropData('conditionNodeVO', conditionNodeVO);
            this.props.editorStore.getSqlCodeByCondition(this.props.editorStore.control.get_data.data.conditionNodeVO.conditionVO);
            this.props.editorStore.modal.setControl(false);
            this.props.editorStore.sendUiData(this.props.editorStore.control.get_data);
        } else {
            this.props.editorStore.control.updateData('status', '0');
            return
        }
    }

    cancelCallBack () {
        if (publicUtils.verifyConditionTree(this.props.editorStore.conditionVOTemp, false)) {
            this.props.editorStore.getSqlCodeByCondition(this.props.editorStore.conditionVOTemp);
        }
        this.props.editorStore.modal.setControl(false);
    }

    render() {
        return (
            <Modal
                title={this.props.editorStore.control.get_data.title}
                visible={this.props.editorStore.modal.getControl}
                onOk={this.okCallBack}
                onCancel={this.cancelCallBack}
                destroyOnClose={true}
                width={800}
            >
                <ConditionPanel conditions={this.props.editorStore.conditionVOTemp} />
            </Modal>
        );
    }
}

export default ModalControl;