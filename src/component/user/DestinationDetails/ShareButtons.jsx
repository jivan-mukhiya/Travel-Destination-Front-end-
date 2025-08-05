import React from 'react';

const ShareButtons = ({ destinationName }) => {
  const shareUrl = window.location.href;
  
  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.859-3.127.859-2.356 0-4.365-1.603-4.365-4.563 0-.376.06-.754.181-1.11-3.726.175-7.025-1.87-9.242-4.997a4.739 4.739 0 00-1.223 3.066c0 1.134.577 2.135 1.455 2.722-.538-.017-1.045-.165-1.487-.41v.041c0 2.204 1.551 4.044 3.613 4.456-.379.105-.777.161-1.188.161-.289 0-.572-.028-.851-.082.572 1.789 2.235 3.091 4.203 3.127-1.547 1.22-3.49 1.921-5.601 1.921-.364 0-.724-.021-1.077-.061 2.003 1.274 4.377 2.01 6.932 2.01 8.307 0 12.84-6.876 12.84-12.84 0-.195-.004-.39-.012-.583a9.172 9.172 0 002.252-2.336z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(destinationName)}!&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Copy Link',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    }
  ];

  return (
    <div className="flex space-x-3">
      {socialPlatforms.map((social) => (
        <button 
          key={social.name}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          onClick={() => {
            if (social.action) {
              social.action();
            } else {
              window.open(social.url, '_blank', 'noopener,noreferrer');
            }
          }}
          aria-label={`Share on ${social.name}`}
        >
          {social.icon}
        </button>
      ))}
    </div>
  );
};

export default ShareButtons;