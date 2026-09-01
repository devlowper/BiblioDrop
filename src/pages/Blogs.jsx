import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const Blogs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-ink py-20 px-4 md:px-6 border-b border-brand/10">
        <div className="max-w-[1280px] mx-auto text-center relative z-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-[#1a1f36] mb-4">Our Blogs</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Fresh stories from the BiblioDrop community — reading tips, author spotlights,
            and delivery updates. Dive into our latest thoughts.
          </p>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand/5 border border-gray-100 transition-all block flex flex-col h-full"
            >
              <div className="relative aspect-[16/11] overflow-hidden shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                <span className="absolute top-4 left-4 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                  {post.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-500 font-medium mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand/70" /> {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand/70" /> {post.author}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[#1a1f36] text-lg leading-snug mb-3 group-hover:text-brand transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.description || 'Dive into this exciting new post to learn more about our latest updates and book recommendations from the experts...'}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand group-hover:text-[#e85a4a] transition-colors">
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
