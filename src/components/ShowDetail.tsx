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
            <Link to="/" className="inline-block mb-6 text-blue-500 hover:text-blue-600">
                ← Back to Shows
            </Link>
            
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : show ? (
                <div className="grid md:grid-cols-2 gap-8">
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
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{show.name}</h1>
                        {show.rating?.average && (
                            <div className="mb-4">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1">{show.rating.average}/10</span>
                            </div>
                        )}
                        {show.genres && show.genres.length > 0 && (
                            <div className="mb-4">
                                {show.genres.map(genre => (
                                    <span key={genre} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="prose max-w-none mb-4"
                            dangerouslySetInnerHTML={{ __html: show.summary || "<p>No summary available</p>" }}
                        />
                        <div className="space-y-2 text-gray-600">
                            {show.status && (
                                <p><strong>Status:</strong> {show.status}</p>
                            )}
                            {show.premiered && (
                                <p><strong>Premiered:</strong> {new Date(show.premiered).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">Show not found</div>
            )}
        </div>
    )
} 