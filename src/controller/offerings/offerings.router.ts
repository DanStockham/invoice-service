import { PrismaClient } from "@prisma/client";
import { OfferingCreateRequest } from "@server/models/OfferingRequest";
import express from "express";

const offeringRouter = express.Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new offering
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferingCreateRequest'
 *     responses:
 *       '201':
 *         description: Offering created successfully
 *       '400':
 *         description: Bad request, offering could not be created
 *     tags:
 *       - Offerings
 */
offeringRouter.post('/', async (req, res) => {
  const payload = req.body as OfferingCreateRequest;

  await prisma.offering.create({
    data: {
      Name: payload.name,
      CostPerUnit: payload.costPerUnit,
      Display: payload.name,
      IsActive: true,
      CreatedBy: 'api user',
    }
  });

  await res.status(201).send({});
})

offeringRouter.get('/list', async (_req, res) => {
  const offerings = await prisma.offering.findMany({
    where: { IsActive: true }
  })

  await res.send(offerings);
})

export default offeringRouter;
