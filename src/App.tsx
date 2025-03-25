import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ShowList } from './components/ShowList'
import { Logo } from './components/Logo'
import { SearchBar } from './components/SearchBar'
import { useState } from 'react'

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
                        background-image: url("https://i.gifer.com/3BBK.gif");
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
                        gap: 3rem;
                        width: 100%;
                    }

                    .result-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .result-item img {
                        width: 100%;
                        height: 295px;
                        object-fit: cover;
                    }

                    .result-item .title {
                        color: #3c948b;
                        margin-top: 1rem;
                        font-weight: bold;
                        text-align: center;
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
                            <Route path="/" element={<ShowList searchQuery={searchQuery} />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    )
}

export default App