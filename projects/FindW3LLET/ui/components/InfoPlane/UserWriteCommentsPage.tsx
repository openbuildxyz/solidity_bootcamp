'use client';
import { useState } from "react";
import { Button } from "@nextui-org/button"
import { Selecter } from "../Selecter"
import { Textarea } from "@nextui-org/input"
import Check  from "../Check"

const valiateTextarea = (Value : string) => {
    if(Value === '') return 'Your can not submit empty comments';
}


export const Page = () => {
    
    const [createTag, isCreateTag] = useState();
    const [commentValue, setCommentValue] = useState("");
    const [inputInvalid, setInputInvalid] = useState(false);


    return (<>
        <div className="flex justify-center items-center gap-20">
                    <Check logo="👍">
                    </Check>
                    <Check logo="👎">
                    </Check>
                </div>       
                <div className="flex items-center w-full gap-2">
                    <p className="text-2xl">Tag : </p>
                    <div className="grid grid-flow-col gap-3 grid-cols-6 items-center">
                        <Selecter className="col-span-5" />
                        <Button className="col-span-1">创建</Button>
                    </div>
                </div> 
                <div className="flex flex-col h-full">
                    <p className="text-2xl">Your comment : </p>
                    <div className="max-h-[440px]">
                    <Textarea value={commentValue} onValueChange={setCommentValue} isInvalid={inputInvalid} errorMessage={'developing...'} className="h-full" variant="bordered" size="lg" placeholder="Share your thoughts with everyone..." style={{height:"100% !important"}} minRows={20} maxRows={25}></Textarea>
                    <p>Textare value: {commentValue} </p>
                    </div>
                </div>  
    
    </>)
}