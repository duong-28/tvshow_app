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
                <style>
                    {`
                    ::-webkit-scrollbar {
                        width: 5px;
                        height: 5px;
                    }
                    
                    ::-webkit-scrollbar-track {
                        background-color: #eee;
                    }
                    
                    ::-webkit-scrollbar-thumb {
                        background-color: #3c948b;
                        border: 2px solid #3c948b;
                        border-radius: 10px;
                    }
                    
                    body {
                        font-family: "Goudy Bookletter 1911", sans-serif;
                        background-image: url("https://i.gifer.com/4NB4.gif");
                        background-color: #151515;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                    }

                    header {
                        background-color: #3f3f3f;
                        width: 100vw;
                        padding: 1rem 0;
                    }

                    .header-content {
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 0 2rem;
                        display: flex;
                        align-items: center;
                        gap: 2rem;
                    }

                    main {
                        max-width: 1400px;
                        margin: 2rem auto;
                        padding: 0 2rem;
                    }

                    .field.result {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 1.5rem;
                        width: 100%;
                    }

                    .result-item {
                        display: flex;
                        flex-direction: column;
                        background: rgba(31, 31, 31, 0.7);
                        border-radius: 8px;
                        padding: 0.5rem;
                        width: 100%;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }

                    .result-item:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 5px 15px rgba(60, 148, 139, 0.3);
                        background: rgba(31, 31, 31, 0.9);
                    }

                    .result-item img {
                        width: 100%;
                        aspect-ratio: 2/3;
                        object-fit: cover;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }

                    .result-item .content {
                        padding: 0.75rem 0.5rem;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .result-item .title {
                        color: #3c948b;
                        font-weight: bold;
                        text-align: center;
                        font-size: 1.1rem;
                        transition: color 0.3s ease;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .result-item:hover .title {
                        color: #4dbfb4;
                    }

                    .result-item .rating {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.25rem;
                        color: #fff;
                        font-size: 0.9rem;
                    }

                    .result-item .rating .star {
                        color: #ffd700;
                    }

                    .result-item .genres {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.25rem;
                        justify-content: center;
                    }

                    .result-item .genre {
                        background: rgba(60, 148, 139, 0.2);
                        color: #3c948b;
                        padding: 0.25rem 0.5rem;
                        border-radius: 9999px;
                        font-size: 0.75rem;
                        transition: all 0.3s ease;
                    }

                    .result-item:hover .genre {
                        background: rgba(60, 148, 139, 0.3);
                        color: #4dbfb4;
                    }
                    `}
                </style>
                <div className="min-h-screen w-full">
                    <header className="bg-[#3f3f3f] h-[70px]">
                        <div className="header-content">
                            <Logo />
                            <SearchBar onSearch={setSearchQuery} />
                        </div>
                    </header>
                    <main>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <TopRatedShows />
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