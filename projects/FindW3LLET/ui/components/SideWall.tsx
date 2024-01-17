import { Link } from "@nextui-org/link";
import { FW3_whole } from "./SvgComponents/FW3-whole-logo";
import { Button } from "@nextui-org/button";

export function SideWall() {
  return (
    <div className="bg-[#D9D9D9] h-full w-2/5 flex flex-col items-center px-10 ">
      <Link className="mt-64 mb-32" href="/">
        <FW3_whole />
      </Link>
      <h1 className="text-black font-bold text-2xl line-clamp-2 justify-center mb-64">
        Help you find the most suitable web3 wallet.
      </h1>
      <div className="flex flex-col items-end">
        <Button
          variant="bordered"
          className="text-black border-black min-w-[240px] mb-5"
          size="lg"
          as={Link}
          href="https://github.com/FindW3LLET/wallet-list/tree/main"
          radius="full"
        >
          add wbe3 wallet +
        </Button>
        <Button
          variant="bordered"
          className="text-black border-black min-w-[240px]"
          size="lg"
          radius="full"
          as={Link}
          href='/support'
        >
          support project +
        </Button>
      </div>
    </div>
  );
}
