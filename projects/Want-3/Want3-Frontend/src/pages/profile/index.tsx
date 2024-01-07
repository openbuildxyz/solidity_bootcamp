// components/Profile.js
import { useAddress, useStorage } from '@thirdweb-dev/react'
import NavBar from '../../components/NavBar'
import React, { useEffect, useState } from 'react'
import {
  Avatar,
  List,
  Divider,
  Dropdown,
  Space,
  MenuProps,
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  Select,
  Switch
} from 'antd'

type SizeType = Parameters<typeof Form>[0]['size']

const initialWish = [
  { id: 1, text: 'NFT#1' },
  { id: 2, text: 'NFT#2' },
  { id: 3, text: 'NFT#3' }
  // 添加更多愿望
]

const initialDonate = [
  { id: 1, text: ' 捐赠0.1eth' },
  { id: 2, text: '捐赠0.1eth' },
  { id: 3, text: '捐赠0.1eth' }
  // 添加更多捐赠
]

const data = [
  {
    title: 'Account1'
  },
  {
    title: 'Account2'
  },
  {
    title: 'Account3'
  }
]

const containerStyle = {
  width: '686px',
  height: '785px',
  margin: '0 auto',
  borderRadius: '12px',
  border: '1px solid #000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2rem'
}

const listContainerStyle = {
  flex: 1,
  padding: '10px'
}

const textStyle1 = {
  color: '#000D4F',
  fontFamily: 'Inter',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal'
}

const textStyle2 = {
  color: '#000D4F',
  fontFamily: 'Inter',
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal',
  margin: '10px 0'
}

const backgroundStyles = {
  background:
    'linear-gradient(0deg, rgba(245, 245, 184, 0.05) 0%, rgba(245, 245, 184, 0.05) 100%), #FFF'
}

const Profile: React.FC = () => {
  const address = useAddress()
  const [wish, setWish] = useState(initialWish)
  const [isLoadingWish, setIsLoadingWish] = useState(false)
  const [donate, setDonate] = useState(initialDonate)
  const [isLoadingDonate, setIsLoadingDonate] = useState(false)

  useEffect(() => {
    setIsLoadingWish(true)
    fetch(`https://api.thirdweb.com/v1/contracts/${address}/data`)
      .then((res) => res.json())
      .then((data) => {
        setWish(data)
        console.log(data)
        setIsLoadingWish(false)
      })
  }, [])

  useEffect(() => {
    setIsLoadingDonate(true)
    fetch(`https://api.thirdweb.com/v1/contracts/${address}/data`)
      .then((res) => res.json())
      .then((data) => {
        setDonate(data)
        console.log(data)
        setIsLoadingDonate(false)
      })
  }, [])

  const [componentSize, setComponentSize] = useState<SizeType | 'large'>(
    'large'
  )

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size)
  }

  return (
    <div style={{
      height: "100px",
      width: "10px",
    }}>
      你好
    </div>
    // <div className="relative overflow-hidden bg-white" style={backgroundStyles}>
    //   <>
    //     <NavBar />
    //   </>
    //   <header
    //     className="center"
    //     style={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       height: '70vh'
    //     }}
    //   >
    //     <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
    //       个人主页
    //     </h1>
    //   </header>

    //   <main>
    //     <div style={containerStyle}>
    //       <Form
    //         labelCol={{ span: 4 }}
    //         wrapperCol={{ span: 14 }}
    //         layout="horizontal"
    //         initialValues={{ size: componentSize }}
    //         onValuesChange={onFormLayoutChange}
    //         size={componentSize as SizeType}
    //         style={{ maxWidth: 600 }}
    //       >
    //         <div style={textStyle1}>
    //           <Divider>个人信息</Divider>
    //         </div>
    //         <Form.Item label="姓名">
    //           <Input />
    //         </Form.Item>
    //         <Form.Item label="电话">
    //           <Input />
    //         </Form.Item>
    //         <Form.Item label="性别">
    //           <Select>
    //             <Select.Option value="male">男</Select.Option>
    //             <Select.Option value="female">女</Select.Option>
    //           </Select>
    //         </Form.Item>
    //         <Form.Item label="地方">
    //           <Cascader
    //             options={[
    //               {
    //                 value: 'zhejiang',
    //                 label: 'Zhejiang',
    //                 children: [{ value: 'hangzhou', label: 'Hangzhou' }]
    //               }
    //             ]}
    //           />
    //         </Form.Item>
    //         <Form.Item label="生日">
    //           <DatePicker />
    //         </Form.Item>
    //         <Form.Item label="公开" valuePropName="checked">
    //           <Switch />
    //         </Form.Item>
    //         <Form.Item>
    //           <Button>保存</Button>
    //         </Form.Item>
    //       </Form>
    //     </div>

    //     <div style={containerStyle} className="lists">
    //       <div className="title" style={listContainerStyle}>
    //         <div style={{ textAlign: 'center' }}>
    //           <Divider>
    //             {' '}
    //             <div style={textStyle1}>Wish </div>
    //           </Divider>
    //         </div>
    //         <div style={textStyle2}>
    //           <div className="words" style={{ textAlign: 'center' }}>
    //             {initialWish.map((item) => (
    //               <a href="your-link-here" key={item.id}>
    //                 <div>{item.text}</div>
    //               </a>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div style={containerStyle} className="lists">
    //       <div className="title" style={listContainerStyle}>
    //         <div style={{ textAlign: 'center' }}>
    //           <Divider>
    //             <div style={textStyle1}>Donate</div>
    //           </Divider>
    //         </div>
    //         <div style={textStyle2}>
    //           <div className="words" style={{ textAlign: 'center' }}>
    //             {data.map((item, index) => (
    //               <a
    //                 href={`https://api.thirdweb.com/v1/contracts/${item.title}/data`}
    //                 key={index}
    //               >
    //                 <List.Item>
    //                   <List.Item.Meta
    //                     avatar={
    //                       <Avatar
    //                         src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
    //                       />
    //                     }
    //                     title={item.title}
    //                     description="捐赠0.1eth"
    //                   />
    //                 </List.Item>
    //               </a>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  )
}

export default Profile
