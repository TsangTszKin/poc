import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Dropdown, Icon, Menu} from "antd";
import '@/styles/business/release/release.less'
import * as PropTypes from "prop-types";
import common from '@/utils/common';

@withRouter
class VersionControl extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
    }

    changeVersion = versionId => {
        if (this.props.match.params.id === String(versionId)) return ;
        this.props.history.push(this.props.changePath + versionId)
    };

    getCurrent = () => {
        const currentVersionId = this.props.match.params.id;
        const currentVersion = this.props.versions.find(item => item.id === currentVersionId);
        return common.isEmpty(currentVersion) ? '': currentVersion.version;
    };

    render() {
        const currentVersion = this.getCurrent();
        const { versions } = this.props;
        const menu = (
            <Menu className="dropdown-menu">
                {
                    versions.map((item, index) => {
                        return (
                            <Menu.Item key={index} onClick={() => this.changeVersion(item.id)}>
                                版本{item.version}
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        );
        return (
            <div className="version-select">
                <Dropdown overlay={menu}>
                    <Button htmlType="button">
                        版本{ currentVersion } <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        )
    }
}

export default VersionControl;

VersionControl.propTypes = {
    changePath: PropTypes.string.isRequired,
    versions: PropTypes.array.isRequired,
};
VersionControl.defaultProps = {
};