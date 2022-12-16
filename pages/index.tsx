import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Loader from '../components/Loader'
import Login from '../components/Login'
import { ethers } from 'ethers'
import { currency } from '../constants'
import CountDownTimer from '../components/CountDownTimer'
import toast from 'react-hot-toast'
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'

const Home: NextPage = () => {
  const address = useAddress()
  const [Quantity, setQuantity] = useState<any>(1)
  const [UserTickets, setUserTickets] = useState<any>(0)

  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_ADDRESS)
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets")
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward")
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice")
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission")
  const { data: expiration } = useContractRead(contract, "expiration")
  const { data: tickets } = useContractRead(contract, "getTickets")
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address)
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")
  const { data: lastWinner } = useContractRead(contract, "lastWinner")
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")
  const { data: lotteryOperator } = useContractRead(contract, "lotteryOperator")

  let inverseTickets: number = 100 - remainingTickets?.toNumber()
  const winningPercentage: number = Number(UserTickets / inverseTickets)

  const handleClick = async () => {
    if (!ticketPrice) return
    const notification = toast.loading('Buying your tickets...')

    try {
      const data = await BuyTickets([{ value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * Quantity).toString()) }])
      toast.success('Tickets Purchased Successfully.', { id: notification })
      console.info('Contract Call Success', data)
      setQuantity(1)
    } catch (error) {
      toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
      console.log('Contract Call Failure', error)
    }
  }

  useEffect(() => {
    if (!tickets) return
    const totalTickets: string[] = tickets
    const numberOfTickets: number = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)
    setUserTickets(numberOfTickets)
  }, [tickets, address])

  const handleWithdraw = async () => {
    const notification = toast.loading('Withdrawing Winnings...')

    try {
      const data = await WithdrawWinnings([{}])
      toast.success('Withdraw Successful.', { id: notification })
      console.info('Contract Call Success', data)

    } catch (error) {
      toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
      console.log('Contract Call Failure', error)
    }
  }

  if (isLoading) return <Loader />

  if (!address) return <Login />

  return (
    <div className="min-h-screen flex flex-col px-2">
      <Head><title>Crypto Lottery | Web3.0</title></Head>
      <Header />
      {renderOperator()}
      {renderWinner()}

      <div className='flex justify-between space-x-1'>
        <div className='stats'>
          <h2 className='text-sm'>Total Pool</h2>
          <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())} {currency}</p>
        </div>
        <div className="stats">
          <h2 className='text-sm'>Tickets Remaining</h2>
          <p className='text-xl'>{remainingTickets?.toNumber()}</p>
        </div>
      </div>
      <div className='mt-5 mb-3'>
        <CountDownTimer />
        <div className="stats mt-4 flex justify-between">
          <span className='text-sm'>Probability of winning <span className='opacity-50 text-sm italic'>(Your Tickets / Total Tickets)</span></span>
          <div className='italic'>{!winningPercentage ? 'Purchase Tickets to Calculate' : '~' + (parseInt(winningPercentage.toFixed(2)) * 100) + '%'}</div>
        </div>
      </div>

      <div className="stats-container space-y-2">
        <div className="stats-container">
          <div className='flex justify-between items-center pb-2'>
            <h2 className='text-sm'>Price Per Ticket(s)</h2>
            <p className='text-xl'>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString())} {currency}</p>
          </div>
          <div className='flex  items-center space-x-2 stats p-4'>
            <p>TICKETS</p>
            <input
              className='flex w-full bg-transparent text-right outline-none'
              placeholder='1'
              type="number"
              min={1}
              max={10}
              value={Quantity}
              onChange={e => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className='space-y-2 mt-5'>
            <div className='flex items-center justify-between font-bold text-sm italic'>
              <p>Total Cost of Tickets</p>
              <p>{ticketPrice && ((Number(ethers.utils.formatEther(ticketPrice)) * Quantity).toString())} {currency}</p>
            </div>
            <div className='flex items-center justify-between text-xs italic'>
              <p>Service Fees</p>
              <p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString())} {currency}</p>
            </div>
            <div className='flex items-center justify-between text-xs italic'>
              <p>+ Network Fees</p>
              <p>{((Number(ethers.utils.formatEther(ticketPrice)) * Quantity).toString()) + Number(ethers.utils.formatEther(ticketCommission.toString()))}</p>
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <button onClick={handleClick} disabled={expiration?.toString() < Date.now().toString() || remainingTickets <= 0} className='mt-5 w-full LoginButton disabled:from-gray-500 disabled:to-gray-100 disabled:cursor-not-allowed disabled:opacity-30'>
              Buy {Quantity} Tickets for {ticketPrice && ((Number(ethers.utils.formatEther(ticketPrice)) * Quantity).toString())} {currency}
            </button>
            <div className='LoginButtonReflection'>....</div>
          </div>
        </div>

        {renderCards()}

      </div>
      {renderDisclaimer()}
      {renderMarquee()}
    </div>
  )

  function renderDisclaimer() {
    return (
      <>
        <div className='flex items-center justify-center p-5'>
          <h2 className='mx-4'>DISCLAIMER:</h2>
          <p>We are not liable nor responsible for any losses under any and all circumstances at or before the point of sale. Play at your own risk.</p>
        </div>
      </>
    )
  }

  function renderMarquee() {
    return (
      <>
        <div className='flex space-x-2 py-2 Marquee bg-transparent'>
          <Marquee gradient={false} speed={50}>
            <h4 className='font-bold'>Last Winner: {lastWinner?.substring(0, 4) + '...' + lastWinner?.substring(lastWinner, lastWinner.length - 4)}</h4>
            <h4 className='font-bold'>({lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount.toString())} {currency})</h4>
          </Marquee>
        </div>
      </>
    )
  }

  function renderOperator() {
    return (
      <>
        {lotteryOperator === address && (
          <AdminControls />
        )}
      </>
    )
  }

  function renderWinner() {
    return (
      <>
        {winnings > 0 && (
          <div className=' mx-5 mb-2 w-auto animate-pulse'>
            <button onClick={handleWithdraw} className='LoginButton flex flex-col justify-center items-center w-full'>
              <p className='italic'>Winner!</p>
              <p className='font-bold text-lg'>{winnings && ethers.utils.formatEther(winnings.toString())} {currency}</p>
              <p className=''>Click Here to Withdraw</p>
            </button>
          </div>)}
      </>
    )
  }

  function renderCards() {
    return (
      <>
        {UserTickets > 0 &&
          <div className='stats'>
            <p className='text-lg mb-2'>You have {UserTickets} tickets in this lottery. <span className='opacity-50 text-sm italic'>(Scroll)</span></p>
            <div className='CardContainer'>
              {Array(UserTickets).fill("").map((_, idx) => <div className='h-20 w-12 rounded-lg flex flex-shrink-0 justify-center items-center italic Card'>{idx + 1}</div>)}
            </div>
          </div>}
      </>
    )
  }
}

export default Home
