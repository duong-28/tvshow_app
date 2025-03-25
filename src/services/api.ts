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

export const getLatestShows = async (): Promise<Show[]> => {
    try {
        // Get both web and TV schedules for more comprehensive latest shows
        const [webResponse, tvResponse] = await Promise.all([
            fetch(`${BASE_URL}/schedule/web`),
            fetch(`${BASE_URL}/schedule`)
        ]);

        const webShows = await webResponse.json();
        const tvShows = await tvResponse.json();

        // Combine both schedules and extract unique shows
        const allScheduledShows = [...webShows, ...tvShows];
        const uniqueShows = new Map();

        // Keep only unique shows, using the most recent airing
        allScheduledShows.forEach(schedule => {
            const show = schedule._embedded?.show || schedule.show;
            if (show) {
                uniqueShows.set(show.id, show);
            }
        });

        // Convert to array and take first 10
        return Array.from(uniqueShows.values()).slice(0, 10);
    } catch (error) {
        console.error('Error fetching latest shows:', error);
        throw new Error('Failed to fetch latest shows');
    }
};
