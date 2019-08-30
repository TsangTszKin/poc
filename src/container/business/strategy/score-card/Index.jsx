import {
    Button,
    Dropdown,
    Menu,
    Select,
    message,
    Row,
    Modal,
    Radio,
    Col,
    Input,
    Popconfirm,
    Spin,
    Table,
    Form, Icon, Upload
} from "antd";
import React, {Component, Fragment} from 'react';
import {observer, Provider} from "mobx-react";
import PageHeader from "@/components/business/strategy-package/page-header";
import TableActionForVersion from '@/components/business/strategy/score-card/TableActionForVersion';
import store from '@/store/business/strategy/score-card/Index';
import publicUtils from "@/utils/publicUtils";
import strategyService from "@/api/business/strategyService";
import MultiControl from "@/components/common/MultiControl";
import PageToolBar from "@/components/business/strategy/score-card/PageToolBar";
import {withRouter} from "react-router-dom";
import Action from "@/components/business/strategy/score-card/Action";
import UseTimes from '@/components/business/UseTimes';
import common from "@/utils/common";
import Paging from "@/components/Paging";
import commonService from '@/api/business/commonService';

@withRouter
@observer
class Index extends Component {
    state = {
        selectedKeys: [],
        selectedRows: [],
        eventSourceId: '',
        category: '',
        search: '',
        isLoading: true,
        fileList: [],
        fieldJson: '',
        importData: {},
        authorizationType: '',
        info: {},
        flag: false,
        lastState: 0,

    }

    componentDidMount() {
        this.getData();
        // if(this.state.flag){
        //     this.getData();
        // }
    }

    getData = () => {
        let queryParams = {
            page: store.pagination.page,
            size: store.pagination.pageSize,
            type: 0,
            name: this.state.search,
            code: this.state.search,
            category: this.state.category,
            eventSourceId: this.state.eventSourceId,
            sort: store.getSort,
            sortType: store.getSortType,//0：code，1：modifiedTime
        };
        console.log(queryParams);
        this.setState({isLoading: true});
        strategyService.getStrategyCardList(queryParams).then(res => {
            this.setState({isLoading: false});
            if (!publicUtils.isOk(res)) return;
            let dataSource = res.data.pageList.resultList;
            store.pagination.setTotal(res.data.pageList.sum);
            dataSource.forEach((item, index) => {
                console.log("item", item)
                item.index = index + 1;
                item.action = <Action dataId={item.id}
                                      code={item.code}
                                      status={item.status}
                                      deleteOne={this.deleteOne}
                                      toDetail={() => this.toDetail(item.id)}
                                      quoteSumFunc={store.getUseTimesTreeForApi}
                                      quoteSum={item.quoteSum}
                                      versionFunc={() => {
                                          store.modal.version.show();
                                          this.showVersionList(item.code);
                                      }}
                                      templateFunc={() => {
                                          store.templateVO.updateData('id', item.id);
                                          store.modal.shareTemplate.show();
                                      }}
                />
            });
            store.setDataSource(dataSource);
        })
        // this.state.lastState ==
        // this.setState({flag:false})
    }

    toDetail = id => this.props.history.push(`/business/strategy/card/detail/${id}`);
    showVersionList = code => {
        strategyService.showStrategyCardVersion(code).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                element.key = i;
                element.index = i + 1;
                element.action = <TableActionForVersion dataId={element.id} deleteVersion={() => {
                    this.deleteVersion(element.id, code);
                }} editPath={`/business/strategy/card/save/1/${element.id}`}
                />
                tempArray.push(element)
            }
            store.setVersionList(tempArray);
        });
    }

    deleteVersion = (id, code) => {
        common.loading.show();
        strategyService.deleteStrategyCardVersion(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success('删除成功！');
            this.getData();
            this.showVersionList(code);
        })
    }

    deleteOne = code => {
        common.loading.show();
        strategyService.deleteStrategyCard(code).then(res => {
            common.loading.hide();
            this.getData();
            if (!publicUtils.isOk(res)) return
            message.success(res.data.resultMessage);
        }).catch(() => {
            common.loading.hide();
        })
    }

    verifyTemplate = () => {
        if (common.isEmpty(store.templateVO.getData.name)) {
            message.warn('请输入名称');
            return false
        }
        // if (common.isEmpty(store.templateVO.getData.description)) {
        //     message.warn('请输入描述');
        //     return false
        // }
        return true
    }

    handleChangePage = (page, pageSize) => {
        store.pagination.setPage(page);
        store.pagination.setPageSize(pageSize);
        this.getData();
    }

    handleSearch = keyWork => {
        console.log(keyWork);
        this.setState({search: keyWork}, this.getData);
    }

    handleChangeCategory = category => {
        this.setState({category}, this.getData);
    }

    handleChangeEventSource = eventSourceId => {
        store.pagination.setPage(1);
        this.setState({eventSourceId}, this.getData);
    }

    multiDelete = selectedKeys => {
        console.log(selectedKeys);
        console.log(this.state.selectedRows);
        if (common.isEmpty(this.state.selectedRows)) {
            message.warning('请勾选');
            return;
        }
        let codeArr = this.state.selectedRows.map(item => item.code);
        common.loading.show();
        strategyService.deleteStrategyCard(codeArr).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success('删除成功');
            this.getData();
            this.setState({
                selectedKeys: [],
                selectedRows: [],
            })
        })
    }

    /* handleChange = (pagination, filters, sorter) => {
         console.log("pagination, filters, sorter", pagination, filters, sorter);
         if (!common.isEmpty(filters.code)&&filters.code.length<2) {
             store.setFilteredInfo(filters.code);
             // store.setFilteredInfo2([]);
             store.setSort(filters.code[0]);
             store.setSortType("code");
             console.log("1111", store.getFilteredInfo,store.getFilteredInfo2)
         }else if(!common.isEmpty(filters.modifiedTime)&&filters.modifiedTime.length<2){
             store.setFilteredInfo2(filters.modifiedTime);
             // store.setFilteredInfo([]);
             store.setSort(filters.modifiedTime[0]);
             store.setSortType("modifiedTime");
             console.log("2222", store.getFilteredInfo,store.getFilteredInfo2)

         }
         //TODO
         this.getData();
         console.log("3333", store.getFilteredInfo,store.getFilteredInfo2)
     };*/

    handleFileChange = info => {
        console.log("handleFileChange", info);
        this.setState({
            info: info
        });
        let {file, fileList} = info;
        const status = file.status;
        if (['error', 'removed'].includes(status)) {
            this.setState({
                fieldJson: '',
                fileList: [],
            });
        } else this.setState({fileList: [file]});
    };

    render() {
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
        let self = this;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '标识',
                dataIndex: 'code',
                key: 'code',
                sorter: function (...params) {
                    console.log("...params", params[2])
                    // self.setState({sort: params[2], sortType: 'code', flag: true})
                }
                /* filters: [{
                     text: '升序',
                     value: "ascend",
                 }, {
                     text: '降序',
                     value: "descend",
                 }],
                 filteredValue: store.getFilteredInfo,*/
            },
            {
                title: '更新时间',
                dataIndex: 'modifiedTime',
                key: 'modifiedTime',
                sorter: function (...params) {
                    console.log("...params", params[2])
                    // self.setState({sort: params[2], sortType: 'code', flag: true})
                }
                /*filters: [{
                    text: '升序',
                    value: "ascend",
                }, {
                    text: '降序',
                    value: "descend",
                }],
                filteredValue: store.getFilteredInfo2,*/
            },
            {
                title: '当前版本',
                dataIndex: 'version',
                key: 'version'
            },
            {
                title: '事件源',
                dataIndex: 'eventSourceName',
                key: 'eventSourceName'
            }, {
                title: '维度',
                dataIndex: 'dimensionName',
                key: 'dimensionName'
            },
            {
                title: '类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
                // render: text => this.state.categoryList[text]
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 50
            }
        ];
        const supportFileTypeText = '支持扩展名：.zip';
        const _this = this;
        const uploadProps = {
            // withCredentials: true,
            accept: '.zip',
            fileList: this.state.fileList,
            // disabled: !common.isEmpty(this.state.fileList),
            onChange: (info) => this.handleFileChange(info),
            onSuccess(res, file) {
                if (!publicUtils.isOk(res)) return;
                console.log('onSuccess', res, file);
                _this.setState({fieldJson: res.data.result});
                _this.setState({fileList: [file]});
            },
            onProgress({percent}, file) {
                console.log('onProgress', `${percent}%`, file.name);
            },
            customRequest({
                              file,
                              filename,
                              onError,
                              onProgress,
                              onSuccess,
                              withCredentials,
                          }) {
                // EXAMPLE: post form-data with 'axios'
                const formData = new FormData();
                // if (data) {
                //     Object.keys(data).map(key => {
                //         formData.append(key, data[key]);
                //     });
                // }
                formData.append(filename, file);

                commonService.getImportZIP(formData,6).then(res => {
                    if (!publicUtils.isOk(res)) {
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        store.modal.importZIP.hide();
                        return;
                    } else {
                        onSuccess(res, file);
                        message.success('上传成功');
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        store.modal.importZIP.hide();
                        _this.getData();
                        _this.handleFileChange();
                        _this.setState({importData: res})
                    }
                });

                return {
                    abort() {
                        console.log('upload progress is aborted.');
                    },
                };
            },
        };
        const menuItems = [
            {label: '删除', callback: selectedKeys => this.multiDelete(selectedKeys),}
        ];
        const rowSelection = {
            selectedRowKeys: this.state.selectedKeys,
            onChange: (selectedKeys, selectedRows) => {
                console.log('selectedKeys changed: ', selectedKeys);
                console.log('selectedRows changed: ', selectedRows);
                this.setState({selectedKeys, selectedRows});
            }
        };
        const menu = <Menu>
            <Menu.Item onClick={() => store.getTemplateListForApi(7)}>基于模板创建</Menu.Item>
            <Menu.Item onClick={() => store.modal.importZIP.show()}>基于文件创建</Menu.Item>
        </Menu>;

        return (
            <Provider store={store}>
                <div>
                    <PageHeader meta={this.props.meta}/>
                    <div className="page-content">
                        <PageToolBar
                            handleSearch={this.handleSearch}
                            handleChangeCategory={this.handleChangeCategory}
                            handleChangeEventSource={this.handleChangeEventSource}
                        >
                            <Fragment>
                                <Dropdown.Button
                                    style={{float: 'right'}}
                                    type="primary"
                                    overlay={menu}
                                    onClick={() => this.props.history.push('/business/strategy/card/save')}>
                                    新建评分卡
                                </Dropdown.Button>
                                <MultiControl
                                    style={{float: 'right', margin: '4px 20px 0 0'}}
                                    items={menuItems}
                                    selectedKeys={this.state.selectedKeys}
                                    showConfirm={true}
                                />
                            </Fragment>
                        </PageToolBar>
                        <Spin spinning={this.state.isLoading}>
                            <Table
                                columns={columns}
                                dataSource={store.dataSource}
                                rowSelection={rowSelection}
                                pagination={false}
                                // onChange={this.handleChange}
                            />
                            <Paging
                                showPageSize={store.pagination.pageSize}
                                total={store.pagination.total}
                                changePage={this.handleChangePage}
                                pageNum={store.pagination.page}
                            />
                        </Spin>
                    </div>

                    <UseTimes/>

                    <Modal
                        title="版本"
                        visible={store.modal.version.value}
                        onOk={() => {
                            store.modal.version.hide();
                        }}
                        width={860}
                        onCancel={() => {
                            store.modal.version.hide();
                            this.getData();
                        }}
                        footer={[
                            <Button key="back" onClick={() => {
                                store.modal.version.hide();
                                this.getData();
                            }}>
                                关闭
                            </Button>
                        ]}
                    >
                        <Table dataSource={store.getVersionList} columns={columns2} pagination={false}/>
                    </Modal>


                    <Modal
                        title="创建评分卡模板"
                        visible={store.modal.shareTemplate.value}
                        onOk={() => {
                            if (this.verifyTemplate()) {
                                store.saveTemplateForApi();
                                store.modal.shareTemplate.hide();
                            }
                        }}
                        width={427}
                        onCancel={() => {
                            store.modal.shareTemplate.hide();
                        }}
                    >
                        <div>
                            <label>
                                <Radio.Group style={{marginBottom: '35px'}} onChange={(e) => {
                                    this.setState({authorizationType: e.target.value})
                                    store.templateVO.updateData('authorizationType', e.target.value)
                                }} value={store.templateVO.getData.authorizationType}>
                                    <Radio.Button value={0}>保存为私有模板</Radio.Button>
                                    <Radio.Button value={1}>保存为公有模板</Radio.Button>
                                    <Radio.Button style={{float: 'right'}} value={2}>导出为文件</Radio.Button>
                                </Radio.Group>
                            </label>
                        </div>
                        <Row style={style.templateName}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>名称：</p>
                            </Col>
                            <Col span={18}>
                                <Input maxlength={30} placeholder="请输入名称" value={store.templateVO.getData.name}
                                       onChange={(e) => {
                                           store.templateVO.updateData('name', e.target.value)
                                       }}/>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '30px', display: this.state.authorizationType == '2' ? 'none' : ''}}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>描述：</p>
                            </Col>
                            <Col span={18}>
                                <Input.TextArea
                                    maxlength={150}
                                    placeholder="请输入描述"
                                    autosize={{minRows: 2, maxRows: 6}} value={store.templateVO.getData.description}
                                    onChange={(e) => {
                                        store.templateVO.updateData('description', e.target.value)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>

                    <Modal
                        title="选择评分卡模板"
                        visible={store.modal.useTemplate.value}
                        onOk={() => {
                            if (common.isEmpty(this.state.templateId)) {
                                message.warn("请选择模板");
                                return
                            }
                            this.props.history.push({pathname: '/business/strategy/card/save/2/' + this.state.templateId});
                            store.modal.useTemplate.hide();
                        }}
                        width={400}
                        onCancel={() => {
                            store.modal.useTemplate.hide();
                        }}
                    >
                        <Select placeholder="请选择模板" defaultValue={this.state.templateId} style={{width: '100%'}}
                                onChange={value => {
                                    let templateId = value;
                                    this.setState({templateId})
                                }}>
                            {
                                !common.isEmpty(store.getTemplateList) ?
                                    store.getTemplateList.map((item, i) =>
                                        <Select.Option value={item.id}
                                                       key={i}>{item.name}</Select.Option>
                                    ) : ''
                            }
                        </Select>
                    </Modal>

                    <Modal
                        title="基于文件创建"
                        visible={store.modal.importZIP.value}
                        footer={null}
                        onOk={() => {
                            this.props.history.push({
                                pathname: '/business/strategy/card/save/3/',
                                state: {data: this.state.importData}
                            });
                            store.modal.importZIP.hide();
                            // if (common.isEmpty(this.state.templateId)) {
                            //     message.warn("请选择模板");
                            //     return
                            // }
                            // this.props.history.push({pathname: '/business/strategy/card/save/2/' + this.state.templateId});
                            // store.modal.importZIP.hide();
                        }}
                        width={500}
                        onCancel={() => {
                            store.modal.importZIP.hide();
                        }}
                    >
                        <div style={{marginBottom: 20, marginTop: 10}}>
                            <Upload.Dragger
                                {...uploadProps}
                            >
                                <p className="ant-upload-drag-icon"><Icon type="inbox"/></p>
                                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                                <p className="ant-upload-hint">{supportFileTypeText}</p>
                            </Upload.Dragger>
                        </div>
                    </Modal>


                </div>
            </Provider>
        );
    }
}

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

export default Index;