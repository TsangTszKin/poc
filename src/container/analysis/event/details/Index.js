import React, { Component, Fragment } from 'react'
import store from '@/store/analysis/event/DetailsStore';
import { Provider, observer } from 'mobx-react';
import SelectGroup from "@/components/analysis/SelectGroup";
import SelectGroup2 from "@/components/analysis/SelectGroup2";
import SelectGroup3 from "@/components/analysis/SelectGroup3";
import { Button, Divider, Drawer, Icon, Modal, Spin, Table } from "antd";
import DateTimePicker2 from "@/components/DateTimePicker2";
import publicUtils from "@/utils/publicUtils";
import Paging from "@/components/Paging";
import FlowNumberDetails from "@/components/analysis/FlowNumberDetails";
import DragSortingTable from "@/components/DragSortingTable";
import DecisionPathsDetails from "@/components/analysis/DecisionPathsDetails";
import eventService from "@/api/analysis/eventService";
import { withRouter } from "react-router-dom";

@withRouter
@observer
class Details extends Component {
    state = {
        index: 0
    };

    componentDidMount() {
        store.setIsTest(this.props.match.path === '/business/testing/result');
        store.initParams();
        store.getEventSourceListAndStrategyList();
        store.getEventCols();

    }

    componentWillUnmount() {
        if (!store.isTest) {
            window.document.querySelector("#analysis-event-details #startTime").value = '';
            window.document.querySelector("#analysis-event-details #endTime").value = '';
        }
    }
    onChangeForTree = (treeDataValue, label, extra) => {
        console.log('treeDataValue, label, extra ', treeDataValue, label, extra);
        store.setColsValue(treeDataValue);
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getEventDetailsList();
    }

    dragSortCallBackFunc = (dragIndex, hoverIndex) => {
        store.tableFields.dragSortCallBackFunc(dragIndex, hoverIndex);
        this.setState({
            index: Math.random()
        })
    }

    render() {
        console.log("store.getRuleList", store);
        console.log("store.getRuleList", store);
        let strategyResultOutDetail = [];
        //todo 还未有数据
        const varColumns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            }, {
                title: '输出名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '数据类型',
                dataIndex: 'code',
                key: 'code',
            }, {
                title: '输出值',
                dataIndex: 'value',
                key: 'value',
            }];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <div className="pageContent" id="analysis-event-details">
                        { !store.isTest ? <Fragment>
                            <SelectGroup firstTitle="选择事件源："/>
                            {
                                store.getRuleList.length > 0 ?
                                    <SelectGroup2 firstTitle="选择策略："/> : ''
                            }
                            <SelectGroup3 firstTitle="筛选条件："
                                          style={ { display: 'flow-root', margin: '0 0 24px 0px', float: 'left' } }/>

                            <Divider/>
                            <div style={ { height: '32px', marginBottom: '24px' } }>
                                <DateTimePicker2 style={ { float: 'left' } } placeholder="请选择开始时间" id="startTime"/>
                                <p style={ {
                                    float: 'left',
                                    width: '30px',
                                    textAlign: 'center',
                                    height: '38px',
                                    lineHeight: '38px'
                                } }>~</p>
                                <DateTimePicker2 style={ { float: 'left' } } placeholder="请选择结束时间" id="endTime"/>
                                {
                                    publicUtils.isAuth("analysis:event:details:config") ?
                                        <Button
                                            type="primary"
                                            style={ {
                                                width: "90px",
                                                height: "40px",
                                                float: 'right',
                                                marginBottom: '15px'
                                            } }
                                            onClick={ () => store.modal.tableFields.setIsShow(true) }
                                        >列表配置</Button>
                                        :
                                        ''
                                }
                            </div>
                        </Fragment> : ''
                        }

                        <Spin size="large" spinning={store.getIsLoading}>
                            <Table
                                id="analysis-details"
                                dataSource={store.getDataSource}
                                columns={store.getColumns}
                                onChangeForTree={() => {
                                }}
                                pagination={false}
                                scroll={{x: 1500}}
                                /* onRow={(record) => {
                                     return {
                                         onClick: () => { store.getEventDetails(store.data[record.key]); },       // 点击行
                                         onMouseEnter: () => { },  // 鼠标移入行
                                     };
                                 }}*/
                            />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal}
                                showPageSize={store.getPageSize} changePage={this.changePage}></Paging>

                        <Drawer
                            title="流水号查看明细"
                            placement="right"
                            closable={false}
                            onClose={() => {
                                store.setShowDrawer(false)
                            }}
                            visible={store.getShowDrawer}
                            width={1000}
                            closable
                            destroyOnClose={true}
                        >
                            <FlowNumberDetails/>
                            <Drawer
                                title={store.getShowDrawer2Name}
                                width={800}
                                closable={false}
                                onClose={() => {
                                    store.setShowDrawer2(false)
                                }}
                                visible={store.getShowDrawer2}
                            >
                                <Table dataSource={strategyResultOutDetail} columns={varColumns} pagination={false}/>
                                {/*<p style={{margin: '15px'}}>共{strategyResultOut.length}条数据</p>*/}
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
                                </div>
                            </Drawer>
                        </Drawer>
                    </div>

                    <Modal
                        title="报文字段（可以通过拖动排序）"
                        visible={store.modal.tableFields.getIsShow}
                        onOk={() => {
                            if (store.tableFields.verify()) {
                                store.modal.tableFields.setIsShow(false);
                                // console.log(store.tableFields.getData);
                                store.saveConfigListForApi();
                            }
                        }}
                        onCancel={() => {
                            store.modal.tableFields.setIsShow(false)
                        }}
                        width={700}
                        destroyOnClose={true}
                    >
                        <DragSortingTable
                            dataSource={store.tableFields.getDataSource}
                            columns={store.tableFields.getColumns}
                            callBackFunc={this.dragSortCallBackFunc}
                        />
                        <Button type="dashed" block style={{marginTop: '10px'}}
                                onClick={() => store.tableFields.addTempVar()}><Icon type="plus"
                                                                                                theme="outlined"/>添加报文字段</Button>
                    </Modal>

                    <Modal
                        title={store.getShowDrawer2Name}
                        /* visible={store.decisionPaths.getData.processon == undefined ?
                             ""
                             : store.modal.decisionPaths.getIsShow}*/
                        visible={store.modal.decisionPaths.getIsShow}
                        onCancel={() => {
                            store.modal.decisionPaths.setIsShow(false)
                        }}
                        bodyStyle={store.decisionPaths.getData.processon == undefined ?
                            {} : {padding: '0'}}
                        width={'700px'}
                        destroyOnClose={true}
                        footer={
                            <Button onClick={() => {
                                store.modal.decisionPaths.setIsShow(false)
                            }}>取消</Button>
                        }
                    >
                        <DecisionPathsDetails myData={store.decisionPaths.getData}/>
                    </Modal>

                </div>
            </Provider>
        )
    }
}

export default Details