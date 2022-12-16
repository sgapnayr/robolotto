import { DotLoader } from 'react-spinners'
import { useState, useEffect } from 'react'

function Loader() {
    const [Count, setCount] = useState(1)

    function loadRobot() {
        setTimeout(() => {
            setCount(Count + 1)
        }, 100)

        const robot = `https://robohash.org/test/${Count}`
        return robot
    }

    useEffect(() => {

    }, [Count])
    return (
        <div className='min-h-screen flex flex-col items-center justify-center Page'>
            <div className='ImageOverlayLoader'>
                <img className='rounded-full h-20 w-20' src={loadRobot()} alt="..." />
            </div>
            <h1 className='text-lg m-2 font-bold'>Loading Smart Contract...</h1>
            <DotLoader color='rgba(20, 244, 255, 1)' size={30} />
        </div>
    )
}

export default Loader