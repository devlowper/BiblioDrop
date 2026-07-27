import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf9]">
        <h1 className="text-3xl font-display font-bold text-[#1a1f36] mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">The blog post you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-brand text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-deep transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Generate some extra placeholder content to make the blog look full
  const extendedContent = `
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">${post.content}</p>
    
    <h3 class="text-2xl font-bold text-[#1a1f36] mt-10 mb-4">The Importance of Routine</h3>
    <p class="mb-6 leading-relaxed text-gray-700">Establishing a routine is one of the most effective ways to ensure consistency in any new habit. When it comes to reading, carving out a specific time of day can signal to your brain that it is time to wind down and focus. Whether it's early in the morning with a cup of coffee, or right before bed to help you sleep, consistency is key.</p>
    
    <blockquote class="border-l-4 border-brand pl-6 py-2 my-8 bg-brand/5 rounded-r-xl italic text-gray-700 font-medium text-lg">
      "A reader lives a thousand lives before he dies. The man who never reads lives only one." – George R.R. Martin
    </blockquote>
    
    <h3 class="text-2xl font-bold text-[#1a1f36] mt-10 mb-4">Creating the Perfect Environment</h3>
    <p class="mb-6 leading-relaxed text-gray-700">Your environment plays a massive role in your ability to concentrate. Find a quiet corner, ensure you have adequate lighting, and maybe keep a notebook handy for jotting down interesting quotes or thoughts. Removing distractions like your smartphone can drastically improve your reading retention and enjoyment.</p>
    
    <p class="mb-6 leading-relaxed text-gray-700">Remember, reading should be a pleasure, not a chore. If you find yourself struggling to get through a book, give yourself permission to put it down and pick up something else. Life is too short to read books you don't enjoy!</p>
  `;

  return (
    <div className="bg-[#fcfaf9] min-h-screen pb-20">
      {/* Header Image */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-6 pb-12">
          <div className="max-w-[900px] mx-auto text-white">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                {post.tag}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/90">
                <Calendar className="w-4 h-4" /> {post.date}
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 rounded-full bg-brand/20 overflow-hidden border-2 border-white/30 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Written by</span>
                <span className="text-base font-bold">{post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 pt-12 md:pt-16">
        <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-gray-100 -mt-24 relative z-10">
          
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-brand" 
               dangerouslySetInnerHTML={{ __html: extendedContent }} />
               
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#1a1f36]">Tags:</span>
              <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                <Tag className="w-3.5 h-3.5" /> {post.tag}
              </span>
              <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                <Tag className="w-3.5 h-3.5" /> Reading
              </span>
            </div>
            
            <button className="flex items-center gap-2 text-brand font-semibold hover:text-brand-deep transition-colors bg-brand/5 px-4 py-2 rounded-full">
              <Share2 className="w-4 h-4" /> Share Article
            </button>
          </div>
        </div>
        
        {/* Next/Prev Navigation */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          <Link to="/" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand/30 transition-colors group">
            <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider block mb-2">Previous Article</span>
            <h4 className="font-display font-bold text-lg text-[#1a1f36] group-hover:text-brand transition-colors">The art of mindful reading</h4>
          </Link>
          <Link to="/" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand/30 transition-colors group text-right">
            <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider block mb-2">Next Article</span>
            <h4 className="font-display font-bold text-lg text-[#1a1f36] group-hover:text-brand transition-colors">Top 10 books to read this summer</h4>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
