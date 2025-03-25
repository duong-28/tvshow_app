import { useQuery } from '@tanstack/react-query';
import { getTopRatedShows } from '../services/api';
import { Link } from 'react-router-dom';
import { Show } from '../types/show';

const ShowSection = ({ shows, sectionId, prevId, nextId }: { 
  shows: Show[], 
  sectionId: string, 
  prevId: string, 
  nextId: string 
}) => (
  <section id={sectionId} className="w-full relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 my-5 px-2 md:px-4">
    <a 
      href={`#${prevId}`} 
      className="arrow__btn absolute left-0 top-0 bottom-0 w-12 md:w-20 flex items-center justify-center text-4xl md:text-6xl text-white no-underline z-10 bg-gradient-to-r from-black/100 to-transparent"
      aria-label="Previous shows"
    >
      ‹
    </a>
    {shows.map((show) => (
      <Link
        to={`/show/${show.id}`}
        key={show.id}
        className="item transition-all duration-200"
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
          <img
            src={show.image?.original || '/placeholder.png'}
            alt={show.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 p-2 md:p-4">
              <h3 className="text-white font-semibold text-sm md:text-base">{show.name}</h3>
              <p className="text-teal-400 text-xs md:text-sm">
                Rating: {show.rating?.average || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Link>
    ))}
    <a 
      href={`#${nextId}`} 
      className="arrow__btn absolute right-0 top-0 bottom-0 w-12 md:w-20 flex items-center justify-center text-4xl md:text-6xl text-white no-underline z-10 bg-gradient-to-l from-black/100 to-transparent"
      aria-label="Next shows"
    >
      ›
    </a>
  </section>
);

export const TopRatedShows = () => {
  const { data: topRatedShows, isLoading } = useQuery({
    queryKey: ['topRatedShows'],
    queryFn: getTopRatedShows,
  });

  if (isLoading) {
    return (
      <div className="w-full bg-gray-900/30 py-4 md:py-8 mb-8 md:mb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-teal-500">Top Rated Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topRatedShows) return null;

  const sections = Array.from({ length: Math.ceil(topRatedShows.length / 5) }, (_, i) =>
    topRatedShows.slice(i * 5, (i + 1) * 5)
  );

  return (
    <div className="w-full bg-gray-900/30 py-4 md:py-8 mb-8 md:mb-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-teal-500">Top Rated TV Shows</h2>
        <div className="wrapper grid grid-cols-[repeat(3,100%)] overflow-hidden scroll-smooth">
          {sections.map((sectionShows, index) => (
            <ShowSection
              key={index}
              shows={sectionShows}
              sectionId={`section${index + 1}`}
              prevId={`section${index === 0 ? sections.length : index}`}
              nextId={`section${index === sections.length - 1 ? 1 : index + 2}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 