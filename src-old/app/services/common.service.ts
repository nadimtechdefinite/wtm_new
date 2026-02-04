import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpApiService } from '../services/http-api.service';
import { Observable } from 'rxjs';


////with Auth
const getMinistryWithApi = environment.apiUrl + "getMinistry";
const getSchemeListWithAPi = environment.apiUrl + "getScheme";
const getSchemeOnAdminLevelApi = environment.apiUrl + "getSchemeOnAdmin";
const getStateListWithApi = environment.apiUrl + "getState";
const getDistritcListWitApi = environment.apiUrl + "getDistrict";
const getBlockListWithAPi = environment.apiUrl + "getBlock";
const getGpListWithApi = environment.apiUrl + "getGp";
const getVillageListWithApi = environment.apiUrl + "getVillage";
const generateOtpWithApi = environment.apiUrl + "generateOtp";
//seema
const baseurl = environment.apiUrl + "citizenDashboard/"



//Dashbord Summary

const getDashboardSummary = environment.apiUrl + 'insideDashboard/summary';

const getSchemeWiseSummary = environment.apiUrl + "insideDashboard/schemeWiseSummary";

const getSchemeCitizens = environment.apiUrl + 'insideDashboard/schemeCitizens';
const schemeCitizensPending = environment.apiUrl + 'insideDashboard/schemeCitizensPending';




// WIthout Auth
const getMinistryApi = environment.apiUrl + "citizen/getMinistry";
const getSchemeListtApi = environment.apiUrl + "citizen/getScheme";
const generateRandomReport = environment.apiUrl + "reports/randomReportData";
const getStateListApi = environment.apiUrl + "citizen/getState";
const getDistritcListApi = environment.apiUrl + "citizen/getDistrict";
const getBlockListApi = environment.apiUrl + "citizen/getBlock";
const getGpListApi = environment.apiUrl + "citizen/getGp";
const getVillageListApi = environment.apiUrl + "citizen/getVillage";

const getComplaintSubCategoryAPi = environment.apiUrl + "citizen/getComplaintSubCategory";

const captchaApi = environment.apiUrl + "auth/captcha/generate";
const verifyCaptchaApi = environment.apiUrl + "citizen/validateCaptcha";

// const generateOtpApi = environment.apiUrl + "citizen/generateOtp";
const generateOtpApi = environment.apiUrl + 'citizen/generateOtpWithoutMob';
const verifyOtpApi = environment.apiUrl + "citizen/validateOtp";
const validateOtp = environment.apiUrl + 'citizen/validateOtpComplaint';

const saveGrievanceApi = environment.apiUrl + "citizen/saveGrievance";

const generateGrievancePdfApi = environment.apiUrl + "citizen/generatePdf";

const isMobileNoExist = environment.apiUrl + "citizen/"


@Injectable({
  providedIn: 'root'
})
export class CommonService extends HttpApiService {


  generateRandomReport() {
    return this.getApi(`${generateRandomReport}`);
  }


  getGrievanceDetails(grievanceNumber: string): Observable<any> {
    const url = `${environment.apiUrl}reviewUpdateStatus/getGrievancesByStatus`;
    return this.getApi(url) as Observable<any>;
  }




  // constructor(public http: HttpClient) { }

  // With Auth ///////////////////////////////Start //////////////////////

  getMinistryWith() {
    return this.getApi(`${getMinistryWithApi}`);
  }

  getSchemeListWith() {
    return this.getApi(`${getSchemeListWithAPi}`);
  }

  getSchemeOnAdminLevel() {
    return this.getApi(`${getSchemeOnAdminLevelApi}`);
  }

  getStateListWith() {
    return this.getApi(`${getStateListWithApi}`);
  }
  getDistritcListWith(stateCode: any) {
    return this.getApi(`${getDistritcListWitApi}?stateCode=${stateCode}`);
  }
  getBlockListWith(districtCode: any) {
    return this.getApi(`${getBlockListWithAPi}?districtCode=${districtCode}`);
  }
  getGpListWith(blockCode: any) {
    return this.getApi(`${getGpListWithApi}?blockCode=${blockCode}`);
  }
  getVillageListWith(gpCode: any) {
    return this.getApi(`${getVillageListWithApi}?gpCode=${gpCode}`);
  }

  generateOtpWith(mobile: any) {
    return this.getApi(`${generateOtpWithApi}?mobile=${mobile}`);
  }

  // With Auth ///////////////////////////////End //////////////////////


  // At Dashboard methods call
  getDashboardSummary() {
    return this.getApi(`${getDashboardSummary}`);
  }

  getSchemeWiseSummary(category: string): Observable<any> {
    return this.getApi(`${getSchemeWiseSummary}/${category}`);
  }

  getSchemeCitizens(schemeId: number, category: string) {
    if (category === 'registered' || category === 'disposed' || category === 'inProgress' || category === 'rejected') {
      return this.http.get<any[]>(`${getSchemeCitizens}/${schemeId}/${category}`);
    } else {
      return this.http.get<any[]>(`${schemeCitizensPending}/${schemeId}/${category}`);
    }

  }









  //// Without Auth /////////////////////////////Start////////////////////////

  getMinistry() {
    return this.getApiWithoutToken(`${getMinistryApi}`);
  }

  getSchemeList() {
    return this.getApiWithoutToken(`${getSchemeListtApi}`);
  }
  getStateList() {
    return this.getApiWithoutToken(`${getStateListApi}`);
  }
  getDistritcList(stateCode: any) {
    return this.getApiWithoutToken(`${getDistritcListApi}?stateCode=${stateCode}`);
  }
  getBlockList(districtCode: any) {
    return this.getApiWithoutToken(`${getBlockListApi}?districtCode=${districtCode}`);
  }
  getGpList(blockCode: any) {
    return this.getApiWithoutToken(`${getGpListApi}?blockCode=${blockCode}`);
  }
  getVillageList(gpCode: any) {
    return this.getApiWithoutToken(`${getVillageListApi}?gpCode=${gpCode}`);
  }


  getComplaintSubCategory(schemeCode: any) {
    return this.getApiWithoutToken(`${getComplaintSubCategoryAPi}?schemeCode=${schemeCode}`);
  }

  generateGrievancePdf(compNo: string, name: String, scheme: String) {
    return this.http.get(`${generateGrievancePdfApi}?compNo=${compNo}&name=${name}&scheme=${scheme}`, {

      responseType: 'blob' as 'json' // This tells Angular to treat the response as binary data
    });
  }


  // Common Apis

  generateOtp(ComplainId: any) {
    return this.getApiWithoutToken(`${generateOtpApi}?grievanceNum=${ComplainId}`);
  }
  verifyOtp(body: any) {
    return this.http.post(validateOtp, body);
  }
  
  saveGrievance(json: any) {
    return this.http.post(`${saveGrievanceApi}`, json);
  }

  generateCaptcha(sessionId: string) {
    return this.getApiWithoutToken(`${captchaApi}?sessionId=${sessionId}`)
  }
  

  verifyCaptcha(json: any) {
    return this.postApiWithoutToken(`${verifyCaptchaApi}`, json);
  }


  //seema
  getCitizenDetails(citzenUrl: any, mobile: any): Observable<any> {
    return this.http.get(baseurl + citzenUrl, { params: { mobileNo: mobile } })
  }

  isMobileNoExist(citzenUrl: any, mobile: any): Observable<any> {
    return this.http.get(isMobileNoExist + citzenUrl, { params: { mobileNo: mobile } })
  }
}



