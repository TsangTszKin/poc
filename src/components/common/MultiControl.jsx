import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Menu, Modal } from "antd";
import common from "@/utils/common";

const { Item } = Menu;


class MultiControl extends Component {
    state = {};

    handleClick = (
        {
            callback,
            isShowConfirm,
            label,
            confirmIcon
        }) => {
        const { selectedKeys } = this.props;
        if (common.isEmpty(selectedKeys)) {
            Modal.warning({ title: '系统提示', content: '未勾选' });
            return;
        }
        if (isShowConfirm) {
            Modal.confirm({
                title: '系统提示',
                content: `确定要批量${ label }吗?`,
                onOk: () => callback(selectedKeys),
                icon: confirmIcon
            })
        } else {
            callback(selectedKeys);
        }
    };

    render() {
        const {
            selectedKeys,
            items,
            hideWhenEmpty,
            style,
            text,
            disabled,
            hidden,
            showConfirm,
        } = this.props;

        const isDisabled = common.isEmpty(selectedKeys) || disabled;
        const isHideButton = (hideWhenEmpty && common.isEmpty(selectedKeys)) || isDisabled || hidden;
        const defaultIcon = <Icon type="question-circle" />;
        let menu = (
            <Menu>
                {
                    items.map(item => {
                        // items属性
                        let {
                            // 选项文字
                            label = '操作',
                            // 点击回调
                            // 注意：会将selectedKey作为参数执行，
                            // 传入items元素可以再写一个函数包裹{ callback: selectedKeys => this.multiDelete() }以防参数影响
                            callback = () => {},
                            // 是否显示确认弹窗
                            isShowConfirm = false,
                            // 操作权限
                            auth = true,
                            // 弹窗Icon, string或ReactNode
                            confirmIcon = defaultIcon,
                        } = item;
                        if (!common.isEmpty(label))
                            return (
                                <Item
                                    title={ auth ? '' : '没有权限' }
                                    disabled={ !auth }
                                    onClick={
                                        () => this.handleClick({
                                            label,
                                            callback,
                                            isShowConfirm: isShowConfirm || showConfirm,
                                            confirmIcon,
                                        })
                                    }
                                >{ label }</Item>
                            )
                    })
                }
            </Menu>
        );

        return (
            <Dropdown
                placement="bottomLeft"
                overlay={ menu }
                disabled={ isDisabled }
            >
                <Button
                    title="请勾选后进行操作"
                    style={ isHideButton ? { display: 'none', ...style } : style }
                    htmlType="button"
                >
                    { text }
                    <Icon type="down"/>
                </Button>
            </Dropdown>
        );
    }
}

MultiControl.propTypes = {
    items: PropTypes.array.isRequired, // 每个item为一个选项
    hideWhenEmpty: PropTypes.bool, // 当items为空的时候隐藏批量操作
    text: PropTypes.string, // 批量操作按钮显示文字
    selectedKeys: PropTypes.array.isRequired, // 表格选中的keys数组
    hidden: PropTypes.bool, // 是否隐藏按钮
    disabled: PropTypes.bool, // 菜单不可用
    showConfirm: PropTypes.bool, // 操作时是否弹窗确认
};

MultiControl.defaultProps = {
    items: [],
    hideWhenEmpty: true,
    text: '批量操作',
    selectedKeys: [],
    hidden: false,
    disabled: false,
    showConfirm: false,
};

// class MenuItem extends Component {
//     constructor(props) {
//         super(props);
//
//     }
//
//     render() {
//         let {
//             label,
//             callback,
//             isShowConfirm,
//             auth,
//             className,
//             style,
//         } = this.props;
//         return (
//             <Item
//                 title={ auth ? '' : '没有权限' }
//                 disabled={ !auth }
//                 onClick={ () => this.handleClick(callback, isShowConfirm || showConfirm, label) }
//             >{ label }</Item>
//         );
//     }
// }
// MenuItem.propTypes = {
//     label: PropTypes.string,
//     callback: PropTypes.func.isRequired,
//     isShowConfirm: PropTypes.bool,
//     auth: PropTypes.bool,
// };
//
// MenuItem.defaultProps = {
//     label: '',
//     callback: () => {},
//     isShowConfirm: false,
//     auth: true,
// };

export default MultiControl;
