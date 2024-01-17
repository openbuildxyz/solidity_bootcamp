import * as PIXI from "pixi.js";
import { GameSettings } from "../../../utils/settings";
import { Interactable } from "../interactions/interactable.js";

export const AddHouseObject = (app, x, y) => {
  let house1 = new Interactable(
    PIXI.Sprite.from("house.png"),
    "This is my house.\n\n\n\n\n[Press X to close dialogue]",
    "structure"
  );
  app.stage.addChild(house1.sprite);
  house1.sprite.x = x;
  house1.sprite.y = y;
};
