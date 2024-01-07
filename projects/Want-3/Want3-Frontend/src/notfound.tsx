import NavBar from 'components/NavBar'
import styled from 'styled-components'
import { Button as AntButton } from 'antd'
import { useNavigate } from 'react-router-dom'

const MyButton = styled(AntButton)`
  display: flex;
  height: 60px;
  width: 150px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #000d4f;
  background: #f2ff26;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25);

  color: #b5d1cc;
  font-family: Inter;
  font-size: 30px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full h-screen">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold">Oops! Page Not Found</h1>
        <div className="mt-5">
          <MyButton onClick={() => navigate('/')}>Return</MyButton>
        </div>
      </div>
    </div>
  )
}

export default NotFound
