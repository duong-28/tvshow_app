import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShowList } from './components/ShowList'
import { ShowDetail } from './components/ShowDetail.tsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">TV Show Explorer</h1>
          </div>
        </header>
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<ShowList />} />
            <Route path="/show/:id" element={<ShowDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App