
import { useState, useEffect, useCallback } from 'react';
import type { Link } from '../types';

const STORAGE_KEY = 'termitoon-links';

export const useLinkStore = () => {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    try {
      const storedLinks = localStorage.getItem(STORAGE_KEY);
      if (storedLinks) {
        setLinks(JSON.parse(storedLinks));
      }
    } catch (error) {
      console.error("Failed to parse links from localStorage", error);
      setLinks([]);
    }
  }, []);

  const saveLinks = useCallback((newLinks: Link[]) => {
    // Sort by most recent first before saving
    const sortedLinks = newLinks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setLinks(sortedLinks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedLinks));
  }, []);

  const addLink = useCallback((title: string, url: string) => {
    if (!title.trim() || !url.trim()) return;
    const newLink: Link = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title,
      url,
      createdAt: new Date().toISOString(),
    };
    saveLinks([...links, newLink]);
  }, [links, saveLinks]);

  const deleteLink = useCallback((id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  }, [links, saveLinks]);
  
  const getLinkById = useCallback((id: string): Link | undefined => {
      // Re-read from storage to ensure we get the latest even if state hasn't updated
      const storedLinks = localStorage.getItem(STORAGE_KEY);
      if (storedLinks) {
          const parsedLinks: Link[] = JSON.parse(storedLinks);
          return parsedLinks.find(link => link.id === id);
      }
      return undefined;
  }, []);

  return { links, addLink, deleteLink, getLinkById };
};
