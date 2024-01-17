import React from 'react'
import { useState } from 'react'
import {
  useContract,
  useContractRead,
  useNFT,
  ThirdwebNftMedia
} from '@thirdweb-dev/react'

export default function NFT({
  targetAddress,
  ...props
}: {
  targetAddress: string
}) {
  const [loading, setLoading] = useState(false)

  const { contract } = useContract(targetAddress)
  const { data: nft, isLoading, error } = useNFT(contract, '1')

  // Render the NFT onto the UI
  if (isLoading) return <div>Loading... NFT metadata</div>
  if (error || !nft) return <div>NFT not found</div>

  return (
    <div>
      {!isLoading && nft ? (
        <ThirdwebNftMedia metadata={nft.metadata} />
      ) : (
        <p>Loading NFT...</p>
      )}
    </div>
  )
}
