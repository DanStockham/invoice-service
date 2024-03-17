import express from 'express';
import { InvoiceCreateRequest } from '@server/models/InvoiceRequest';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs';
import { Company, Invoice, InvoiceStatus, LineItem, PrismaClient, TermType } from '@prisma/client';

const invoicesRouter = express.Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceCreateRequest'
 *     responses:
 *       '201':
 *         description: Invoice created successfully
 *       '400':
 *         description: Bad request, invoice could not be created
 *     tags:
 *       - Invoices
 */
invoicesRouter.post('/', async (req, res) => {
  const payload = req.body as InvoiceCreateRequest;
  const currentDateTime = new Date();

  await prisma.invoice.create({
    data: {
      InvoiceNumber: payload.invoiceNumber,
      Notes: payload.notes,
      LineItems: {
        createMany: {
          data: payload.lineItems
        }
      },
      Status: InvoiceStatus.INITIALED,
      termTypeId: payload.termTypeId,
      CreatedBy: 'api user',
      DateCreated: currentDateTime,
      companyId: payload.clientId,
    }
  });

  await res.status(201).send({})

})


/**
 * @openapi
 * /generate-invoice/{invoiceNumber}:
 *   get:
 *     summary: Generate an invoice
 *     parameters:
 *       - in: path
 *         name: invoiceNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice number
 *     responses:
 *       '200':
 *         description: Invoice generated successfully
 *       '404':
 *         description: Invoice not found
 *     tags:
 *       - Invoices
 */
invoicesRouter.get('/generate-invoice/:invoiceNumber', async (req, res) => {
  const invoiceNumber = req.params['invoiceNumber'];
  let invoice: Invoice;
  let company: Company;
  let lineItems: LineItem[];
  let termType: TermType;

  try {
    invoice = await prisma.invoice.findFirst({
      where: {
        InvoiceNumber: invoiceNumber
      }
    });

    if(!invoice) {
      return res.sendStatus(404);
    }

    company = await prisma.company.findFirst({
      where: {
        Id: invoice.companyId
      }
    });

    lineItems = await prisma.lineItem.findMany({
      where: {
        invoiceId: invoice.Id
      },
      include: {
        Offering: true
      }
    })

    termType = await prisma.termType.findFirst({
      where: {
        Id: invoice.termTypeId
      }
    });
  } catch(ex) {
    throw ex;
  }

  const calculatedValues = {
    grandTotal: lineItems.reduce((acc: number, curr: any) => acc + (curr.Offering.CostPerUnit * curr.Quantity), 0)
  }

  const templateFile = fs.readFileSync('src/templates/invoice-template.hbs', 'utf-8');
  const template = Handlebars.compile(templateFile);
  const html = template({ 
    invoice, 
    company, 
    lineItems, 
    termType,
    calculatedValues
  });

  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();

  await page.setContent(html);

  await page.pdf({ path: 'test.pdf', format: 'A4' });
  browser.close();

  const pdfBase64 = fs.readFileSync('test.pdf', 'base64');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=test.pdf`);

  return res.send(Buffer.from(pdfBase64, 'base64'));
});

export default invoicesRouter;