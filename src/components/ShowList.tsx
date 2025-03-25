import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect, useState } from 'react'
import { Show } from '../types/show'
import { getShows, searchShows } from '../services/api'
import { Link } from 'react-router-dom'

interface ShowListProps {
    searchQuery: string;
}

export const ShowList = ({ searchQuery }: ShowListProps) => {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Show[]>([])
    const [displayedShowsCount, setDisplayedShowsCount] = useState(50)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const observerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const search = async () => {
            if (!searchQuery.trim()) {
                setIsSearching(false)
                setSearchResults([])
                setDisplayedShowsCount(50)
                return
            }

            try {
                setSearchLoading(true)
                setIsSearching(true)
                const results = await searchShows(searchQuery.trim())
                setSearchResults(results.map(result => result.show))
            } catch (err) {
                console.error('Failed to search shows:', err)
            } finally {
                setSearchLoading(false)
            }
        }

        search()
    }, [searchQuery])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ['shows'],
        queryFn: ({ pageParam = 0 }) => getShows('', pageParam),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length
        },
        enabled: !isSearching,
        initialPageParam: 0
    })

    const allShows = data?.pages?.flatMap(page => page) ?? []
    const displayedShows = isSearching 
        ? searchResults 
        : allShows.slice(0, displayedShowsCount)

    // Handle local pagination
    const handleLoadMore = () => {
        setIsLoadingMore(true)
        setTimeout(() => {
            setDisplayedShowsCount(prev => prev + 50)
            setIsLoadingMore(false)
        }, 500)
    }

    useEffect(() => {
        if (!observerRef.current || isSearching) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (allShows.length > displayedShowsCount) {
                        handleLoadMore()
                    } else if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage()
                    }
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '200px'
            }
        )

        observer.observe(observerRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, isSearching, allShows.length, displayedShowsCount])

    const LoadingIndicator = () => (
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 p-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3c948b] border-r-transparent"></div>
        </div>
    )

    const shouldShowLoadingIndicator = !isSearching && (
        isFetchingNextPage || 
        isLoadingMore || 
        (hasNextPage && allShows.length > 0)
    )

    if (isLoading && !isSearching) {
        return <div>Loading...</div>
    }

    if (error instanceof Error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
            {displayedShows.map((show) => (
                <Link 
                    to={`/show/${show.id}`}
                    key={show.id} 
                    className="result-item transition-transform hover:scale-105"
                    aria-label={`View details for ${show.name}`}
                >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                        <img
                            src={show.image?.original || 'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'}
                            alt={show.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="absolute bottom-0 p-2 md:p-3 w-full">
                                <h2 className="text-white font-semibold text-sm md:text-base truncate">
                                    {show.name}
                                </h2>
                                {show.rating?.average && (
                                    <div className="text-teal-400 text-xs md:text-sm flex items-center gap-1">
                                        <span className="text-yellow-400">★</span>
                                        <span>{show.rating.average.toFixed(1)}</span>
                                    </div>
                                )}
                                {show.genres && show.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {show.genres.slice(0, 2).map((genre: string) => (
                                            <span 
                                                key={genre} 
                                                className="text-[10px] md:text-xs px-1.5 py-0.5 bg-gray-700/50 text-gray-200 rounded"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            
            {shouldShowLoadingIndicator && <LoadingIndicator />}
            
            <div ref={observerRef} className="h-4" />

            {!isLoading && !searchLoading && displayedShows.length === 0 && (
                <div className="col-span-2 sm:col-span-3 md:col-span-4 p-4 text-center">
                    <p className="text-gray-400 text-sm md:text-base">
                        {isSearching ? 'No shows found for your search' : 'No shows available'}
                    </p>
                </div>
            )}

            {searchLoading && (
                <div className="col-span-2 sm:col-span-3 md:col-span-4 p-4 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3c948b] border-r-transparent"></div>
                    <p className="text-gray-400 text-sm md:text-base mt-2">Searching...</p>
                </div>
            )}
        </div>
    )
}