import { getCarsCount } from "./products";
import carsData from "./data/cars.json";
import { Central } from "./central";

const carsCount = getCarsCount(carsData);

console.log("MuultiAgent - Car exchange");
console.log(`Cars data count: ${carsCount}`);

const central = new Central();

central.listSellers();
central.listBuyers();
central.startExchange().then(() => process.exit(0));
