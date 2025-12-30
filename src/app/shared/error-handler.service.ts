import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handleHttpError(error: HttpErrorResponse, context: string = '') {
    switch (error.status) {
      case 0:
        console.error(`🚫 Network error while ${context}: Server unreachable.`);
        break;
      case 400:
        console.error(`⚠️ Bad Request while ${context}:`, error.error?.errorMsg || 'Invalid data.');
        break;
      case 401:
        console.error(`🔒 Unauthorized while ${context}:`, error.error?.errorMsg || 'Login required.');
        break;
      case 403:
        console.error(`🚫 Forbidden while ${context}:`, error.error?.errorMsg || 'Access denied.');
        break;
      case 404:
        console.error(`❌ Not Found while ${context}:`, error.error?.errorMsg || 'Resource missing.');
        break;
      case 500:
        console.error(`💥 Internal Server Error while ${context}:`, error.error?.errorMsg || 'Server crashed.');
        break;
      case 503:
        console.error(`⚙️ Service Unavailable while ${context}:`, error.error?.errorMsg || 'Try again later.');
        break;
      default:
        console.error(`❗ Unexpected error (${error.status}) while ${context}:`, error.error?.errorMsg || error.message);
    }
  }
}
