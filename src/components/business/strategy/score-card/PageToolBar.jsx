import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Button, Col, Icon, Input, Row, Select } from "antd";
import common from "@/utils/common";
import commonService from "@/api/business/commonService";
import publicUtils from "@/utils/publicUtils";
import variableService from "@/api/business/variableService";

class PageToolBar extends Component {
    state = {
        keyword: '',
        isExtend: false,
        eventSourceList: [],
        eventSourceId: '',
        categoryList: [],
        category: '',
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // 获取事件源列表
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return ;
            let eventSourceList = [
                { eventSourceId: '', eventSourceName: '所有' },
                ...res.data.result
            ];
            this.setState({ eventSourceList });
        });

        // 获取类别列表
        commonService.getCategoryListByType('scoreCard').then(res => {
            if (!publicUtils.isOk(res)) return ;
            let categoryList = [
                { dataValue: '', dataName: '所有' },
                ...res.data.result
            ];
            this.setState({ categoryList });
        });
    }

    handleSearch = () => {
        this.props.handleSearch(this.state.keyword);
    };

    handleChangeEventSource = eventSourceId => {
        this.setState({ eventSourceId });
        this.props.handleChangeEventSource(eventSourceId);
    }

    handleChangeCategory = category => {
        this.setState({ category });
        this.props.handleChangeCategory(category);
    }

    render() {
        return (
            <div className="pageToolBar-container">
                <Row gutter={ 20 }>
                    <Col style={{ marginBottom: '10px' }} span={ this.state.isExtend ? 24: 14 }>
                        <Row gutter={ 20 }>
                            <Col md={ 10 } lg={ 8 }>
                                <div style={{ display: 'flex' }}>
                                    选择事件源:
                                    <Select
                                        value={ this.state.eventSourceId }
                                        style={{ flex: 1, marginLeft: '6px', marginTop: '4px' }}
                                        onChange={ this.handleChangeEventSource }>
                                        {
                                            this.state.eventSourceList.map((item, i) =>
                                                <Select.Option value={ item.eventSourceId }>{ item.eventSourceName }</Select.Option>
                                            )
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col md={ 10 } lg={ 8 }>
                                <Input.Search
                                    placeholder={ this.props.searchPlaceholder }
                                    onSearch={ value => this.handleSearch() }
                                    onChange={ (e) => {
                                        this.setState({
                                            keyword: common.stripscript(e.target.value)
                                        })
                                    } }
                                    value={ this.state.keyword }
                                    style={ { marginTop: '4px' } }
                                    onPressEnter={ this.handleSearch }
                                />
                            </Col>
                            <Col md={ 4 } lg={ 8 }>
                                <div style={{ display: 'flex' }}>
                                    {
                                        this.state.isExtend ?
                                            <Fragment>
                                                选择类别:
                                                <Select
                                                    value={ this.state.category }
                                                    style={{ flex: 1, margin: '4px 20px 0 6px' }}
                                                    onChange={ this.handleChangeCategory }
                                                >
                                                    {
                                                        this.state.categoryList.map(item =>
                                                            <Select.Option value={ item.dataValue }>{ item.dataName }</Select.Option>
                                                        )
                                                    }
                                                </Select>
                                            </Fragment>
                                            : ''
                                    }
                                    <a
                                        href="javascript:;"
                                        style={ { whiteSpace: 'nowrap' } }
                                        onClick={ () => this.setState({ isExtend: !this.state.isExtend }) }
                                    >{ this.state.isExtend ? '收起': '展开' } <Icon type="down" rotate={ this.state.isExtend ? 180: 0 } /></a>
                                </div>

                            </Col>
                        </Row>
                    </Col>
                    <Col span={ this.state.isExtend ? 24: 10 }>
                        {
                            this.props.children
                        }
                    </Col>
                </Row>
            </ div>
        );
    }
}

export default PageToolBar;

PageToolBar.prototypes = {
    handleChangeEventSource: PropTypes.func,
    handleChangeCategory: PropTypes.func,
    handleSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
};

PageToolBar.defaultProps = {
    handleChangeEventSource: () => {},
    handleChangeCategory: () => {},
    handleSearch: () => {},
    searchPlaceholder: '输入名称或者标识查询',
};