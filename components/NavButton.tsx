import React from 'react'

interface Props {
    title: string
    isActive: boolean
    onClick?: () => void
}

function NavButton({ title, isActive, onClick }: Props) {
    return (
        <button onClick={onClick} className={`hover:text-white px-2 font-bold opacity-30 italic LogoutButton`}>
            {title}
        </button>
    )
}

export default NavButton