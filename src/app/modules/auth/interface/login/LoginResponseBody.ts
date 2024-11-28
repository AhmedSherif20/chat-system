import { BaseApiResponse } from '../../../../interfaces/BaseApiResponse';
import { User } from '../../../../interfaces/User';

export interface LoginResponseBody extends BaseApiResponse, User {}
