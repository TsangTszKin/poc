/**
 * 进度条属性：
 * className 最外层附加class
 * percent 百分比，必填，number类型
 * color 进度条颜色
 * animation 是否显示过渡
 * delay 过渡时间
 */
import React, {Component} from "react";
import '@/styles/analysis/data-graphics.less';
import * as PropTypes from "prop-types";

class ProcessBar extends Component {
    state = {
        percent: 0
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        let { percent, animation, delay } = this.props;
        if(percent > 100) percent = 100;
        if(percent < 0) percent = 0;
        if(animation) {
            this.tiemout = setTimeout(() => this.setState({ percent }), delay);
        } else {
            this.setState({ percent });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.percent !== this.props.percent) {
            if(this.tiemout) clearTimeout(this.tiemout);
            this.setState({ percent: nextProps.percent })
        }
    }


    componentWillUnmount() {
        if(this.tiemout) clearTimeout(this.tiemout);
    }

    render() {
        let { className, color, children, title } = this.props;
        return (
            <div className={`process-bar-wrapper ${className}`} title={ title }>
                <div className='process-bar'>
                    <div className="process-bar-current" style={{width: `${this.state.percent}%`, backgroundColor: color}}>
                        <i className="process-bar-dot-1" style={{backgroundColor: color}} />
                        <i className="process-bar-dot-2" style={{backgroundColor: color}} />
                    </div>
                </div>
                <div className="process-text">{this.state.percent}%
                    { children }
                </div>
            </div>
        );
    }
}

export default ProcessBar;

ProcessBar.propTypes = {
    color: PropTypes.string,
    percent: PropTypes.number.isRequired,
    className: PropTypes.string,
    animation: PropTypes.bool,
    delay: PropTypes.number
};

ProcessBar.defaultProps = {
    color: '#ff6600',
    percent: 0,
    className: '',
    title: '',
    animation: false,
    delay: 300,
}