/*
 * @Author: zengzijian
 * @Date: 2019-01-16 11:43:24
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:38:48
 * @Description: 
 */
import React from 'react';
import {observer, Provider} from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/event-source/Index';
import WebSocketStore from '@/store/system/event-source/WebSocketStore2';
import PageHeader from '@/components/PageHeader';
import {Table, message, Spin, Modal, Icon} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import {inject} from "mobx-react/index";
import {withRouter} from "react-router-dom";
import eventSourceService from '@/api/system/eventSourceService';
import MultiControl from "@/components/common/MultiControl";


let timer = 0;

@withRouter
@inject('GlobalStore')
@observer
class EventSource extends React.Component {
    state = {
        filteredInfo: [],
    };

    constructor(props) {
        super(props);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.changePage = this.changePage.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount() {
        window.clearInterval(timer)
    }

    componentDidMount() {
        store.initParams();
        store.getListForApi();
        store.getSourceStatusTypeList();
        // let ticket = hex_md5(String(Math.random()));
        // sessionStorage.ticket = ticket;
        WebSocketStore.init("syncSources", null);//事件源列表
        /*timer = setInterval(function () {
            store.getListForApi();
        }, 30000)*/
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
    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);

        store.page.setNum(pageNum);
        store.page.setSize(pageSize);
        store.getListForApi();
    }

    handleChange = (pagination, filters) => {
        store.params.setStatus(filters.status);
        store.page.setNum(1);
        store.getListForApi();
        this.setState({
            filteredInfo: filters.status,
        });
    };


    multiDelete() {
        var ids = [];
        for (let i = 0; i < store.resultDataList.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(store.resultDataList[i]);
                    ids.push(row.id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }

        common.loading.show();
        eventSourceService.deleteOneEventSource(ids).then(res => {
            common.loading.hide();
            store.getListForApi();
            store.setSelectedRowKeys([]);
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })
    }

    render() {
        let {filteredInfo} = this.state;
        filteredInfo = filteredInfo || {};
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };

        console.log("filteredInfo", filteredInfo)

        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            }, {
                title: '名称',
                dataIndex: 'eventSourceName',
                key: 'eventSourceName',
            }, {
                title: '标识',
                dataIndex: 'eventSourceType',
                key: 'eventSourceType',
                sorter: (a, b) => {
                    return a.eventSourceType.localeCompare(b.eventSourceType)
                }
            }, {
                title: '输入选择',
                dataIndex: 'dataSourceType',
                key: 'dataSourceType'
            }, {
                title: '输出选择',
                dataIndex: 'dataSinkType',
                key: 'dataSinkType',
            }, {
                title: '维度映射',
                dataIndex: 'dimensionVOS',
                key: 'dimensionVOS',

            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                filters: [{
                    text: '未就绪',
                    value: 0,
                }, {
                    text: '已就绪',
                    value: 1,
                }, {
                    text: '上线中',
                    value: 2,
                }, {
                    text: '下线中',
                    value: 3,
                }, {
                    text: '已发布',
                    value: 4,
                }, {
                    text: '删除失败',
                    value: 5,
                }, {
                    text: '已出错',
                    value: 6,
                }, {
                    text: '发布中',
                    value: 7,
                }, {
                    text: '就绪中',
                    value: 8,
                }],
                filteredValue: filteredInfo,
                /* onFilter: (value, record) => {
                     return console.log("喵喵喵？",value, record);value,record.status.props.status == value;
                 }*/
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 100
            },
        ];
        const menuItems = [
            {
                label: '删除',
                callback: () => this.multiDelete(),
                auth: publicUtils.isAuth("system:eventSource:delete"),
                confirmIcon: <Icon type="close-circle" style={{color: '#f00'}}/>
            },
        ];
        let multiActionComponent = <MultiControl
            style={{float: 'right', margin: '4px 20px 0 0'}}
            items={menuItems}
            selectedKeys={store.getSelectedRowKeys}
            showConfirm={true}
        />;

        return (
            <Provider store={Provider}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入名称或标识查询"
                                     btnStr={publicUtils.isAuth("business:variable:rtq:edit") ? '新建事件源' : ''}
                                     btnCallBack={() => this.props.history.push({pathname: '/system/config2/eventSource/eventSourceDetails'})}>
                            {publicUtils.isAuth("system:eventSource:edit") ?
                                multiActionComponent
                                : ''
                            }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{x: store.table.getDataSource.length > 0 ? 1100 : 'auto'}}
                                   rowSelection={rowSelection} columns={columns}
                                   onChange={this.handleChange}

                                   dataSource={store.table.getDataSource} pagination={false}/>
                        </Spin>
                        <Paging pageNum={store.page.getNum} total={store.page.getTotal}
                                showPageSize={store.page.getSize} changePage={this.changePage}></Paging>
                    </div>

                    <Modal
                        title="维度映射"
                        visible={store.modal.getIsShow}
                        // onOk={() => { store.getDimensionMappingForApi(store.getActiveDimensionId)}}
                        /*onOk={() => {
                            store.modal.setIsShow(false)
                        }}*/
                        footer={null}
                        onCancel={() => {
                            store.modal.setIsShow(false)
                            store.getListForApi();
                            // let ticket = hex_md5(String(Math.random()));
                            // sessionStorage.ticket = ticket;
                            WebSocketStore.init("syncSources", null);//事件源列表
                        }}
                        width="850px"
                    >
                        <Table columns={store.modal.getColumns} dataSource={store.modal.getDataSource}
                               pagination={false} scroll={{x: 1200, y: 300}}/>
                    </Modal>

                </div>
            </Provider>

        )
    }
}

export default EventSource