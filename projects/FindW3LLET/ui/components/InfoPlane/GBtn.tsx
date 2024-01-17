'use client';
import useGithubJson from "@/lib/useGithubJson";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Props = {
    btnContent: string;
    id: string;
}

export default function GBtn({btnContent, id} : Props) {
    const [href, setHref] = useState<string>();
    const JSONData = useGithubJson()

    useEffect(()=> {
        function gethref() {
            if(JSONData) {
                const matchedObj = Object.values(JSONData).filter(item => item.id === id).pop()
                setHref(matchedObj?.website ?? '')
            }
        }
        gethref()
    }, [JSONData,id])


return (<Button fullWidth variant="bordered" size="lg" as={Link} href={href?.toString() || '/'}>
          {btnContent}
        </Button>)
}