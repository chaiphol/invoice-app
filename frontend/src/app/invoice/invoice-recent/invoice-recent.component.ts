import { Router, NavigationExtras } from '@angular/router';
import { Product } from '../../product/product';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Customer } from '../../customer/customer';
import * as _ from 'underscore';
import { Invoice } from '../invoice';
import { ProductService } from '../../product/product.service';
import { AreaService } from '../../area/area.service';
import { CustomerService } from '../../customer/customer.service';

@Component({
  selector: 'app-invoice-recent',
  templateUrl: './invoice-recent.component.html',
  styleUrls: ['./invoice-recent.component.css']
})
export class InvoiceRecentComponent implements OnInit {
  public currentDate: number = Date.now();
  public invoiceList: Invoice[] = [];
  public searchMode = 'username';
  constructor(private customerService: CustomerService, private router: Router, private invoiceService: InvoiceService, private productService: ProductService, private areaService: AreaService) { }

  ngOnInit() {
    this.getRecentInvoice();
  }

  getRecentInvoice() {
    this.invoiceList = [];
    this.invoiceService.getRecentInvoice()
      .subscribe(
      (res: Customer[]) => {
        _.each(res, (customer: Customer) => {
          customer.productData = [];
          let tempInvoice: Invoice;

          // get all products
          if (customer.productList.length > 0) {
            _.each(customer.productList, (element) => {
              this.productService.getProductById(element)
                .subscribe(
                (res: Product) => {
                  customer.productData.push(res);
                },
                (err) => {
                }
                )
            });
          }
          // get area
          this.areaService.getAreaById(customer.area)
            .subscribe(
            (res) => {
              customer.areaData = res;
            }
            )

          let date = new Date();
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

          //prepare invoice
          tempInvoice = {
            customerData: customer,
            payment_due_date: firstDay,
            status: 'Due',
            discount: 0,
            invoice_created_date: firstDay,
            total: 0,
            amount_due: 0,
            productList: customer.productList
          }

          _.each(customer.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
              (res: Product) => {
                tempInvoice.total = tempInvoice.total + res.rate;
                tempInvoice.amount_due = tempInvoice.total;
              },
              (err) => {

              }
              )
          });

          this.invoiceList.push(tempInvoice);
        });
      },
      (err) => {
        console.log(err);
      }
      )
  }

  //change search filter
  filterChange(event: any) {
    this.searchMode = event;
  }

  //quick search
  quickSearch(event: any) {
    if (event == '') {
      this.getRecentInvoice();
      return;
    }
    let data = {
      text: event
    }
    let reg = new RegExp(event, "i");
    let resArray = [];
    if (this.searchMode == 'username') {
      _.each(this.invoiceList, (item) => {
        if (reg.test(item['customerData']['username'])) {
          resArray.push(item);
        }
      });
      this.invoiceList = resArray;
    }
    else if (this.searchMode == 'mobile_number') {
      _.each(this.invoiceList, (item) => {
        if (reg.test(item['customerData']['mobile_primary'])) {
          resArray.push(item);
        }
      });
      this.invoiceList = resArray;
    }
    else if (this.searchMode == 'area') {
      _.each(this.invoiceList, (item) => {
        if (reg.test(item['customerData']['areaData']['name'])) {
          resArray.push(item);
        }
      });
      this.invoiceList = resArray;
    }
  }

  //edit invoice
  editInvoice(invoice: Invoice) {
    let navextras: NavigationExtras = {
      queryParams: { "invoice": JSON.stringify(invoice) }
    };
    this.router.navigate(['/invoice/edit'], navextras);
  }

}
