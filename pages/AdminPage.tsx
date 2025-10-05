
import React, { useState, useCallback, FormEvent } from 'react';
import { useLinkStore } from '../hooks/useLinkStore';

const ADMIN_PASSWORD = '1234';

const AdminLoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            onLogin();
        } else {
            setError('Incorrect password.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                <h1 className="text-4xl font-bold text-center text-white mb-2">Termitoon</h1>
                <p className="text-center text-red-200 mb-8">Admin Panel</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-red-200"
                    />
                    {error && <p className="text-red-300 text-sm mt-2 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { links, addLink, deleteLink } = useLinkStore();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notification, setNotification] = useState('');

    const handleAddLink = (e: FormEvent) => {
        e.preventDefault();
        addLink(title, url);
        setTitle('');
        setUrl('');
        showNotification('Link added successfully!');
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const copyToClipboard = (linkId: string) => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#/view/${linkId}`;
        navigator.clipboard.writeText(shareUrl);
        showNotification('Share link copied!');
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {notification && (
                <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-pulse">
                    {notification}
                </div>
            )}
            <h1 className="text-5xl font-bold text-center text-white mb-8 drop-shadow-lg">Admin Dashboard</h1>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Add New Link</h2>
                <form onSubmit={handleAddLink} className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="🎞  Video Title (e.g., Zootopia 2016)"
                        required
                        className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-red-200"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="🔗  Direct Video URL"
                        required
                        className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-red-200"
                    />
                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                        Add Link
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Existing Links</h2>
                {links.length > 0 ? (
                    links.map(link => (
                        <div key={link.id} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-bold text-lg truncate text-white">{link.title}</h3>
                                <p className="text-sm text-red-200 truncate">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                                <button onClick={() => copyToClipboard(link.id)} className="flex-1 sm:flex-none w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm">Copy</button>
                                <button onClick={() => deleteLink(link.id)} className="flex-1 sm:flex-none w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-red-200 py-8">No links added yet.</p>
                )}
            </div>
        </div>
    );
};


const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('termitoon-auth') === 'true');

    const handleLogin = () => {
        sessionStorage.setItem('termitoon-auth', 'true');
        setIsAuthenticated(true);
    };

    return isAuthenticated ? <AdminDashboard /> : <AdminLoginPage onLogin={handleLogin} />;
};

export default AdminPage;
