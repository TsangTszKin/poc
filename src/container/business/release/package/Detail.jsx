import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/release/package/Detail';
import PageHeader2 from '@/components/PageHeader2';
import '@/styles/business/variable/real-time-query-edit.less';
import { withRouter } from 'react-router-dom';
import { Row, Col, Spin, Drawer, Table, Modal, Divider, Button } from 'antd';
import PropTypes from 'prop-types';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import '@/styles/business/release/release.less';
import PageHeader from "@/components/business/strategy-package/page-header";
import strategyService from "@/api/business/strategyService";
import common from '@/utils/common';
import Status from "@/components/business/strategy-package/status";
import FormButtonGroupForStrategyPackage from "@/components/FormButtonGroupForStrategyPackage";
import FixedBottomBar from "@/components/common/FixedBottomBar";

// 内部表格配置
const columns2 = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 90 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 225 },
    { title: '标识', dataIndex: 'code', key: 'code' },
    { title: '发布版本', dataIndex: 'version', key: 'version' },
    { title: '更新时间', dataIndex: 'modifiedTime', key: 'modifiedTime' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action'
    }
];

const resourceColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '当前版本', dataIndex: 'version', key: 'version' },
    { title: '更新时间', dataIndex: 'modifiedTime', key: 'modifiedTime' },
];

@withRouter
@observer
class Detail extends Component {
    state = {
        isFixedRight: true,
        expandedRows: [0, 1, 2, 3, 4], // 默认全展开
        expandedRows_2: [0, 1, 2, 3, 4]
    };

    componentDidMount() {
        store.setStrategyPackageId(this.props.match.params.id);
        store.getDataSourceFromApi(() => {
            this.props.history.push('/business/release/package');
        });
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.match.params.id) return;
        if (this.props.match.params.id !== nextProps.match.params.id) {
            store.setStrategyPackageId(nextProps.match.params.id);
            store.getDataSourceFromApi(() => {
                this.props.history.push('/business/release/package');
            });
        }
    }

    componentWillUnmount() {

    }

    handleExpandChange = expandedRows => {
        // console.log(expandedRows);
        this.setState({ expandedRows });
    };

    handleConfirm = () => {
        let selectedVersion = store.selectedRows.pop();
        console.log(selectedVersion);
        if (common.isEmpty(selectedVersion)) {
            Modal.warning({ title: '系统提示', content: '请勾选' });
            return;
        }
        common.loading.show();
        strategyService.updateResource(store.resource.currentId, selectedVersion.id).then(res => {
            common.loading.hide();
            if (publicUtils.isOk(res, true)) {
                this.handleCancel();
                store.getDataSourceFromApi();
            }
        });
    };

    handleCancel = () => {
        store.setSelectedRows([]);
        store.setSelectedRowKeys([]);
        store.resource.reset();
    };

    render() {
        const rowSelection = {
            selectedRowKeys: store.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                // const selectedRowKey = selectedRowKeys.pop();
                store.setSelectedRowKeys([selectedRowKeys.pop()]);
                store.setSelectedRows([selectedRows.pop()]);
            }
        };
        // 规则集内嵌表格显示规则
        // const expandedRuleSetRender = ruleRow => {
        //     console.log(ruleRow);
        //     return (
        //         <Table
        //             className="resource-table"
        //             columns={ columns2 }
        //             dataSource={ ruleRow.ruleRows }
        //             pagination={ false }
        //         />
        //     );
        // };
        const expandedRowRender = (rowData) => {
            let table;
            // if(rowData.type === 4) {
            //     console.log('rowData', rowData);
            //     table = (
            //         <Table
            //             className="resource-table"
            //             columns={ columns2 }
            //             dataSource={ rowData.expandRows }
            //             pagination={ false }
            //             expandedRowRender={ record => expandedRuleSetRender(record) }
            //             // onExpandedRowsChange={ expandedRows => this.handleExpandChange(expandedRows)}
            //         />
            //     );
            // } else {
            //     table = (
            //         <Table
            //             className="resource-table"
            //             columns={ columns2 }
            //             dataSource={ rowData.expandRows }
            //             pagination={ false }
            //         />
            //     );
            // }
            table = (
                <Table
                    className="resource-table"
                    columns={ columns2 }
                    dataSource={ rowData.expandRows }
                    pagination={ false }
                />
            );
            return table;
        };

        return (
            <Provider store={ store }>
                <div className='panel'>
                    <PageHeader
                        meta={ this.props.meta }
                        changePath="/business/release/package/detail/"
                        versions={ store.version.getList }
                        auth={ {
                            test: publicUtils.isAuth("business:strategy:rule:view"),
                            sql: publicUtils.isAuth("business:strategy:rule:view"),
                            version: publicUtils.isAuth("business:strategy:rule:view"),
                        } }>
                        <div className="header-status">
                            <Status statusCode={ store.detail.status }/>
                            <Divider type="vertical"/>
                            <Status statusCode={ store.detail.auditStatus }/>
                        </div>
                    </PageHeader>
                    <div className="pageContent" style={ { marginLeft: '24px', padding: '0 0 64px 0' } }>
                        <div style={ { marginTop: '20px', paddingTop: '16px' } }>
                            <FormBlock header="基本信息">
                                <Row>
                                    <Col span={ 8 }>
                                        <p>名称：{ store.baseInfo.getName }</p>
                                    </Col>
                                    <Col span={ 8 }>
                                        <p>标识：{ store.baseInfo.getCode }</p>
                                    </Col>
                                    <Col span={ 8 }>
                                        <p>事件源：{ store.baseInfo.getEventSourceName }</p>
                                    </Col>
                                </Row>
                            </FormBlock>

                            <FormBlock header="资源">
                                <Spin spinning={ store.getIsLoading } size="large">
                                    <div className="outer-table-wrapper">
                                        <Table
                                            scroll={ { x: false } }
                                            columns={ store.table.columns }
                                            dataSource={ store.table.dataSource }
                                            pagination={ false }
                                            expandedRowKeys={ this.state.expandedRows }
                                            expandedRowRender={ record => expandedRowRender(record) }
                                            onExpandedRowsChange={ expandedRows => this.handleExpandChange(expandedRows) }
                                        />
                                    </div>
                                </Spin>
                            </FormBlock>

                        </div>
                        <Modal
                            title="版本"
                            onOk={ this.handleConfirm }
                            onCancel={ this.handleCancel }
                            visible={ store.resource.isShowResource }
                        >
                            <Table
                                scroll={ { x: 'max-content' } }
                                className="release-version-table"
                                columns={ resourceColumns }
                                dataSource={ store.resource.list }
                                pagination={ false }
                                rowSelection={ rowSelection }
                            />
                        </Modal>
                    </div>
                    <FixedBottomBar>
                        <Button htmlType="button"
                                onClick={ () => this.props.history.push("/business/release/package") }>返回</Button>
                    </FixedBottomBar>
                </div>
            </Provider>
        );
    }
}

Detail.propTypes = {
    collapsed: PropTypes.bool
};
Detail.defaultProps = {
    collapsed: false
};
export default Detail;