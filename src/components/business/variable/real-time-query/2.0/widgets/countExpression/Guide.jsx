import React, { Component } from 'react';
import PropTypes from 'prop-types';
import guideImg from '@/assets/componnents/rtqvar-comput-guide.png';

class Guide extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <Fragment >
            //     <Steps current={this.props.current - 1} size="small">
            //         {steps.map(item => (
            //             <Step key={item.title} title={item.title} />
            //         ))}
            //     </Steps>
            //     <div style={style.stepsContent}>{steps[this.props.current - 1].content}</div>
            // </Fragment>
            <div style={{ background: 'url(' + guideImg + ') center center', height: '223px', width: '770px' }}>

            </div>
        );
    }
}

Guide.propTypes = {
    current: PropTypes.number
};
Guide.defaultProps = {
    current: 1
}
export default Guide;

// eslint-disable-next-line no-unused-vars
const style = {
    stepsContent: {
        marginTop: '16px',
        border: '1px dashed #e9e9e9',
        borderRadius: '6px',
        backgroundColor: ' #fafafa',
        minHeight: '200px',
        textAlign: 'center',
        paddingTop: '80px'
    },
    cell1: {
        display: 'inline-block',
        height: '30px',
        width: '18px',
        border: '1px solid red',
        padding: '3px',
        position: 'relative',
        top: '5px'
    },
    cell2: {
        display: 'inline-block',
        height: '21px',
        width: '10px',
        border: '1px dotted',
        borderRadius: '3px'
    },
    cell3: {
        display: 'inline-block',
        width: '88px',
        border: '1px solid red',
        padding: '3px',
        margin: '5px 20px'
    },
    cellEmpty: {
        display: 'inline-block',
        width: '10px',
        height: '22px'
    }
}


