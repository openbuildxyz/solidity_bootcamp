import { BigNumber, ethers } from "ethers";
import { BaseDTO } from "./BaseDTO";
import { CarDTO } from "./CarDTO";
import { ParkingDTO } from "./ParkingDTO";

export class PlayerDTO extends BaseDTO {
  address: string = "";

  parkings: ParkingDTO[] = [];
  cars: CarDTO[] = [];

  public get hasParkings(): boolean {
    return this.parkings.length > 0;
  }

  public get hasCars(): boolean {
    return this.cars.length > 0;
  }

  public async balance() {
    // parking
    let balanceParking = ethers.constants.Zero;
    for (let i = 0; i < this.parkings.length; i++) {
      const value: string = await this.parkings[i].getBalance();
      balanceParking = balanceParking.add(value);
    }

    // car
    let balanceCar = ethers.constants.Zero;
    for (let i = 0; i < this.cars.length; i++) {
      const value = await this.cars[i].getBalance();
      balanceCar = balanceCar.add(value);
    }

    const balance = balanceParking.add(balanceCar);

    return balance;
  }
}
