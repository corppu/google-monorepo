import { createMapsService } from '@gm/lib-rest-maps';

import { MapsController } from './controllers/MapsController';

export const createMapsController = () => new MapsController(createMapsService);
