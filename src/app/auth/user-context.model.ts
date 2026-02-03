// user-context.model.ts
export interface UserContext {
  userCode: number;
  loginName: string;
  userName: string;
  userType: number;

  schemeCode: number;
  stateCode: number;
  districtCode: number;
  blockCode: number;
  panchayatCode: number;
  villageCode: number;

  exp: number;
}
