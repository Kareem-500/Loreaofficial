import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Article } from '../types';
import { ARTICLES } from '../data/journal';

interface JournalSectionProps {
  onSelectArticle: (article: Article) => void;
  onViewAllArticles: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  onSelectArticle,
  onViewAllArticles
}) => {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F4EF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
              THE LORÉA JOURNAL · WOMEN'S STYLE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#1D1D1B]">
              Notes on Style, Fabric & Living
            </h2>
          </div>
          <button
            onClick={onViewAllArticles}
            className="mt-4 md:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#1D1D1B] hover:text-[#B88F88] pb-1 border-b border-[#1D1D1B] hover:border-[#B88F88] transition-all flex items-center space-x-2"
          >
            <span>READ THE JOURNAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Editorial Cards with Magazine Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-[#EAE5DE] mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.22em] bg-[#1D1D1B]/80 text-[#F7F4EF] px-2 py-1 backdrop-blur-xs">
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-[#7C746B] font-light tracking-wider mb-2">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 opacity-70" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1D1D1B] group-hover:text-[#B88F88] transition-colors leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-sm text-[#7C746B] font-light leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center space-x-1 text-xs tracking-[0.18em] uppercase text-[#1D1D1B] font-medium group-hover:text-[#B88F88] transition-colors">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
