import { useState } from 'react'

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('')

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        onSearch(query)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="flex-1 max-w-[900px]">
            <div className="flex w-full">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Shows and Movies..."
                    className="flex-1 text-base bg-[#2a2a2a] text-white border border-[#3c948b] rounded-l-[30px] p-[10px] h-[40px] focus:outline-none focus:border-[#1f5f58] transition-colors duration-300"
                />
                <button
                    className="bg-[#3c948b] text-white border border-[#3c948b] rounded-r-[30px] px-6 h-[40px] hover:bg-[#2a6b64] transition-colors duration-300"
                    onClick={() => handleSubmit()}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    )
} 