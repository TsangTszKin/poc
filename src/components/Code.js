/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:21
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-27 18:03:17
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/theme/idea.css';
import '@/styles/code.less';

import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/idea.css';

class Code extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            sqlCode: this.props.sqlCode
        }
    }
    componentDidMount() {
        this.setState({
            isLoading: false
        })
    }

    changeCode = (code) => {
        this.setState({
            sqlCode: code
        })
    }

    componentWillUpdate(nextProps) {
        if (nextProps.sqlCode != this.props.sqlCode) {
            this.setState({
                sqlCode: nextProps.sqlCode
            })
        }
    }

    render() {
        const options = {
            lineNumbers: true,                     //显示行号  
            mode: { name: "text/x-mysql" },          //定义mode  
            extraKeys: this.props.type === 1 ? {} : { "Ctrl": "autocomplete" },   //自动提示配置  
            // theme: this.props.type === 1 ? 'duotone-light' : 'idea',//选中的theme  
            theme: 'idea',//选中的theme  
            cursorHeight: this.props.type === 1 ? 0 : 1
        };
        let self = this;
        return (
            <div>
                <Spin spinning={this.state.isLoading} size="small">
                    {
                        this.props.type === 1 ?
                            <CodeMirror
                                value={this.state.sqlCode}
                                onChange={(editor, value) => {
                                    console.log({ editor }, { value });
                                }}
                                options={options}
                                height="auto"
                            />
                            :
                            <CodeMirror
                                value={this.props.sqlCode}
                                onChange={(editor, value) => {
                                    console.log({ editor }, { value });
                                }}
                                onBeforeChange={(editor, data, value) => {
                                    console.log(value);
                                    this.props.changeCode(value);
                                }}
                                options={options}
                                onFocus={() => {
                                    if (!localStorage.isFirstUseSqlCodeEdtor && this.props.type !== 1) {
                                        message.info("按Ctrl有sql关键字提示~", 5);
                                        localStorage.isFirstUseSqlCodeEdtor = "1";
                                    }
                                }}
                                height="auto"
                            />
                    }

                </Spin>
            </div>
        )
    }
}
Code.propTypes = {
    sqlCode: PropTypes.string,
    type: PropTypes.oneOf([1, 2]),//1是只读模式，2是读写模式
    changeCode: PropTypes.func
}
Code.defaultProps = {
    sqlCode: '',
    type: 1
}
export default Code;