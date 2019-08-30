import React from 'react';
import { observer, inject } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormItem from '@/components/FormItem';
import FormBlock from '@/components/FormBlock';
import Form from '@/components/Form';
import { Table, Input, Select, Button, Icon } from 'antd';
import iconConfig from '@/config/iconConfig';
import FormTitle from '@/components/FormTitle';

@inject('store')
@observer
class Info extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.store.getEventSourceSelectListForApi();
    }

    updateSaveData = (key, value) => {
        console.log("updateSaveData", key, value);
        let data = this.props.store.details.getData;
        if (key === 'name')
            value = common.stripscript(value);
        data[key] = value;
        this.props.store.details.setData(data);
    }

    tableDataChange = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
    }



    render() {
        let selectData = [];
        iconConfig.forEach(element => {
            selectData.push({ code: element, value: element })
        })
        return (
            <div>
                <FormBlock header="基本信息">
                    <Form>
                        <FormItem name="机构名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.props.store.details.getData.name} placeHolder="请输入目录名称" />
                        <FormItem name="机构标识" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.props.store.details.getData.code} placeHolder="请输入目录标识" disabled={common.isEmpty(this.props.store.details.getData.id)?false:true} />
                        <div style={{ width: '300px', padding: '10px' }}>
                            <FormTitle isNotNull={false} name="授权事件源"></FormTitle>
                            <Select onChange={(value) => { this.updateSaveData('eventsourceIdList', value); }} value={this.props.store.details.getData.eventsourceIdList} style={{ marginTop: '10px', minWidth: '280px' }} mode="multiple">
                                {this.props.store.getEventSourceSelectList.map((item, i) =>
                                    <Select.Option value={item.id}>{item.eventSourceName}</Select.Option>
                                )}
                            </Select>
                        </div>
                    </Form>
                    <Form>
                        <FormItem name="备注" type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="remark" defaultValue={this.props.store.details.getData.remark} placeHolder="请输入跳转地址 (URL)" />
                    </Form>
                </FormBlock>

                {
                    publicUtils.isAuth("system:organization:edit") ?
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={this.props.store.saveDetailsForApi} style={{ marginRight: '30px' }}>保存</Button>
                        </div>
                        :
                        ''
                }

            </div>
        )
    }
}
export default Info
