import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react'
import common from '@/utils/common';
import Code from '@/components/Code';

@inject('editorStore')
@observer
class ModalSql extends Component {

    constructor(props) {
        super(props);
        this.okCallBack = this.okCallBack.bind(this);
        this.changeCode = this.changeCode.bind(this);
    }

    okCallBack() {
        if (common.isEmpty(this.props.editorStore.sql.get_data.data.scriptNodeVO.name) || common.isEmpty(this.props.editorStore.sql.get_data.data.scriptNodeVO.sqlCode)) {
            this.props.editorStore.sql.updateData('status', '0');
            this.props.editorStore.sendUiData(this.props.editorStore.sql.get_data);
        } else {
            this.props.editorStore.sql.updateData('status', '1');
            this.props.editorStore.sendUiData(this.props.editorStore.sql.get_data);
        }
        this.props.editorStore.modal.setSql(false);
    }

    changeCode(value) {
        let scriptNodeVO = this.props.editorStore.sql.get_data.data.scriptNodeVO;
        scriptNodeVO.sqlCode = value;
        this.props.editorStore.sql.updatePropData('scriptNodeVO', scriptNodeVO);
    }

    render() {
        return (
            <Modal
                title={this.props.editorStore.sql.get_data.title}
                visible={this.props.editorStore.modal.getSql}
                onOk={() => { }}
                onCancel={() => this.props.editorStore.modal.setSql(false)}
                destroyOnClose={true}
                width={700}
                footer={<Button type="primary" onClick={this.okCallBack}>确定</Button>}
            >
                <Code
                    changeCode={this.changeCode}
                    sqlCode={this.props.editorStore.sql.get_data.data.scriptNodeVO.sqlCode}
                    type={2}
                />
            </Modal>
        );
    }
}
export default ModalSql;