import React from 'react';
import { TreeSelect } from 'antd';
import organizationService from '@/api/system/auth/organizationService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import OrganizationCell from '@/components/system/auth/member/OrganizationCell';

const TreeNode = TreeSelect.TreeNode;

class OrganizationPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: [],
            index: 0
        }
    }

    componentDidMount() {
        let self = this;
        organizationService.getTree().then(res => {
            // if (!publicUtils.isOk(res)) return
            self.setState({
                tree: res.data.result
            })
            console.log("res.data.result", res.data.result)
        }).catch(() => { })
    }

    render() {
        console.log("this.state.tree", this.state.tree)
        return (
            <TreeSelect
                showSearch
                style={{ width: 300 }}
                // value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
            // onChange={this.onChange}
            >
                {
                    this.props.tree.map((item, i) =>
                        <OrganizationCell item={item} ></OrganizationCell>
                    )
                }
            </TreeSelect>
        )
    }
}
export default OrganizationPicker