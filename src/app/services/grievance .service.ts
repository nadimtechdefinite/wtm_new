import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class grievanceService {

    private dashboardReloadSubject = new BehaviorSubject<number>(0);;

  dashboardReload$ = this.dashboardReloadSubject.asObservable();


  constructor() {}
triggerDashboardReload() {
    console.log('🔥 Dashboard reload triggered from SIDEBAR');
    this.dashboardReloadSubject.next(Date.now()); // UNIQUE VALUE
  }
  
}
