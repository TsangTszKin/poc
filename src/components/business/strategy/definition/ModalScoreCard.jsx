import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react'
import ScoreCardPanel from '@/components/common/ScoreCardPanel';

@inject('editorStore')
@observer
class ModalScoreCard extends Component {
    render() {
        return (
            <Modal
                title={this.props.editorStore.scoreCard.get_data.title}
                visible={this.props.editorStore.modal.getScoreCard}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setScoreCard(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={() => this.props.editorStore.modal.setScoreCard(false)}>确定</Button>}
            >
                <ScoreCardPanel id={this.props.editorStore.scoreCard.get_data.data.scoreCardNodeVO.scoreCardId}
                    from="strategyFlow" />
            </Modal>
        );
    }
}
export default ModalScoreCard;