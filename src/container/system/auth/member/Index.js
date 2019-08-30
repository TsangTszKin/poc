/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-string-refs */
/*
 * @Author: zengzijian
 * @Date: 2018-12-18 09:06:28
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:35:25
 * @Description: 
 */
import React from 'react';
import { Table, Modal, Form, Spin, message, Input } from 'antd';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/auth/member/Index';
import { observer, Provider } from 'mobx-react';
import PageToolBar from '@/components/PageToolBar';
import FormData from '@/components/system/auth/member/FormData';
import Paging from '@/components/Paging';
import PageHeader from '@/components/PageHeader';
import organizationStore from '@/store/system/auth/organization/Index';

@Form.create()
@observer
class Member extends React.Component {
    constructor(props) {
        super(props);
        this.modalSaveOk = this.modalSaveOk.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.state = {
            tree: []
        }
    }

    componentDidMount() {
        this.props.form.validateFields();
        store.initParams();
        store.getListForApi();


    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.page.setNum(pageNum);
        store.page.setSize(pageSize);
        store.getListForApi();
    }

    modalSaveOk = () => {
        this.refs.FormData.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                let organization = values.organization.split('·-·')[0];
                let orgName = values.organization.split('·-·')[1];
                values.organization = organization;
                values.orgName = orgName;

                let data = store.getData;
                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        const element = values[key];
                        data[key] = element;
                    }
                }
                store.setData(data);
                store.saveForApi();
            } else {
                console.log(err);
                for (const key in err) {
                    if (err.hasOwnProperty(key)) {
                        const element = err[key];
                        message.warn(element.errors[0].message);
                    }
                    break;
                }
                return err;
            }
        })
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        store.page.setNum(1);
        store.params.setKeyword(keyword);
        store.getListForApi();
    }

    render() {

        return (
            <Provider store={store} organizationStore={organizationStore}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入成员姓名" btnStr={publicUtils.isAuth("system:member:edit") ? "新增用户" : ''} btnCallBack={() => { store.setData({}); store.modal.save.setIsShow(true); store.getOrgListForApi(); }}></PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{ x: store.table.getDataSource.length > 0 ? 900 : 'auto' }}
                                dataSource={store.table.getDataSource}
                                columns={store.table.getColumns}
                                pagination={false}
                            />
                        </Spin>

                        <Paging pageNum={store.page.getNum} total={store.page.getTotal} showPageSize={store.page.getSize} changePage={this.changePage}></Paging>
                    </div>



                    {
                        publicUtils.isAuth("system:member:edit") ?
                            <Modal
                                title="保存用户信息"
                                visible={store.modal.save.getIsShow}
                                onOk={this.modalSaveOk}
                                onCancel={() => { store.modal.save.setIsShow(false); }}
                                keyboard
                                destroyOnClose={true}
                            >
                                <FormData ref="FormData" tree={store.orgList.getData} />
                            </Modal>
                            :
                            <Modal
                                title="保存用户信息"
                                visible={store.modal.save.getIsShow}
                                onOk={this.modalSaveOk}
                                onCancel={() => { store.modal.save.setIsShow(false); }}
                                keyboard
                                destroyOnClose={true}
                                footer={null}
                            >
                                <FormData ref="FormData" tree={store.orgList.getData} />
                            </Modal>
                    }

                    <Modal
                        title="重置密码"
                        visible={store.modal.resetPassword.getIsShow}
                        onOk={() => {
                            let value = store.reset.getPassword;
                            if (value.length > 16 || value.length < 6) {
                                message.warn("请输入6到16位的密码");
                            } else {
                                store.resetPasswordForApi()
                            }
                        }}
                        onCancel={() => { store.modal.resetPassword.setIsShow(false); }}
                        keyboard
                        destroyOnClose={true}
                    >
                        <Input.Password value={store.reset.getPassword} onChange={(e) => {
                            let value = e.target.value;
                            store.reset.setPassword(value);
                        }} />
                    </Modal>
                </div>
            </Provider >
        )
    }
}
export default Member