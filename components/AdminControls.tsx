import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import React from 'react'
import { RiRefundLine, RiRestartLine, RiStarLine, RiMoneyDollarBoxLine } from 'react-icons/ri'
import { currency } from '../constants'
import { toast } from 'react-hot-toast'

interface Props {
    onClick?: () => void
}

function AdminControls() {
    const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_ADDRESS)
    const { data: operatorTotalCommission } = useContractRead(contract, "operatorTotalCommission")

    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll")
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission")
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")

    const handleDrawWinner = async () => {
        const notification = toast.loading('Drawing Winner...')

        try {
            const data = await DrawWinnerTicket([{}])
            toast.success('Winner Selected.', { id: notification })
            console.info('Contract Call Success', data)

        } catch (error) {
            toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
            console.log('Contract Call Failure', error)
        }
    }

    const handleWithdrawCommission = async () => {
        const notification = toast.loading('Withdrawing Commission...')

        try {
            const data = await WithdrawCommission([{}])
            toast.success('Withdraw Successful.', { id: notification })
            console.info('Contract Call Success', data)

        } catch (error) {
            toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
            console.log('Contract Call Failure', error)
        }
    }

    const handleRestartLottery = async () => {
        const notification = toast.loading('Resetting Lottery...')

        try {
            const data = await restartDraw([{}])
            toast.success('Reset Successful.', { id: notification })
            console.info('Contract Call Success', data)

        } catch (error) {
            toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
            console.log('Contract Call Failure', error)
        }
    }

    const handleRefundAll = async () => {
        const notification = toast.loading('Refunding Ticket Holders...')

        try {
            const data = await RefundAll([{}])
            toast.success('Refund Successful.', { id: notification })
            console.info('Contract Call Success', data)

        } catch (error) {
            toast.error(`Whoops, something went wrong. Try raising your gas limit.`, { id: notification })
            console.log('Contract Call Failure', error)
        }
    }

    return (
        <div className='text-center rounded-md w-full pb-2'>
            <h2 className='font-bold'>Admin Controls</h2>
            <p className='mb-2 pb-2'><span className='opacity-50'>Total Commission:</span> <span className='font-bold'>{operatorTotalCommission && ethers.utils.formatEther(operatorTotalCommission.toString())} {currency}</span></p>

            <div className='flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-1 justify-center'>
                <button className='admin-button' onClick={handleDrawWinner}>
                    <RiStarLine className='h-6 mx-auto mb-2' />
                    Draw Winner
                </button>
                <button className='admin-button' onClick={handleWithdrawCommission}>
                    <RiMoneyDollarBoxLine className='h-6 mx-auto mb-2' />
                    Withdraw Commission
                </button>
                <button className='admin-button' onClick={handleRestartLottery}>
                    <RiRestartLine className='h-6 mx-auto mb-2' />
                    Restart Lottery
                </button>
                {/* <button className='admin-button' onClick={handleRefundAll}>
                    <RiRefundLine className='h-6 mx-auto mb-2' />
                    Refund All
                </button> */}
            </div>
        </div>
    )
}

export default AdminControls