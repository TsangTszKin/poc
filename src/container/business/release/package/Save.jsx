import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/release/package/Save';
import PageHeader from '@/components/business/strategy-package/page-header';
import '@/styles/business/variable/real-time-query-edit.less';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { Form, Spin, Transfer, Modal, Input, Row, Col, Select, Divider, Table, message } from 'antd';
import PropTypes from 'prop-types';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import FormButtonGroupForStrategyPackage from '@/components/FormButtonGroupForStrategyPackage';
import '@/styles/business/release/release.less';
import common from "@/utils/common";
import Status from "@/components/business/strategy-package/status";
import Iconfont from "@/components/common/Iconfont";

const numberOfType = {
    'rtqVars': 1,
    'extVars': 2,
    // 'rules': 3, /* 现在策略包不可以直接选择规则资源 */
    'ruleSets': 4,
    'decisionFlows': 5,
    'scoreCards': 6,
    'decisionTables': 7,
};
const resourceColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '当前版本', dataIndex: 'version', key: 'version' },
    { title: '更新时间', dataIndex: 'modifiedTime', key: 'modifiedTime' },
];

@Form.create()
@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSourceList: [],
            isNew: !this.props.match.params.id,
            result: {},
        };
        this.isNew = common.isEmpty(this.props.match.params.id);
        // 解决页面跳转(和切换事件源)store数据不初始化的问题，否则必须刷新页面
        store.resetAllTransfer();
        store.restBaseInfo();
        this.getInitDataList = this.getInitDataList.bind(this);
    }

    componentDidMount() {
        this.getInitDataList();
        // document.title = common.isEmpty(this.props.match.params.id) ? '新建策略包': '编辑策略包';
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.match.params.id) return;
        if (this.props.match.params.id !== nextProps.match.params.id) {
            store.resetAllTransfer();
            store.restBaseInfo();
            this.getInitDataList();
        }
    }

    getInitDataList = () => {
        common.loading.show();
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) {
                common.loading.hide();
                return;
            }
            const result = res.data.result;
            this.setState({ eventSourceList: result });

            // 编辑策略包时，根据id获取单个策略包数据，该id为版本id
            if (this.props.match.params.id) {
                strategyService.getStrategyPackageToEdit(this.props.match.params.id)
                    .then(response => {
                        if (publicUtils.isOk(response) && response.data) return response.data;
                        else throw '策略包获取失败';
                    })
                    .then(data => {
                        // console.log(data);
                        const { result } = data;
                        this.result = result;
                        this.setState({ result });
                        store.baseInfo.setName(result.name);
                        store.baseInfo.setCode(result.code);
                        store.version.setList(result.versions.versionList);
                        store.version.setCurrentVersion(result.versions.lastEditVersion);
                        // this.versions = result.versions;
                        // 设置事件源并获取穿梭框全部选项
                        const { eventSource } = result;
                        store.baseInfo.setEventSourceId(eventSource.eventSourceId);
                        store.baseInfo.setEventSourceType(eventSource.eventSourceType);
                        store.baseInfo.setEventSourceName(eventSource.eventSourceName);
                        store.getStrategyPackageResourcesForApi().then(() => {
                            common.loading.hide();
                            // 设置穿梭框已选项
                            // 因为有些数据是以前保存的，获取的左边列表里面是不一定有的，要给选项里加上，否则右边不显示

                            // 换了新的写法待稳定后可删除
                            // const { rtqVars, rules, ruleSets, extVars, decisionFlows, decisionTables, scoreCards } = result;
                            // this.remixOptionsFromPackage(rtqVars, store.rtq);
                            // this.remixOptionsFromPackage(rules, store.rule);
                            // this.remixOptionsFromPackage(ruleSets, store.ruleSet);
                            // this.remixOptionsFromPackage(extVars, store.ext);
                            // this.remixOptionsFromPackage(decisionFlows, store.strategy);

                            store.transferKeys.forEach(key => {
                                this.remixOptionsFromPackage(result[key] || [], store[key]);
                            });
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        common.loading.hide();
                        this.props.history.push('/business/release/package');
                    });
            } else {
                common.loading.hide();
            }
        });
    };

    /**
     * 设置右侧已选项，同时将穿梭框左边没有的选项从策略包已选项加入
     * @param packageOptions 策略包中的已选项
     * @param storeObj store中控制穿梭框的observable对象
     */
    remixOptionsFromPackage = (packageOptions, storeObj) => {
        storeObj.setSelect(packageOptions.map(item => {
            const options = storeObj.getAll;
            // 判断已选项是否存在于左侧选项中,如果不包含就加到选项中
            // const notIncludeThis = options.every(option => option.id !== item.id);
            // let includeThis = options.some(option => option.code === item.code);
            let includeThis;
            options.forEach(option => {
                if (option.code === item.code) {
                    includeThis = true;
                    // 有时候策略包保存的策略跟接口获得列表信息不一致，以决策包保存的信息为准，替换掉接口获得列表选项
                    Object.assign(option, item);
                }
            })
            console.log(includeThis ? 'includeThis' : 'notIncludeThis', item.name);
            if (!includeThis) {
                item.key = item.code;
                options.push(item);
                storeObj.setAll(options);
            }
            return item.code;
        }));
    };

    handleEventSelect = eventSourceId => {
        store.resetAllTransfer();
        store.baseInfo.setEventSourceId(eventSourceId);
        const selectItem = this.state.eventSourceList.find(item => item.eventSourceId === eventSourceId);
        store.baseInfo.setEventSourceName(selectItem.eventSourceName);
        store.baseInfo.setEventSourceType(selectItem.eventSourceType);
        store.getStrategyPackageResourcesForApi();
    };

    // 保存编辑或者保存新建
    save = isNewVersion => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                Modal.error({ title: '系统提示', content: '信息有错误' });
                return;
            }
            isNewVersion = isNewVersion === true;
            // console.log(isNewVersion ? '保存为新版本':'新建或保存策略包');
            const data = {
                name: values.name,
                code: values.code,
                eventSource: {
                    eventSourceName: store.baseInfo.getEventSourceName,
                    eventSourceType: store.baseInfo.getEventSourceType,
                    eventSourceId: store.baseInfo.getEventSourceId,
                },
                // 换了新的写法待稳定后可删除
                // rtqVars: this.formatSelectedArray(store.rtq.getSelect, store.rtq.getAll),
                // rules: this.formatSelectedArray(store.rule.getSelect, store.rule.getAll),
                // ruleSets: this.formatSelectedArray(store.ruleSet.getSelect, store.ruleSet.getAll),
                // extVars: this.formatSelectedArray(store.ext.getSelect, store.ext.getAll),
                // decisionFlows: this.formatSelectedArray(store.strategy.getSelect, store.strategy.getAll),
            };
            // 获取策略包详细返回资源的字段需要跟getStrategyPackageResourcesForApi返回的字段（tKey）一致
            store.transferKeys.forEach(tKey => {
                // console.log(`${store.textOfType[tKey]}(${tKey})`, store[tKey].getSelect, store[tKey].getAll);
                data[tKey] = this.formatSelectedArray(store[tKey].getSelect, store[tKey].getAll);
            });
            if (this.props.match.params.id) data.id = this.props.match.params.id;
            // console.log(data);
            common.loading.show();
            strategyService.saveStrategyPackage(data, isNewVersion)
                .then(res => res.data)
                .then(data => {
                    // console.log(data);
                    common.loading.hide();
                    if (data.resultCode !== 1000) {
                        Modal.error({
                            title: '系统提示',
                            content: data.resultMessage,
                        });
                    } else {
                        Modal.success({
                            title: '系统提示',
                            content: data.resultMessage,
                        });
                        this.props.history.push('/business/release/package');
                    }
                });
        });

    };

    // 穿梭框根据code作比较，保存是传id
    formatSelectedArray = (selectedKeys, data) => {
        // console.log('selectedKeys', selectedKeys);
        // console.log('data', data);
        return data.filter(a => selectedKeys.includes(a.code))
            .map(item => {
                return { id: item.id };
            });
    };

    renderItem = item => {
        return {
            label: item.name, // for displayed item
            value: { id: item.id }, // for title and filter matching
        };
    };

    renderOption = (record, tKey) => {
        // console.log('record', record, tKey);
        if (tKey === 'extVars') return <span>{ record.name }</span>;
        else return (
            <span>{ record.name } - { record.version }<Iconfont style={ { marginLeft: '6px' } } className="iconbanben" title="选择版本" onClick={ e => this.changeOptionVersion(e, record, tKey) } /></span>
        )
    }

    changeOptionVersion = (e, resource, tKey) => {
        e.stopPropagation();
        const type = numberOfType[tKey];
        if (!type) return ;
        common.loading.show();
        strategyService.getResourceVersions(resource.code, type, true).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            store.versionList.setIsShow(true);
            store.versionList.setPrevResId(resource.id);
            store.versionList.setPrevType(tKey);
            store.versionList.setList(res.data.result);
        });
    }

    handleConfirm = () => {
        console.log(store.versionList.selectedKey);
        console.log(store.versionList.selectedRows);
        if (common.isEmpty(store.versionList.selectedKey)) {
            message.error('请勾选');
            return;
        }
        const prevType = store.versionList.prevType;
        console.log('prevType', prevType);
        let currentAllOfType = store[prevType].getAll;
        console.log('currentAllOfType', currentAllOfType);
        let replaceIndex = currentAllOfType.findIndex(item => item.id === store.versionList.prevResId);
        if (replaceIndex === -1) {
            console.log('something wrong');
            return;
        }
        let newOption = {
            code: store.versionList.selectedRows[0].code,
            id: store.versionList.selectedRows[0].id,
            key: store.versionList.selectedRows[0].code,
            name: store.versionList.selectedRows[0].name,
            version: store.versionList.selectedRows[0].version,
        };
        currentAllOfType.splice(replaceIndex, 1, newOption);
        console.log('currentAllOfType', currentAllOfType);
        store[prevType].setAll(currentAllOfType);
        store.versionList.setIsShow(false);
        store.versionList.reset();
    }

    handleCancel = () => {
        store.versionList.setIsShow(false);
        store.versionList.reset();
    }

    filterOption = (inputValue, option) => option.name.indexOf(inputValue) > -1;

    render() {
        //解决在mobx之间的通讯问题
        // processTreeStore.getDataForApi(store.getId);
        //info再初始化一次
        if (store.getStoreBus === 1) store.setStoreBus(2);
        const nameConfig = {
            rules: [
                {
                    pattern: /^([^?!`~@#$^&%*()=|{}':;,\[\].<>/！￥…（）—【】‘；：”“。，、？]+)$/,
                    message: '不可以输入特殊字符'
                },
                { required: true, message: '请输入名称' },
                { max: 32, message: '最大长度32' }
            ],
            initialValue: store.baseInfo.name
        };
        const codeConfig = {
            rules: [
                { pattern: new RegExp("^[A-Za-z0-9_]+$"), message: '请输入字母，数字，下划线' },
                { required: true, message: '请输入标识' },
                { max: 12, message: '最大长度12' }
            ],
            initialValue: store.baseInfo.code
        };
        const eventSourceConfig = {
            rules: [
                { pattern: new RegExp("^[A-Za-z0-9_]+$"), message: '请输入字母，数字，下划线' },
                { required: true, message: '请选择事件源' },
            ],
            initialValue: store.baseInfo.eventSourceId
        };
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            selectedRowKeys: store.versionList.selectedKey,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                // const selectedRowKey = selectedRowKeys.pop();
                store.versionList.setSelectedKey([selectedRowKeys.pop()]);
                store.versionList.setSelectedRows([selectedRows.pop()]);
            }
        };
        return (
            <Provider store={ store }>
                <div className='panel'>
                    <PageHeader
                        meta={ this.props.meta }
                        versions={ store.version.getList }
                        changePath="/business/release/package/save/"
                        auth={ {
                            test: publicUtils.isAuth("business:release:package:view"),
                            sql: publicUtils.isAuth("business:release:package:edit"),
                            version: publicUtils.isAuth("business:release:package:edit"),
                        } }>
                        <div className="header-status">
                            <Status statusCode={ this.state.result.status }/>
                            <Divider type="vertical"/>
                            <Status statusCode={ this.state.result.auditStatus }/>
                        </div>
                    </PageHeader>
                    <div className="pageContent" style={ { marginLeft: '24px', padding: '0 0 64px 0' } }>
                        <div style={ { marginTop: '20px', paddingTop: '16px' } }>
                            <FormBlock header="基本信息">
                                <Form ref="formRef">
                                    <Row gutter={ 30 }>
                                        <Col span={ 8 }>
                                            <Form.Item label="名称">
                                                {
                                                    getFieldDecorator('name', nameConfig)(
                                                        <Input placeholder="请输入名称"/>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col span={ 8 }>
                                            <Form.Item label="标识">
                                                {
                                                    getFieldDecorator('code', codeConfig)(
                                                        <Input placeholder="请输入标识" disabled={ !this.isNew }/>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col span={ 8 }>
                                            <Form.Item label="事件源">
                                                {
                                                    getFieldDecorator('eventSource', eventSourceConfig)(
                                                        <Select onChange={ this.handleEventSelect }
                                                                disabled={ !common.isEmpty(this.props.match.params.id) }>
                                                            {
                                                                this.state.eventSourceList.map(item =>
                                                                    <Select.Option
                                                                        value={ item.eventSourceId }>{ item.eventSourceName }</Select.Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </FormBlock>
                            <FormBlock header="资源">
                                {
                                    store.transferKeys.map(tKey =>
                                        <Cell>
                                            <Title>{ store.textOfType[tKey] }</Title>
                                            <Spin spinning={ store.getIsLoading } size="large"
                                                  style={ { width: '700px', height: '266px' } }>
                                                <Transfer
                                                    dataSource={ store[tKey].getAll }
                                                    showSearch
                                                    filterOption={ this.filterOption }
                                                    listStyle={ {
                                                        width: 350,
                                                        height: 266,
                                                    } }
                                                    operations={ ['加入', '移除'] }
                                                    targetKeys={ store[tKey].getSelect }
                                                    onChange={ (selectKey) => store[tKey].setSelect(selectKey) }
                                                    render={ record => this.renderOption(record, tKey) }
                                                />
                                            </Spin>
                                        </Cell>
                                    )
                                }
                                {/*<Cell>*/ }
                                {/*    <Title>实时查询变量</Title>*/ }
                                {/*    <Spin spinning={store.getIsLoading} size="large" style={{ width: '700px', height: '266px' }}>*/ }
                                {/*        <Transfer*/ }
                                {/*            dataSource={store.rtq.getAll}*/ }
                                {/*            showSearch*/ }
                                {/*            filterOption={this.filterOption}*/ }
                                {/*            listStyle={{*/ }
                                {/*                width: 350,*/ }
                                {/*                height: 266,*/ }
                                {/*            }}*/ }
                                {/*            operations={['加入', '移除']}*/ }
                                {/*            targetKeys={store.rtq.getSelect}*/ }
                                {/*            onChange={(selectKey) => store.rtq.setSelect(selectKey)}*/ }
                                {/*            render={item => item.name}*/ }
                                {/*        />*/ }
                                {/*    </Spin>*/ }
                                {/*</Cell>*/ }
                                {/*<Cell>*/ }
                                {/*    <Title>衍生变量</Title>*/ }
                                {/*    <Spin spinning={store.getIsLoading} size="large" style={{ width: '700px', height: '266px' }}>*/ }
                                {/*        <Transfer*/ }
                                {/*            dataSource={store.ext.getAll}*/ }
                                {/*            showSearch*/ }
                                {/*            listStyle={{*/ }
                                {/*                width: 350,*/ }
                                {/*                height: 266,*/ }
                                {/*            }}*/ }
                                {/*            operations={['加入', '移除']}*/ }
                                {/*            targetKeys={store.ext.getSelect}*/ }
                                {/*            onChange={(selectKey) => store.ext.setSelect(selectKey)}*/ }
                                {/*            render={item => item.name}*/ }
                                {/*        />*/ }
                                {/*    </Spin>*/ }
                                {/*</Cell>*/ }
                                {/*/!* 暂时隐藏 *!/*/ }
                                {/*/!*<Cell>*!/*/ }
                                {/*/!*    <Title>规则</Title>*!/*/ }
                                {/*/!*    <Spin spinning={store.getIsLoading} size="large" style={{ width: '700px', height: '266px' }}>*!/*/ }
                                {/*/!*        <Transfer*!/*/ }
                                {/*/!*            dataSource={store.rule.getAll}*!/*/ }
                                {/*/!*            showSearch*!/*/ }
                                {/*/!*            filterOption={this.filterOption}*!/*/ }
                                {/*/!*            listStyle={{*!/*/ }
                                {/*/!*                width: 350,*!/*/ }
                                {/*/!*                height: 266,*!/*/ }
                                {/*/!*            }}*!/*/ }
                                {/*/!*            operations={['加入', '移除']}*!/*/ }
                                {/*/!*            targetKeys={store.rule.getSelect}*!/*/ }
                                {/*/!*            onChange={(selectKey) => store.rule.setSelect(selectKey)}*!/*/ }
                                {/*/!*            render={item => item.name}*!/*/ }
                                {/*/!*        />*!/*/ }
                                {/*/!*    </Spin>*!/*/ }
                                {/*/!*</Cell>*!/*/ }
                                {/*<Cell>*/ }
                                {/*    <Title>规则集</Title>*/ }
                                {/*    <Spin spinning={store.getIsLoading} size="large" style={{ width: '700px', height: '266px' }}>*/ }
                                {/*        <Transfer*/ }
                                {/*            dataSource={store.ruleSet.getAll}*/ }
                                {/*            showSearch*/ }
                                {/*            listStyle={{width: 350, height: 266,}}*/ }
                                {/*            operations={['加入', '移除']}*/ }
                                {/*            targetKeys={store.ruleSet.getSelect}*/ }
                                {/*            onChange={(selectKey) => {store.ruleSet.setSelect(selectKey)}}*/ }
                                {/*            render={item => item.name}*/ }
                                {/*        />*/ }
                                {/*    </Spin>*/ }
                                {/*</Cell>*/ }
                                {/*<Cell>*/ }
                                {/*    <Title>决策流</Title>*/ }
                                {/*    <Spin spinning={store.getIsLoading} size="large" style={{ width: '700px', height: '266px' }}>*/ }
                                {/*        <Transfer*/ }
                                {/*            dataSource={store.strategy.getAll}*/ }
                                {/*            showSearch*/ }
                                {/*            listStyle={{width: 350, height: 266,}}*/ }
                                {/*            operations={['加入', '移除']}*/ }
                                {/*            targetKeys={store.strategy.getSelect}*/ }
                                {/*            onChange={(selectKey) => store.strategy.setSelect(selectKey)}*/ }
                                {/*            render={item => item.name}*/ }
                                {/*        />*/ }
                                {/*    </Spin>*/ }
                                {/*</Cell>*/ }
                            </FormBlock>
                        </div>
                    </div>
                    <FormButtonGroupForStrategyPackage
                        saveCallBack={ () => this.save(false) }
                        saveCallBack2={ () => this.save(true) }
                        cancelCallBack={ () => this.props.history.push("/business/release/package") }
                        isShowSaveBtn={ this.result && this.result.status !== 105 }
                        isShowSaveAsNew={ !this.isNew }
                    />
                    <Modal
                        title="版本"
                        onOk={ this.handleConfirm }
                        onCancel={ this.handleCancel }
                        visible={ store.versionList.isShow }
                    >
                        <Table
                            scroll={ { x: 'max-content' } }
                            className="release-version-table"
                            columns={ resourceColumns }
                            dataSource={ store.versionList.list }
                            pagination={ false }
                            rowSelection={ rowSelection }
                        />
                    </Modal>
                </div>
            </Provider>
        );
    }
}

Save.propTypes = {
    collapsed: PropTypes.bool
};
Save.defaultProps = {
    collapsed: false
};
export default Save;

class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p style={ {
                fontSize: '14px',
                fontWeight: '650',
                color: 'rgba(0, 0, 0, 0.647058823529412)',
                marginBottom: '15px'
            } }>{ this.props.children }</p>
        );
    }
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={ { marginBottom: '30px' } }>{ this.props.children }</div>
        );
    }
}