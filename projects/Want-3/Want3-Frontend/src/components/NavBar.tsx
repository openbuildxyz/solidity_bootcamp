// components/Navbar.js
import React from 'react'
import { ConnectWallet } from '@thirdweb-dev/react'
import { Input } from 'antd'
import Vector from '../assets/Vector.png'
import Group3 from '../assets/Group3.png'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'
const { Search } = Input

const Want3Wallet = styled(ConnectWallet)`
  width: 13rem !important;
  background-color: #fff !important;
  border: 1px solid #000d4f !important;
  border-radius: 12px !important;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25) !important;
  color: #000d4f !important;
  font-size: 18px !important;
`

function NavBar() {
  const navigate = useNavigate()
  const { Search } = Input

  function navToSurprise(value: string) {
    navigate('/surprise/' + value)
  }

  return (
    <div className="w-full p-5 text-white bg-MainBodyColor1/5">
      <div className=" flex items-center mt-1">
        <div
          className="flex-1 flex ml-3 z-10 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={Vector} className="w-24 h-10 mt-0"></img>
          <img src={Group3} className="w-10 h-6 ml-1 mt-4"></img>
          <a className="line-height mt-2.5 text-FontColor text-3xl font-semibold">
            ant3
          </a>
        </div>
        <div className="z-10 flex-2 mr-16">
          <Search
            placeholder="Input the wish you want surprise"
            allowClear
            onSearch={navToSurprise}
            style={{ width: 400 }}
            size="large"
          />
        </div>
        <div className="mr-2 ml-10 z-10">
          <button className="mx-10 mr-14 text-gray-900 text-lg hover:underline hover:underline-offset-8 hover:text-gray-300 focus:underline focus:underline-offset-8 focus:opacity-50">
            Contact
          </button>
          <button
            className="mx-10 mr-14 text-gray-900 text-lg hover:underline hover:underline-offset-8 hover:text-gray-300 focus:underline focus:underline-offset-8 focus:opacity-50"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>

          <Want3Wallet />
        </div>
      </div>
    </div>
  )
}

export default NavBar
