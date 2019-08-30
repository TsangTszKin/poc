/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/9 10:01
 * Description: 测试列表-单个策略包的测试方案列表
 */
import React, { Component } from "react";
import store from "@/store/business/testing/plan-list/Index";
import { Button, message, Spin, Table } from "antd";
import PageHeader from "@/components/PageHeader";
import { observer, Provider } from "mobx-react";
import PageToolBar from "@/components/PageToolBar";
import Paging from "@/components/Paging";
import { withRouter } from "react-router-dom";
import publicUtils from "@/utils/publicUtils";
import common from "@/utils/common";
import TableAction from "@/components/business/testing/plan-list/TableAction";
import Status from "@/components/business/testing/list/Status";
import strategyService from "@/api/business/strategyService";
import MultiControl from "@/components/common/MultiControl";
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
        key: 'name',
        width: 220
    },
    {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: 240
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
class TestPlanList extends Component {
    state = {
        selectedKeys: [],
        selectedRows: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.socket = new webSocketConnection({
            ticket: 'testPlan',
            // socketOpen: () => {},
            socketMessage: this.handleSocketMessage,
            // socketClose: e => {},
            socketError: e => console.log('WebSocket连接发生错误', e),
            timeout: 10000,
        });
        this.testId = this.props.match.params.testId;
        store.reset();
        this.getData();
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
        if (this.socket) this.socket.closeSocket();
    }

    handleSocketMessage = msg => {
        let msgData = JSON.parse(msg.data);
        // msgData.source === 'refreshTestPlanList'
        message.success(msgData.resultMessage);
        this.getData();
    };

    createPlan = () => this.props.history.push(`/business/testing/list/${ this.testId }/plan/save`);

    goBack = () => this.props.history.push('/business/testing/list');

    getData = () => {
        strategyService.getTestPlanAll(this.testId, store.pagination.page, store.pagination.pageSize, store.query).then(res => {
            if (!publicUtils.isOk(res)) return;
            const { pageList } = res.data; // 具体看接口返回数据
            const { resultList } = pageList;
            this.resultList = resultList;
            store.pagination.setTotal(pageList.sum);
            let dataList = resultList.map((data, index) => {
                const { id, name, description, createdTime, status, } = data;
                return {
                    id,
                    index: (store.pagination.page - 1) * store.pagination.pageSize + index + 1,
                    name: common.cutString(name, 10),
                    createdTime: common.formatTime(createdTime),
                    description: description,
                    action: <TableAction dataId={ id } status={ status } deleteOne={ this.deleteOne }
                                         execute={ () => this.executePlan(index) }
                                         edit={ () => this.props.history.push(`/business/testing/list/${ this.testId }/plan/save/${ id }`) }
                                         delete={ () => this.deletePlan(id) }
                    />,
                    status: <Status status={ status }/>,
                };
            });
            store.setDataSource(dataList);
            store.setIsLoading(false);
        });
    };

    deletePlan = id => {
        // TODO
        console.log('删除方案', id);
        common.loading.show();
        strategyService.deleteTestPlanByIdArr([id]).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res, true)) return;
            this.getData();
        });
    };

    executePlan = index => {
        // TODO
        console.log('执行方案', this.resultList[index]);
        strategyService.runTestPlan(this.resultList[index]).then(res => {
            if (!publicUtils.isOk(res, true)) return;
            console.log(res.data.result);
        });
    };

    handleSearch = (_, value) => {
        console.log(value);
        store.setQuery(value);
        this.getData();
    };

    handleChangePage = (page, pageSize) => {
        store.pagination.setPage(page);
        store.pagination.setPageSize(pageSize);
        this.getData();
    };

    multiDelete = () => {
        common.loading.show();
        console.log(this.state.selectedRows);
        const idArr = this.state.selectedRows.map(item => item.id);
        console.log(idArr);
        strategyService.deleteTestPlanByIdArr(idArr).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res, true)) return;
            this.setState({
                selectedRows: [],
                selectedKeys: []
            });
            this.getData();
        });
    };

    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedKeys,
            onChange: (selectedKeys, selectedRows) => {
                this.setState({
                    selectedKeys,
                    selectedRows
                });
            }
        };
        const menu = [
            { label: '删除', callback: () => this.multiDelete() },
        ];
        return (
            <Provider store={ store }>
                <div className="panel">
                    <Button className="go-back-btn" type="default" htmlType="button" onClick={ this.goBack }>返回</Button>
                    <PageHeader meta={ this.props.meta }/>
                    <div className="pageContent">
                        <PageToolBar
                            changeToolBar={ this.handleSearch }
                            searchPlaceholder="输入名称查询"
                            btnStr="新建方案"
                            btnCallBack={ this.createPlan }
                        >
                            <MultiControl style={ style.multiControl } items={ menu }
                                          selectedKeys={ this.state.selectedKeys } showConfirm/>
                        </PageToolBar>
                        <Spin spinning={ store.isLoading } size="large">
                            <Table
                                rowSelection={ rowSelection }
                                dataSource={ store.dataSource }
                                scroll={ { x: store.dataSource > 0 ? 950 : true } }
                                columns={ columns }
                                pagination={ false }/>
                        </Spin>
                        <Paging
                            pageNum={ store.pagination.page }
                            total={ store.pagination.total }
                            showPageSize={ store.pagination.pageSize }
                            changePage={ this.handleChangePage }/>
                    </div>
                </div>
            </Provider>
        );
    }
}

export default TestPlanList;

const style = {
    multiControl: {
        float: 'right',
        margin: '4px 20px 0 0'
    }
};