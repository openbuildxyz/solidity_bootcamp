import { Avatar } from "@nextui-org/avatar"
import { Divider } from "@nextui-org/divider"
import { FC } from "react"

type CommentComponent = {
  // don't need avatarUrl beacause
  walletAdd?: string,
  content?: string,
  id: string
}

const formatAdd = (walletAdd : string | undefined) => {
  const lastTwo = walletAdd?.substring(walletAdd.length - 2);
  const firstFour = walletAdd?.substring(0,4);
  const star = '*'.repeat(18);

  return firstFour + star + lastTwo;
}
const mockData = {
  '1':'This wallet offers a simple and intuitive user interface, making the management of digital assets effortless.',
}

const CommentComponent : FC<CommentComponent> = ({ walletAdd, content , id}) => {
  return (<>
          <div className=" flex overflow-scroll">
            <div className="w-20 h-20">
            <Avatar className="w-20 h-20"></Avatar> 
            </div>
            <div className=" flex pl-2 flex-col gap-y-3">
              <p className="font-bold text-xl">
                {`0x4C................04A9`}
              </p>
              <p className="text-2xl ">{mockData[1]}</p>
            </div>
          </div>
          <Divider></Divider>
        </>
  )
}

type Props = {
  id?: string // id 去 content表里面找 对应 wallet - content
}



async function Page({ id } : Props) {
  //const {isEmpty,commendsArr } = await useRedis("1")
  
  // if (isEmpty) {
  //   return <div className="notes-empty">
  //     {'No commends created yet!'}
  //   </div>
  // }

    return (
    <div className="h-full overflow-y-scroll">
        <div className="flex flex-col items-start  gap-2 justify-start overflow-y-auto p-5 hover:scale-105 transition-all">
          {[1].map((_,index) => <CommentComponent id={index.toString()}/>)}
          {/* { commendsArr.map((item) => <CommentComponent walletAdd={item.key} content={item.value}/>)} */}
        </div>
    </div>
  )
}

export default Page;