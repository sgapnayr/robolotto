import { useMetamask } from '@thirdweb-dev/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'

function Login() {
    const [Count, setCount] = useState(1)
    const connect = useMetamask()

    function loadRobot() {
        setTimeout(() => { setCount(Count + 1) }, 1500)
        const robot = `https://robohash.org/test/${Count}`
        return robot
    }

    useEffect(() => { }, [Count])

    return (
        <>
            <Head><title>Login | Web3.0</title><link rel="shortcut icon" href='./favicon.png' /></Head>
            {renderHead()}
            <div className='min-h-screen flex flex-col items-center justify-center Page'>
                <h1 className='text-4xl opacity-20 italic'>RoboLotto</h1>
                <p className='italic text-center'>A crypto lottery, built on the Polygon MATIC™ Mumbai Network</p>
                <div className='ImageOverlay'>
                    <img src={loadRobot()} alt="..." className='rounded-full h-50 w-50 mb-10 RobotImage' />
                </div>
                <button onClick={connect} className='mb-2 LoginButton'>
                    Connect MetaMask
                </button>
                <div className='LoginButtonReflection'>....</div>
            </div>
        </>
    )

    function renderHead() {
        return (
            <>
                <Head>
                    <title>Crypto Lottery | Web3.0</title>
                </Head>
            </>
        )
    }
}

export default Login