import express from 'express';

const locationRouter = express();

locationRouter.get('/test', (_req, res) => {
  return res.send('this is a test');
});

export default locationRouter;
