import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import TreeCopy from '@/components/process-tree/TreeStatic';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

@withRouter
class ProcessTreeStatic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNodeId: ''
        }
        console.log(" this.props.node", this.props.node);
        this.props.node.active ? this.style = { color: 'red' } : this.style = {};
        if (!common.isEmpty(this.props.match.params.type)) {
            if (this.props.match.params.type === 'greedy') {
                if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
                    this.style = { color: '#000', opacity: '0.45' }
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
        nextProps.node.active ? this.style = { color: 'red' } : this.style = {};
        if (!common.isEmpty(this.props.match.params.type)) {
            if (this.props.match.params.type === 'greedy') {
                if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
                    this.style = { color: '#000', opacity: '0.45' }
                }
            }
        }
    }


    render() {
        return (
            <li className="node">
                {
                    this.props.nodeKey === 0 ? '' : this.props.nodeKey == '0-0' ? <div style={{ height: '21px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-10px' }}></div> : <div style={{ height: '22px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-11px' }}></div>
                }
                {
                    this.props.nodeKey !== 0 ? <p style={{ width: 'fit-content', float: 'left', marginBottom: 0 }}>--</p> : ''
                }
                <div className="node-bus" style={{ marginLeft: this.props.nodeKey === 0 ? '11px' : 0 }}>

                    <div className="node-body" style={this.style} onClick={() => this.activeFunc(this.props.nodeKey, this.props.node.type, this.props.node.secondType, this.props.node.id, this.props.node.mold && this.props.node.mold == 'ruleSet' ? true : false)} >
                        {(() => {
                            if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
                                return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                            } else {
                                switch (this.props.node.type) {
                                    case -1:
                                        return <Icon type="folder-open" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 0:
                                        return <Icon type="dashboard" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 1:
                                        if (this.props.node.secondType === 2) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 4) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 3) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 0) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 1) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })()
                        }
                        <span title={this.props.node.name} className="node-name">{this.props.node.name}</span>
                    </div>


                </div>

                {
                    this.props.node.nodes ?
                        <ul className="node-panel">
                            {this.props.node.nodes.map((item, i) =>
                                <TreeCopy node={item}></TreeCopy>
                            )}
                        </ul> : ''
                }
            </li>
        )
    }
}

export default ProcessTreeStatic;