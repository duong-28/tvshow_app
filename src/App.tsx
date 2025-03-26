import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ShowList } from './components/ShowList'
import { ShowDetail } from './components/ShowDetail'
import { Logo } from './components/Logo'
import { SearchBar } from './components/SearchBar'
import { useState } from 'react'
import { TopRatedShows } from './components/TopRatedShows'

const queryClient = new QueryClient()

function App() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen w-full">
                    <header>
                        <div className="header-content">
                            <Logo />
                            <div className="flex-1">
                                <SearchBar onSearch={setSearchQuery} />
                            </div>
                        </div>
                    </header>
                    <main>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <div className="top-rated-section">
                                            {!searchQuery && <TopRatedShows />}
                                        </div>
                                        <ShowList searchQuery={searchQuery} />
                                    </>
                                }
                            />
                            <Route path="/show/:id" element={<ShowDetail />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    )
}

export default App