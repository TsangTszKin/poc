import React, {Component} from 'react';
import {Provider, observer} from 'mobx-react';
import store from '@/store/business/template/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Switch, Spin, message, Select, Icon } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {Modal} from "antd/lib/index";
import {withRouter} from "react-router-dom";
import {inject} from "mobx-react/index";
import commonService from "../../../api/business/commonService";
import MultiControl from "@/components/common/MultiControl";

@withRouter
@inject('GlobalStore')
@observer
class template extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
    }

    componentDidMount() {
        store.initParams();
        store.getDataSourceForApi();
    }

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
        commonService.deleteTemplate(ids).then(res => {
            common.loading.hide();
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }

    /**
     * 表格排序变化回调
     */
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
        store.setSelectedRowKeys([]);
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        var query = {
            name: keyword,
            code: keyword,
            type: selectValue
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
    }

    showConfirm(type) {
        let title;
        let self = this;
        switch (type) {
            case '3':
                title = "删除";
                break;

            default:
                break;
        }
        Modal.confirm({
            title: '确定批量' + title + '?',
            content: '',
            onOk() {
                console.log('OK');
                switch (type) {
                    case '3':
                        self.multiDelete();
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

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => {
                return a.code.localeCompare(b.code)
            }
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName'
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '共享类型',
            dataIndex: 'authorizationType',
            key: 'authorizationType'
        }, {
            title: '创建人',
            dataIndex: 'createdUserName',
            key: 'createdUserName'
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
            sorter: (a, b) => {
                return String(a.createdTime).localeCompare(String(b.createdTime))
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 80,
        }];
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            { label: '删除', callback: selectedKeys => this.multiDelete(), auth: publicUtils.isAuth("business:variable:template:delete"), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        let multiActionComponent = (
            <MultiControl
                style={ { float: 'right', margin: '4px 20px 0 0' } }
                items={ menuItems }
                selectedKeys={ store.getSelectedRowKeys }
                showConfirm={ true }
            />);
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择类型" categoryType="category_template" changeToolBar={this.changeToolBar}
                                     searchPlaceholder="输入名称或标识查询">
                            {publicUtils.isAuth("business:variable:template:edit") ?
                                multiActionComponent
                                : ''
                            }
                        </PageToolBar>
                        {/*<PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询"></PageToolBar>*/}
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{x: store.getDataSource.length > 0 ? 1100 : 'auto'}}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={store.getDataSource}
                                pagination={false}/>
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize}
                                changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default template