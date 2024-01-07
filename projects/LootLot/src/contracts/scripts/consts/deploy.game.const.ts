export const gameDeploy = {
  systemIdPrefix: "lotloot.contracts.protocol",
  systems: [
    //below are eno systems
    //below are game systems
  ],
  //special system ids
  systemId: function (systemName: string) {
    switch (systemName) {
      default:
        return null;
    }
    return `${this.systemIdPrefix}.${systemName}`;
  },
};
