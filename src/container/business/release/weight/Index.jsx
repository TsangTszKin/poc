import React, { Fragment } from 'react';
import { Table, Row, Col, Spin, Descriptions, InputNumber, Select, Empty } from 'antd';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/business/release/weight/Index';
import { observer, Provider } from 'mobx-react';
import PageHeader from '@/components/PageHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import '@/styles/system/auth/group.less';
import FormHeader from '@/components/FormHeader';
import FormBlock from '@/components/FormBlock';
import FormButtonGroup from '@/components/FormButtonGroup';
import CatalogStatic from '@/components/business/strategy-package/CatalogStatic.jsx';

// @Form.create()
@observer
class Event extends React.Component {
    constructor(props) {
        super(props);
        this.changeData = this.changeData.bind(this);
        this.changeListData = this.changeListData.bind(this);
    }

    componentDidMount() {
        store.getStrategypackageWeightTreeForApi(true);
    }

    changeData(key, value) {
        store.detail.update_data(key, value)
    }
    changeListData(key, value, i) {
        let resources = store.detail.get_data.resources;
        resources[i][key] = value
        store.detail.update_data('resources', resources)
    }

    render() {

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ marginBottom: '50px' }}>
                        <div style={ style.mainContent }>
                            <div style={ style.left }>
                                <FormHeader title="策略权重" ></FormHeader>
                                {
                                    store.loading.get_data.left === 'empty' ?
                                        <Empty image={ Empty.PRESENTED_IMAGE_SIMPLE } description="暂无数据，请先配置策略包" />
                                        :
                                        <CatalogStatic clickCallBack1={store.getBListForApi} clickCallBack2={store.getCListForApi} />
                                }
                            </div>
                            <div style={ style.right }>
                                <Spin spinning={ store.loading.get_data.right === true } size="large">
                                    {
                                        store.loading.get_data.right === 'empty' ?
                                            <Empty image={ Empty.PRESENTED_IMAGE_SIMPLE } description="暂无数据，请先配置策略包" />
                                            :
                                            <Fragment>
                                                <Row >
                                                    <Col span={12}>
                                                        <FormHeader title="策略包" style={{ marginLeft: '24px' }}></FormHeader>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Select size="small" style={{ width: '100px', float: 'right' }} value={store.detail.get_data.id}
                                                                onChange={(value) => store.getStrategypackageWeightDetailForApi(value)}
                                                        >
                                                            {
                                                                store.detail.get_data.versions.map((item, i) => {
                                                                    return <Select.Option key={i} disabled={item.id === store.detail.get_data.id} value={item.id} data={item}>{item.version}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </Col>
                                                </Row>
                                                <FormBlock header="策略包权重">
                                                    <Descriptions>
                                                        <Descriptions.Item label="名称">{store.detail.get_data.name}</Descriptions.Item>
                                                        <Descriptions.Item label="标识">{store.detail.get_data.code}</Descriptions.Item>
                                                        <Descriptions.Item label="权重值">
                                                            {
                                                                publicUtils.isAuth("business:release:strategy:weight:edit") ?
                                                                    <InputNumber placeholder="输入正整数" size="small" min={1} max={100} value={store.detail.get_data.weight} onChange={value => {
                                                                        let eventPercentage = String(value);
                                                                        if (eventPercentage.indexOf('.') >= 0) {
                                                                            value = Number(eventPercentage.split('.')[0]);
                                                                        }
                                                                        if (value <= 0) value = 1
                                                                        this.changeData('weight', value)
                                                                    }} />
                                                                    : store.detail.get_data.weight
                                                            }

                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </FormBlock>

                                                <FormBlock header="策略权重">
                                                    <Table
                                                        dataSource={(() => {
                                                            // 转换
                                                            let dataSource = [];
                                                            store.detail.get_data.resources.forEach((element, i) => {
                                                                dataSource.push({
                                                                    index: i + 1,
                                                                    name: element.name,
                                                                    code: element.code,
                                                                    versionName: element.versionName,
                                                                    typeName: element.typeName,
                                                                    weight: publicUtils.isAuth("business:release:strategy:weight:edit") ? <InputNumber placeholder="输入正整数" size="small" min={1} max={100} value={element.weight} onChange={value => {
                                                                        let eventPercentage = String(value);
                                                                        if (eventPercentage.indexOf('.') >= 0) {
                                                                            value = Number(eventPercentage.split('.')[0]);
                                                                        }
                                                                        if (value <= 0) value = 1
                                                                        this.changeListData('weight', value, i)
                                                                    }} /> : element.weight
                                                                })
                                                            })
                                                            return dataSource
                                                        })()}
                                                        columns={columns}
                                                        style={{ width: '100%', overflowX: 'auto' }}
                                                        pagination={false} />
                                                </FormBlock>
                                            </Fragment>
                                    }
                                </Spin>
                            </div>
                        </div>
                        {/*<Row style={{ height: '100%' }}>*/}

                        {/*    <Col xs={12} sm={12} md={12} lg={7} xl={5} style={{ height: '100%', paddingTop: '7px', overflow: 'auto' }} id="left">*/}


                        {/*    </Col>*/}

                        {/*    <Col xs={12} sm={12} md={12} lg={17} xl={19} style={{ backgroundColor: '#FFF', height: '100%', padding: '24px 0px', overflowY: 'scroll', borderLeft: '1px solid rgb(232, 232, 232)', marginTop: '-20px' }} id="right">*/}
                        {/*        */}

                        {/*    </Col>*/}

                        {/*</Row>*/}

                    </div>

                    {
                        publicUtils.isAuth("business:release:strategy:weight:edit") ?
                            <FormButtonGroup
                                isShowCancelBtn={false}
                                saveCallBack={() => {
                                    if (store.verify()) {
                                        store.savStrategypackageForApi(store.detail.get_data);
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

const columns = [{
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
    title: '版本',
    dataIndex: 'versionName',
    key: 'versionName',
}, {
    title: '策略类型',
    dataIndex: 'typeName',
    key: 'typeName',
}, {
    title: '权重值',
    dataIndex: 'weight',
    key: 'weight',
}];

const style = {
    mainContent: {
        display: 'flex'
    },
    left: {
        width: '265px',
        paddingTop: '7px',
        overflow: 'auto'
    },
    right: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: '24px 0px',
        overflowY: 'scroll',
        borderLeft: '1px solid rgb(232, 232, 232)',
        marginTop: '-20px'
    }
};