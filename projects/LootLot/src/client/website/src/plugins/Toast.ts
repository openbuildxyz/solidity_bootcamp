export class Toast {
  public static $app: any = null!;

  private static message(): any {
    return this.$app.config.globalProperties.$message;
  }

  static success(msg: string) {
    // @ts-ignore
    this.message().success(msg);
  }

  static error(msg: string) {
    // @ts-ignore
    this.message().error(msg);
  }

  static warn(msg: string) {
    // @ts-ignore
    this.message().warning(msg);
  }
}
