import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Menu, Radio } from "antd";

class RadioDropdownButton extends Component {

    handleChangRadio = e => {
        const {
            onChange = () => {
            }
        } = this.props;
        onChange(e);
    };

    render() {
        const { value, data, className, } = this.props;
        const menu = <Menu>
            {
                data.slice(1).map(item =>
                    <Menu.Item>
                        <Radio.Button value={ item.value }>{ item.text }</Radio.Button>
                    </Menu.Item>
                )
            }
        </Menu>;

        return (
            <Radio.Group
                className={ className }
                value={ value }
                onChange={ this.handleChangRadio }
            >
                { data.length > 0 ?
                    <Radio.Button value={ data[0].value }>{ data[0].text }</Radio.Button>
                    : ''
                }
                { data.length > 1 ?
                    <Dropdown overlay={ menu } value={ 0 } placement="bottomRight">
                        <Button className="radio-dropdown-button" htmlType="button">
                            <Icon type="ellipsis"/>
                        </Button>
                    </Dropdown>
                    : ''
                }
            </Radio.Group>
        );
    }
}

RadioDropdownButton.propTypes = {
    data: PropTypes.array.isRequired
};

export default RadioDropdownButton;
