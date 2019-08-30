import React from 'react';
import { observer, inject } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { Tree, Icon, Modal, message } from 'antd';
import AddAndSub from '@/components/AddAndSub';
import '@/styles/system/auth/power/catalog';

const { TreeNode } = Tree;

@inject('store')
@observer
class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
    }

    onDragEnter = (info) => {
        // message.info("拖拽可改变当前结构位置")
        console.log("onDragEnter", info);

        if (localStorage.dragTips != 0) {
            Modal.confirm({
                title: '拖拽可改变当前结构位置',
                content: '',
                cancelText: '不再提示',
                okText: '我知道了',
                onOk() {
                    console.log('我知道了');
                },
                onCancel() {
                    console.log('不再提示');
                    localStorage.dragTips = 0;
                },
            });
        }


    }

    onDrop = (info) => {
        console.log("onDrop", info);
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.childs) {
                    return loop(item.childs, key, callback);
                }
            });
        };
        const data = [...this.props.store.tree.getData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.childs = item.childs || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.childs.push(dragObj);
            });
        } else if (
            (info.node.props.childs || []).length > 0 // Has childs
            && info.node.props.expanded // Is expanded
            && dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.childs = item.childs || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.childs.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        //这里更新拖拽后的数据
        this.props.store.tree.setData(data);
        console.log("这里更新拖拽后的数据", common.deepClone(data));

        let fromId = info.dragNode.props.id;
        let toId = info.node.props.id;

        let fromKey = info.dragNode.props.eventKey;
        let toKey = info.node.props.eventKey;
        let tree = this.props.store.tree.getData;
        let ids = [];

        if (fromKey.substr(0, fromKey.length - 1) === toKey.substr(0, fromKey.length - 1) && fromKey.length === toKey.length) {
            //同级排序
            let keyLength = fromKey.length;
            if (keyLength === 1) {
                //第一级同级拖动
                tree.forEach(element => {
                    ids.push(element.id);
                })
            } else if (keyLength > 1) {
                let keyArray = [];
                for (let i = 0; i < fromKey.split("-").length - 1; i++) {
                    const element = fromKey.split("-")[i];
                    keyArray.push(element);

                }
                console.log("keyArray = ", keyArray)
                let data = tree[keyArray[0]].child;
                if (keyArray.length > 1) {
                    getChild(1);
                }
                function getChild(index) {
                    data = data[keyArray[index]].child;
                    if (keyArray.length > index + 1) {
                        getChild(index + 1);
                    }
                }
                console.log("data = ", data)
                data.forEach(element => {
                    ids.push(element.id);
                })

            }
            toId = -1;
            fromId = -1;
        } else {
            //跨级拖动排序
            let keyLength = toKey.length;

            if (info.dropToGap) {//并行拖拽的方式 更正父级ID
                toId = info.node.props.parentId;
            }

            if (keyLength === 1) {
                //拖动到第一级
                tree.forEach(element => {
                    ids.push(element.id);
                })
            } else if (keyLength > 1) {
                let keyArray = [];
                for (let i = 0; i < toKey.split("-").length - 1; i++) {
                    const element = toKey.split("-")[i];
                    keyArray.push(element);

                }
                console.log("跨级拖动排序 keyArray = ", keyArray)
                let data;
                if (fromKey.length == 1) {//拖住的对象是第一级元素
                    if (Number(fromKey) < Number(toKey.split("-")[0])) {
                        data = tree[(Number(keyArray[0]) - 1)].child;
                    } else {
                        data = tree[keyArray[0]].child;
                    }
                }
                if (keyArray.length > 1) {
                    getChild(1);
                }
                function getChild(index) {
                    data = tree[keyArray[index]].child;
                    if (keyArray.length > index + 1) {
                        getChild(index + 1);
                    }
                }
                console.log("跨级拖动排序 data = ", data)
                data.forEach(element => {
                    ids.push(element.id);
                })

            }
        }

        console.log("parentId", toId);
        console.log("id", fromId);
        console.log("ids", ids);

        this.props.store.moveNodeForApi(fromId, toId, ids);
    }


    render() {

        const loop = data => data.map((item) => {
            if (item.childs && item.childs.length) {
                return <TreeNode
                    key={item.key}
                    id={item.id}
                    parentId={item.parentId}
                    title={
                        <div >
                            <span onClick={() => {
                                if (!publicUtils.isAuth('system:organization:view')) return
                                this.props.store.getDetailsByIdForApi(item.id);
                            }
                            }>{item.name}</span>
                            {
                                publicUtils.isAuth("system:organization:edit") ?
                                    <AddAndSub
                                        style={{ height: '20px', lineHeight: '20px', float: 'right', width: 'fit-content', padding: '0', margin: '0 0 0 10px' }}
                                        type="add-sub"
                                        add={() => { this.props.store.addOneMenu(item.id) }}
                                        sub={() => { this.props.store.deleteOneForApi(item.id) }}
                                    />
                                    :
                                    ''
                            }
                        </div>
                    }
                >{loop(item.childs)}</TreeNode>;
            }
            return <TreeNode
                key={item.id}
                id={item.id}
                parentId={item.parentId}
                title={
                    <div >
                        <span onClick={() => {
                            if (!publicUtils.isAuth('system:organization:view')) return
                            this.props.store.getDetailsByIdForApi(item.id);
                        }}>{item.name}</span>
                        {
                            publicUtils.isAuth("system:organization:edit") ?
                                <AddAndSub
                                    style={{ height: '20px', lineHeight: '20px', float: 'right', width: 'fit-content', padding: '0', margin: '0 0 0 10px' }}
                                    type="add-sub"
                                    add={() => { this.props.store.addOneMenu(item.id) }}
                                    sub={() => { this.props.store.deleteOneForApi(item.id) }}
                                />
                                :
                                ''
                        }
                    </div>
                }
            />;
        });

        return (
            <Tree
                className="draggable-tree"
                draggable={publicUtils.isAuth("system:organization:edit") ? true : false}
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                showLine={true}
                id="catalog-tree"
                // defaultExpandAll={true}
                defaultSelectedKeys={common.isEmpty(String(this.props.store.tree.getDefaultSelectEdNodeKey)) ? [] : [String(this.props.store.tree.getDefaultSelectEdNodeKey)]}
            >
                {loop(this.props.store.tree.getData)}
            </Tree>

        )
    }
}
export default Catalog

const gData = [{
    title: '策略中心',
    key: '0',
    children: [
        { title: '首页', key: '0-0' },
        {
            title: '变量管理', key: '0-1', children: [
                { title: '事件变量', key: '0-1-0' },
                { title: '批次变量', key: '0-1-1' },
                { title: '实时查询变量', key: '0-1-2' },
                { title: '衍生变量', key: '0-1-3' }
            ]
        },
        { title: '策略管理', key: '0-2' }
    ]
},
{
    title: '数据分析',
    key: '1',
    children: []
},
{
    title: '系统管理',
    key: '2',
    children: []
}];