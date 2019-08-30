import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message, Table } from 'antd';
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
import DragSortingTableHaveStore from '@/components/DragSortingTableHaveStore';

@withRouter
@inject('store', 'editorStore')
@observer
class Branch extends Component {
    constructor(props) {
        super(props);
        this.checkIsFinish = this.checkIsFinish.bind(this);
    }

    componentDidMount() {
        // let uiData = JSON.parse(sessionStorage.def_local_1);//本地的数据
        // let node = this.props.editorStore.originData.nodeMap[uiData.elements[this.props.editorStore.commonUI_data.getId].from.id];
        // if (node) {
        //     let dataSource = node.branchNodeVO.dataSource;
        //     dataSource.forEach(element => {
        //         if (element.key === uiData.elements[this.props.editorStore.commonUI_data.getId].to.id) {
        //             this.setState({
        //                 expression: element.expression
        //             })
        //         }
        //     })
        // }

    }
    componentWillReceiveProps(nextProps) {

    }

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.branchNodeVO.getName)) rs = false;
        if (common.isEmpty(this.props.editorStore.branchLinker.get_data.text)) rs = false;
        return rs
    }

    render() {

        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                <Form>
                    <FormItem name="名称" type="input" isNotNull={false}
                        changeCallBack={(key, value) => {
                            this.props.editorStore.branchLinker.updateData('text', value);
                            this.props.editorStore.sendUiData(this.props.editorStore.branchLinker.get_data);
                        }}
                        defaultValue={this.props.editorStore.branchLinker.get_data.text}
                    ></FormItem>
                    <FieldCell name="表达式" >
                        <p>
                            {
                                this.props.editorStore.branchLinker.get_data.data.expression
                            }
                        </p>
                    </FieldCell>
                </Form>
            </div>
        )
    }
}

Branch.propTypes = {
}
Branch.defaultProps = {
}

export default Branch

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