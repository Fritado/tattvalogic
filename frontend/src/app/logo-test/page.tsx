import React from 'react';
import Image from 'next/image';

export default function LogoDisplay() {
    return (
        <div style={{ padding: '50px', backgroundColor: '#fff', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '600px', height: '200px' }}>
                <Image
                    src="/TattvaLogic.png"
                    alt="TattvaLogic Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}
