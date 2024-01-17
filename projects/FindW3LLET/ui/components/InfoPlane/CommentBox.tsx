'use client'
import { useGetWalletVoteInfo } from "@/server/findwalletServer"
import { Card, CardBody, CardFooter } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { Link } from "@nextui-org/link"
import { useEffect, useState } from "react"

type Props = {
    id: string
}

export function CommentsPlane ({id} : Props) {
    const [voteInfo, setVoteInfo] = useState<{ supporting : bigint , unSupporting : bigint}>({ supporting: 0n, unSupporting : 0n});

    const { data }  = useGetWalletVoteInfo(parseInt(id))
    
    useEffect(() => {
            setVoteInfo(data);
            console.log(19,data)
        }
    ,[data]);

    return (<Card className="p-10 transition-all hover:scale-105 hover:cursor-pointer hover:text-blue-400 " href={`/card/${id}/commend`} as={Link} >
        <CardBody className="flex">
            <div className="flex  justify-center items-centergap-3">
                <div className="text-6xl">👍</div>
                <div className="text-7xl"> { parseInt(voteInfo?.supporting.toString()) || 0} / { (parseInt(voteInfo?.supporting.toString())) + (parseInt(voteInfo?.unSupporting.toString())) || 0} </div>
            </div>
        </CardBody>
        <Divider></Divider>
        <CardFooter className="flex items-center justify-center">
            <p className="text-2xl">View all Comments</p>
        </CardFooter>
    </Card>)
}