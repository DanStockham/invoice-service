import { PrismaClient } from "@prisma/client";
import { ClientRequest } from "@server/models/ClientRequest";
import express from "express";

const clientsRouter = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientRequest'
 *     responses:
 *       '201':
 *         description: Client created successfully
 *       '400':
 *         description: Bad request, client could not be created
 *     tags:
 *       - Clients
 */
clientsRouter.post('/', async (req, res) => {
  const payload = req.body as ClientRequest;
  const { address } = payload;

  const addressContents = {
    Address: {
      create: address
    }
  }

  let data = {
    Name: payload.name,
    Phones: {
      create: payload.phones || [],
    },
    Email: payload.email,

  }

  if(address) {
    data = { ...addressContents, ...data}
  }
  await prisma.company.create({
    data,
    include: {
      Address: true,
      Phones: true
    }
  });

  res.sendStatus(201);
});

export default clientsRouter;