import {Injectable} from '@angular/core';
import {CustomHttpService} from "../custom-http.service";
import {environment} from "../../environments/environment";
import 'rxjs/add/operator/map';

@Injectable()
export class CustomerService {

  private customerUrl = environment.api_server + 'customer/';

  constructor(private http: CustomHttpService) {
  }

  getAllCustomers(paginator) {
    let url = this.customerUrl + 'all/' + 'page=' + paginator;
    return this.http.get(url).map((res) => res.json());
  }

  setStatus(data: any) {
    let url = this.customerUrl + 'status_change/';
    return this.http.put(url, data).map((res) => res.json());
  }

  getCustomerDetails(id) {
    let url = this.customerUrl + 'details/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  updateCustomer(data: any) {
    let url = this.customerUrl + 'details/update';
    return this.http.put(url, data).map((res) => res.json());
  }

  createNewCustomer(data: any) {
    let url = this.customerUrl + 'create/';
    return this.http.post(url, data).map((res) => res.json());
  }

  searchByUsername(data: any) {
    let url = this.customerUrl + 'search/username/';
    return this.http.post(url, data).map((res) => res.json());
  }

  searchByMobileNumber(data: any) {
    let url = this.customerUrl + 'search/mobile_number/';
    return this.http.post(url, data).map((res) => res.json());
  }

  searchByArea(data: any) {
    let url = this.customerUrl + 'search/area/';
    return this.http.post(url, data).map((res) => res.json());
  }

  getCustomerByArea(data: any) {
    let url = this.customerUrl + 'search/customerByArea/';
    return this.http.post(url, data).map((res) => res.json());
  }

  setCheckGenerateInvoice(data: any) {
    let url = this.customerUrl + 'check_change_generate_invoice_monthly';
    return this.http.post(url, data).map((res) => res.json());
  }

  uploadFileContents(data: any) {
    let url = this.customerUrl + 'upload-file-contents';
    return this.http.post(url, data).map((res) => res.json());
  }

  getTotalCustomerCount(){
    let url = this.customerUrl + 'customer-count';
    return this.http.get(url).map((res) => res.json());
  }

  generateAutoInvoice(){
    let url = this.customerUrl + 'generate-auto-invoice';
    return this.http.get(url).map((res) => res.json());
  }
}
