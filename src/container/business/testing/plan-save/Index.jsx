/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/9 13:58
 * Description: 新建策略测试方案
 */

import React, { Component } from 'react';
import { observer } from "mobx-react";
import '@/styles/business/testing/index.less';
import { withRouter } from "react-router-dom";
import TestPlanSave from "@/container/business/testing/plan-save/Save";

@withRouter
@observer
class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.testId = this.props.match.params.testId;
    }

    render() {
        return (
            <TestPlanSave key={ this.testId }/>
        );
    }

}

export default TestPlanSave;