'use client'
import { Avatar } from '@nextui-org/avatar'
import { Divider } from '@nextui-org/divider'
import React, { useEffect, useState } from 'react'
import Tag from '../Tag'
import AddTag from './AddTag'
import { CommentsPlane } from './CommentBox'
import useGithubJson from '@/lib/useGithubJson'
import { useAccount } from 'wagmi'
import { useAddTagEvent, useGetBaseFee, useGetTags, useGetWalletVoteInfo } from '@/server/findwalletServer'
import OpinionBtn from './OpinionBtn'

// Todo : on-chain
type Props = {
  id: string
}

export default function Page({ id }: Props) {
  const [detailobj, setDetailobj] = useState<
    | {
        name: string
        website: string
        avatarUrl: string
        type: string
        info: string
        id: string
      }
    | undefined
  >()
  const [tags, setTags] = useState<string[] | undefined>([''])
  const { isConnected } = useAccount() //

  const JSONData = useGithubJson()

  const { data } = useGetTags(parseInt(id))

  useEffect(() => {
    function fetchDetail() {
      const obj =
        JSONData &&
        Object.values(JSONData!)
          .filter(item => item.id === id)
          .pop()
      setDetailobj(obj)
    }
    fetchDetail()
  }, [id, JSONData])

  useEffect(() => {
    function fetchTags() {
      const arr = data?.map(item => item.tagName)
      arr && setTags(arr)
    }
    fetchTags()
  }, [data])

  return (
    <>
      <div className='flex justify-start items-center p-5 pl-0 min-h-[120px] overflow-x-scroll'>
        <div className='w-20 h-20'>
        <Avatar src={detailobj?.avatarUrl} className='min-h-20 min-w-20 h-20 w-20'></Avatar>
        </div>
        <div className='flex flex-col px-5'>
          <div className='row-span-1'>
            <p className='text-2xl'>{detailobj?.name}</p>
          </div>
          <div className='w-full flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <p className='text-xl'>Tag : </p>
              { !isConnected && <p className='text-l text-red-500'>Want to add tag? Please connect your wallet</p>}
              <div>{isConnected && <AddTag walletId={id} />}</div>
            </div>
            <div className='w-full flex items-center gap-1 '>
              {tags &&
                tags?.map((item: string) => (
                  <div key={item}>
                    <Tag key={item} context={item}></Tag>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Divider></Divider>
      <div className='flex flex-col gap-1 min-h-[192px] overflow-scroll'>
        <p className='text-3xl'>Info:</p>
        <div className='flex flex-col gap-2'>{detailobj?.info}</div>
      </div>
      <Divider></Divider>
      <div className='flex flex-col items-center justify-center'>
        {!isConnected && <p className='text-red-500'>Want to vote? Please click the btn to collect your wallet </p>}
        <div className='flex items-center justify-center gap-20'>
          {[1, 0].map(item => (
            <OpinionBtn
              disable={!isConnected}
              className='w-20 h-20 text-4xl'
              opinion={item as 0 | 1}
              walletId={id}
              key={item}
            ></OpinionBtn>
          ))}
        </div>
      </div>
      <Divider></Divider>
      <div className='px-3 min-h-[230px]'>
        <CommentsPlane id={id} />
      </div>
    </>
  )
}
