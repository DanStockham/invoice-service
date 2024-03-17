import { Address, Phone } from "@prisma/client";

export type ClientRequest = {
  email: string;
  address?: Address;
  phones: Phone[];
  name: string;
}