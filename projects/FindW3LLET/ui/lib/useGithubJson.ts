import { useEffect, useState } from 'react'

interface WalletJson  {
  [id :string] : {
    name:string,
    website:string,
    avatarUrl: string,
    type:string,
    info:string,
    id:string
  }
  
}

export enum WalletJsonFilePath {
  WalletListTestNet = 'wallet-list-testnet.json',
  WalletListTMainNet = 'wallet-list-mainnet.json', 
}
export const WALLETLISTPATH = 
   WalletJsonFilePath.WalletListTestNet

const BASE_URL = 'https://raw.githubusercontent.com/FindW3LLET/wallet-list/main/'

const useGithubJson = () => {
  const [jsonData, setJsonData] = useState<WalletJson | undefined>()

  useEffect(() => {
    let isMounted = true
    fetch(`${BASE_URL}${WALLETLISTPATH}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then((data) => {
          if(isMounted) setJsonData(data);
        })
      .catch((error) => {
        console.error(error)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return jsonData
  
}

export default useGithubJson;
