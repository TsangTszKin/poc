/*
 * @Author: zengzijian
 * @Date: 2019-01-29 09:39:41
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-15 16:20:39
 * @Description: 
 */
import React from 'react';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import store from '@/store/system/config/task/Index';
import PageHeader from '@/components/PageHeader';
import { Table, message, Spin, Modal, Form, Select } from 'antd';
import FormButtonGroup from '@/components/system/config/task/FormButtonGroup';

@Form.create()
@observer
class Task extends React.Component {
    constructor(props) {
        super(props)
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
    }

    componentDidMount() {
        store.initParams();
        store.getListForApi();
        // store.getEventSourceSelectListForApi();
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.page.setNum(pageNum);
        store.page.setSize(pageSize);
        store.getListForApi();
    }


    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        store.page.setNum(1);
        store.params.setQuery(keyword);
        store.getListForApi();
    }



    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{height: '100%'}}>
                        <Spin spinning={store.loading.a.get} size="large">
                            <Table
                                columns={store.table.a.getColumns} dataSource={store.table.a.getDataSource} pagination={false}
                            />
                        </Spin>
                        {/* <Paging pageNum={store.page.getNum} total={store.page.getTotal} showPageSize={store.page.getSize} changePage={this.changePage}></Paging> */}
                    </div>

                    <FormButtonGroup syncToRTD={store.syncRTDForApi} syncExtVarToRTD={() => { store.modal.setA(true) }} save={store.saveForApi} />
                    <Modal
                        title="请选择事件源同步"
                        visible={store.modal.getA}
                        onOk={() => {

                            if (common.isEmpty(store.eventSourceId)) {
                                message.warning("请选择事件源");
                                return
                            }

                            store.modal.setA(false);
                            store.syncExtVarToRTDForApi(store.eventSourceId);

                        }}
                        onCancel={() => store.modal.setA(false)}
                    >
                        <Select style={{ width: '100%' }} onChange={(value) => store.eventSourceId = value} defaultValue={store.eventSourceId}>
                            {
                                store.getEventSourceSelectList.map((item, i) =>
                                    <Select.Option key={i} value={item.eventSourceId}>{item.eventSourceName}</Select.Option>
                                )
                            }
                        </Select>
                    </Modal>
                </div>
            </Provider>

        )
    }
}
export default Task