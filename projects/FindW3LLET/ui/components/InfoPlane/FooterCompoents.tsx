import { CardFooter } from "@nextui-org/card";
import { Wbtn } from "./Wbtn";
import GBtn from "./GBtn";

export type FooterProps = {
  btnContent: string;
  w: boolean;
  id: string;
};

// to-do write comments updates
export default async function FooterComponents ({
  btnContent,
  w,
  id,
} : FooterProps) {
  //const { isEmpty , commendsArr} = await useRedis('1');

  return (
    <CardFooter>
      {!w  && (
        <GBtn btnContent={btnContent} id={id} />
      )}
      {w && <Wbtn btnContent={btnContent} />}
    </CardFooter>
  );
};
