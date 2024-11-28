import { BaseApiResponse } from '../../../../interfaces/BaseApiResponse';
import { User } from '../../../../interfaces/User';

export interface RegisterResponseBody extends BaseApiResponse, User {}
