let lastTime: number;

export function log(...args: any) {
  if (!lastTime) {
    console.log(new Date().toLocaleString(), ...args);
  } else {
    console.log(
      new Date().toLocaleString(),
      new Date().getTime() - lastTime,
      ...args
    );
  }
  lastTime = new Date().getTime();
}
