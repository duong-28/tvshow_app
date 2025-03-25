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
        <div className="col-span-4 p-4 text-center">
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
        <div className="field result">
            {displayedShows.map((show) => (
                <Link 
                    to={`/show/${show.id}`}
                    key={show.id} 
                    className="result-item"
                    aria-label={`View details for ${show.name}`}
                >
                    <img
                        src={show.image?.original || 'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'}
                        alt={show.name}
                        className="w-full object-cover"
                        loading="lazy"
                    />
                    <div className="content">
                        <h2 className="title">
                            {show.name}
                        </h2>
                        {show.rating?.average && (
                            <div className="rating">
                                <span className="star">★</span>
                                <span>{show.rating.average.toFixed(1)}</span>
                            </div>
                        )}
                        {show.genres && show.genres.length > 0 && (
                            <div className="genres">
                                {show.genres.slice(0, 3).map((genre: string) => (
                                    <span key={genre} className="genre">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            ))}
            
            {shouldShowLoadingIndicator && <LoadingIndicator />}
            
            <div ref={observerRef} className="h-4" />

            {!isLoading && !searchLoading && displayedShows.length === 0 && (
                <div className="col-span-4 p-4 text-center">
                    <p className="text-gray-600">
                        {isSearching ? 'No shows found for your search' : 'No shows available'}
                    </p>
                </div>
            )}

            {searchLoading && (
                <div className="col-span-4 p-4 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3c948b] border-r-transparent"></div>
                    <p className="text-gray-600 mt-2">Searching...</p>
                </div>
            )}
        </div>
    )
}