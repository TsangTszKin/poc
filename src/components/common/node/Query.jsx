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
class Query extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }



    render() {

        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                <Form>
                    <FormItem
                        name="名称"
                        type="input"
                        isNotNull={true}
                        changeCallBack={(key, value) => {
                            // this.props.editorStore.node.setName(value);  //vo待确定
                            this.props.editorStore.updateUiData(this.props.editorStore.commonUI_data.getId, 'title', value);
                        }}
                        code="name"
                    // defaultValue={this.props.editorStore.baseInfo.getDataSourceName}
                    ></FormItem>
                    <FormItem name="标识" type="input" isNotNull={true} ></FormItem>
                    {
                        this.props.type === 'rtq' ?
                            <FormItem name="变量映射" type="select" isNotNull={true} code="mappingType" selectData={[{ code: 0, value: '实时变量映射' }, { code: 1, value: '临时变量映射' }]}></FormItem>
                            : ''
                    }
                    <FormItem name="表字段" type="select" isNotNull={true} ></FormItem>
                    <FormItem name="分组字段" type="select" isNotNull={true} ></FormItem>
                    <FormItem name="排序字段" type="select" isNotNull={true} ></FormItem>
                    <FieldCell name="SQL" >
                        <Code ref={el => this.code = el} sqlCode={this.props.editorStore.node.getScript} type={1} />
                    </FieldCell>
                </Form>
            </div>
        )
    }
}

Query.propTypes = {
}
Query.defaultProps = {
}

export default Query

const style = {
    root: {
        style: {
            height: '100%', padding: '10px', margin: '0'
        },
        title: {
            style: {
                textAlign: 'center',
                marginBottom: '10px'
            }
        }
    }
}