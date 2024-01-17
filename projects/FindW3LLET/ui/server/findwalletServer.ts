import { findWalletAbi } from '@/abi/findWalletAbi'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useContractEvent, useContractRead, useContractWrite, useWalletClient } from 'wagmi'

export const contract_add = '0x9bb88B3d71c59055D3C2Fbd0a0B0215a5C7155A0'

export function useGetTags(id: any) {
  return useContractRead({
    address: contract_add,
    abi: findWalletAbi,
    functionName: 'getTags',
    args: [id],
  })
}
// id:number, tag : string, weight : string
export function useAddTag() {
  return useContractWrite({
    address: contract_add,
    abi: findWalletAbi,
    functionName: 'addTag',
    // args:[id, tag],
    // value: parseEther(weight)
  })
}

export function useGetWalletVoteInfo(id: any) {
  return useContractRead({
    address: contract_add,
    abi: findWalletAbi,
    functionName: 'getWalletInfoQuarter',
    args: [id],
  })
}
// id : number , isSupporting : 0 | 1, fee : string
export function useVote() {
  return useContractWrite({
    address: contract_add,
    abi: findWalletAbi,
    functionName: 'vote',
    // args:[id,isSupporting],
    // value: parseEther(fee)
  })
}

export function useGetBaseFee() {
  return useContractRead({
    address: contract_add,
    abi: findWalletAbi,
    functionName: 'getBaseFee',
  })
}

export function useEnterVoteEvent() {
  return useContractEvent({
    address: contract_add,
    abi: findWalletAbi,
    eventName: 'EnterVote',
    listener(logs) {
      window.location.reload()
    },
  })
}

export function useAddTagEvent() {
  return useContractEvent({
    address: contract_add,
    abi: findWalletAbi,
    eventName: 'AddTag',
    listener(logs) {
      window.location.reload()
    },
  })
}

export function usePickWinnerEvent() {
  return useContractEvent({
    address: contract_add,
    abi: findWalletAbi,
    eventName: 'PickWinner',
    listener(logs) {
      console.log(`Message: ${JSON.stringify(logs)}`)
      alert(`Message: ${logs}`)
    },
  })
}
