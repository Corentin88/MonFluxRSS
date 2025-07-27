"use client";
import { useState, useEffect } from 'react';

export default function SelectFlux({ value, onChange }) {
    const types = ['veille techno', 'jeux video', 'cuisine', 'science et spatial'];
    const [feeds, setFeeds] = useState([]);
  
    useEffect(() => {
      fetch(`/api/feed_sources?type=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => setFeeds(data['hydra:member'] || []));
    }, [value]);
  
    return (
      <div className="mt-4">
        <div className="w-[550px] px-4 py-2 mx-auto flex space-x-2 align-center justify-center bg-orange-50 rounded-sm">
          {types.map(type => (
            <button
              key={type}
              className={`px-4 py-2 ${value === type ? 'border-b-4 border-orange-500 font-bold bg-orange-50 rounded-sm' : 'hover:bg-orange-300 rounded-sm hover:scale-105 transition-all duration-200 '}`}
              onClick={() => onChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
  
        <div className="mt-10">
          {feeds.map(feed => (
            <div key={feed.id}>
              <h2>{feed.name}</h2>
              <p>{feed.url}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  