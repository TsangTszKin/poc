import React from 'react';
import {observer, Provider} from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import {Table, message, Radio, Spin, Select, Modal, Icon, Button} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import dimensionService from '@/api/system/config2/dimensionService';
import {inject} from "mobx-react/index";
import {withRouter} from "react-router-dom";
import store from '@/store/system/config2/tableStructure/Index';
import tablesService from '@/api/system/config2/tablesService';
import MultiControl from "@/components/common/MultiControl";

const {confirm} = Modal;


@withRouter
@inject('GlobalStore')
@observer
class EventSource extends React.Component {
    constructor(props) {
        super(props);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.changePage = this.changePage.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.getDimensionList = this.getDimensionList.bind(this);
        this.state = {
            selectData: [],
            toRedis: false
        }
    }

    componentDidMount() {
        this.getDimensionList();
        store.initParams();
        store.getListForApi();
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        store.page.setNum(1);
        store.params.setQuery(keyword);
        store.params.setDimensionId(selectValue);
        store.getListForApi();
    }
    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);

        store.page.setNum(pageNum);
        store.page.setSize(pageSize);
        store.getListForApi();
    }

       getDimensionList() {
           var self = this;
           dimensionService.getDimensionNameList().then(res => {
               if (!publicUtils.isOk(res)) return
               let dataList = [{code: '', value: '所有'}];
               for (let i = 0; i < res.data.result.length; i++) {
                   const element = res.data.result[i];
                   let data = {};
                   data.value = element.name;
                   data.code = element.rtdDimensionId;
                   dataList.push(data);
               }
               self.setState({
                   selectData: dataList
               });
           });
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
        tablesService.deleteOneTables(ids).then(res => {
            common.loading.hide();
            store.getListForApi();
            store.setSelectedRowKeys([]);
            if (!publicUtils.isOk(res)) return
            message.success("删除成功")
            store.getListForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }


    showConfirm() {
        let self = this;
        confirm({
            title: '系统提示',
            content: '是否推送到redis?',
            onOk() {
                store.tablesToRedis();
                self.setState({
                    toRedis: true
                });
                setTimeout(()=>{
                    self.setState({
                    toRedis: false
                    });
                }, 60000)//F5刷新页面后state会为空，需要后端限制；
            },
            onCancel() {
            },
        });
    }




    multiOffline() {
        var ids = [];
        var multiOffstatus = [];
        let flag = true;
        for (let i = 0; i < store.resultDataList.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(store.resultDataList[i]);
                    ids.push(row.id);
                    multiOffstatus.push(row.status);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        multiOffstatus.forEach(element => {
            if (element == '1') {
                flag = false;
            }
        })
        if (flag) {
            common.loading.show();
            tablesService.tablesToRTD(ids).then(res => {
                common.loading.hide();
                store.getListForApi();
                store.setSelectedRowKeys([]);
                if (!publicUtils.isOk(res)) return
                message.success("同步成功");
                this.getListForApi();
            }).catch(() => {
                common.loading.hide();
            })
        } else {
            message.warning('勾选的数据中存在已同步的数据，请取消勾选已同步的数据');
        }
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
            // { label: '已同步', callback: () => this.multiOnline() },
            {
                label: '同步',
                callback: () => this.multiOffline(),
                auth: publicUtils.isAuth("system:tableStructure:deploy")
            },
            {
                label: '删除',
                callback: () => this.multiDelete(),
                auth: publicUtils.isAuth("system:tableStructure:delete"),
                confirmIcon: <Icon type="close-circle" style={{color: '#f00'}}/>
            },
        ];
        let multiActionComponent = <MultiControl
            style={{float: 'right', margin: '4px 20px 0 0'}}
            items={menuItems}
            selectedKeys={store.getSelectedRowKeys}
            showConfirm={true}
        />;
        let multiActionComponent2 =
            <div className="add-btn-container" style={{right: '10px', position: 'relative'}}>
                <Button disabled={this.state.toRedis} type="primary" onClick={this.showConfirm}>推送到Redis</Button>
            </div>
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择维度" categoryType="category_batch" selectData={this.state.selectData} changeToolBar={this.changeToolBar} searchPlaceholder="输入名称或标识查询"
                                     btnStr={publicUtils.isAuth("system:tableStructure:edit") ? '新建库表' : ''}
                                     btnCallBack={() => this.props.history.push({pathname: '/system/config2/tableStructure/save'})}>
                            {publicUtils.isAuth("system:tableStructure:edit") ?
                                multiActionComponent2
                                : ''
                            }
                            {publicUtils.isAuth("system:tableStructure:edit") ?
                                multiActionComponent
                                : ''
                            }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{x: store.table.getDataSource.length > 0 ? 1100 : 'auto'}}
                                   columns={store.table.getColumns} dataSource={store.table.getDataSource}
                                   pagination={false} rowSelection={rowSelection}/>
                        </Spin>
                        <Paging pageNum={store.page.getNum} total={store.page.getTotal}
                                showPageSize={store.page.getSize} changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider>

        )
    }
}

export default EventSource