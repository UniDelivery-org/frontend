import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import { 
  VehicleCreateDTO, 
  VehicleResponseDTO, 
  VehicleSearchFilter 
} from '../data-access/vehicle.dto';

export const vehicleActions = createActionGroup({
  source: 'Vehicle',
  events: {
    'Load My Vehicles': props<{ page?: number; size?: number }>(),
    'Load My Vehicles Success': props<{ response: Page<VehicleResponseDTO> }>(),
    'Load My Vehicles Failure': props<{ error: ApiError }>(),

    'Load Active Vehicle': emptyProps(),
    'Load Active Vehicle Success': props<{ vehicle: VehicleResponseDTO }>(),
    'Load Active Vehicle Failure': props<{ error: ApiError }>(),

    'Create Vehicle': props<{ payload: VehicleCreateDTO }>(),
    'Create Vehicle Success': props<{ vehicle: VehicleResponseDTO }>(),
    'Create Vehicle Failure': props<{ error: ApiError }>(),

    'Set Active Vehicle': props<{ vehicleId: string }>(),
    'Set Active Vehicle Success': props<{ vehicle: VehicleResponseDTO }>(),
    'Set Active Vehicle Failure': props<{ error: ApiError }>(),

    'Search Vehicles': props<{ filter: VehicleSearchFilter }>(),
    'Search Vehicles Success': props<{ response: Page<VehicleResponseDTO> }>(),
    'Search Vehicles Failure': props<{ error: ApiError }>(),
  },
});
