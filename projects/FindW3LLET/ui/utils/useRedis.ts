import { getAllComments } from "@/lib/reids";

export async function useRedis(id :string) {
    const commentsRecord = await getAllComments();
    const commentsObjArr = Object.entries(commentsRecord);
    const isEmpty = commentsObjArr.length === 0
    const matchedComments = commentsObjArr.filter(([walletID, walletCommends]) => {
              if(walletID === id) return walletCommends
    })
    const arr = matchedComments.map(([_,commendsJSON]) => {
        return JSON.parse(commendsJSON);
    })
    const commendsArr = arr[0];
    return { isEmpty , commendsArr};
  }