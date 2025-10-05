
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLinkStore } from '../hooks/useLinkStore';
import type { Link } from '../types';

const VlcIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.89 3.23l2.93 5.08L24 19.8l-8.22-4.75-.01 4.75-2.89-5.09L4.69 3.23h8.2zM11.1 20.77L0 4.23l8.22 4.75.01-4.75 2.89 5.09 8.19 11.45h-8.22z" />
    </svg>
);

const AndroidIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.42 1.34c.95-.31 1.94-.31 2.89 0l.23.08c1.33.42 2.37 1.46 2.79 2.79l.08.23c.31.95.31 1.94 0 2.89l-.08.23c-.42 1.33-1.46 2.37-2.79 2.79l-.23.08c-.95.31-1.94.31-2.89 0l-.23-.08c-1.33-.42-2.37-1.46-2.79-2.79l-.08-.23c-.31-.95-.31-1.94 0-2.89l.08-.23c.42-1.33 1.46-2.37 2.79-2.79l.23-.08zM6.58 1.34c.95-.31 1.94-.31 2.89 0l.23.08c1.33.42 2.37 1.46 2.79 2.79l.08.23c.31.95.31 1.94 0 2.89l-.08.23c-.42-1.33-1.46-2.37-2.79-2.79l-.23-.08c-.95-.31-1.94-.31-2.89 0l-.23.08c-1.33.42-2.37 1.46-2.79 2.79l-.08.23c-.31-.95-.31-1.94 0-2.89l.08-.23c.42-1.33 1.46-2.37 2.79-2.79l.23-.08zM19 12v7c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-7h14zM4 11V9c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2H4z" />
    </svg>
);


const ViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getLinkById } = useLinkStore();
    const [link, setLink] = useState<Link | null | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const foundLink = getLinkById(id);
            setLink(foundLink);

            if (foundLink) {
                const ua = navigator.userAgent.toLowerCase();
                const isIOS = /iphone|ipad|ipod/.test(ua);
                const isAndroid = /android/.test(ua);
                const isDesktop = !isIOS && !isAndroid;

                if (isIOS) {
                    const vlcUrl = `vlc://${foundLink.url.replace(/^https?:\/\//, '')}`;
                    window.location.href = vlcUrl;
                } else if (isAndroid) {
                    window.location.href = foundLink.url;
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, getLinkById]);

    if (link === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl">
                Loading...
            </div>
        );
    }

    if (link === null) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-2xl text-red-200">Link not found or has been deleted.</p>
                </div>
            </div>
        );
    }
    
    const openForIOS = () => {
        const vlcUrl = `vlc://${link.url.replace(/^https?:\/\//, '')}`;
        window.location.href = vlcUrl;
    };
    
    const openForAndroid = () => {
        window.location.href = link.url;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-red-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-rose-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse delay-1000"></div>

            <div className="z-10 w-full max-w-md">
                <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg mb-4">
                    Termitoon
                </h1>
                <p className="text-lg text-red-200 mb-8">
                    If the video doesn't open automatically, use the buttons below.
                </p>

                <div className="space-y-4">
                     <button 
                        onClick={openForIOS}
                        className="w-full bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg p-4 flex items-center justify-center text-left transform transition duration-300 hover:scale-105 hover:bg-white"
                     >
                        <VlcIcon />
                        <div>
                            <span className="font-bold text-xl">Open with VLC</span>
                            <span className="block text-sm text-gray-600">For iPhone / iPad</span>
                        </div>
                    </button>
                    
                    <button 
                        onClick={openForAndroid}
                        className="w-full bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg p-4 flex items-center justify-center text-left transform transition duration-300 hover:scale-105 hover:bg-white"
                    >
                        <AndroidIcon />
                        <div>
                            <span className="font-bold text-xl">Open with Player</span>
                             <span className="block text-sm text-gray-600">For Android Devices</span>
                        </div>
                    </button>
                </div>

                <p className="mt-12 text-base text-red-200/80 break-words">
                    🎬 {link.title}
                </p>
            </div>
        </div>
    );
};

export default ViewPage;
