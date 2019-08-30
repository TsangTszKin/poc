import React, { Component } from 'react';
import PropTypes from 'prop=types';
import { Modal } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

class Test extends Component {
  constructor(props) {
    super(props);
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    )
  }
}
Test.propTypes = {
  show: PropTypes.bool
}
Test.defaultProps = {}
export default Test;