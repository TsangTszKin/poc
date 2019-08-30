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
class Linker extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let controlLinker = this.props.editorStore.controlLinker.get_data;
        console.log("controlLinker", controlLinker)
        // 空text的时候，默认设置一个“命中”或者“非命中”字眼
        if (common.isEmpty(controlLinker.text)) {
            // 是否有兄弟linker
            let broLinker = null;
            let uiData = JSON.parse(sessionStorage.def_local_1);

            for (const key in uiData.elements) {
                if (uiData.elements.hasOwnProperty(key)) {
                    const element = uiData.elements[key];
                    if (element.name === 'linker' && element.from.id === controlLinker.from.id && key !== controlLinker.id) {
                        broLinker = element;
                    }
                }
            }
            console.log("broLinker", broLinker)
            if (broLinker) {
                if (common.isEmpty(broLinker.text)) {
                    this.props.editorStore.controlLinker.updateData('text', '命中');
                }else {
                    this.props.editorStore.controlLinker.updateData('text', '非命中');
                }
            } else {
                this.props.editorStore.controlLinker.updateData('text', '命中');
            }
            this.props.editorStore.sendUiData(this.props.editorStore.controlLinker.get_data);
        }
    }
    componentWillReceiveProps(nextProps) {

    }



    render() {

        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                {/* <FieldCell name="节点名称" /> */}
                <Form>
                    <FormItem
                        name="是否命中"
                        type="switch"
                        isNotNull={true}
                        changeCallBack={(key, value) => {
                            value = value ? '命中' : '非命中';
                            this.props.editorStore.controlLinker.updateData('text', value);
                            this.props.editorStore.sendUiData(this.props.editorStore.controlLinker.get_data);
                        }}
                        code="name"
                        defaultValue={this.props.editorStore.controlLinker.get_data.text === '命中' ? true : false}
                    ></FormItem>

                </Form>
            </div>
        )
    }
}

Linker.propTypes = {
}
Linker.defaultProps = {
}

export default Linker

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