'use client';
import { Button } from "@nextui-org/button";
import { CardHeader } from "@nextui-org/card";
import { useRouter } from "next/navigation";

export type HeaderProps = {
    title: string;
    btnContent: string;
  };
  
export default function HeaderComponents({ title, btnContent } : HeaderProps)  {
    const router = useRouter()
    return (
      <CardHeader className="flex justify-between">
        <Button radius="full" variant="bordered" className="" onClick={() => { title === 'Detail' && router.push('/') || title === 'Comments' && router.back()} }>
          {btnContent}
        </Button>
        <p className="font-bold text-3xl"> {title} </p>
        <Button radius="full" variant="light" className="" isDisabled></Button>
      </CardHeader>
    );
  };