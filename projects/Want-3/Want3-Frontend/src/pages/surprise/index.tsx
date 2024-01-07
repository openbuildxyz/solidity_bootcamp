import { useParams } from 'react-router-dom'
import React, { useState, useRef, useEffect } from 'react'
import { Web3Button } from '@thirdweb-dev/react'
import styled from 'styled-components'
import { Modal, Typography, Button, Progress } from 'antd'
import './DonationModal.css'
import NFT from './nft'
import { WantDetails } from './surprise'

import {
  useContractWrite,
  useContract,
  useContractRead,
  useNFT,
  ThirdwebNftMedia
} from '@thirdweb-dev/react'

const contractAddress = '0xE3B6993942A183A3A6C78B35Ca4ede2Af258C6D2'
const apiUrl = 'https://api-want3.zeabur.app/v1'

const WishButton = styled(Web3Button)`
  display: flex !important;
  height: 100% !important;
  width: 33% !important;
  justify-content: center !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  border-radius: 8px !important;
  border: 1px solid #000d4f !important;
  background: #f2ff26 !important;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25) !important;

  color: #b5d1cc !important;
  font-family: Inter !important;
  font-size: 24px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;

  margin-bottom: 20px !important;
`

const Surprise = () => {
  const [donationAmount, setDonationAmount] = useState(0)
  const [donateSuccess, setDonateSuccess] = useState(0)
  const [buySuccess, setBuySuccess] = useState(0)
  const { wanterAddr } = useParams()

  const [wantDetails, setWantDetails] = useState<WantDetails[] | null>([])
  const [getWantError, setGetWantError] = useState(null)
  const [hasWant, setHasWant] = useState(false)

  const { contract } = useContract(contractAddress)
  const { data, isLoading, error } = useContractRead(contract, 'wantList', [
    wanterAddr
  ])
  // const data = 0x29508801d260499b710CF33E35235bCFdffcE561;
  const {
    mutateAsync,
    isLoading: isLoading1,
    error: error1
  } = useContractWrite(contract, 'donateFund')

  console.log('contract:', contract)

  if (error) {
    console.error('failed to read contract', error)
  } else {
    console.log('contract data:', data, isLoading, error)
    console.log('wanterAddr:', wanterAddr)
  }

  useEffect(() => {
    const fetchWantDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/wants/want?wantAddr=${wanterAddr}`
        )

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const responseData = await response.json()

        setWantDetails(responseData)
        setHasWant(true)
        console.log('want details: ', responseData)
      } catch (err) {
        console.error('fetch error: ', err)
      }
    }

    fetchWantDetails()
  }, [wanterAddr])

  const { Title } = Typography
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen space-x-10 relative">
        <h1 className="text-xl font-bold mb-5 absolute top-6 left-24">
          Surprise
        </h1>

        <div className="flex-1 flex flex-col justify-between items-start p-5 border-r space-y-8">
          <div className="p-5 rounded bg-gradient-to-br from-custom-green to-custom-offwhite bg-opacity-20 mx-12">
            <div className="want-details-section mb-10 text-3xl">
              Wish Details
            </div>

            <div className="want-details-section mb-10 rounded bg-opacity-30 bg-slate-400 p-8 border-spacing-1 border-2 border-slate-400">
              {getWantError && <div>Error: {getWantError}</div>}
              {!wantDetails || wantDetails.length === 0 ? (
                <div>This address does not have a wish!</div>
              ) : (
                <div>
                  <p>Want ID: {wantDetails[0].wantId}</p>
                  <p>NFT Address: {wantDetails[0].nftAddr}</p>
                  <p>Slogan: {wantDetails[0].slogan}</p>
                  <p>Realized Value: {wantDetails[0].realizedValue}</p>
                  <p>Is Realized: {wantDetails[0].isRealized ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="nft-metadata-section ml-20 mt-8">
            <NFT targetAddress="0xDFef0ae167f9a649823772A733a34B06CAB7DcA8" />
          </div>
        </div>

        {/* Donation Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-5 space-y-24">
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.01"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="w-3/5 mb-5"
          />

          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="w-1/4 p-2.5 border rounded-md"
          />

          <WishButton
            isDisabled={!hasWant}
            contractAddress={contractAddress}
            action={async () => {
              console.log(wanterAddr)
              console.log(donationAmount)
              setDonateSuccess(3)

              try {
                let result = await mutateAsync({
                  args: [wanterAddr, (donationAmount * 1e18).toString()],
                  overrides: {
                    gasLimit: 5000000
                    // value: utils.parseEther("0.1"), // send 0.1 native token with the contract call
                  }
                })
                console.log(result)
                setDonateSuccess(1)

                let wantIdcheck = ''
                if (wantDetails && wantDetails.length > 0) {
                  wantIdcheck = wantDetails[0].wantId
                  console.log(wantIdcheck)
                } else {
                  // 应该会被hasWant捕获为disabled
                }

                const dataToBeSent = {
                  wantId: wantIdcheck,
                  donaterAddr: data,
                  value: donationAmount,
                  message: 'Transaction successful'
                }

                const response = await fetch(apiUrl + '/wants/donate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(dataToBeSent)
                })

                console.log(response)
                showModal()
              } catch (e) {
                console.log(e)
                setDonateSuccess(2)
              }
            }}
          >
            助力！
          </WishButton>
          <div className="text-m font-bold mb-5">
            {donateSuccess == 1 && <p>助力成功</p>}
            {donateSuccess == 2 && <p>助力失败</p>}
            {donateSuccess == 3 && <p>正在助力……</p>}

            {/* case 1:
                  // const { data: queryCouldBuy } = useContractRead(
                  //   contract,
                  //   'couldBuy',
                  //   [wanterAddr]
                  // )
                  console.log('queryCouldBuy : 是否达到了预定的金额 ')
                  // console.log(queryCouldBuy)
                  setBuySuccess(1)
                  showModal()
                  console.log('showmodal test')
                  return <p>助力成功!</p>
                case 2:
                  return <p>助力失败</p>
                case 3:
                  return <p>正在助力……</p>
                default:
                  return <></>
              }
            } */}
          </div>
          <div>
            <Button
              onClick={() => {
                const { data: queryCouldBuy } = useContractRead(
                  contract,
                  'couldBuy',
                  [wanterAddr]
                )
                console.log('queryCouldBuy : 是否达到了预定的金额 ')
                setBuySuccess(queryCouldBuy)
                showModal()
              }}
            >
              点击弹窗
            </Button>
            <Modal
              open={visible}
              onCancel={handleCancel}
              footer={null}
              className="custom-modal" // 添加自定义 CSS 类名
            >
              <div className="modal-content">
                {donateSuccess == 0 ? (
                  <Title level={2} className="success-title">
                    Donate Success !!!
                  </Title>
                ) : (
                  <>
                    <Title level={4} className="count-title">
                      您是捐赠者中的第1名
                    </Title>
                    {/* 在这里根据实际情况显示第几名 */}
                  </>
                )}
                <Progress percent={50} className="progress-bar" />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}

export default Surprise
