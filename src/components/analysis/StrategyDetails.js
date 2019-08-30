/*
 * @Author: zengzijian
 * @Date: 2018-10-24 17:24:09
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:07:22
 * @Description: 
 */
import React, { Component } from 'react';
import { Tabs, Table, Divider } from 'antd';

const style = {
    name: { margin: '10px 0 5px 0'},
    value: { color: '#000000', opacity: '0.85' }
}

class StrategyDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        function callback(key) {
            console.log(key);
        }
        const varColumns = [{
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

        const varDataSource = [{
            key: '1',
            name: '交易金额',
            code: "ev_trade_num",
            value: 'A01'
        }, {
            key: '2',
            name: '交易种类',
            code: 'ev_trade_class',
            value: 'A02'
        }];


        const outPutDataSource = [{
            key: '1',
            name: '判断是否活动卡',
            code: "A01",
            nodeName: 'a'
        }, {
            key: '2',
            name: '判断是否新客户',
            code: 'A01',
            nodeName: 'a'
        }];
        return (
            <div>
                <div style={{ color: '#333333', height: '135px' }}>
                    <div style={{ width: '33%', float: 'left' }}>
                        <p style={style.name}>名称：<span style={style.value}>实时触发进度提醒短信</span></p>
                        <p style={style.name}>维度：<span style={style.value}>信用卡用户</span></p>
                        <p style={style.name}>策略类型：<span style={style.value}>灰度策略</span></p>
                    </div>
                    <div style={{ width: '33%', float: 'left' }}>
                        <p style={style.name}>标识：<span style={style.value}>a123</span></p>
                        <p style={style.name}>类别：<span style={style.value}>30ms</span></p>
                        <p style={style.name}>维度值：<span style={style.value}>10001</span></p>
                    </div>
                    <div style={{ width: '33%', float: 'left' }}>
                        <p style={style.name}>事件源：<span style={style.value}>信用卡实时交易事件</span></p>
                        <p style={style.name}>策略模式：<span style={style.value}>流程模式</span></p>
                        <p style={style.name}>时间：<span style={style.value}>2018-10-11 08:30:20</span></p>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Tabs defaultActiveKey="1" onChange={callback} >
                        <Tabs.TabPane tab="输出结果" key="1">

                            {
                                outPutDataSource.map((item, i) =>
                                    <div key={i} style={{ height: '120px' }}>
                                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '10px 0' }}>{item.name}</p>
                                        <div style={{ color: '#000000', fontSize: '14px', margin: '20px 0', height: '30px', lineHeight: '30px' }}>
                                            <p style={{ width: '50%', float: 'left' }}>原因码：{item.code}</p>
                                            <p style={{ width: '50%', float: 'left' }}>叶子结点名称：{item.nodeName}</p>
                                        </div>
                                        <Divider />
                                    </div>
                                )
                            }
                            {/* <Table dataSource={outPutDataSource} columns={outPutColumns} pagination={false} /> */}
                            {/* <p style={{ margin: '15px' }}>共2条数据</p> */}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="事件变量" key="2"><Table dataSource={varDataSource} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共2条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="批次变量" key="3"><Table dataSource={varDataSource} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共2条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="实时查询变量" key="4"><Table dataSource={varDataSource} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共2条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="衍生变量" key="5"><Table dataSource={varDataSource} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共2条数据</p>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
StrategyDetails.propTypes = {

}

StrategyDetails.defaultProps = {

}

export default StrategyDetails