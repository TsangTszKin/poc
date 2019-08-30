/*
 * @Author: zengzijian
 * @Date: 2018-10-24 14:42:37
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:06:13
 * @Description: 
 */
import React, {Component} from 'react';
import FlowNumberIcon from '@/assets/flow-number.png';
import {Tabs, Table, Icon} from 'antd';
import StrategyPath from '@/components/analysis/StrategyPath.1';
import common from '@/utils/common';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
class FlowNumberDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("getDrawerData", this.props.store.getDrawerData)
        let drawerData = this.props.store.getDrawerData;
        let strategyResultOut = drawerData.strategyResultOut;
        let eventVarListData = drawerData.eventVarList;
        let batchVarListData = drawerData.batchVarList;
        let extVarListData = drawerData.extVarList;
        let rtqVarListData = drawerData.rtqVarList;
        let ruleResultOutData = [];
        let headerInfo = drawerData.headerInfo;
        const isShowHitList = headerInfo.status === '命中'; // 是否显示命中列表
        let flag = true;
        if (!common.isEmpty(strategyResultOut)) {
            strategyResultOut.forEach(element => {
                element.index = strategyResultOut.indexOf(element) + 1;
                element.key = common.getGuid();
                if (element.type == 5) {
                    flag = false;
                    element.action = <div>
                        {/* <Icon type="file-text" title="查看"
                          onClick={() => {
                              this.props.store.setShowDrawer2Name(element.name),
                                  this.props.store.setShowDrawer2(true),
                                  this.props.store.getStrategyResultOutDetailsList()
                          }}/>*/}
                        <Icon style={{marginLeft: '10px'}} type="cluster" title="决策路径"
                              onClick={() => {
                                  this.props.store.setShowDrawer2Name(element.packageName),
                                  this.props.store.modal.decisionPaths.setIsShow(true),
                                  this.props.store.getStrategyResultOutDetailsList(element)
                              }}/>
                    </div>
                }
            })
        }
        eventVarListData.forEach(element => {
            element.index = eventVarListData.indexOf(element) + 1;
            element.key = common.getGuid();
        })
        batchVarListData.forEach(element => {
            element.index = batchVarListData.indexOf(element) + 1;
            element.key = common.getGuid();
        })
        rtqVarListData.forEach(element => {
            element.index = rtqVarListData.indexOf(element) + 1;
            element.key = common.getGuid();
        })
        extVarListData.forEach(element => {
            element.index = extVarListData.indexOf(element) + 1;
            element.key = common.getGuid();
        })

        drawerData.ruleResultOut.forEach(element => {
            element.results.forEach(element3 => {
                ruleResultOutData.push({
                    key: common.getGuid(),
                    strategyCode: element.strategyName,
                    ruleCode: element.ruleName,
                    resultName: element3.resultName,
                    resultValue: element3.resultValue
                })
            })
        })

        // drawerData.ruleResultOut.forEach(element => {
        //     ruleResultOutData.push({
        //         key: common.getGuid(),
        //         name: element.strategyCode,
        //         code: element.strategyCode,
        //         value: element.outPutValue
        //     })
        // })
        const varColumns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            }, {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '标识',
                dataIndex: 'code',
                key: 'code',
            }, {
                title: '值',
                dataIndex: 'value',
                key: 'value',
            }];

        const varColumns2 = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            }, {
                title: '策略包',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '策略',
                dataIndex: 'code',
                key: 'code',
            }, {
                title: '策略类型',
                dataIndex: 'typeName',
                key: 'typeName',
            }, {
                title: '输出值',
                dataIndex: 'outPutValue',
                key: 'outPutValue',
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 80
            }];
        if(flag){
            varColumns2.splice(varColumns2.length - 1, 1);
        }

        const outPutColumns = [{
            title: '策略名称',
            dataIndex: 'strategyCode',
            key: 'strategyCode',
        }, {
            title: '规则名称',
            dataIndex: 'ruleCode',
            key: 'ruleCode',
        }, {
            title: '输出名称',
            dataIndex: 'resultName',
            key: 'resultName',
        },
            {
                title: '输出值',
                dataIndex: 'resultValue',
                key: 'resultValue',
            }];


        return (
            < div>
                <div style={{height: '32px'}}>
                    <img src={FlowNumberIcon} style={{height: '25px', float: 'left', marginTop: '3px'}}/>
                    <p style={{
                        height: '32px',
                        float: 'left',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: '0px',
                        marginLeft: '15px'
                    }}>事件流水号：{headerInfo.seqNo}</p>
                </div>
                <div style={{color: '#333333', height: '90px'}}>
                    <div style={{width: '30%', float: 'left'}}>
                        <p style={{margin: '10px 0 5px 0'}} className="rtd-ellipsis">事件源名称：<span
                            style={{color: '#000000'}}>{headerInfo.name}</span></p>
                        <p style={{margin: '10px 0'}} className="rtd-ellipsis">事件发生时间：<span
                            style={{color: '#000000'}}>{headerInfo.ddApdate}</span></p>
                    </div>
                    <div style={{width: '21%', float: 'left'}}>
                        <p style={{margin: '10px 0 5px 0'}} className="rtd-ellipsis">事件源标识：<span
                            style={{color: '#000000'}}>{headerInfo.eventCode}</span></p>
                        <p style={{margin: '10px 0'}} className="rtd-ellipsis">决策总耗时：<span
                            style={{color: '#000000'}}>{headerInfo.timeConsuming}</span></p>
                    </div>
                    {
                        // 应该不会有人起个策略名字叫'无'吧
                        headerInfo.bingoRule === '无' ? '':
                            <div style={{width: '20%', float: 'left'}}>
                                <p style={{color: '#000000', margin: '10px 0 5px 0'}}>命中策略</p>
                                <p style={{fontSize: '20px', margin: '5px 0 10px 0'}}
                                   className="rtd-ellipsis">{headerInfo.bingoRule}</p>
                            </div>
                    }
                    {
                        // 应该不会有人起个策略包名字叫'无'吧
                        headerInfo.bingoStrategy === '无' ? '':
                            <div style={{width: '20%', float: 'left'}}>
                                <p style={{color: '#000000', margin: '10px 0 5px 0'}}>命中策略包</p>
                                <p style={{fontSize: '20px', margin: '5px 0 10px 0'}}
                                   className="rtd-ellipsis">{headerInfo.bingoStrategy}</p>
                            </div>
                    }
                    <div style={{width: '9%', float: 'left'}}>
                        <p style={{color: '#000000', margin: '10px 0 5px 0'}}>状态</p>
                        <p style={{fontSize: '20px', margin: '5px 0 10px 0'}}
                           className="rtd-ellipsis">{headerInfo.status}</p>
                    </div>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Tabs
                        defaultActiveKey={!common.isEmpty(this.props.store.drawerData.hitNodeTree) ? '1'
                            : !common.isEmpty(this.props.store.drawerData.ruleResultOut) ? '2'
                                : isShowHitList ? '3': '4'}>
                        {
                            common.isEmpty(this.props.store.drawerData.hitNodeTree) ? '' :
                                <Tabs.TabPane tab="决策路径" key="1">
                                    <StrategyPath/>
                                </Tabs.TabPane>
                        }
                        {
                            common.isEmpty(this.props.store.drawerData.ruleResultOut) ? '' :
                                <Tabs.TabPane tab="输出结果" key="2">
                                    <Table dataSource={ruleResultOutData} columns={outPutColumns} pagination={false}/>
                                    <p style={{margin: '15px'}}>共{ruleResultOutData.length}条数据</p>
                                </Tabs.TabPane>
                        }
                        {
                            isShowHitList ?
                                <Tabs.TabPane tab="命中列表" key="3">
                                    <Table dataSource={strategyResultOut} columns={varColumns2} pagination={false}/>
                                    <p style={{margin: '15px'}}>共{common.isEmpty(strategyResultOut) ? 0 : strategyResultOut.length}条数据</p>
                                </Tabs.TabPane>
                                : ''
                        }

                        <Tabs.TabPane tab="事件变量" key="4">
                            <Table dataSource={eventVarListData} columns={varColumns} pagination={false}/>
                            <p style={{margin: '15px'}}>共{eventVarListData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="批次变量" key="5">
                            <Table dataSource={batchVarListData} columns={varColumns} pagination={false}/>
                            <p style={{margin: '15px'}}>共{batchVarListData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="实时查询变量" key="6">
                            <Table dataSource={rtqVarListData} columns={varColumns} pagination={false}/>
                            <p style={{margin: '15px'}}>共{rtqVarListData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="衍生变量" key="7">
                            <Table dataSource={extVarListData} columns={varColumns} pagination={false}/>
                            <p style={{margin: '15px'}}>共{extVarListData.length}条数据</p>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

FlowNumberDetails.propTypes = {}

FlowNumberDetails.defaultProps = {}

export default FlowNumberDetails