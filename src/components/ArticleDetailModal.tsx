import React from 'react';
import { X, Clock, Calendar, Share2, ArrowLeft } from 'lucide-react';
import { Article } from '../types';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex justify-center items-start p-2 sm:p-4 md:p-8 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#F7F4EF] shadow-2xl border border-[#EAE5DE] my-auto overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 bg-[#F7F4EF]/90 backdrop-blur-xs rounded-full text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
          aria-label="Close article"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-[#222]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl">
            <span className="text-[10px] tracking-[0.24em] uppercase bg-white/20 backdrop-blur-xs px-2.5 py-1 mb-2 inline-block">
              {article.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-12 max-w-3xl mx-auto">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-[#EAE5DE] text-xs text-[#7C746B] font-light">
            <div className="flex items-center space-x-4">
              <span>{article.author}</span>
              <span>·</span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {article.date}
              </span>
              <span>·</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {article.readTime}
              </span>
            </div>
            <p className="font-serif italic text-sm text-[#1D1D1B] mt-2 sm:mt-0">
              {article.titleAr}
            </p>
          </div>

          {/* Paragraphs with editorial typography */}
          <div className="space-y-6 text-[#1D1D1B] text-base sm:text-lg font-light leading-relaxed font-sans">
            {article.content.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none text-lg text-[#1D1D1B]' : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer of Article */}
          <div className="mt-12 pt-8 border-t border-[#EAE5DE] flex justify-between items-center">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1D1D1B] hover:text-[#B88F88] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journal</span>
            </button>
            <span className="text-xs text-[#7C746B] font-light">
              Published by LORÉA Atelier Press · Cairo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
