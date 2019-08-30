/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-string-refs */
/*
 * @Author: zengzijian
 * @Date: 2019-01-17 16:24:31
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:37:57
 * @Description: 
 */
import React from 'react';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/config/system-var/Index';
import PageHeader from '@/components/PageHeader';
import { Table, message, Spin, Modal, Form, Drawer, Button, Icon } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import FormData from '@/components/system/config/system-var/FormData';
import FormDataDetail from '@/components/system/config/system-var/FormDataDetail';
import DragSortingTable from "@/components/DragSortingTable.js";
import systemVarService from '@/api/system/config/systemVarService';
import MultiControl from "@/components/common/MultiControl";



@Form.create()
@observer
class SystemVar extends React.Component {
    constructor(props) {
        super(props)
        this.modalSaveOk = this.modalSaveOk.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.drawerSaveOk = this.drawerSaveOk.bind(this);
    }

    componentDidMount() {
        store.initParams();
        store.getListForApi();
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.page.setNum(pageNum);
        store.page.setSize(pageSize);
        store.getListForApi();
        store.setSelectedRowKeys([]);
    }

    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        var query = {
            keyword: keyword,
            dataType: selectValue
        }
        store.page.setNum(1);
        store.params.setQuery(query);
        store.getListForApi();
    }

    modalSaveOk = () => {
        this.refs.FormData.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据",err, values);//这里可以拿到数据
                let data = store.getData;
                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        const element = values[key];
                        data[key] = element;
                    }
                }
                if(!common.isEmpty(values.status)){
                    if(values.status){
                        data.status = 1
                    }else {
                        data.status = 2
                    }
                }else {
                    data.status = 2
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
            this.refs.FormData.resetFields();
        })
    }

    drawerSaveOk = () => {
        this.refs.FormDataDetail.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                let data2 = store.getData2;
                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        const element = values[key];
                        data2[key] = element;
                    }
                }
                data2.status = data2.status ? 1 : 2;
                data2.keyCode = store.keyCode;
                store.setData2(data2);
                store.saveDetailsListDetailsForApi();
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
            this.refs.FormDataDetail.resetFields();
        })
    }

    moveRow = (dragIndex, hoverIndex) => {
        let ids = [];
        const dragRow = store.table2.getDataSource[dragIndex];
        const dataSource = common.deepClone(store.table2.getDataSource);
        dataSource.splice(dragIndex, 1);
        dataSource.splice(hoverIndex, 0, dragRow);
        dataSource.forEach((item, index) => {
            item.index = index + 1;
            ids.push(item.id)
        });
        systemVarService.orderTables(ids).then(res => {
            if (!publicUtils.isOk(res)) return
           });
        store.table2.setDataSource(dataSource);
    };


    render() {
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            { label: '删除', callback: () => store.multiControl('删除'), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        let multiActionComponent = <MultiControl
            style={ { float: 'right', margin: '4px 20px 0 0' } }
            items={ menuItems }
            selectedKeys={ store.getSelectedRowKeys }
            showConfirm={ true }
        />;
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar  selectName="选择类型" categoryType="systemVar" changeToolBar={this.changeToolBar} searchPlaceholder="输入名称或标识查询" btnStr={publicUtils.isAuth("system:config:systemVar:edit") ? '新建系统变量' : ''} btnCallBack={() => { store.setData({}); store.modal.save.setIsShow(true); }}>
                            { multiActionComponent }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{ x: store.table.getDataSource.length > 0 ? 800 : 'auto' }}
                                rowSelection={rowSelection}
                                columns={store.table.getColumns} dataSource={store.table.getDataSource} pagination={false}
                            // onRow={(record) => {
                            //     this.refs.FormDataDetail.resetFields();
                            // }}
                            />
                        </Spin>
                        <Paging pageNum={store.page.getNum} total={store.page.getTotal} showPageSize={store.page.getSize} changePage={this.changePage}></Paging>
                    </div>
                    <Modal
                        title={store.getData.id != null ? "编辑系统变量" : "新建系统变量"}
                        visible={store.modal.save.getIsShow}
                        onOk={this.modalSaveOk}
                        onCancel={() => { store.modal.save.setIsShow(false); }}
                        keyboard
                        destroyOnClose={true}
                        maskClosable={false}
                    >
                        <FormData ref="FormData" />
                    </Modal>
                    <Drawer
                        title="字典明细"
                        placement="right"
                        closable={false}
                        width={500}
                        destroyOnClose={true}
                        onClose={() => { store.modal.drawer1.setIsShow(false) }}
                        visible={store.modal.drawer1.getIsShow}
                    >
                        <DragSortingTable
                            dataSource={store.table2.getDataSource}
                            columns={store.table2.getColumns}
                            callBackFunc={this.moveRow}
                        />
                        {
                            publicUtils.isAuth("system:config:systemVar:edit") ?
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={() => {
                                    store.modal.drawer2.setIsShow(true);
                                    store.setData2({
                                        "dataName": null,
                                        "dataCode": null,
                                        "keyCode": null,
                                        "dataValue": null,
                                        "sort": 0,
                                        "status": 1
                                    });
                                    this.refs.FormDataDetail.resetFields();
                                }}><Icon type="plus" theme="outlined" />添加字典</Button>
                                : ''
                        }


                        <Drawer
                            title="字典保存"
                            width={400}
                            closable={false}
                            onClose={() => { store.modal.drawer2.setIsShow(false) }}
                            visible={store.modal.drawer2.getIsShow}
                            destroyOnClose={true}
                        >
                            <FormDataDetail ref="FormDataDetail" />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    borderTop: '1px solid #e8e8e8',
                                    padding: '10px 16px',
                                    textAlign: 'right',
                                    left: 0,
                                    background: '#fff',
                                    borderRadius: '0 0 4px 4px',
                                }}
                            >
                                <Button
                                    style={{
                                        marginRight: 8,
                                    }}
                                    onClick={() => store.modal.drawer2.setIsShow(false)}
                                >
                                    取消
                                </Button>
                                {
                                    publicUtils.isAuth("system:config:systemVar:edit") ?
                                        <Button onClick={this.drawerSaveOk} type="primary">保存</Button>
                                        : ''
                                }

                            </div>
                        </Drawer>
                    </Drawer>

                </div>
            </Provider>

        )
    }
}
export default SystemVar