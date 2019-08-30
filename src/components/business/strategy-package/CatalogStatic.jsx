import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { Tree, Icon, Switch } from 'antd';
import AddAndSub from '@/components/AddAndSub';
import '@/styles/system/auth/power/catalog';
import PropTypes from 'prop-types'


@inject('store')
@observer
class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <Fragment >
                {
                    this.props.store.tree.get_data.length === 0 ? '' :
                        <Tree.DirectoryTree
                            defaultExpandAll={true}
                            // selectedKeys={this.state.selectedKeys}
                            defaultSelectedKeys={['0-0']}
                            onSelect={(selectedKeys, e) => {
                                console.log(selectedKeys, e)
                                const props = e.node.props;
                                if (props.type === 2) {
                                    this.props.store.getStrategypackageWeightDetailForApi(props.id);
                                }
                            }}>
                            {
                                this.props.store.tree.get_data.map((item, i) =>
                                    <Tree.TreeNode
                                        selectable={false}
                                        title={<span>{item.eventSourceName}
                                            {
                                                publicUtils.isAuth("business:release:strategy:weight:edit") ?
                                                    <Switch
                                                        checked={item.enabledWeight}
                                                        style={{ marginLeft: '28px' }}
                                                        size="small"
                                                        onChange={(checked) => this.props.store.strategypackageWeightSwitchForApi(checked, item.eventSourceId)}
                                                    />
                                                    :
                                                    item.enabledWeight ? '（开启）' : '（关闭）'
                                            }
                                        </span>} key={`${i}`} type={1} >
                                        {
                                            item.packages.map((item2, j) => {
                                                let name = common.cutString(item2.name, 10);
                                                if (item2.weight) {
                                                    name += `(${item2.weight})`
                                                }
                                                return <Tree.TreeNode title={name} key={`${i}-${j}`} id={item2.id} type={2} />
                                            }
                                            )
                                        }
                                    </Tree.TreeNode>
                                )
                            }
                        </Tree.DirectoryTree>
                }
            </Fragment>
        )
    }
}
Catalog.propTypes = {
    clickCallBack1: PropTypes.func,
    clickCallBack2: PropTypes.func,
}
Catalog.defaultProps = {
    clickCallBack1: () => { },
    clickCallBack2: () => { }
}
export default Catalog