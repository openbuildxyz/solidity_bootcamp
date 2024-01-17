import { Avatar } from "@nextui-org/avatar"
import { Card } from "@nextui-org/card"

const logos =  {
    0 : '👎',
    1 : '👍'
}

type Props = {
    id?: string,
    avatarUrl ?: string,
    logo : 0 | 1,
    supporting: string,
    unSupporting: string,
}

function RankCard({avatarUrl, logo,supporting,unSupporting} : Props)  {
    return (<Card className="p-10 flex h-40 flex-row items-center gap-[50%] hover:scale-110">
        <Avatar src={avatarUrl} className="w-20 h-20">
        </Avatar>
        <div className="flex flex-row items-center gap-10">
           <p className="text-5xl">{logos[logo] ?? logos[1]}</p> 
           <p className="text-6xl">{logo === 1 && supporting}</p>
           <p className="text-6xl">{logo === 0 && unSupporting}</p>
           <p className="text-5xl"> / </p>  
           <p className="text-4xl">{parseInt(supporting) + parseInt(unSupporting)}</p> 
        </div>
    </Card>)
}

export default RankCard;