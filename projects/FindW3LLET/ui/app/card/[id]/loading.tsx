import {Card, Skeleton} from "@nextui-org/react";

export default function Loading() {
    return <>
        <Card className="flex-1 col-span-2 flex-grow max-h-[90vh] flex-col gap-5 p-1">
            <Skeleton className="rounded-lg ">
                <div className=" h-screen rounded-lg bg-default-300">
                </div>
            </Skeleton>
        </Card>
    </>
  }