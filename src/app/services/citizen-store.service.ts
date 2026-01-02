import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { masterService } from '../services/master.service';

@Injectable({
  providedIn: 'root'
})
export class CitizenStoreService {

  private citizenDetailsSubject = new BehaviorSubject<any>(null);
  citizenDetails$ = this.citizenDetailsSubject.asObservable();

  constructor(
    private masterService: masterService
  ) {}
  

  /** 🔥 API CALL ONLY HERE */
  loadCitizenDetails(citizenId: number, mobileNo: string) {
  // ✅ Prevent duplicate API calls
  if (this.citizenDetailsSubject.value) return;

  if (!citizenId || !mobileNo) return;
  this.masterService.citizenDetails(citizenId, mobileNo).subscribe({
    next: (res: any) => {
      this.citizenDetailsSubject.next(res?.data ?? null);
      sessionStorage.setItem("name",JSON.stringify(res?.data.name))
    }, 
    error: err => console.error('API Error:', err)
  });
}


  /** Optional: direct access */
  getCitizenDetails() {
    return this.citizenDetailsSubject.value;
  }
}
