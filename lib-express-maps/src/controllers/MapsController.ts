import type { IMapsService } from '@gm/lib-contracts-maps';

import express, { Request, Response } from 'express';

const RS = String.fromCharCode(0x1e);

export class MapsController {
  public readonly router = express.Router();

  constructor(
    private readonly serviceFactory: (params: unknown) => IMapsService,
  ) {
    // Controller builds its own routes
    this.router.get('/maps/stream', this.stream);
  }

  readonly stream = async (req: Request, res: Response) => {
    console.log(req.query);
    const service = this.serviceFactory(req.query);

    res.setHeader('Content-Type', service.contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const abortController = new AbortController();
    req.on('close', () => abortController.abort());

    try {
      for await (const feature of service.stream(abortController.signal)) {
        res.write(RS);
        res.write(JSON.stringify(feature));
        res.write('\n');
      }

      res.end();
    } catch (err) {
      if (abortController.signal.aborted) return;

      console.error('MapsController stream error:', err);
      res.status(500).json({ error: 'Streaming failed' });
    }
  };
}
