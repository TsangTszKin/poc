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


@withRouter
@inject('store',  'editorStore')
@observer
class Sql extends Component {
    constructor(props) {
        super(props);
        this.checkIsFinish = this.checkIsFinish.bind(this);
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.sql.get_data.data.scriptNodeVO.name)) rs = false;
        if (common.isEmpty(this.props.editorStore.sql.get_data.data.scriptNodeVO.sqlCode)) rs = false;

        return rs
    }

    render() {

        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                <Form>
                    <FormItem name="名称" type="input" isNotNull={true}
                        changeCallBack={(key, value) => {
                            if (!common.isEmpty(value))
                                value = value.substr(0, 30);

                            this.props.editorStore.sql.updateData('title', value);
                            let scriptNodeVO = this.props.editorStore.sql.get_data.data.scriptNodeVO;
                            scriptNodeVO.name = value;
                            this.props.editorStore.sql.updatePropData('scriptNodeVO', scriptNodeVO);

                            if (this.checkIsFinish()) {
                                this.props.editorStore.sql.updateData('status', '1');
                                this.props.editorStore.sendUiData(this.props.editorStore.sql.get_data);
                            } else {
                                this.props.editorStore.sql.updateData('status', '0');
                                this.props.editorStore.sendUiData(this.props.editorStore.sql.get_data);
                            }
                        }}
                        defaultValue={this.props.editorStore.sql.get_data.title}
                    ></FormItem>
                </Form>
            </div>
        )
    }
}

Sql.propTypes = {
}
Sql.defaultProps = {
}

export default Sql

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

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '数据类型',
        dataIndex: 'typeLabel',
        key: 'typeLabel',
    }
];