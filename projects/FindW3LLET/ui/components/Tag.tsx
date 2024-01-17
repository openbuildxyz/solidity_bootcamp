import { Chip } from "@nextui-org/chip";
import { FC } from "react";

type TagProps = {
    context: string | undefined;
  };

const Tag: FC<TagProps> = ({ context }) => {
    return (
        <Chip radius="full" className="px-2 max-w-full overflow-x-scroll text-sm flex shadow">{context}</Chip>
    );
  };

export default Tag;