import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Show } from '../types/show'
import { getShow } from '../services/api'

export const ShowDetail = () => {
    const { id } = useParams<{ id: string }>()
    const [show, setShow] = useState<Show | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchShow = async () => {
            if (!id) return
            try {
                setLoading(true)
                const data = await getShow(parseInt(id))
                setShow(data)
            } catch (err) {
                setError('Failed to load show details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchShow()
    }, [id])

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Link to="/" className="inline-block mb-6 text-[#3c948b] hover:text-[#4dbfb4] transition-colors duration-300">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Shows
            </Link>
            
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3c948b] border-r-transparent"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : show ? (
                <div className="grid md:grid-cols-2 gap-8 bg-[rgba(31,31,31,0.7)] p-6 rounded-lg">
                    <div>
                        {show.image && (
                            <img
                                src={show.image.original || show.image.medium}
                                alt={show.name}
                                className="w-full rounded-lg shadow-lg"
                                loading="lazy"
                            />
                        )}
                    </div>
                    <div className="text-white">
                        <h1 className="text-3xl font-bold mb-4 text-[#3c948b]">{show.name}</h1>
                        {show.rating?.average && (
                            <div className="mb-4 flex items-center">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="ml-2 text-lg">{show.rating.average}/10</span>
                            </div>
                        )}
                        {show.genres && show.genres.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {show.genres.map(genre => (
                                    <span 
                                        key={genre} 
                                        className="px-3 py-1 bg-[rgba(60,148,139,0.2)] text-[#3c948b] rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div 
                            className="prose prose-invert max-w-none mb-6 text-gray-300"
                            dangerouslySetInnerHTML={{ __html: show.summary || "<p>No summary available</p>" }}
                        />
                        <div className="space-y-2 text-gray-300">
                            {show.status && (
                                <p><strong className="text-[#3c948b]">Status:</strong> {show.status}</p>
                            )}
                            {show.premiered && (
                                <p><strong className="text-[#3c948b]">Premiered:</strong> {new Date(show.premiered).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">Show not found</div>
            )}
        </div>
    )
} 