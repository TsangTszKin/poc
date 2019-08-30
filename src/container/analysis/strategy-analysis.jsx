import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from '@/store/analysis/strategy-analysis/Index.js';
import { observer, Provider } from "mobx-react";
import AntVLine from "@/components/analysis/data-graohics/AntVLine";
import { Col, Divider, Modal, Radio, DatePicker, Row, Tree, Dropdown, Button, Menu, Icon, Spin } from "antd";
import '@/styles/analysis/strategy-analysis.less'
import common from "@/utils/common";
import moment from 'moment';
import publicUtils from "@/utils/publicUtils";
import RadioDropdownButton from "@/components/common/RadioDropdownButton";
import eventService from "@/api/analysis/eventService";
import AntVPie from "@/components/analysis/strategy-analysis/AntVPie";

const { DirectoryTree, TreeNode } = Tree;
const { RangePicker } = DatePicker;
const weekdays = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

@observer
class StrategyAnalysis extends Component {
    state = {
        tree: [],
        dimensions: [],
        pieData: [],
    };

    componentDidMount() {
        // 获取树状控件第一二级目录，展示事件源并将策略包加入到子目录
        eventService.getEventsAndPackages().then(res => {
            if (!publicUtils.isOk(res, false, false)) return ;
            let result = res.data.result;
            // console.log(result);
            this.tree = !common.isEmpty(result) ? result.map((item, index) => {
                return {
                    key: `0-${ index }`,
                    title: item.eventSourceVO.eventSourceName,
                    children: item.strategyPackageSummaryVOList.map((packageItem, packageIndex) => {
                        return {
                            key: `0-${ index }-${ packageIndex }`,
                            title: packageItem.name,
                            dataRef: packageItem,
                        }
                    }),
                    dataRef: item.eventSourceVO,
                }
            }) : [];
            // console.log(this.tree);
            store.menu.setList(this.tree);
            store.menu.setIsLoading(false);
        });
        eventService.getAnalysisDimensions().then(res => {
            if (!publicUtils.isOk(res)) return ;
            const result = res.data.result || [];
            let dimensions = result.map(({name, code}, index) => {
                return {
                    text: name,
                    value: index,
                    code,
                }
            });
            this.setState({ dimensions });
        });
    }

    // 切换时间类型并获取数据
    handleChangeType = type => {
        store.chart.setType(type);
        this.getChartDate();
    };

    // 时间选择改变
    handleChangeTime = (value, dateString) => {
        const [startTime, endTime] = dateString;
        if (!common.isEmpty(startTime) && !common.isEmpty(endTime)) {
            console.log('Formatted Selected Time: ', startTime, endTime);
            const startValue = value[ 0 ].valueOf();
            const endValue = value[ 1 ].valueOf();
            const diff = endValue - startValue;
            if (diff > 2592000000) {
                Modal.error({ title: '系统提示', content: '不可以超过30天' });
                return;
            }
            store.chart.setType('4');
            store.chart.setTimeStart(moment(new Date(startTime)));
            store.chart.setTimeEnd(moment(new Date(endTime)));
            this.getChartDate();
        }
    };

    getChartDate = () => {
        // console.log(store.menu.selectedItem);
        if (common.isEmpty(store.menu.selectedItem) || JSON.stringify(store.menu.selectedItem) === '{}') return ;
        const strategyAnalysisVO = {
            packageCode: store.menu.selectedItem.packageCode,
            packageId:  store.menu.selectedItem.packageId,
            packageVersion: store.menu.selectedItem.packageVersion,
            resourceCode: store.menu.selectedItem.code,
            statisticalField: this.state.dimensions[store.chart.dataType].code,
            type: store.menu.selectedItem.type,
            tendencyVO: {
                dateType: store.chart.type,
                endDate: store.chart.type === '4' ? store.chart.timeEnd: '',
                startDate: store.chart.type === '4' ? store.chart.timeStart: '',
            }
        };
        eventService.getStrategyAnalysisChart(strategyAnalysisVO).then(this.handleChartDateChange)
    };

    // 改变时间后更新数据
    handleChartDateChange = res => {
        if (!publicUtils.isOk(res) || common.isEmpty(res.data.result)) return;
        // console.log(res);
        let { hitTotal } = res.data.result;
        let chartData = [];
        for (let key in hitTotal) {
            if (hitTotal.hasOwnProperty(key)) {
                chartData.push({
                    time: this.numberToTime(key),
                    count: hitTotal[ key ]
                });
            }
        }
        store.chart.setData(chartData);
    };

    numberToTime = number => {
        switch (store.chart.type) {
            case '0':
                return number.length === 1 ? `0${ number }:00` : `${ number }:00`;
            case '1':
                return weekdays[parseInt(number)] || number;
            case '3':
                return `${number}月`;
            // case '4':
            //     return moment(store.chart.timeStart).add(Number(number) - 1, 'days').format('M/D');
            default:
                return number
        }
    }

    // 切换折线图展示的数据
    handleChangRadio = e => {
        store.chart.setDataType(e.target.value);
        this.getChartDate();
    };

    // 树状控件选定策略
    handleSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
        console.log('selectedKeys', selectedKeys);
        if (common.isEmpty(selectedNodes)) return ;
        const strategyData = selectedNodes[0].props.dataRef;
        console.log(strategyData);
        store.menu.setSelectedItem(strategyData);
        store.setIsInfoLoading(true);
        store.setStrategyInfo({});
        eventService.getStrategyAnalysisResult({
            packageId: strategyData.packageId,
            packageCode: strategyData.packageCode,
            packageVersion: strategyData.packageVersion,
            resourceCode: strategyData.code,
            statisticalField: this.state.dimensions[store.chart.dataType].code,
            type: strategyData.type,
            eventType: strategyData.eventSourceType
        }).then(res => {
            if (!publicUtils.isOk(res)) return ;
            store.setIsInfoLoading(false);
            const result = res.data.result || {};
            store.setStrategyInfo(result);
        });
        this.setState({ pieData: [] });
        // 如果是决策流，获取数据以饼图展示决策流包含的规则组件，包括规则、规则集、决策表、评分卡等。
        if (strategyData.type === 5) {
            eventService.getResourceCountOfStrategy(strategyData.id).then(res => {
                // console.log(res);
                if (!publicUtils.isOk(res)) return ;
                const result = res.data.result;
                if (String(result) !== '[object Object]') {
                    console.log('决策流资源数据为空，饼图无法显示');
                    return ;
                }
                let sum = Object.values(result).reduce((a, b) => a + b, 0);
                // console.log('sum', sum);
                let pieData = [];
                for(let key in result) {
                    if (result.hasOwnProperty(key)) {
                        let percent = result[key] / sum;
                        percent = Number.isNaN(percent) ? 0: percent;
                        pieData.push({
                            item: key,
                            count: result[key],
                            percent: percent,
                            percentText: (percent * 100).toFixed(2)
                        })
                    }
                }
                // console.log(result);
                this.setState({ pieData: pieData });
            })
        }
        this.handleChangeType('0');
        store.menu.setSelectedKeys(selectedKeys);
    };

    // 展开树状控件
    onExpand = expandedKeys => {
        // console.log(expandedKeys);
        store.menu.setExpandedKeys(expandedKeys);
    };

    // 异步加载树节点数据
    onLoadData = treeNode => {
        return new Promise(resolve => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            console.log(treeNode);
            let data = treeNode.props.dataRef;
            // console.log(data);
            let currentKeys = treeNode.props.eventKey.split('-');
            // 展开的是策略包
            if (currentKeys.length === 3) {
                eventService.getPackageStrategy(data.id).then(res => {
                    if (!publicUtils.isOk(res)) return;
                    const result = res.data.result;
                    console.log('第一次展开获取策略包数据', result);
                    let children = [
                        {
                            title: '规则',
                            key: `${ treeNode.props.eventKey }-0`,
                            dataRef: result.ruleVOSet,
                            children: result.ruleVOSet.map((rule, ruleIndex) => {
                                return {
                                    title: rule.name,
                                    key: `${ treeNode.props.eventKey }-0-${ ruleIndex }`,
                                    dataRef: {
                                        packageId: result.packageId,
                                        packageCode: result.packageCode,
                                        packageVersion: result.packageVersion,
                                        type: 3,
                                        eventSourceType: this.tree[currentKeys[1]].dataRef.eventSourceType,
                                        ...rule
                                    },
                                    isLeaf: true,
                                }
                            })
                        },
                        {
                            title: '决策流',
                            key: `${ treeNode.props.eventKey }-1`,
                            dataRef: result.strategyVOSet,
                            children: result.strategyVOSet.map((strategy, strategyIndex) => {
                                return {
                                    title: strategy.name,
                                    key: `${ treeNode.props.eventKey }-0-${ strategyIndex }`,
                                    dataRef: {
                                        packageId: result.packageId,
                                        packageCode: result.packageCode,
                                        packageVersion: result.packageVersion,
                                        type: 5,
                                        eventSourceType: this.tree[currentKeys[1]].dataRef.eventSourceType,
                                        ...strategy,
                                    },
                                    isLeaf: true,
                                }
                            })
                        },
                    ];
                    // console.log(this.tree);
                    this.tree[currentKeys[1]].children[currentKeys[2]].children = children;
                    store.menu.setList(this.tree);
                    resolve();
                });
            }
        });
    };

    render() {
        // 递归生成treenode
        const loop = data =>
            data.map(item => {
                if (!item.isLeaf) {
                    return (
                        // 父节点不可选
                        <TreeNode title={ item.title } selectable={ false } dataRef={ item.dataRef }>
                            { item.children ? loop(item.children): '' }
                        </TreeNode>
                    );
                }
                return <TreeNode title={ item.title } dataRef={ item.dataRef } isLeaf />;
            });
        const TypeItem = props => {
            let { text, value, current } = props;
            const className = current === value ? 'active' : '';
            return (
                <a
                    className={ `type-item ${ className }` }
                    href="javascript:"
                    onClick={ () => this.handleChangeType(value) }
                >{ text }</a>
            )
        };

        const chartConfig = {
            time: '时间',
            count: this.state.dimensions[store.chart.dataType] ? this.state.dimensions[store.chart.dataType].text : '次数',
        };

        const tradeTitle = {
            3: '规则命中趋势',
            5: '决策流',
        };

        return (
            <Provider store={ store }>
                <div className="strategy-analysis-container">
                    <div className="strategy-analysis-content directory-tree">
                        <Spin spinning={ store.menu.isLoading }>
                            <DirectoryTree
                                onExpand={ this.onExpand }
                                loadData={ this.onLoadData }
                                expandedKeys={ store.menu.expandedKeys }
                                selectedKeys={ store.menu.selectedKeys }
                                // autoExpandParent={autoExpandParent}
                                onSelect={ this.handleSelect }
                            >
                                { loop(store.menu.list) }
                                {/*{ loop(this.state.tree) }*/}
                            </DirectoryTree>
                        </Spin>
                    </div>
                    <div className="strategy-analysis-content analysis-content">
                        <div className="strategy-analysis-header">
                            <span className="strategy-analysis-title">{ common.isEmpty(store.menu.selectedItem) || JSON.stringify(store.menu.selectedItem) === '{}' ? '请选择策略': store.menu.selectedItem.name }</span>
                        </div>
                        <div className="strategy-info">
                            <Spin spinning={ store.isInfoLoading }>
                                <Row gutter={ 30 }>
                                    <Col span={ 8 }>
                                        <div className="strategy-info-box">
                                            <p className="info-text">
                                                <svg className="icon icon-svg" aria-hidden="true">
                                                    <use xlinkHref="#iconzongmingzhongcishu"/>
                                                </svg>
                                                <span>总命中次数</span>
                                                <span className="text-right">{ store.strategyInfo.totalHit }</span>
                                            </p>
                                            <Divider className="info-divider"/>
                                            <p className="info-footer">
                                                命中率 <span>{ store.strategyInfo.totalHitRatio }%</span>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col span={ 8 }>
                                        <div className="strategy-info-box">
                                            <p className="info-text">
                                                <svg className="icon icon-svg" aria-hidden="true">
                                                    <use xlinkHref="#icondangtianmingzhongcishu"/>
                                                </svg>
                                                <span>当天命中次数</span>
                                                <span className="text-right">{ store.strategyInfo.todayHit }</span>
                                            </p>
                                            <Divider className="info-divider"/>
                                            <p className="info-footer">
                                                命中率 <span>{ store.strategyInfo.todayHitRatio }%</span>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col span={ 8 }>
                                        <div className="strategy-info-box">
                                            <p className="info-text">
                                                <svg className="icon icon-svg" aria-hidden="true">
                                                    <use xlinkHref="#iconshangxianshijian"/>
                                                </svg>
                                                <span>上线时间</span>
                                                <span className="text-right">{ store.strategyInfo.onlineTime }</span>
                                            </p>
                                            <Divider className="info-divider"/>
                                            <p className="info-footer">
                                                当前版本<span>V{ store.strategyInfo.version }</span>
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Spin>
                        </div>
                        <div className="strategy-trade">
                            <div className="strategy-trade-header clearfix">
                                <span className="strategy-analysis-title">
                                    { tradeTitle[store.menu.selectedItem.type] || '规则命中趋势' }
                                </span>
                                <div className="data-chart-menu-right">
                                    <TypeItem text="今日" value="0" current={ store.chart.type }/>
                                    <TypeItem text="本周" value="1" current={ store.chart.type }/>
                                    <TypeItem text="本月" value="2" current={ store.chart.type }/>
                                    <TypeItem text="全年" value="3" current={ store.chart.type }/>
                                    <RangePicker
                                        className="data-chart-range-picker"
                                        onChange={ this.handleChangeTime }
                                        defaultValue={ [store.chart.timeStart, store.chart.timeEnd] }
                                        format={ store.chart.dateFormat }
                                    />
                                    <RadioDropdownButton
                                        data={ this.state.dimensions }
                                        className="strategy-analysis-radio"
                                        value={ store.chart.dataType }
                                        onChange={ this.handleChangRadio }
                                    />
                                </div>
                            </div>
                            <div className="strategy-analysis-chart-wrapper">
                                {
                                    this.state.dimensions.map(dimension =>
                                        store.chart.dataType === dimension.value ?
                                            <AntVLine
                                                key={ store.menu.selectedItem.id }
                                                data={ store.chart.data }
                                                dataType={ store.chart.type }
                                                config={ chartConfig }
                                            />
                                            : ''
                                    )
                                }
                            </div>
                        </div>
                        { !common.isEmpty(this.state.pieData) ?
                            <div className="strategy-row-three">
                                <div className="strategy-analysis-block">
                                    <div className="strategy-analysis-block-header clearfix">
                                <span className="strategy-analysis-title">
                                    决策流
                                </span>
                                    </div>
                                    <div className="strategy-analysis-block-content">
                                        <AntVPie data={ this.state.pieData } />
                                    </div>
                                </div>
                            </div>
                            : ''
                        }
                    </div>
                </div>
            </Provider>
        );
    }
}

StrategyAnalysis.propTypes = {};

export default StrategyAnalysis;
