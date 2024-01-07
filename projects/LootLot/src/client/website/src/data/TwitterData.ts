import { StringUtil } from "../core/utils/StringUtil";
import { Singleton } from "../core/game/Singleton";
import { APP_NAME } from "../const/Constants";
import axios from "axios";

export class TwitterData extends Singleton {
  public get tid(): string {
    return StringUtil.xor(`${process.env.VUE_APP_TOKEN_X_APP_ID}`, APP_NAME);
  }

  public get token(): string {
    return `${StringUtil.xor(
      `${process.env.VUE_APP_TOKEN_X_APP_SEC}`,
      APP_NAME
    )}jFRcPFELxnTqkO7V0pSf3J7JrCU_MSPnTYJ-OW-2t`;
  }

  async init() {
    // setTimeout(() => {
    //   this.authTwitter();
    // }, 5000);
  }

  async authTwitter() {
    // https://api.twitter.com/oauth/authenticate?oauth_token=rK6RqQAAAAABqq1gAAABi2C2HTY

    axios
      .get(
        `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
          this.tid
        }&redirect_uri=${encodeURIComponent(
          "https://lotloot.osairo.xyz"
        )}&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`
      )
      .then((response) => {
        // 处理响应
        console.log("返回值", response);
      })
      .catch((error) => {
        // 处理错误
        console.log("一次", error);
      });

    console.log(
      "request",
      `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
        this.tid
      }&redirect_uri=${encodeURIComponent(
        "https://lotloot.osairo.xyz"
      )}&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`
    );
  }
}

export const twitterData: Readonly<TwitterData> = TwitterData.getInstance();
