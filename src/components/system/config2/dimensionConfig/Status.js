import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import common from '@/utils/common';

class Status extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="status" style={this.props.style}>
                {
                    (() => {
                        switch (this.props.status) {
                            case 0:
                                return <div><p className="status-label ing"></p><p className="status-name">未同步</p>
                                </div>
                            case 1:
                                return <div><p className="status-label online"></p><p
                                    className="status-name status-name-active">已同步</p></div>
                            case 2:
                                return <div><p className="status-label error"></p><p className="status-name">上线失败</p>
                                </div>
                            case 3:
                                return <div><p className="status-label error"></p><p className="status-name">下线失败</p>
                                </div>
                            case 4:
                                return <div><p className="status-label online"></p><p className="status-name status-name-active">已发布</p></div>
                            case 5:
                                return <div><p className="status-label error"></p><p className="status-name">删除失败</p>
                                </div>
                            case 6:
                                return <div><p className="status-label error"></p><p className="status-name">已出错</p></div>
                            case 7:
                                return <div><p className="status-label error"></p><p className="status-name  status-name-active">发布中</p></div>
                            default:
                                break;
                        }
                    })()
                }
                {/*  {
                    this.props.statusList.map((item, i) =>
                            this.props.status == item.code ?
                                <div><p className="status-label ing"></p><p className="status-name">{item.value}</p>
                                </div>
                                : ''
                    )
                }*/}

            </div>
        )
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired,
    style: PropTypes.object
}
Status.defaultProps = {
    style: {}
}
export default Status