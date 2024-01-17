'use client';
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { FC, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Tag from "./Tag";
import { useGetTags } from "@/server/findwalletServer";
import { formatEther } from "viem";


type CardProps = {
  className?: string;
  name?: string;
  avatarUrl ?: string;
  id:string
}

type TypeProps = {
  tagName: string,
  weight: string
}

export const InfoCard : FC<CardProps> = ({ className,name,avatarUrl,id }) =>  {
  const [tags, setTags] = useState<TypeProps[]>([{ tagName: '', weight: ''}])

  const cardClassNames = clsx("max-h-[306px]",className)
  
  const { data } = useGetTags(parseInt(id));

  useEffect(() => {
    function pickTop5Taps() {
      const arr = data?.map((item) => { return { tagName: item.tagName, weight: formatEther(item.tagWeight) }})
      arr && arr?.sort((a,b) => { return parseFloat(b.weight) - parseFloat(a.weight)})
      const top5 = arr?.slice(0,5)
      top5 && setTags(top5)
    }
    pickTop5Taps()
  },[data])

  return (
    <>
      <Card shadow="sm" className={cardClassNames}>
        <CardBody>
          <div className="flex items-center justify-center flex-col h-full">
            <div className="basis-1/2 flex items-center">
              <Avatar src={avatarUrl} className="w-20 h-20" />
            </div>
            <div className="basis-1/4 flex items-center">
              <p className="font-bold text-2xl">{name}</p>
            </div>
            <div className="basis-1/4 flex items-center">
              <p>Rate_Tag:</p>
            </div>
            <div className="basis-1/4 grid grid-cols-3 gap-y-1 gap-x-2 justify-items-center">
                 { tags && tags?.map(item => (
                    <Tag context={item.tagName} key={item.tagName}/>
                ))
                }
            </div>
          </div>
        </CardBody>
        <CardFooter className="item-center justify-center">
            <div className="flex items-center justify-center w-full">
                <Button className="transition-all hover:scale-105 hover:cursor-pointer"
                        as={Link}
                        variant="bordered"
                        fullWidth
                        href={`/card/${id}/detail`}
                >
                    Info
                </Button>
            </div>
        </CardFooter>
      </Card>
    </>
  );
}
