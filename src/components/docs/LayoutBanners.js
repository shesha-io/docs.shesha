import { Image } from 'antd';
import React, { useState } from 'react';

const banners = {

};

export default function LayoutBanners({ url, type }) {
    const [showImage, setShowImage] = useState(false);

    const handleClick = () => {
        setShowImage(false);
    };

    return (
        <div>
            {showImage ? (
                <Image
                    src={banners[type]}
                    alt="Clickable Image"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                    width={900}
                    preview={false}
                />
            ) : (
                <iframe
                    title="Embedded Iframe"
                    src={url}
                    width="100%"
                    height="500"
                    allowFullScreen
                    autoPlay
                ></iframe>
            )}
        </div>
    );
};
