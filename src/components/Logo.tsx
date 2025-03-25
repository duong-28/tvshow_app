import { Link } from 'react-router-dom'

export const Logo = () => {
    return (
        <Link to="/" className="flex items-center mr-[3%]">
            <img 
                src="https://static.tvmaze.com/images/tvm-header-logo.png" 
                alt="logo" 
                className="w-[140px]"
            />
        </Link>
    )
} 