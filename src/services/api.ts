import axios from 'axios'
import { Show, ShowSearchResult } from '../types/show'

const BASE_URL = 'https://api.tvmaze.com'

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
})

export const getShows = async (page: number = 0): Promise<Show[]> => {
    try {
        const response = await apiClient.get(`/shows?page=${page}`)
        return response.data
    } catch (error) {
        console.error('Error fetching shows:', error)
        throw new Error('Failed to fetch shows')
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
