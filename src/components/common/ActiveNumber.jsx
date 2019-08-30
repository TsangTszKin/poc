import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from "@/utils/common";

class ActiveNumber extends Component {
    state = {
        currentNumber: 0,
        showNumber: 0,
        value: 0,
    };

    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            // console.log('nextProps.value', nextProps.value);
            if (this.interval) clearInterval(this.interval);
            this.init(nextProps);
        }
    }

    componentDidMount() {
        // console.log(111);
        this.init(this.props);
    }

    init = props => {
        let { delay = 300, value, formatNumber = false } = props;
        // console.log(delay, value);
        let time = delay / value;
        let step, stepCount;
        // 最短每30ms为一帧
        if (time > 30) {
            step = value / delay;
            stepCount = delay / time;
        } else {
            time = 30;
            stepCount = delay / 30;
            step = value / stepCount;
        }
        // console.log('time', time);
        // console.log('expectStep', step);
        // console.log('stepCount', stepCount);
        // let startTime = new Date();
        let decrease = step / stepCount;
        let change = step * 1.5;
        this.interval = setInterval(() => {
            // console.log(change);
            change = change > 1 ? change : 1;
            let currentNumber = this.state.currentNumber + change;
            currentNumber = currentNumber > value ? value : currentNumber;
            if (currentNumber >= value) {
                clearInterval(this.interval);
                // let endTime = new Date();
                // console.log('实际耗时：', endTime - startTime);
            }
            this.setState({ currentNumber });
            const showNumber = currentNumber.toString().split('.')[0];
            if (formatNumber) this.setState({ showNumber: common.formatNumber(showNumber) });
            else this.setState({ showNumber });
            change -= decrease;
        }, time);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
        let { className = '' } = this.props;
        return (
            <span className={ className }>
                { this.state.showNumber }
            </span>
        );
    }
}

export default ActiveNumber;

ActiveNumber.propTypes = {
    className: PropTypes.string,
    delay: PropTypes.number,
    formatNumber: PropTypes.bool,
    value: PropTypes.number.isRequired
};

ActiveNumber.defaultProps = {
    className: '',
    delay: 300,
    formatNumber: false,
    value: 0
};
