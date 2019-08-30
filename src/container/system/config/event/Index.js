/*
 * @Author: zengzijian
 * @Date: 2019-01-18 09:04:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:35:56
 * @Description: 
 */
import React from 'react';
import { Table, Icon, Row, Col, Spin, Button } from 'antd';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/config/event/Index';
import { observer, Provider } from 'mobx-react';
import PageHeader from '@/components/PageHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import '@/styles/system/auth/group.less';
import FormHeader from '@/components/FormHeader';
import FormBlock from '@/components/FormBlock';
import FormButtonGroup from '@/components/FormButtonGroup';
import CatalogStatic from '@/components/system/auth/organization/CatalogStatic';

// @Form.create()
@observer
class Event extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // this.props.form.validateFields();
        store.initParams();
        store.getDimensionsListForApi();
    }


    render() {

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <FormHeader title="选择机构" ></FormHeader>
                        <Row style={{ height: '100%', marginTop: '20px' }}>

                            {/* <Col xs={11} sm={11} md={11} lg={9} xl={7} style={{ padding: '10px 20px', backgroundColor: '#fff', height: '100%', overflowY: 'scroll' }} id="left">


                                <div style={{ height: '33px', lineHeight: '33px' }} className="group-header">
                                    选择机构
                                </div>
                                <Spin spinning={store.loading.a.get} size="large">
                                    <Menu style={{ positive: 'relative', borderRight: 'none' }} defaultSelectedKeys={[0]} defaultSelectedKeys={['0']}>
                                        {
                                            store.data.a.map((item, i) =>
                                                <Menu.Item
                                                    key={`${i}`}
                                                    onClick={() => {
                                                        store.getBListForApi(item.code);
                                                        store.getCListForApi(item.code);
                                                    }}
                                                >
                                                    <span>{item.name}</span>
                                                </Menu.Item>
                                            )
                                        }

                                    </Menu>

                                </Spin>

                            </Col> */}

                            <Col xs={12} sm={12} md={12} lg={7} xl={5} style={{ height: '100%' }} id="left">
                                <CatalogStatic clickCallBack1={store.getBListForApi} clickCallBack2={store.getCListForApi} />
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={17} xl={19} style={{ backgroundColor: '#FFF', height: '100%', padding: '24px 0px', overflowY: 'scroll', borderLeft: '1px solid rgb(232, 232, 232)', marginTop: '-20px' }} id="right">




                                <FormHeader title="事件分析配置" style={{ marginLeft: '24px' }}></FormHeader>
                                <FormBlock header="事件明细列表配置">
                                    <Spin spinning={store.loading.b.get} size="large">
                                        <Table dataSource={store.table.details.getDataSource} columns={store.table.details.getColumns} style={{ width: '100%', overflowX: 'auto' }} pagination={false} />
                                        {
                                            publicUtils.isAuth("system:config:event:edit") ?
                                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={() => { store.addTableRow1(); }}><Icon type="plus" theme="outlined" />添加记录</Button>

                                                : ''
                                        }

                                    </Spin>
                                </FormBlock>

                                <FormBlock header="事件统计维度配置">
                                    <Spin spinning={store.loading.b.get} size="large">
                                        <Table
                                            dataSource={store.table.dimension.getDataSource}
                                            columns={store.table.dimension.getColumns}
                                            style={{ width: '100%', overflowX: 'auto' }}
                                            pagination={false} />

                                        {
                                            publicUtils.isAuth("system:config:event:edit") ?
                                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={() => { store.addTableRow2(); }}><Icon type="plus" theme="outlined" />添加维度配置</Button>

                                                : ''
                                        }

                                    </Spin>
                                </FormBlock>



                            </Col>

                        </Row>

                    </div>

                    {
                        publicUtils.isAuth("system:config:event:edit") ?
                            <FormButtonGroup
                                isShowCancelBtn={false}
                                saveCallBack={() => {
                                    if (store.verify1() && store.verify2()) {
                                        store.saveDetailsListForApi();
                                    }
                                }}
                            />

                            : ''
                    }

                </div>
            </Provider>
        )
    }
}
export default Event