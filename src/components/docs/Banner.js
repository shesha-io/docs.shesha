import { Image } from 'antd';
import React, { useState } from 'react';
import bannerImage from './images/get-to-know-shesha-banner.png';
import membershipBanner from './images/membership-management-banner.png';

export default function Banner({ url, type }) {
    const [showImage, setShowImage] = useState(true);

    const handleClick = () => {
        setShowImage(false);
    };

    return (
        <div>
            {showImage ? (
                <Image
                    src={type == 1 ? bannerImage : membershipBanner}
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
                    frameBorder="0"
                    allowFullScreen
                    autoPlay  // Add autoPlay attribute to start playing instantly
                ></iframe>
            )}
        </div>
    );
};

