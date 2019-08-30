import React from 'react';
import { notification, Button, Icon } from 'antd';
import LoginBg from '@/assets/login-bg.png';
import errorPage from '@/assets/404.png';
import { withRouter } from 'react-router-dom';

@withRouter
class Error404 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='panel'>
                <div className="pageContent" style={{ backgroundImage: 'url(' + LoginBg + ')', position: 'relative', height: '100%' }}>
                    <Button type="primary" onClick={() => { this.props.history.push('/'); window.location.reload(); }}>
                        <Icon type="left" />返回首页
                    </Button>
                    <img src={errorPage} style={{ position: 'absolute', height: '250px', width: '250px', top: '50%', left: '50%', marginTop: '-185px', marginLeft: '-125px' }} />
                </div>
            </div>
        )
    }
}
export default Error404;