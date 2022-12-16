import { useContract, useContractRead } from '@thirdweb-dev/react'
import CountDown from 'react-countdown'

interface Props {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
}

function CountDownTimer() {
    const { contract } = useContract(process.env.NEXT_PUBLIC_LOTTERY_ADDRESS)
    const { data: expiration } = useContractRead(contract, "expiration")

    const renderer = ({ hours, minutes, seconds, completed }: Props) => {
        if (completed) {
            return (
                <>
                    <h2 className='text-center text-xl mb-5 animate-pulse'>Ticket sales have now closed for this draw.</h2>
                    <div className='flex space-x-6'>
                        <div className='flex-1 animate-pulse'>
                            <div className='countdown'>{hours}</div>
                            <div className='countdown-label'>Hours</div>
                        </div>
                        <div className='flex-1 animate-pulse'>
                            <div className='countdown'>{minutes}</div>
                            <div className='countdown-label'>Minutes</div>
                        </div>
                        <div className='flex-1 animate-pulse'>
                            <div className='countdown'>{seconds}</div>
                            <div className='countdown-label'>Seconds</div>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <div className='flex flex-col justify-center items-center w-full'>
                    <h3 className='text-sm mb-2 italic'>Time Remaining</h3>
                    <div className='flex space-x-6 w-full'>
                        <div className='flex-1'>
                            <div className='countdownLeft text-md'>{hours}</div>
                            <div className='countdown-label'>Hours</div>
                        </div>
                        <div className='flex-1'>
                            <div className='countdown text-md'>{minutes}</div>
                            <div className='countdown-label'>Minutes</div>
                        </div>
                        <div className='flex-1'>
                            <div className='countdown text-md'>{seconds}</div>
                            <div className='countdown-label'>Seconds</div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <CountDown date={new Date(expiration * 1000)} renderer={renderer} />
        </div>
    )
}

export default CountDownTimer