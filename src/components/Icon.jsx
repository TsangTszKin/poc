/*
 * @Author: zengzijian
 * @Date: 2019-06-15 11:02:08
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-15 11:26:20
 * @Description: 
 */
import React from 'react'
import PropTypes, { oneOf } from 'prop-types'

export class Icon extends React.Component {
    render() {
        return (
            (() => {
                switch (this.props.type) {
                    case 'font-class':
                        if (this.props.havePopup) {
                            return <p><span className={`iconfont ${this.props.code}`} title={this.props.title} style={this.props.style}></span></p>
                        } else {
                            return <span className={`iconfont ${this.props.code}`} title={this.props.title} style={this.props.style}></span>
                        }
                    case 'symbol':
                        return <svg className="icon icon-svg" aria-hidden="true">
                            <use xlinkHref={this.props.code} />
                        </svg>
                    default:
                        return <span></span>
                }
            })()
        )
    }
}
Icon.propTypes = {
    type: PropTypes.oneOf(['font-class', 'symbol']),
    style: PropTypes.object,
    havePopup: PropTypes.bool,
    code: PropTypes.string,//iconfont对应的代码标识
    title: PropTypes.string
}
Icon.defaultProps = {
    type: 'font-class',
    style: {},
    havePopup: false,
    code: '',
    title: ''
}
export default Icon
