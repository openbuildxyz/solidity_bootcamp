import {
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowRightAlt,
  ArrowUpward,
} from "@mui/icons-material";

import { IconButton, Sheet, Grid } from "@mui/joy";
import { convertStrToDirection } from "../../utils/convertStrToDirection";

export const FarmBtn = (props) => {
  return (
    <IconButton
      sx={btnStyle}
      onClick={() => {
        if (props.landId && props.landId > 0) {
          props.goToLand(props.landId);
        } else {
          props.mintLand(convertStrToDirection(props.direction));
        }
      }}
    >
      {props.direction === "up" ? (
        <ArrowUpward />
      ) : props.direction === "down" ? (
        <ArrowDownward />
      ) : props.direction === "left" ? (
        <ArrowBack />
      ) : props.direction === "right" ? (
        <ArrowForward />
      ) : (
        <ArrowRightAlt />
      )}
      {props.landId && props.landId > 0 ? (
        <>go to land ({props.landId})</>
      ) : (
        <>mint new land</>
      )}
    </IconButton>
  );
};
const btnStyle = {
  bgcolor: "rgba(255,255,255,0.9)",
  m: 1,
};
