import { useState, useEffect } from 'react'
import { Show } from '../types/show'
import { getShows, searchShows } from '../services/api'
import { ShowCard } from './ShowCard'
import { SearchBar } from './SearchBar'

export const ShowList = () => {
    // State to store our shows
    const [shows, setShows] = useState<Show[]>([])
    // State to handle loading
    const [loading, setLoading] = useState(true)
    // State to handle errors
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(0)
    const [isSearching, setIsSearching] = useState(false)
    const [cachedShows, setCachedShows] = useState<Show[]>([])

    const fetchShows = async (pageNum: number) => {
        try {
            setLoading(true)
            const data = await getShows(pageNum)
            const newShows = pageNum === 0 ? data : [...shows, ...data]
            setShows(newShows)
            if (pageNum === 0) {
                setCachedShows(data)
            }
        } catch (err) {
            setError('Failed to load shows')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setIsSearching(false)
            setShows(cachedShows)
            return
        }

        try {
            setLoading(true)
            setIsSearching(true)
            const results = await searchShows(query)
            setShows(results.map(result => result.show))
        } catch (err) {
            setError('Failed to search shows')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        if (!isSearching && !loading) {
            setPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        if (!isSearching) {
            fetchShows(page)
        }
    }, [page])

    if (loading) {
        return <div className="text-center py-4">Loading...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>
    }

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            
            {error && (
                <div className="text-center text-red-500 py-4">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shows.map(show => (
                    <ShowCard key={show.id} show={show} />
                ))}
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                </div>
            )}

            {!loading && !isSearching && shows.length > 0 && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {loading ? "Loading..." : "Load More Shows"}
                    </button>
                </div>
            )}

            {!loading && shows.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {isSearching ? 'No shows found for your search' : 'No shows available'}
                </div>
            )}
        </div>
    )
}