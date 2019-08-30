import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react'
import RulePanel from '@/components/common/RulePanel.jsx';

@inject('editorStore')
@observer
class ModalRule extends Component {
    render() {
        return (
            <Modal
                title={this.props.editorStore.rule.get_data.title}
                visible={this.props.editorStore.modal.getRule}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setRule(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={() => this.props.editorStore.modal.setRule(false)}>确定</Button>}
            >
                <RulePanel ruleId={this.props.editorStore.rule.get_data.data.ruleNodeVO.ruleExeId} />
            </Modal>
        );
    }
}
export default ModalRule;