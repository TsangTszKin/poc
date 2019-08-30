import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react'
import RuleSetPanel from '@/components/common/RuleSetPanel.jsx';

@inject('editorStore')
@observer
class ModalRuleSet extends Component {
    render() {
        return (
            <Modal
                title={this.props.editorStore.ruleSet.get_data.title}
                visible={this.props.editorStore.modal.getRuleSet}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setRuleSet(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={() => this.props.editorStore.modal.setRuleSet(false)}>确定</Button>}
            >
                <RuleSetPanel ruleSetId={this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.ruleSetId} />
            </Modal>
        );
    }
}
export default ModalRuleSet;