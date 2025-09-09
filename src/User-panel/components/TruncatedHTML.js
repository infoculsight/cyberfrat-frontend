// TruncatedHTML.js
import React from 'react';

const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const truncateWords = (text, wordLimit = 70) => {
  const words = text.trim().split(/\s+/);
  return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
};

const TruncatedHTML = ({ html }) => {
  const plainText = stripHtml(html);
  const truncatedText = truncateWords(plainText, 70);
  return <div>{truncatedText}</div>;
};

export const TruncatedHTMLList = ({ html }) => {
  const plainText = stripHtml(html);
  const truncatedText = truncateWords(plainText, 10);
  return <div style={{marginBottom:"10px"}}>{truncatedText}</div>;
};
export const FixTruncatedHTMLList = ({ html }) => {
  const plainText = stripHtml(html);
  const truncatedText = truncateWords(plainText, 1000);
  return <div style={{marginBottom:"10px"}}>{truncatedText}</div>;
};

export default TruncatedHTML;

