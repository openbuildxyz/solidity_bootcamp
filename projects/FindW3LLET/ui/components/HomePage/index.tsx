"use client";
import { SelectorType, Selecter as TypeSelect } from "@/components/Selecter";
import useGithubJson from "@/lib/useGithubJson";
import { useEffect, useState } from "react";
import { InfoCard } from "../InfoCard";

type RenderCardsType = {
  name: string;
  website: string;
  avatarUrl: string;
  type: string;
  info: string;
  id: string;
};

export default function HomePage() {
  const [type, selectType] = useState("all");
  const [types, setTypes] = useState<SelectorType[]>([]);
  const [renderCards, changeRenderCards] = useState<RenderCardsType[]>([]);
  const handleSelectionChange = (e : any) => {
    selectType(e.target.value);
  };

  const JSONData = useGithubJson();

  useEffect(() => {
    function getAllType() {
      if (JSONData) {
        const _types =
          Object.values(JSONData).map((item) => {
            return { value: item.type.toUpperCase(), label: item.type };
          });
          _types.unshift({ value: "all".toString(), label: "ALL" })
        if (_types.length) setTypes(_types);
      }
    }
    getAllType();
  }, [JSONData]);

  useEffect(() => {
    function shuffleCards() {
      if (JSONData && type.toLowerCase() === "all") {
        changeRenderCards(Object.values(JSONData));
      } else if (JSONData && type.toLowerCase() !== "all") {
        const matchedCards = Object.values(JSONData).filter(
          (item) => item.type === type
        );
        changeRenderCards(matchedCards);
      }
    }
    shuffleCards();
  }, [type,JSONData]);

  return (
    <div className="max-h-full relative flex flex-col">
      <div className="mb-2 w-2/6 flex-shrink-0">
        <TypeSelect type={type} types={types} onChange={handleSelectionChange} />
      </div>
      <div className="h-full min-h-screen p-1">
        <div className="grid grid-cols-3 gap-1 ">
          {renderCards.map((item) => (
            <InfoCard
              className="transition-all hover:scale-105 hover:cursor-pointer"
              key={item.name}
              name={item.name}
              avatarUrl={item.avatarUrl}
              id={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
