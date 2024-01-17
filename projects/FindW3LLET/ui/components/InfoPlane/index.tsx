import { Card } from "@nextui-org/card";
import clsx from "clsx";
import { FC } from "react";
import HeaderComponents from "./HeaderComponents";
import { HeaderProps } from "./HeaderComponents";
import BodyComponetns from './BodyComponents';
import { BodyProps } from "./BodyComponents";
import FooterComponents from "./FooterCompoents";
import { FooterProps } from "./FooterCompoents";

export type PlaneProps = {
  className?: string;
  header: HeaderProps;
  body: BodyProps;
  footer: FooterProps;
};

export const InfoPlane: FC<PlaneProps> = ({ className, header, body, footer }) => {
  const PlaneClassNames = clsx(className);
  console.log(header,body,footer);
  return (
    <Card className={PlaneClassNames}>
      <HeaderComponents title={header.title} btnContent={header.btnContent}/>
      <BodyComponetns bodyType={body.bodyType} id={body.id} />
      <FooterComponents btnContent={footer.btnContent} id={footer.id} w={footer.w}  />
    </Card>
  );
};
