import { BaseApiResponse } from '../../../../interfaces/BaseApiResponse';

export interface GetAllUsersResponseBody extends BaseApiResponse {
  data: { id: string; userName: string }[];
}
