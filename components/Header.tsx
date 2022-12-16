import React from 'react'
import NavButton from './NavButton'
import { useAddress, useDisconnect } from '@thirdweb-dev/react'
import { ConnectWallet } from "@thirdweb-dev/react";

function Header({ }) {
    const address = useAddress() as string | undefined
    const disconnect = useDisconnect()

    return (
        <header className='grid grid-cols-2 md:grid-cols-2 justify-between p-4 items-center'>
            <div className="flex items-center space-x-2 ImageOverlayLoader">
                <img src={`https://robohash.org/test${address}`} alt="..." />
                <div>
                    {/* <h1 className='text-lg font-bold'>Robo Lotto</h1>
                    <p className='text-xs text-black/50 truncate'>{address ? 'User ' + address?.substring(0, 4) + '...' + address?.substring(address.length, address.length - 4) : 'Please Login.'}</p> */}
                </div>
            </div>
            <ConnectWallet accentColor="#fcfcfc" colorMode='light' className='LogoutButton' />
            <div className='flex flex-col justify-end items-end ml-auto text-right' >
                {/* <NavButton onClick={disconnect} isActive={false} title='Log Out' /> */}
            </div>
        </header>
    )
}

export default Header