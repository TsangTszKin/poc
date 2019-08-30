/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-10-12 16:59:50
 * @Description: 
 */
import React from 'react';
import ErrorCode from '@/components/ErrorCode';

const DelayLoading = ({ pastDelay, error }) => {
    if (pastDelay) {
        return <div>Loading...</div>
    } else if (error) {
        console.log(error);
        return (
            <ErrorCode />
        );
    } else {
        return null;
    }
}
export default DelayLoading