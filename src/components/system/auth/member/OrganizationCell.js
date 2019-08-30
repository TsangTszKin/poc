import React from 'react';
import { TreeSelect } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import OrganizationCellCopy from '@/components/system/auth/member/OrganizationCell';

const TreeNode = TreeSelect.TreeNode;

class OrganizationCell extends React.Component {
    constructor(props) {
        super(props);
        console.log("this.props.item", this.props.item)
    }


    render() {
        
        return (
            <TreeNode value={this.props.item.code} title={this.props.item.name} key={String(this.props.item.id)}>
                {
                    !common.isEmpty(this.props.item.childs) ?
                        this.props.item.childs.map((item, i) =>
                            <OrganizationCellCopy item={item} />
                        ) : ''
                }
            </TreeNode>
        )
    }
}
export default OrganizationCell
