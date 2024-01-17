"use client";
import { InfoCard } from "@/components/InfoCard";
import useGithubJson from "@/lib/useGithubJson";
import { useEffect, useState } from "react";

export default function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;
  const [detailobj, setDetailobj] = useState<
    | {
        name: string;
        website: string;
        avatarUrl: string;
        type: string;
        info: string;
        id: string;
      }
    | undefined
  >();

  const JSONData = useGithubJson();

  useEffect(() => {
    function fetchDetail() {
      const obj =
        JSONData &&
        Object.values(JSONData!)
          .filter((item) => item.id === id)
          .pop();
      setDetailobj(obj);
    }
    fetchDetail();
  }, [id, JSONData]);
  return (
    <div className="max-h-full flex flex-col">
      <div className="h-full min-h-[90vh] max-h-full p-1">
        <div className="h-full min-h-[90vh] grid grid-cols-3 gap-2">
          <InfoCard
            className="flex-1 col-span-1 transition-all hover:scale-105 hover:cursor-pointer "
            name={detailobj?.name}
            avatarUrl={detailobj?.avatarUrl}
            id={detailobj?.id}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
