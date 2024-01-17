'use client'
import useGithubJson from "@/lib/useGithubJson";
import { InfoCard } from "./InfoCard";

type Props = {
    item : {
        name: string;
        website: string;
        avatarUrl: string;
        type: string;
        info: string;
        id: string;
    }
}

export default function Cards({} :  )  {
    const JSONData = useGithubJson();
    return (<>
        
        </>)
}

