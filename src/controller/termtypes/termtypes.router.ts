import { PrismaClient, TermType } from "@prisma/client";
import express from "express";

const termTypeRouter = express.Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new term type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TermType'
 *     responses:
 *       '201':
 *         description: Term type created successfully
 *       '400':
 *         description: Bad request, term type could not be created
 *     tags:
 *       - Term Types
 */
termTypeRouter.post('/', async (req, res) => {
  const payload = req.body as TermType;

  await prisma.termType.create({
    data: payload
  });

  await res.status(201).send({});
})

/**
 * @openapi
 * /list:
 *   get:
 *     summary: List all term types
 *     responses:
 *       '200':
 *         description: A list of term types
 *       '500':
 *         description: Server error
 *     tags:
 *       - Term Types
 */
termTypeRouter.get('/list', async (_req, res) => {
  const termTypes = await prisma.termType.findMany({});

  await res.send(termTypes);
});

export default termTypeRouter;