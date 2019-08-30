import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/release/audit/Strategy'
import PageHeader from '@/components/PageHeader'
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import { Spin, Table, Radio, Modal, Select, Avatar } from 'antd';
import publicUtils from '@/utils/publicUtils';
import MultiControl from "@/components/common/MultiControl";

@observer
class Strategy extends Component {

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
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
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        store.page.setNum(1);
        store.params.setName(keyword);
        store.params.setCode(keyword);
        store.getListForApi();
    }

    showConfirm(type) {
        let title;
        switch (type) {
            case 1:
                title = "通过";
                break;
            case 2:
                title = "拒绝";
                break;
        }
        Modal.confirm({
            title: '确定批量' + title + '?',
            content: '',
            onOk() {
                switch (type) {
                    case 1:
                        store.multiPassForApi();
                        break;
                    case 2:
                        store.multiRejectForApi();
                        break;
                    default:
                        break;
                }
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    handleChangeRadio = value => {
        store.params.setStatus(value);
        store.page.setNum(1);
        store.getListForApi();
    }

    render() {
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            { label: '通过', callback: () => this.showConfirm(1) },
            { label: '拒绝', callback: () => this.showConfirm(2) },
        ];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} />

                    {/*<Select*/}
                    {/*    value="批量操作"*/}
                    {/*    style={{ width: '109px', float: 'right', margin: '4px 20px 0 20px' }}*/}
                    {/*    onChange={(value) => { this.showConfirm(value) }}*/}
                    {/*>*/}
                    {/*    <Select.Option value={1}>通过</Select.Option>*/}
                    {/*    <Select.Option value={2}>拒绝</Select.Option>*/}
                    {/*</Select>*/}
                    <div className="pageContent">
                        <PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入名称或标识查询">
                            <Radio.Group
                                onChange={(e) => { this.handleChangeRadio(e.target.value)}}
                                defaultValue={store.params.getStatus}
                                value={store.params.getStatus}
                                style={{ float: 'right' }}>
                                <Radio.Button value={102}>审核中</Radio.Button>
                                <Radio.Button value={103}>通过</Radio.Button>
                                <Radio.Button value={104}>拒绝</Radio.Button>
                                <Radio.Button value="">全部</Radio.Button>
                            </Radio.Group>
                            {publicUtils.isAuth("business:release:strategy:batch") ?
                                <MultiControl
                                    style={ { width: '109px', float: 'right', margin: '4px 20px 0 20px' } }
                                    items={ menuItems }
                                    selectedKeys={ store.getSelectedRowKeys }
                                />
                                : ''
                            }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{ x: store.table.getDataSource.length > 0 ? 1100 : 'auto' }}
                                rowSelection={rowSelection} columns={store.table.getColumns} dataSource={store.table.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.page.getNum} total={store.page.getTotal} showPageSize={store.page.getSize} changePage={this.changePage}/>
                    </div>

                    <Modal
                        title="审核过程"
                        visible={store.modal.auditProcess.get}
                        onOk={() => store.modal.auditProcess.set(false)}
                        onCancel={() => store.modal.auditProcess.set(false)}
                    >
                        <div style={{ paddingTop: '10px', borderBottom: '1px solid #dcdcdc8a' }}>
                            <div style={{ float: 'left', width: '50px', height: '50px' }}>
                                <Avatar style={{ marginTop: '3px' }} size="large">{store.auditProcess.getInfo.avatar}</Avatar>
                            </div>
                            <div style={{ float: 'left' }}>
                                <p style={{ marginBottom: '0', color: '#000' }}>{store.auditProcess.getInfo.submitUserName}<span style={{ color: 'rgba(0,0,0,.65)' }}>（{store.auditProcess.getInfo.submittedTime}）</span></p>
                                <span>{ store.auditProcess.getInfo.actionTypeName }</span>
                                <p style={{ color: '#E44B4E' }}>{store.auditProcess.getInfo.remark}</p>
                            </div>
                            <div style={{clear: 'both'}}/>
                        </div>

                        {
                            store.auditProcess.getInfo.status != 102 ?

                                <div style={{ paddingTop: '10px', borderBottom: '1px solid #dcdcdc8a' }}>
                                    <div style={{ float: 'left', width: '50px', height: '50px' }}>
                                        <Avatar style={{ marginTop: '3px' }} size="large">{store.auditProcess.getInfo2.avatar}</Avatar>
                                    </div>
                                    <div style={{ float: 'left' }}>
                                        <p style={{ marginBottom: '0', color: '#000' }}>{store.auditProcess.getInfo2.auditUserName}<span style={{ color: 'rgba(0,0,0,.65)' }}>（{store.auditProcess.getInfo2.auditedTime}）</span></p>
                                        {
                                            store.auditProcess.getInfo2.status == 103 ?//通过
                                                <p style={{ color: '#5EC793' }}>通过</p>
                                                ://拒绝
                                                <p style={{ color: '#E44B4E' }}>拒绝</p>
                                        }

                                    </div>
                                    <div style={{ clear: 'both' }}></div>
                                </div>

                                : ''

                        }

                    </Modal>

                </div>
            </Provider>
        )
    }
}

export default Strategy