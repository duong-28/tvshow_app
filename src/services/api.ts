import axios from 'axios'
import { Show, ShowSearchResult } from '../types/show'

const BASE_URL = 'https://api.tvmaze.com'

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
})

export const getShows = async (query: string, page: number) => {
    try {
        if (query) {
            const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
            const data = await response.json()
            return data.map((item: any) => item.show)
        } else {
            const response = await fetch(`${BASE_URL}/shows?page=${page}`)
            return response.json()
        }
    } catch (error) {
        console.error('Error fetching shows:', error)
        return []
    }
}

export const getShow = async (id: number): Promise<Show> => {
    try {
        const response = await apiClient.get(`/shows/${id}`)
        return response.data
    } catch (error) {
        console.error('Error fetching show details:', error)
        throw new Error('Failed to fetch show details')
    }
}

export const searchShows = async (query: string): Promise<ShowSearchResult[]> => {
    try {
        const response = await apiClient.get(`/search/shows?q=${encodeURIComponent(query)}`)
        return response.data
    } catch (error) {
        console.error('Error searching for shows:', error)
        throw new Error('Failed to search for shows')
    }
}

export const getTopRatedShows = async (): Promise<Show[]> => {
    try {
        // Fetch first page of shows which includes popular ones
        const response = await fetch(`${BASE_URL}/shows`);
        const shows = await response.json() as Show[];

        // Sort by rating (weight considers both rating value and number of votes)
        return shows
            .filter(show => show.rating && show.rating.average) // Only shows with ratings
            .sort((a, b) => {
                const ratingA = a.rating?.average || 0;
                const ratingB = b.rating?.average || 0;
                return ratingB - ratingA;
            })
            .slice(0, 10);
    } catch (error) {
        console.error('Error fetching popular shows:', error);
        throw new Error('Failed to fetch popular shows');
    }
};
