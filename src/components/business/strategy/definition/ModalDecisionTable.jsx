import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react'
import DecisionTablePanel from '@/components/common/DecisionTablePanel';

@inject('editorStore')
@observer
class ModalDecisionTable extends Component {
    render() {
        return (
            <Modal
                title={this.props.editorStore.decisionTable.get_data.title}
                visible={this.props.editorStore.modal.getDecisionTable}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setDecisionTable(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={() => {
                    this.props.editorStore.modal.setDecisionTable(false);

                }}>确定</Button>}
            >
                <DecisionTablePanel
                    id={this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.decisionTableId}
                    from="strategyFlow" />
            </Modal>
        );
    }
}
export default ModalDecisionTable;