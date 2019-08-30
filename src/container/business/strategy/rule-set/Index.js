/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-20 14:00:21
 * @Description: 
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule-set/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Select, Spin, message, Button, Icon, Modal, Row, Col, Radio, Input } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar2';
import PageToolBar2 from '@/components/PageToolBar3';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import '@/styles/business/rule-set/index.less'
import UseTimes from '@/components/business/UseTimes';
import variableService from '@/api/business/variableService';
import MultiControl from "@/components/common/MultiControl";

@withRouter
@observer
class RuleSet extends Component {
    constructor(props) {
        super(props);
        this.state = { selectData: [] }
        this.changePage = this.changePage.bind(this);
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
    }
    componentDidMount() {
        this.getEventSourceSelectList();
        store.initParams();
        store.getDataSourceForApi();
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    }
    getEventSourceSelectList() {
        var self = this;
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return
            let dataList = [{ code: '', value: '所有' }];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                let data = {};
                data.value = element.eventSourceName;
                data.code = element.eventSourceId;
                dataList.push(data);
            }
            self.setState({
                selectData: dataList
            });
        });
    }

    multiControl = option => {
        if (common.isEmpty(store.getSelectedRowKeys)) {
            message.warn("请先选择操作项");
            return
        }
        let rowsData = store.getSelectedRowKeys.map(selectedIndex => store.responseData[selectedIndex].id);
        if (rowsData.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        if (option === '删除') {
            this.multiDelete(rowsData);
        }
    };

    multiDelete(ids) {
        common.loading.show();
        strategyService.changeRuleSetStatus(ids, 'delete').then(res => {
            this.setState({
                selectedRowKeys: []
            })
            common.loading.hide();
            store.getDataSourceForApi();
            if (!publicUtils.isOk(res)) return
             // 测试要求删除都统一为“删除成功”
             message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })
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
            title: '更新时间',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime',
            sorter: (a, b) => {
                return String(a.modifiedTime).localeCompare(String(b.modifiedTime))
            }
        }, {
            title: '当前版本',
            dataIndex: 'version',
            key: 'version'
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        },
        {
            title: '匹配模式',
            dataIndex: 'typeStr',
            key: 'typeStr'
        },
        {
            title: '类别',
            dataIndex: 'categoryName',
            key: 'categoryName'
        },
        {
            title: '使用次数',
            dataIndex: 'quoteSum',
            key: 'quoteSum'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 50
        }];
        let addTypeComponent = (
            <Select
                placeholder="新建规则集"
                style={{ width: '114px', float: 'right', margin: '4px 20px 0 0' }}
                value="新建规则集"
                className="primary-select"
            >
                <Select.Option value="1" onClick={() => this.props.history.push('/business/strategy/rule-set/save/1')}>全规则模式</Select.Option>
                <Select.Option value="2" onClick={() => this.props.history.push('/business/strategy/rule-set/save/0')}>优先级模式</Select.Option>
            </Select>
        );
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            { label: '删除', callback: () => this.multiControl('删除'), auth: publicUtils.isAuth("business:strategy:ruleSet:delete"), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} />
                    <div className="pageContent">
                        <PageToolBar selectName="选择事件源" categoryType="category_rule_set" selectData={this.state.selectData} searchPlaceholder="输入名称或标识查询">
                            {publicUtils.isAuth("business:strategy:ruleSet:edit") ?
                                addTypeComponent
                                : ''
                            }
                            <MultiControl
                                style={ { float: 'right', margin: '4px 20px 0 0' } }
                                items={ menuItems }
                                selectedKeys={ store.getSelectedRowKeys }
                                showConfirm={ true }
                            />
                        </PageToolBar>
                        <PageToolBar2 type="ruleSet" selectName="选择事件源" categoryType="category_rule_set" selectData={this.state.selectData} selectName2="选择类别" searchPlaceholder="输入名称或标识查询">
                            {publicUtils.isAuth("business:strategy:ruleSet:edit") ?
                                <div style={{ width: '280px' }}>
                                    {addTypeComponent}
                                    <MultiControl
                                        style={ { float: 'right', margin: '4px 20px 0 0' } }
                                        items={ menuItems }
                                        selectedKeys={ store.getSelectedRowKeys }
                                        showConfirm={ true }
                                    />
                                </div>
                                : ''
                            }
                        </PageToolBar2>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table rowSelection={rowSelection} scroll={{ x: store.getDataSource.length > 0 ? 1100 : 'auto' }} columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                    <UseTimes />

                    <Modal
                        title="版本"
                        visible={store.modal.version.value}
                        onOk={() => {
                            store.modal.version.hide();
                        }}
                        width={850}
                        onCancel={() => {
                            store.modal.version.hide();
                        }}
                        afterClose={store.getDataSourceForApi}
                        footer={[
                            <Button key="back" onClick={() => store.modal.version.hide()}>
                                关闭
                            </Button>
                        ]}
                    >
                        <Table dataSource={store.getVersionList} columns={columns2} pagination={false} />
                    </Modal>

                    <Modal
                        title="创建规则模板"
                        visible={store.modal.shareTemplate.value}
                        onOk={() => {
                            if (this.verifyTemplate()) {
                                store.saveTemplateForApi();
                                store.modal.shareTemplate.hide();
                            }
                        }}
                        width={427}
                        onCancel={() => {
                            store.setTemplateType(1);
                            store.modal.shareTemplate.hide();
                        }}
                    >
                        <Row style={style.templateName}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>名称：</p>
                            </Col>
                            <Col span={18}>
                                <Input maxlength={30} placeholder="请输入名称" value={store.templateVO.getData.name} onChange={(e) => {
                                    store.templateVO.updateData('name', e.target.value)
                                }} />
                            </Col>
                        </Row>
                        <Row style={style.templateDescription}>
                            <Col span={4} >
                                <p style={style.modal_template_p}>描述：</p>
                            </Col>
                            <Col span={18} >
                                <Input.TextArea
                                    maxlength={150}
                                    placeholder="请输入描述"
                                    autosize={{ minRows: 2, maxRows: 6 }} value={store.templateVO.getData.description} onChange={(e) => {
                                        store.templateVO.updateData('description', e.target.value)
                                    }}
                                />
                            </Col>
                        </Row>
                        <Radio.Group onChange={(e) => {
                            store.templateVO.updateData('authorizationType', e.target.value)
                        }} value={store.templateVO.getData.authorizationType} style={style.radio}>
                            <Radio value={0}>保存为私有模板</Radio>
                            <Radio value={1}>保存为公有模板</Radio>
                        </Radio.Group>
                    </Modal>

                    <Modal
                        title="选择规则集模板"
                        visible={store.modal.useTemplate.value}
                        onOk={() => {
                            if (store.getTemplateType === 1) {//自定义
                                this.props.history.push({ pathname: '/business/strategy/rule/save' });
                                store.setTemplateType(1);
                                store.modal.useTemplate.hide();
                            } else {
                                if (common.isEmpty(this.state.templateId)) {
                                    message.warn("请选择模板");
                                    return
                                }
                                this.props.history.push({ pathname: '/business/strategy/rule/save/2/' + this.state.templateId });
                                store.setTemplateType(1);
                                store.modal.useTemplate.hide();
                            }
                        }}
                        width={400}
                        onCancel={() => {
                            store.modal.useTemplate.hide();
                        }}
                    >
                        <Radio.Group onChange={(e) => { store.setTemplateType(e.target.value) }} value={store.getTemplateType}>
                            <Radio value={1} style={style.radio2}>自定义</Radio>
                            <Radio value={2} style={style.radio2}>基于模板创建</Radio>
                            {store.getTemplateType === 2 ?
                                <Select placeholder="请选择模板" defaultValue={this.state.templateId} style={{ width: '250px', marginTop: '10px' }} onChange={(value) => {
                                    this.setState({
                                        templateId: value
                                    })
                                }}>
                                    {
                                        store.getTemplateList.map((item, i) =>
                                            <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                        )
                                    }
                                </Select>
                                : null}
                        </Radio.Group>
                    </Modal>

                </div>
            </Provider >
        )
    }
}

export default RuleSet


const columns2 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '当前版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '更新时间',
        dataIndex: 'modifiedTime',
        key: 'modifiedTime',
    },
    {
        title: '操作人',
        dataIndex: 'createdUserName',
        key: 'createdUserName',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
];

const style = {
    modal_template_p: {
        width: '100%',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'left'
    },
    templateName: {
        marginBottom: '15px'
    },
    templateDescription: {
        marginBottom: '30px'
    },
    radio: {
        // marginTop: '30px'
    },
    radio2: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    }
}