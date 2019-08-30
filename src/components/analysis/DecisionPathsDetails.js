import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlowNumberIcon from '@/assets/flow-number.png';
import {Tabs, Table, Icon} from 'antd';
import StrategyPath from '@/components/analysis/StrategyPath.1';
import publicUtils from '@/utils/publicUtils';
import EditorStore from '@/store/EditorStore';
import common from '@/utils/common';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import ReactDOM from "react-dom";

@inject('store')
@observer
class DecisionPathsDetails extends Component {
    constructor(props) {
        super(props);
        this.updateIframeData = this.updateIframeData.bind(this);
        this.state = {
            iFrameHeight: 0,
        }
    }

    updateIframeData() {
        const childFrameObj = document.getElementById('myiframe');
        // console.log("传过去的数据",this.props.myData)
        childFrameObj.contentWindow.postMessage({code: 3, value: this.props.myData.processon, ids:this.props.myData.hitAssemblyId}, '*'); //code:0更新渲染UI
    }

    render() {
        console.log("this.props.myData",this.props.myData)
        return (
            this.props.myData.processon == undefined ? "暂无数据" :
            <div>
                <iframe
                    src="/static/strategy/html/index/flow/flow2.html"
                    frameBorder="0"
                    scrolling="no"
                    id="myiframe"
                    className="myiframe"
                    name="myiframe"
                    width="100%"
                    height={'600px'}
                    onLoad={() => {
                        EditorStore.getDetailForApi2(this.props.myData);
                        this.updateIframeData();
                    }}

                ></iframe>
            </div>
        )
    }
}

DecisionPathsDetails.propTypes = {}

DecisionPathsDetails.defaultProps = {}

export default DecisionPathsDetails