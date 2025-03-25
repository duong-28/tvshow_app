import { Link, useNavigate } from 'react-router-dom'

export const Logo = () => {
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        navigate('/')
        window.location.reload()
    }

    return (
        <Link to="/" onClick={handleClick} className="flex items-center mr-[3%]">
            <img 
                src="https://static.tvmaze.com/images/tvm-header-logo.png" 
                alt="logo" 
                className="w-[140px]"
            />
        </Link>
    )
}