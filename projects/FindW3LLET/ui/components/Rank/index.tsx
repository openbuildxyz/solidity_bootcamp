'use client'

import useGithubJson from '@/lib/useGithubJson'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useEffect, useRef, useState } from 'react'
import RankCard from './rankCard'
import { useGetWalletVoteInfo } from '@/server/findwalletServer'
import { formatUnits } from 'viem'

type walletVoteInfo = {
  id: string
  avatarUrl: string
  supporting: string
  unSupporting: string
}

type walletsData = {
  id: string
  avatarUrl: string
}

export default function RankPage() {
  const [goods, setGoods] = useState<walletVoteInfo[]>([{ id: '', avatarUrl: '', supporting: '', unSupporting: '' }])
  const [bads, setBads] = useState<walletVoteInfo[]>([{ id: '', avatarUrl: '', supporting:'', unSupporting:'' }])
  const walletId = useRef('0')
  const [status, setStatus] = useState<0 | 1>(1)
  
  const JSONData = useGithubJson()
  const { data } =  useGetWalletVoteInfo(parseInt(walletId.current))

  console.log(35, JSONData);
  
  useEffect(() => {
   async  function fetchIDsandAvatarUrl() {
      if (JSONData) {
        const _wallets = Object.values(JSONData).map(item => {
          return { id: item.id, avatarUrl: item.avatarUrl }
        })
        console.log(43, data, formatUnits(data?.supporting || BigInt('0'), 0));
        console.log(44, data, formatUnits(data?.unSupporting || BigInt('0'), 0));

        
        // setWallets(_wallets) // 设置好钱包数据
        const value =  _wallets.map(item => {
          walletId.current = item.id
          console.log(50, data)
           return {
            id: item.id,
            avatarUrl: item.avatarUrl,
            supporting: formatUnits(data?.supporting || BigInt('0'), 0),
            unSupporting: formatUnits(data?.unSupporting || BigInt('0'), 0),
           }
        })
        console.log(68, value);
        fetchVoteInfo(value)
      }
    }
    fetchIDsandAvatarUrl()
  }, [JSONData,data])

  function fetchVoteInfo(walletsVoteInfos : walletVoteInfo[]) {
    const shifted_walletsVoteInfos: walletVoteInfo[] = walletsVoteInfos.filter(item => item.id !== '') // because the initial obj is empty

    const goodsList = shifted_walletsVoteInfos
      .map(item => {
        return { id: item.id, avatarUrl: item.avatarUrl, supporting: item.supporting, unSupporting: item.unSupporting }
      })
      .sort((a, b) =>  Number(b.supporting) - Number(a.supporting))
    const badsList = shifted_walletsVoteInfos
      .map(item => { 
        return { id: item.id, avatarUrl: item.avatarUrl, supporting: item.supporting ,unSupporting: item.unSupporting }
      })
      .sort((a, b) =>Number(b.unSupporting) - Number(a.unSupporting))
    setGoods(goodsList)
    setBads(badsList)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex'>
        <ButtonGroup>
          <Button variant={status === 1 ? 'bordered' : 'shadow'} onPress={() => setStatus(1)}>
            Good
          </Button>
          <Button variant={status === 0 ? 'bordered' : 'shadow'} onPress={() => setStatus(0)}>
            Bad
          </Button>
        </ButtonGroup>
      </div>
      <div className='flex flex-col gap-5'>
        {status === 1 && goods.map(item => <RankCard logo={status} avatarUrl={item.avatarUrl} key={item.id} supporting={item.supporting} unSupporting={item.unSupporting} />)}
        {status === 0 && bads.map(item => <RankCard logo={status} avatarUrl={item.avatarUrl} key={item.id} supporting={item.supporting} unSupporting={item.unSupporting} />)}
      </div>
    </div>
  )
}
