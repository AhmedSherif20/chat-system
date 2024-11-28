export interface BaseApiResponse {
  isSuccess: boolean;
  errors?: { code: string; description: string }[];
}
