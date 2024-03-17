import { LineItem, InvoiceStatus, TermType } from "@prisma/client";

export type InvoiceCreateRequest = {
  clientId: number;
  invoiceNumber: string;
  termTypeId: number;
  lineItems?: LineItem[];
  notes?: string;
  status?: InvoiceStatus;
  termType: TermType;
}