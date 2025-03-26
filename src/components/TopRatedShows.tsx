import { useQuery } from '@tanstack/react-query';
import { getTopRatedShows } from '../services/api';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export const TopRatedShows = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: topRatedShows, isLoading } = useQuery({
    queryKey: ['topRatedShows'],
    queryFn: getTopRatedShows,
  });

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('a')?.offsetWidth || 200;
    const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gray-900/30 py-4 md:py-8 mb-8 md:mb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-teal-500">Top 10 Rated TV Shows</h2>
          <div className="netflix-row">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="netflix-item flex-none w-32 md:w-48 aspect-[2/3] animate-pulse bg-gray-800 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topRatedShows) return null;

  // Take only the first 10 shows
  const shows = topRatedShows.slice(0, 10);

  return (
    <div className="w-full bg-gray-900/30 py-4 md:py-8 mb-8 md:mb-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-teal-500">Top Rated TV Shows</h2>
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="netflix-row"
          >
            {shows.map((show, index) => (
              <Link
                to={`/show/${show.id}`}
                key={show.id}
                className="netflix-item flex-none w-32 md:w-48 aspect-[2/3]"
              >
                <span 
                  className="absolute bottom-0 left-0 -translate-x-[60%] text-[5rem] md:text-[8rem] font-bold 
                           text-gray-900 [-webkit-text-stroke:2px_white] [text-shadow:0_0_0.25rem_black] pointer-events-none z-[25]"
                >
                  {index + 1}
                </span>
                <div 
                  className="absolute inset-0 rounded-lg overflow-hidden bg-gray-800 shadow-lg"
                >
                  <img
                    src={show.image?.original}
                    alt={show.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 w-full p-4 backdrop-blur-sm bg-black/30">
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{show.name}</h3>
                      <p className="text-teal-400 text-xs md:text-sm">
                        Rating: {show.rating?.average || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-36 bg-gradient-to-r from-black to-transparent pointer-events-none z-[15]" />
          <div className="absolute right-0 top-0 bottom-0 w-36 bg-gradient-to-l from-black to-transparent pointer-events-none z-[15]" />
          <div className="absolute left-0 top-0 bottom-0 w-24 z-[60]" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-[60]" />
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-7xl text-teal-500/90 hover:text-teal-400 transition-colors cursor-pointer z-[70] bg-transparent border-none outline-none appearance-none p-0"
            aria-label="Previous shows"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl text-teal-500/90 hover:text-teal-400 transition-colors cursor-pointer z-[70] bg-transparent border-none outline-none appearance-none p-0"
            aria-label="Next shows"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}; 