import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);

  const noTokenUrls = [
    'getStateListApi',
    'getDistrictListApi',
    'getVillageListApi',
    'saveGrievanceApi',
    'generateOtpApi',
  ];

  const citizenOtpUrl = 'validateOtpComplaint';
  let modifiedReq = req;
  const skipToken = noTokenUrls.some(url => req.url.includes(url));
  if (req.url.includes(citizenOtpUrl)) {
    const citizenToken = sessionStorage.getItem('citizentoken');
    if (citizenToken) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `2Bearer ${citizenToken}`
        }
      });
    }
  } else if (!skipToken) {
    const adminToken = sessionStorage.getItem('accessToken');
    if (adminToken) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${adminToken}`
        }
      });
    }
  }
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // your error handling...
      return throwError(() => new Error(error.message));
    })
  );
};

