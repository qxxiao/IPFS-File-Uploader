import React from 'react';
import './header.css';

function MyHeader() {
    return (
        <div className="header-div">
            <div className="header-img">
                <img src={'./imgs/ipfs.png'} alt="logo" />
            </div>
            <div className="header-title">IPFS-File-Uploader</div>

            <div className="header-link gateway">
                <a
                    className="link"
                    href="https://ipfs.github.io/public-gateway-checker/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Gateway
                </a>
            </div>

            <div className="header-link github">
                <a
                    className="link"
                    href="https://github.com/qxxiao/IPFS-File-Uploader"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </div>
        </div>
    );
}

export default MyHeader;
