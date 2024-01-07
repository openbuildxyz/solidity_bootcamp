// 0表示未mint 1表示车位空 2表示他人占用 3表示自己占用(3仅出现在朋友的车库)
export enum ParkingStatus {
  NOT_MINT = 0,
  EMPTY = 1,
  PARKED_BY_FRIEND = 2,
  PARKED_BY_ME = 3,
}
