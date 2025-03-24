import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect, useState } from 'react'
import { Show } from '../types/show'
import { getShows, searchShows } from '../services/api'
import { ShowCard } from './ShowCard'
import { SearchBar } from './SearchBar'

export const ShowList = () => {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Show[]>([])
    const [displayedShowsCount, setDisplayedShowsCount] = useState(25)
    const observerRef = useRef<HTMLDivElement>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ['shows'],
        queryFn: ({ pageParam = 0 }) => getShows(pageParam),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length
        },
        enabled: !isSearching,
        initialPageParam: 0
    })

    useEffect(() => {
        if (!observerRef.current || isFetchingNextPage || isSearching) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (allShows.length > displayedShowsCount) {
                        // Show 25 more shows if we have them cached
                        setDisplayedShowsCount(prev => prev + 25)
                    } else if (hasNextPage) {
                        // Fetch next page if we need more shows
                        fetchNextPage()
                    }
                }
            },
            { 
                threshold: 0.5,
                rootMargin: '100px'
            }
        )

        observer.observe(observerRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, isSearching, data, displayedShowsCount])

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setIsSearching(false)
            setSearchResults([])
            setDisplayedShowsCount(25) // Reset display count when clearing search
            return
        }

        try {
            setIsSearching(true)
            const results = await searchShows(query)
            setSearchResults(results.map(result => result.show))
        } catch (err) {
            console.error('Failed to search shows:', err)
        }
    }

    const allShows = data?.pages?.flatMap(page => page) ?? []
    const displayedShows = isSearching 
        ? searchResults 
        : allShows.slice(0, displayedShowsCount)

    const LoadingIndicator = () => (
        <div className="text-center py-8 mt-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="text-gray-600 mt-2">Loading more TV shows...</p>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchBar onSearch={handleSearch} />

            {error instanceof Error && (
                <div className="text-center text-red-500 py-4">{error.message}</div>
            )}

            {isLoading && !isSearching ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="text-gray-600 mt-2">Loading shows...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedShows.map((show: Show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                    
                    {/* Loading indicator shown when actively loading more or when we have more to display */}
                    {!isSearching && (isFetchingNextPage || (hasNextPage && allShows.length > 0)) && (
                        <LoadingIndicator />
                    )}
                    
                    <div ref={observerRef} className="h-4" />

                    {!isLoading && displayedShows.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-gray-600">
                                {isSearching ? 'No shows found for your search' : 'No shows available'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}