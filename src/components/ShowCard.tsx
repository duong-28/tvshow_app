import { Link } from 'react-router-dom'
import { Show } from '../types/show'

interface ShowCardProps {
    show: Show
}

export const ShowCard = ({ show }: ShowCardProps) => {
    return (
        <Link to={`/show/${show.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {show.image ? (
                <img
                    src={show.image.medium}
                    alt={show.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                </div>
            )}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{show.name}</h2>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600">
                        {show.rating?.average ? show.rating.average.toFixed(1) : 'N/A'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {show.genres.map(genre => (
                        <span 
                            key={genre}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}