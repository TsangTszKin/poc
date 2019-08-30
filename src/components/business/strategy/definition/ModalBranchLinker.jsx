import React, { Component } from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react'
import publicUtils from '@/utils/publicUtils';
import BranchConditionPanel from '@/components/common/BranchConditionPanel.jsx';

@inject('editorStore')
@observer
class ModalBranchLinker extends Component {
    constructor(props){
        super(props);
        this.okCallBack = this.okCallBack.bind(this);
    }

    okCallBack () {
        if (publicUtils.verifyConditionTree(this.props.editorStore.conditionVOTemp, true)) {
            this.props.editorStore.branchLinker.updateData('status', '1');
            this.props.editorStore.branchLinker.updatePropData('conditionVO', this.props.editorStore.conditionVOTemp);
            this.props.editorStore.getSqlCodeByCondition_singleBranch(this.props.editorStore.conditionVOTemp);
            this.props.editorStore.modal.setBranchLinker(false)
        } else {
            return
        }
    }

    render() {
        return (
            <Modal
                title={this.props.editorStore.branchLinker.get_data.text}
                visible={this.props.editorStore.modal.getBranchLinker}
                onOk={this.okCallBack}
                onCancel={() => this.props.editorStore.modal.setBranchLinker(false)}
                destroyOnClose={true}
                width={800}
            >
                <BranchConditionPanel conditions={this.props.editorStore.conditionVOTemp} />
            </Modal>
        );
    }
}
export default ModalBranchLinker;