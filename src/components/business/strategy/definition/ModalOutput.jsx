import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import { inject, observer } from 'mobx-react'
import common from '@/utils/common';
import OutPutPanel from '@/components/common/OutPutPanel.jsx';

@inject('editorStore')
@observer
class ModalOutput extends Component {
    constructor(props) {
        super(props);
        this.okCallBack = this.okCallBack.bind(this);
    }

    okCallBack() {
        let tempArray = [];
        this.props.editorStore.output.get_helper.parametersKey.forEach(element => {

            this.props.editorStore.output.get_helper.parametersList.forEach(element2 => {
                if (element2.id === element) {
                    tempArray.push(element2)
                }
            })
        })

        let outPutNodeVO = this.props.editorStore.output.get_data.data.outPutNodeVO;
        outPutNodeVO.parameters = tempArray;
        this.props.editorStore.output.updatePropData('outPutNodeVO', outPutNodeVO);

        if (common.isEmpty(outPutNodeVO.parameters)) {
            message.warn("请选择输出节点参数");
            return
        }
        if (common.isEmpty(outPutNodeVO.name) || common.isEmpty(outPutNodeVO.parameters)) {
            this.props.editorStore.output.updateData('status', '0');
            this.props.editorStore.sendUiData(this.props.editorStore.output.get_data);
        } else {
            this.props.editorStore.output.updateData('status', '1');
            this.props.editorStore.sendUiData(this.props.editorStore.output.get_data);
        }
        this.props.editorStore.modal.setOutput(false);
    }

    render() {
        return (
            <Modal
                title={this.props.editorStore.output.get_data.title}
                visible={this.props.editorStore.modal.getOutput}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setOutput(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={this.okCallBack}>确定</Button>}
            >
                <OutPutPanel />
            </Modal>
        );
    }
}
export default ModalOutput;