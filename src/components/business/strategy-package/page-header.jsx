import React, { Component, Fragment } from "react";
import BreadCrumb from "@/components/BreadCrumb";
import { withRouter } from "react-router-dom";
import '@/styles/business/release/release.less'
import PropTypes from "prop-types";
import VersionControl from "@/components/business/strategy-package/version-control";
import Code from "@/components/Code";
import { Drawer } from "antd";
import common from "@/utils/common";
import '@/styles/components/page-header.less';
import TestButton from "@/components/common/TestButton";

@withRouter
class PageHeader extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isShowSql: false,
        isShowTest: false,
    };

    componentDidMount() {
        this.id = this.props.match.params.id;
    }

    render() {
        // 编辑已有的策略包就会有versions数组
        const isShowVersionSelect = !!this.props.match.params.id && !!this.props.changePath && !common.isEmpty(this.props.versions);
        const { testParams } = this.props;
        return (
            <Fragment>
                <div className="panel-header">
                    <BreadCrumb nav={ this.props.meta.nav }/>
                    <p className='title'>
                        { this.props.meta.title } <span className="description">{ this.props.meta.descript }</span>
                    </p>
                    {
                        // 模板管理的path上有type是2
                        this.props.match.params.type == '2' ? '' :
                            isShowVersionSelect ?
                                <VersionControl versions={ this.props.versions }
                                                changePath={ this.props.changePath } { ...this.props } />
                                : ''
                    }
                    {
                        common.isEmpty(this.props.sqlCode) ? '' :
                            <div className="page-header-btn" onClick={ () => this.setState({ isShowSql: true }) }>
                                <icon className="iconfont iconzonglan" title="总览"/>
                                <span>总览</span>
                            </div>
                    }
                    {
                        // 模板管理的path上有type是2
                        this.props.match.params.type == '2' ? '' :
                            !this.props.inspectVarSet ? '' :
                                <TestButton className="page-header-btn" testParams={ testParams }
                                            inspectVarSet={ this.props.inspectVarSet }/>
                    }
                    { this.props.children }
                </div>
                <Drawer
                    title="总览"
                    placement="right"
                    closable={ true }
                    onClose={ () => this.setState({ isShowSql: false }) }
                    visible={ this.state.isShowSql }
                    width="720"
                    destroyOnClose={ true }
                >
                    <Code sqlCode={ this.props.sqlCode } type={ 1 }/>
                </Drawer>
            </Fragment>
        )
    }
}

export default PageHeader;

PageHeader.propTypes = {
    changePath: PropTypes.string,
    versions: PropTypes.array,
    sqlCode: PropTypes.string,
    testParams: PropTypes.object,
    inspectVarSet: PropTypes.array,
};
PageHeader.defaultProps = {
    sqlCode: '',
    testParams: {},
};