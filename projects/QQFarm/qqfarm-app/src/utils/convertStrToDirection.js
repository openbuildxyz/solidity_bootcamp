export const convertStrToDirection = (str) => {
  if (str === "up") {
    return 0;
  } else if (str === "down") {
    return 1;
  } else if (str === "left") {
    return 2;
  } else if (str === "right") {
    return 3;
  } else {
    return 0;
  }
};
