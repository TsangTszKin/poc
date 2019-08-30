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
                        <FormItem name="目录名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.props.store.details.getData.name} placeHolder="请输入目录名称" />
                        <FormItem name="目录标识" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="label" defaultValue={this.props.store.details.getData.label} placeHolder="请输入目录标识" />
                        <FormItem name="跳转地址 (URL)" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="url" defaultValue={this.props.store.details.getData.url} placeHolder="请输入跳转地址 (URL)" />
                        <div style={{ height: '83px', width: '300px', padding: '10px' }}>
                            <FormTitle isNotNull={true} name="图标"></FormTitle>
                            <Select showSearch={true} optionFilterProp="search" onChange={(value) => { this.updateSaveData('icon', value); }} value={this.props.store.details.getData.icon} placeHolder="请选择菜单图标" style={{ marginTop: '10px', width: '100%' }}>
                                {selectData.map((item, i) =>
                                    <Select.Option search={`${item.code}${item.value}`} value={item.code}><Icon type={item.code} style={{ marginRight: '10px' }} />{item.value}</Select.Option>
                                )}
                            </Select>
                        </div>
                    </Form>
                </FormBlock>

                <FormBlock header="功能支持">
                    <Form>
                        <Table dataSource={this.props.store.details.table.getDataSource} columns={this.props.store.details.table.getColumns} pagination={false} style={{ width: '100%' }} />

                        {
                            publicUtils.isAuth("system:power:edit") ?
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.props.store.addAction}><Icon type="plus" theme="outlined" />添加</Button>
                                :
                                ''
                        }
                    </Form>
                </FormBlock>
                {
                    publicUtils.isAuth("system:power:edit") ?
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
