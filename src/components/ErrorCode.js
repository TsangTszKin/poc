import React from 'react';
import { notification, Button } from 'antd';
import LoginBg from '@/assets/login-bg.png';
import error from '@/assets/error.png';
import error500pic from '@/assets/500pic.png';
import error500number from '@/assets/500number.png';
import { withRouter } from 'react-router-dom';

@withRouter
class ErrorCode extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='panel' style={{ position: 'relative', height: '100%' }}>
                <div style={{ position: 'absolute', height: '200px', width: '450px', top: '50%', left: '50%', marginTop: '-160px', marginLeft: '-225px', cursor: 'pointer' }}>
                    <div style={{ float: 'left', width: '200px', height: '100%' }}>
                        <img src={error500pic} style={{ height: '200px', width: '200px' }} />
                    </div>
                    <div style={{ float: 'right', width: '181px', height: '100%', paddingTop: '20px' }}>
                        <img src={error500number} style={{ height: '68px', width: '153px' }} />
                        <p style={{ height: '68px', lineHeight: '68px', margin: '0', fontFamily: '"Microsoft YaHei"', fontSize: '20px', color: '#000', opacity: '0.43' }}>抱歉，服务器出错了</p>
                        <Button type="primary" onClick={() => {
                            window.location.reload();
                        }}>刷新</Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default ErrorCode;