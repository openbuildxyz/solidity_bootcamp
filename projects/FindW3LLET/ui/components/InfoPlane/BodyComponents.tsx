import { CardBody } from "@nextui-org/card";
import DetailPage from "./DetailPage";
import CommentsPage from "./CommentsPage";

export type BodyProps = {
    bodyType: "Detail" | "AComments";
    id: string;
  };
  
  const BodyConfig = {
    ["Detail"]: { bodyClass: "flex flex-col gap-2", useComponent: "detail" },
    ["AComments"]: { bodyClass: "flex gap-2", useComponent: "acomments" },
  };
  
export default function BodyComponetns ({ bodyType, id } : BodyProps)  {
    const BodyClass = BodyConfig[bodyType].bodyClass;
    const BodyComponents = BodyConfig[bodyType].useComponent; 
  
    return (
      <CardBody className={BodyClass}>
        {BodyComponents === "detail" && <DetailPage id={id}/>}
        {BodyComponents === "acomments" && <CommentsPage id={id}/>}
      </CardBody>
    );
  };