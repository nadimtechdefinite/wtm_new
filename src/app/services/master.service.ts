import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpApiService } from '../services/http-api.service';
import { Observable, Subject } from 'rxjs';


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
const downloadDoc = environment.apiUrl + "file/download/";
const submitFeedback = environment.apiUrl + "citizen/submitFeedback";
const getFeedbackDetail = environment.apiUrl + "statussmaster/statusDetail?key";
const getpendingCountAdmin = environment.apiUrl + "pd-admin/pending?schemeId";
const auditTrailSave = environment.apiUrl + 'audit-trail/save';
const getCitizenhistory = environment.apiUrl + "citizen/history";

//auth api
const generateOtpApi = environment.apiUrl + 'auth/generate-otp';
const validateOtp = environment.apiUrl + 'auth/verify-otp';
const captchaApi = environment.apiUrl + "auth/captcha/generate";
const verifyCaptchaApi = environment.apiUrl + "auth/captcha/validate?captcha";
const getGrievanceDetailsForAdmin = environment.apiUrl + "pd-admin/grievanceDetails?schemeId";
const COMMENTS_ATTACHMENTS_URL = environment.apiUrl + "comments-attachments/save";
const changePasswordApi = environment.apiUrl + 'update-password/changePassword';
const citizenFeedback = environment.apiUrl + "application/feedback";

@Injectable({
  providedIn: 'root'
})
export class masterService extends HttpApiService {
isLoggingOut = false;
isLoggingIn = false;
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

  citizenFeedback(json: any) {
    return this.http.post(`${citizenFeedback}`, json);
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

  verifyCaptcha(data: any):Observable<any> {
      return this.http.post(verifyCaptchaApi, data,{
      withCredentials: true // important to preserve session
    });
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

  pendingCountForAdmin(stateCode: any, bucket: any):Observable<any> {
    return this.getApiWithoutToken(`${getpendingCountAdmin}=${stateCode}&bucket=${bucket}`);
  }

  commentsAttachments(data: any):Observable<any> {
    return this.http.post(`${COMMENTS_ATTACHMENTS_URL}`, data);
  }


    getOfficerStatusDetail(key: any) {
    return this.getApiWithoutToken(`${getstatusDetail}=STATUS_${key}`);
  }

  getcitizenStatus() {
    return this.getApiWithoutToken(`${getstatusDetail}=STATUS`);
  }

  feedbackStatusDetail(key: any) {
    return this.getApiWithoutToken(`${getFeedbackDetail}=${key}`);
  }

    adminSummaryDetails(schemeCode: any) {
    return this.getApiWithoutToken(`${getadminSummary}/${schemeCode}`);
  }

  downloadDoc(fileName: any) : Observable<Blob>{
    return this.http.get(`${downloadDoc}${fileName}`, {responseType: 'blob'} );
  }

  submitCitizenFeedback(data:any){
    return this.http.post(`${submitFeedback}`, data);
  }

    Citizenhistory(key: any) {
    return this.getApiWithoutToken(`${getCitizenhistory}/${key}`);
  }

   private auditActionSubject = new Subject<{ type: string; page: string }>();
  auditAction$ = this.auditActionSubject.asObservable();

  triggerAudit(type: string, page: string) {
    this.auditActionSubject.next({ type, page });
  }
saveAuditLog( type: 'LOGIN' | 'LOGOUT' | 'VISIT'| 'ADD_GRIEVANCE',page: string): Observable<any> {
 const user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const payload = {
    loginName: user?.mobileNo || user?.loginName,
    loginLogout: type,
    visitPage: page
  };

  return this.http.post(auditTrailSave, payload);
}
  
changePassword(data: any) {
  return this.putApi(changePasswordApi, data);
}

}



