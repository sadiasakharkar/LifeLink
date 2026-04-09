import { pathToFileURL } from "node:url";
import { bootstrapService } from "../services/bootstrapService.js";

export const seedLocalData = async () => {
  await bootstrapService.ensureSeedData();
  console.log("seeded local LifeLink data");
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await seedLocalData();
}
