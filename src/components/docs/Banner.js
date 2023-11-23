import { Image } from 'antd';
import React, { useState } from 'react';
import bannerImage from './images/get-to-know-shesha-banner.png';

export default function Banner({ }) {
    const [showImage, setShowImage] = useState(true);

    const handleClick = () => {
        setShowImage(false);
    };

    return (
        <div>
            {showImage ? (
                <Image
                    src={bannerImage}
                    alt="Clickable Image"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                    width={900}
                    preview={false}
                />
            ) : (
                <iframe
                    title="Embedded Iframe"
                    src="https://www.youtube.com/embed/JGy7lc5WAwE?autoplay=1&controls=0"
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

