import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { getCatalogBooks } from '../lib/externalBooks';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Filter } from 'lucide-react';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand';

const selectClass =
  'w-full p-2.5 bg-brand-ink border border-brand/20 text-black rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['books', { page, category, search: searchParams.get('search') }],
    queryFn: async () =>
      getCatalogBooks({
        page,
        limit: 12,
        search: searchParams.get('search') || '',
        category,
      }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchParams.set('search', searchTerm);
    } else {
      searchParams.delete('search');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleFilterChange = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-black mb-2">Browse Books</h1>
          <p className="text-gray-500">Live catalog powered by Open Library.</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title..."
              className={inputClass}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button type="submit" variant="primary" className="ml-2 py-2">
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-brand-ink border border-brand/15 p-6 sticky top-24 rounded-2xl">
            <div className="flex items-center gap-2 mb-6 text-brand">
              <Filter className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Filters</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className={selectClass}
                  value={category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Biography">Biography</option>
                  <option value="Children">Children</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand/15">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-brand-ink h-80 rounded-2xl" />
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-24 bg-brand-ink border border-dashed border-brand/20 rounded-2xl">
              <p className="text-gray-500 mb-2">No books found matching your criteria.</p>
              <Button variant="outline" onClick={() => setSearchParams(new URLSearchParams())}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data?.data?.map((book) => (
                  <Link to={`/books/${book._id}`} key={book._id} className="group flex flex-col h-full">
                    <Card className="h-full group-hover:border-brand/40 transition-colors relative">
                      <div className="aspect-[3/4] bg-brand-ink overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-xs text-brand mb-1">{book.category}</p>
                        <h3 className="text-base font-bold text-black line-clamp-1 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{book.author}</p>
                        <div className="mt-auto pt-3 border-t border-brand/10">
                          <p className="text-sm font-medium text-gray-700">
                            ${(book.deliveryFee || 0).toFixed(2)} Delivery
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {data?.pagination?.pages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  <Button variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {Math.min(data.pagination.pages, 50)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.min(data.pagination.pages, 50)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
