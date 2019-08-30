import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import store from '@/store/business/testing/list/Index';
import PageHeader from '@/components/PageHeader';
import PageToolBar from "@/components/PageToolBar";
import { Icon, message, Spin, Table } from "antd";
import Paging from "@/components/Paging";
import { withRouter } from "react-router-dom";
import publicUtils from "@/utils/publicUtils";
import MultiControl from "@/components/common/MultiControl";
import variableService from "@/api/business/variableService";
import webSocketConnection from "@/utils/websocket";

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '标识',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: '事件源',
        dataIndex: 'eventSourceName',
        key: 'eventSourceName',
    },
    {
        title: '发布版本',
        dataIndex: 'version',
        key: 'version',
        render: text => `V${ text }`
    },
    {
        title: '提交时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 132
    }];

@withRouter
@observer
class TestingList extends Component {
    state = {
        selectedRowKeys: [],
        selectedRows: []
    };

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.ticket = 'testPublish';
    }

    componentDidMount() {
        variableService.getEnumList('resourceStatus').then(res => {
            if (!publicUtils.isOk(res)) return;
            store.setVarTypeList(res.data.result);
            store.getDataSourceForApi();
            this.socket = new webSocketConnection({
                ticket: this.ticket,
                // socketOpen: () => {},
                socketMessage: this.handleSocketMessage,
                // socketClose: e => {},
                socketError: e => console.log('WebSocket连接发生错误', e),
                timeout: 10000,
            });
        });
    }

    componentWillUnmount() {
        if (this.socket) this.socket.closeSocket();
    }

    handleSocketMessage = msg => {
        let msgData = JSON.parse(msg.data);
        message.success(msgData.resultMessage);
        store.getDataSourceForApi();
    };

    changeToolBar = (selectValue, keyword) => {
        store.pagination.setPage(1);
        store.setQuery(keyword);
        store.getDataSourceForApi();
    };

    changePage = (pageNum, pageSize) => {
        store.pagination.setPage(pageNum);
        store.pagination.setPageSize(pageSize);
        store.getDataSourceForApi();
    };

    multiControl = option => {
        // console.log(option, this.state.selectedRows);
        if (option === '删除') {
            let ids = this.state.selectedRows.map(item => item.id);
            store.deleteTest(ids);
        }
        this.setState({ selectedRowKeys: [], selectedRows: [] });
    };

    render() {
        const menuItems = [
            {
                label: '删除',
                callback: () => this.multiControl('删除'),
                confirmIcon: <Icon type="close-circle" style={ { color: '#f00' } }/>
            },
        ];

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
            }
        };
        return (
            <Provider store={ store }>
                <div className='panel'>
                    <PageHeader meta={ this.props.meta }/>
                    <div className="pageContent">
                        <PageToolBar
                            changeToolBar={ this.changeToolBar }
                            searchPlaceholder="输入名称查询"
                            btnCallBack={ () => {
                                store.setIsShowModal(true);
                            } }
                        >
                            <MultiControl
                                style={ { float: 'right', margin: '4px 20px 0 0' } }
                                items={ menuItems }
                                selectedKeys={ this.state.selectedRows }
                                showConfirm={ true }
                            />
                        </PageToolBar>
                        <Spin spinning={ store.getIsLoading } size="large">
                            <Table
                                rowSelection={ rowSelection }
                                dataSource={ store.getDataSource }
                                scroll={ { x: store.getDataSource.length > 0 ? 950 : true } }
                                columns={ columns }
                                pagination={ false }/>
                        </Spin>
                        <Paging
                            pageNum={ store.pagination.page }
                            total={ store.pagination.total }
                            showPageSize={ store.pagination.pageSize }
                            changePage={ this.changePage }/>
                    </div>
                </div>
            </Provider>
        );
    }
}

export default TestingList;