import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import { Sheet, Grid } from "@mui/joy";
import FarmCard from "../farmCard";
import _ from "lodash";
import { getMap, mintMap } from "../../services/web3";
import { FarmBtn } from "../../components/farmBtn";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ContractSettings } from "../../utils/settings";

export const Demo = () => {
  const { address } = useAccount();
  const [map, setMap] = useState({});
  const [currentLandId, setcurrentLandId] = useState(1);
  const [moveDirection, setMoveDirection] = useState(0);
  const { config } = usePrepareContractWrite({
    address: ContractSettings.contractAddress,
    abi: ContractSettings.contractABI,
    functionName: "mintLand", // 你想要调用的合约函数
    args: [currentLandId, moveDirection],
    overrides: {
      from: address,
      value: 0,
    },
  });
  const { write } = useContractWrite(config);

  // todo: write 成功之后刷新

  useEffect(() => {
    handleGetMap(currentLandId);
  }, [currentLandId]);

  const handleGetMap = (mapId) => {
    console.log("🚀 ~ file: index.jsx:20 ~ handleGetMap ~ mapId:", mapId);
    getMap(mapId, address).then((res) => {
      console.log("res: ", res);
      const mapData = {
        landId: Number(res?.landId),
        owner: res?.landOwner,
        landRewards: Number(res?.landRewards),
        u: Number(res?.u),
        d: Number(res?.d),
        l: Number(res?.l),
        r: Number(res?.r),
        g: Number(res?.g),
        s: Number(res?.s),
        data: res?.data,
      };
      console.log("🚀 ~ file: index.jsx:35 ~ getMap ~ mapData:", mapData);
      setMap(mapData);
    });
  };

  const handleMintLand = (direction) => {
    console.log("🚀 ~ file: index.jsx:57 ~ handleMintLand ~ direction:", direction)
    // mintMap(currentLandId, direction, address).then((res) => {
    //   console.log("res: ", res);
    // });
    // write();
    write?.(currentLandId, direction);
  };

  return (
    <Box
      sx={{
        backgroundImage: "url(pics/farm1.png)",
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(0,0,0,0.5)",
        }}
      >
        <Box>Owner: {map.owner}</Box>
        <Box>Rewards: {map.landRewards}</Box>
        <Box>LandId:</Box>
      </Box>
      <FarmBtn
        direction="up"
        landId={map.u}
        mintLand={handleMintLand}
        goToLand={setcurrentLandId}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FarmBtn
            direction="left"
            landId={map.l}
            mintLand={handleMintLand}
            goToLand={setcurrentLandId}
          />
        </Box>
        <Sheet
          variant="outlined"
          color="neutral"
          sx={{
            p: 4,
            width: "720px",
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "none",
          }}
        >
          <Grid
            container
            spacing={{ xs: 1, md: 3 }}
            columns={{ xs: 12, sm: 12, md: 12 }}
            sx={{ flexGrow: 1 }}
          >
            {_.range(9).map((i) => (
              <Grid item xs={4} sm={4} md={4} key={i}>
                <FarmCard />
              </Grid>
            ))}
          </Grid>
        </Sheet>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FarmBtn
            direction="right"
            landId={map.r}
            mintLand={handleMintLand}
            goToLand={setcurrentLandId}
          />
        </Box>
      </Box>
      <Box>
        <FarmBtn
          direction="down"
          landId={map.d}
          mintLand={handleMintLand}
          goToLand={setcurrentLandId}
        />
      </Box>
    </Box>
  );
};

const btnStyle = {
  bgcolor: "rgba(255,255,255,0.9)",
  m: 1,
};
