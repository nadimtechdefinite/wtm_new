import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpApiService } from '../services/http-api.service';
import { Observable } from 'rxjs';


//master api
const getschemeMasterList = environment.apiUrl + "schemeMaster";
const getStateMaster = environment.apiUrl + "stateMaster";
const getDistritcListApi = environment.apiUrl + "districtsmaster";
const getBlockListApi = environment.apiUrl + "blocksmaster";
const getpanchayatmaster = environment.apiUrl + "panchayatmaster"
const getVillagemaster = environment.apiUrl + "villagemaster"
const grievanceregister = environment.apiUrl + "citizenregistration/register";
const isMobileNoExist = environment.apiUrl + "citizenregistration/verifyMobile"
const saveGrievance = environment.apiUrl + "citizen/saveGrievance";
const getCitizenDetails = environment.apiUrl + "citizenregistration/citizen-details";
const ministryMaster = environment.apiUrl + "ministryMaster";
const getcommentsaAttachments = environment.apiUrl + "comments-attachments";
const getstatusDetail = environment.apiUrl + "statussmaster/statusDetail?key";
const getadminSummary = environment.apiUrl + "pd-admin/summary";

//auth api
const generateOtpApi = environment.apiUrl + 'auth/generate-otp';
const validateOtp = environment.apiUrl + 'auth/verify-otp';
const captchaApi = environment.apiUrl + "auth/captcha/generate";
const verifyCaptchaApi = environment.apiUrl + "auth/captcha/validate?captcha";
const getGrievanceDetailsForAdmin = environment.apiUrl + "pd-admin/grievanceDetails?schemeId";
const COMMENTS_ATTACHMENTS_URL = environment.apiUrl + "comments-attachments/save";
@Injectable({
  providedIn: 'root'
})
export class masterService extends HttpApiService {


  ///master api///
  getStateMaster() {
    return this.getApiWithoutToken(`${getStateMaster}`);
  }

  getDistritcList(stateCode: any) {
    return this.getApiWithoutToken(`${getDistritcListApi}/${stateCode}`);
  }

  getBlockList(stateCode: any, districtCode: any) {
    return this.getApiWithoutToken(`${getBlockListApi}/${stateCode}/${districtCode}`);
  }

  panchayatmaster(stateCode: any, districtCode: any, blockCode: any) {
    return this.getApiWithoutToken(`${getpanchayatmaster}/${stateCode}/${districtCode}/${blockCode}`);
  }

  getVillageList(stateCode: any, districtCode: any, blockCode: any,gpCode: any) {
    return this.getApiWithoutToken(`${getVillagemaster}/${stateCode}/${districtCode}/${blockCode}/${gpCode}`);
  }

  grievanceregister(json: any) {
    return this.http.post(`${grievanceregister}`, json);
  }
  
    saveGrievance(json: any) {
    return this.http.post(`${saveGrievance}`, json);
  }

    isMobileNoExist( mobile: any): Observable<any> {
      return this.http.get(isMobileNoExist, { params: { mobileNo: mobile } })
    }

      generateOtp(mobile: any) {
        return this.http.post(`${generateOtpApi}`, mobile,{
      withCredentials: true // important to preserve session
    });
        
      }

  verifyOtp(body: any) {
    return this.http.post(validateOtp, body,{
      withCredentials: true // important to preserve session
    });
  }

    generateCaptcha() {
       return this.http.post(captchaApi, {},{
      withCredentials: true // important to preserve session
    });
  }

    verifyCaptcha(key: any) {
    return this.getApiWithSession(`${verifyCaptchaApi}=${key}`);
  }

  schemeMaster() {
    return this.getApi(`${getschemeMasterList}`);
  }

  citizenDetails(citizenId: any, mobile: any) {
    return this.getApiWithoutToken(`${getCitizenDetails}/${citizenId}/${mobile}`);
  }

  getcommentsaAttachments(citizenId: any, grievanceId: any) {
    return this.getApiWithoutToken(`${getcommentsaAttachments}/citizen/${citizenId}/grievance/${grievanceId}`);
  }


    getMinistry() {
    return this.getApiWithoutToken(`${ministryMaster}`);
  }

    getGrievanceDetailsForAdmin(stateCode: any) {
    return this.getApiWithoutToken(`${getGrievanceDetailsForAdmin}=${stateCode}`);
  }


  commentsAttachments(data: any):Observable<any> {
    debugger;
    return this.http.post(`${COMMENTS_ATTACHMENTS_URL}`, data);
  }

    getOfficerStatusDetail(key: any) {
    return this.getApiWithoutToken(`${getstatusDetail}=STATUS_${key}`);
  }

    adminSummaryDetails(schemeCode: any) {
    return this.getApiWithoutToken(`${getadminSummary}/${schemeCode}`);
  }

}



