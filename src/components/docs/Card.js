import React from 'react';
import { Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function NavCard({ title, url, description }) {
    return (
        <Card style={{ width: 400 }}>
            <ArrowRightOutlined style={{ paddingBottom: '15px' }} />
            <a href={url}><h4 style={{ fontSize: '20px' }} >{title}</h4></a>
            <p style={{ fontSize: '15px' }} >{description}</p>
        </Card>
    );
}