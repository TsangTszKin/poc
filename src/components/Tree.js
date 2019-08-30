import React, { Component } from "react"
import { Icon, Select } from 'antd'
import '@/styles/tree.less'

class Tree extends Component {
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    render() {
        return (
            <div className="cell"><Icon type="setting" />
                <div className="cell-body">
                    是否活动卡（批次变量） 等于 是
                </div>
            </div>
        )
    }
}

export default Tree