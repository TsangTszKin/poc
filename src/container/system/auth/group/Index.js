/* eslint-disable react/no-string-refs */
/*
 * @Author: zengzijian
 * @Date: 2018-12-18 09:17:06
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:34:46
 * @Description: 
 */
import React from 'react';
import { Table, Radio, Icon, Modal, Dropdown, Row, Col, Spin, Popover, Menu, Drawer, message, Button } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/auth/group/Index';
import { observer, Provider } from 'mobx-react';
import PageToolBar from '@/components/PageToolBar';
import FormData from '@/components/system/auth/group/FormData';
import PageHeader from '@/components/PageHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import PermissionAssignment from '@/components/system/auth/group/PermissionAssignment';
import GroupMemberAdmin from '@/components/system/auth/group/GroupMemberAdmin';
import '@/styles/system/auth/group.less';

// @Form.create()
@observer
class Member extends React.Component {
    constructor(props) {
        super(props);
        this.modalGroupSaveOk = this.modalGroupSaveOk.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
    }

    componentDidMount() {
        // this.props.form.validateFields();
        store.initParams();
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    }

    modalGroupSaveOk = () => {
        this.refs.FormData.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
            } else {
                console.log(err);
                return err;
            }
        })
    }

    onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
    }

    onPageChange(pageNumber) {
        console.log('Page: ', pageNumber);
    }

    /**
    * 工具栏参数发生变化回调
    */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        store.page.setNum(1);
        store.params.setKeyword(keyword);
        store.getUserListByTeamIdForApi(store.activeGroup.getId, 1);
    }


    render() {

        console.log("store.getIsLoading", store.getIsLoading)

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ backgroundColor: '#F0F2F5', padding: '0px', height: '100%' }} id="group">
                        <Row style={{ height: '100%' }}>

                            <Col xs={11} sm={11} md={11} lg={9} xl={7} style={{ padding: '10px 20px', backgroundColor: '#fff', height: '100%', overflowY: 'scroll' }} id="left">


                                <div style={{ height: '33px', lineHeight: '33px' }} className="group-header">
                                    分组列表
                                    {
                                        publicUtils.isAuth("system:group:edit") ?
                                            <Popover
                                                content={
                                                    <FormData ref="FormData" />
                                                }
                                                title="新增分组"
                                                trigger="click"
                                                visible={store.modal.groupAdd.getIsShow}
                                                onVisibleChange={(value) => {
                                                    store.modal.groupAdd.setIsShow(value);
                                                    store.data.setName("");
                                                }}
                                            >
                                                <Icon
                                                    title="新增分组"
                                                    className="group-add" type="plus" theme="outlined"
                                                    style={{ float: 'right', margin: '10px', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        store.data.setId('');
                                                        store.data.setName('');
                                                        store.modal.groupAdd.setIsShow(true);
                                                    }} />
                                            </Popover>
                                            :
                                            ''
                                    }
                                </div>
                                <Spin spinning={store.loading.getGroup} size="large">
                                    <Menu style={{ positive: 'relative', borderRight: 'none' }}  defaultSelectedKeys={['0']}>
                                        {
                                            store.getList.map((item, i) =>
                                                <Menu.Item
                                                    key={`${i}`}
                                                    onClick={() => {
                                                        store.activeGroup.setId(item.id);
                                                        store.activeGroup.setName(item.name);
                                                        store.initParams();
                                                        store.getUserListByTeamIdForApi(item.id, 1);
                                                    }}
                                                >
                                                    <span>{item.name}</span>
                                                    {
                                                        publicUtils.isAuth('system:group:edit') ?
                                                            <Icon type="edit"
                                                                className="group-edit"
                                                                style={{ position: 'absolute', right: '10px', top: '12px' }}
                                                                title="编辑" onClick={() => {
                                                                    store.getGroupDetail(item.id, item.name);
                                                                }} />
                                                            :
                                                            ''
                                                    }
                                                </Menu.Item>
                                            )
                                        }

                                    </Menu>
                                    {
                                        store.getList.length == 0 ?
                                            <p style={{ textAlign: 'center', marginTop: '30px' }}>暂无分组</p>
                                            : ''

                                    }


                                </Spin>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={14} xl={16} style={{ backgroundColor: '#FFF', height: '100%', padding: '24px 32px' }} id="right">

                                <div style={{ height: '44px', marginBottom: '10px' }}>
                                    <PageToolBar changeToolBar={this.changeToolBar} searchValue={store.params.getKeyword} searchPlaceholder="输入成员姓名" btnStr={publicUtils.isAuth("system:group:edit") ? "新增成员" : ''} btnCallBack={() => { store.modal.add.setIsShow(true); store.getNOTUserListByTeamIdForApi(store.activeGroup.getId, 0); }}>
                                        <Radio.Group defaultValue={1} onChange={(e) => { console.log(e.target.value) }} style={{ float: 'right', marginRight: '20px' }}>
                                            {
                                                publicUtils.isAuth("system:group:edit") ?
                                                    <Radio.Button value={1}
                                                        onClick={() => {
                                                            store.getPowerByTeamIdForApi(store.activeGroup.getId);
                                                        }}
                                                    >权限分配</Radio.Button>
                                                    :
                                                    ''
                                            }
                                            {
                                                publicUtils.isAuth('system:group:edit') ?
                                                    <Dropdown overlay={
                                                        <Menu>
                                                            <Menu.Item>
                                                                <a href="javascript:;" onClick={() => {

                                                                    if (common.isEmpty(store.activeGroup.getId)) {
                                                                        message.warn("当前没有分组哦");
                                                                        return
                                                                    } else {
                                                                        Modal.confirm({
                                                                            title: '是否解散' + store.activeGroup.getName + '？',
                                                                            content: '',
                                                                            okText: '确定',
                                                                            okType: 'danger',
                                                                            cancelText: '取消',
                                                                            onOk() {
                                                                                console.log('OK');
                                                                                store.dissolveTeamForApi(store.activeGroup.getId);
                                                                            },
                                                                            onCancel() {
                                                                                console.log('Cancel');
                                                                            },
                                                                        });
                                                                    }

                                                                }}
                                                                >解散分组</a>
                                                            </Menu.Item>
                                                        </Menu>
                                                    } placement="bottomCenter">
                                                        <Radio.Button value="more">...</Radio.Button>
                                                    </Dropdown>

                                                    :
                                                    ''
                                            }

                                        </Radio.Group>
                                    </PageToolBar>
                                </div>

                                <Spin spinning={store.loading.getMember} size="large">
                                    <Table
                                        scroll={{ x: 500 }}
                                        dataSource={store.table.getDataSource} columns={store.table.getColumns} style={{ width: '100%' }}
                                        pagination={
                                            {
                                                current: store.page.getNum,
                                                total: store.page.getTotal,
                                                onChange: (pageNum, pageSize) => {
                                                    store.page.setNum(pageNum);
                                                    store.page.setSize(pageSize);
                                                    store.getMemberListForApi();
                                                },
                                                size: 'small',
                                                showQuickJumper: true,
                                                showSizeChanger: true,
                                                onShowSizeChange: (pageNum, pageSize) => {
                                                    store.page.setNum(pageNum);
                                                    store.page.setSize(pageSize);
                                                    store.getMemberListForApi();
                                                },
                                                showPageSize: store.page.getSize
                                            }
                                        }
                                    />
                                </Spin>
                            </Col>

                        </Row>

                    </div>

                    <Modal
                        title="修改名称"
                        visible={store.modal.groupSave.getIsShow}
                        onOk={this.modalGroupSaveOk}
                        onCancel={() => { store.modal.groupSave.setIsShow(false); }}
                        keyboard
                        destroyOnClose={true}
                        footer={null}
                    >
                        <FormData ref="FormData" />
                    </Modal>

                    <Modal
                        title="新增成员"
                        visible={store.modal.add.getIsShow}
                        onOk={() => { store.modal.add.setIsShow(false); store.optionUserFromTeamForApi(); }}
                        onCancel={() => { store.modal.add.setIsShow(false); }}
                        keyboard
                        destroyOnClose={true}
                        width="650px"
                    >
                        <GroupMemberAdmin />
                    </Modal>

                    <Drawer
                        title={store.activeGroup.getName}
                        placement="right"
                        closable={true}
                        onClose={() => { store.modal.side.setIsShow(false) }}
                        visible={store.modal.side.getIsShow}
                        width={600}
                        destroyOnClose={true}
                    >
                        <div id="group-power-drawer">
                            {
                                store.powerForTeam.getResourceTree.map((item, i) =>
                                    <PermissionAssignment key={i} item={item} />
                                )
                            }
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                width: '100%',
                                borderTop: '1px solid #e9e9e9',
                                padding: '10px 16px',
                                background: '#fff',
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => store.modal.side.setIsShow(false)} style={{ marginRight: 8 }}>
                                取消
                            </Button>
                            <Button onClick={() => store.powerForTeam.setTeamAuthVO(store.powerForTeam.getTeamAuthVOBack)} type="primary" style={{ marginRight: 8 }}>
                                重置
                            </Button>
                            <Button onClick={store.powerAssignForTeamForApi} type="primary">
                                保存
                            </Button>
                        </div>
                    </Drawer>

                </div>
            </Provider>
        )
    }
}
export default Member

