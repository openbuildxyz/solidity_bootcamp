export class Singleton {
  public static getInstance(): any {
    let Class: any = this;
    if (!Class._Instance) {
      Class._Instance = new Class();
      if (Class._Instance.initialize) {
        Class._Instance.initialize();
      }
    }
    return Class._Instance;
  }
}
