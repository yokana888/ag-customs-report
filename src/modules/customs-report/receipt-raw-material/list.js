import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    info = { page: 1, size: 50 };

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 4
        }
    };


    search() {
        this.error = {};

        if (!this.dateTo || this.dateTo == "Invalid Date")
            this.error.dateTo = "Tanggal Akhir harus diisi";

        if (!this.dateFrom || this.dateFrom == "Invalid Date")
            this.error.dateFrom = "Tanggal Awal harus diisi";


        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.flag = true;
            this.info.page = 1;
            this.info.total = 0;
            this.searching();
        }
    }

    searching() {

        var args = {
            page: this.info.page,
            size: this.info.size,
            dateFrom: this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
        }
        this.service.search(args)

            .then(result => {
                this.totalqty = 0;
                this.totalprice =0;
                this.rowCount = [];
                var rowDoc = [];
                this.info.total = result.info.total;
                var index = 0;
                this.data = [];
                for (var i of result.data) {
                    var type = i.BeacukaiNo.toString();
                    if (!this.rowCount[type]) {
                        this.rowCount[type] = 1;
                    } else {
                        this.rowCount[type]++;
                    }
                    this.totalqty += i.SmallQuantity;
                    this.totalprice += i.Amount;
                    i.SmallQuantity = i.SmallQuantity.toLocaleString('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    i.Amount = i.Amount.toLocaleString('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                    this.data.push(i);
                }

                for (var b of result.data) {
                    let clastype = result.data.find(o => o.BeacukaiNo == b.BeacukaiNo);
                    if (clastype) {
                        clastype.rowspan = this.rowCount[b.BeacukaiNo]
                    }
                }


                //    for(var a of result.data){
                //        var bc=a.BCType.toString();
                //        var doc=a.BCNo;
                //        var bcdate = a.BCDate.toString();
                //        if(!this.rowCount[bc]){
                //            this.rowCount[bc]=1;
                //        }
                //        else{
                //            this.rowCount[bc]++;
                //        }

                //        if(!rowDoc[doc+bc]){
                //            index++;
                //            //a.count=index;
                //            rowDoc[doc+bc]=1;
                //        }
                //        else{
                //            rowDoc[doc+bc]++;
                //        }

                //        if(!rowDoc[bc+bcdate]){
                //         index++;
                //         //a.count=index;
                //         rowDoc[bc+bcdate]=1;
                //         }
                //         else{
                //             rowDoc[bc+bcdate]++;
                //         }
                //    }
                //    for(var b of result.data){
                //        let bcno=result.data.find(o=> o.BCType + o.BCNo==b.BCType + b.BCNo);
                //        if(bcno){
                //            bcno.docspan=rowDoc[b.BCNo+b.BCType];
                //        }
                //        let bctipe=result.data.find(o=> o.BCType ==b.BCType);
                //        if(bctipe){
                //            bctipe.rowspan=this.rowCount[b.BCType];
                //        }
                //        let bcdates=result.data.find(o=> o.BCType + o.BCDate == b.BCType + b.BCDate);
                //        //console.log(bcdates)
                //        if(bcdates){
                //             bcdates.bcdatespan=rowDoc[b.BCType + b.BCDate];
                //        }
                //    }
                //    this.data=result.data;
            });

    }

    changePage(e) {
        var page = e.detail;
        this.info.page = page;
        this.searching();
    }
    reset() {
        this.dateFrom = "";
        this.dateTo = "";
        this.data = [];
        this.info.page = 1;
    }

    ExportToExcel() {
        this.error = {};

        if (!this.dateTo || this.dateTo == "Invalid Date")
            this.error.dateTo = "Tanggal Akhir harus diisi";

        if (!this.dateFrom || this.dateFrom == "Invalid Date")
            this.error.dateFrom = "Tanggal Awal harus diisi";


        if (Object.getOwnPropertyNames(this.error).length === 0) {
            var info = {
                dateFrom: this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
                dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
            }
            this.service.generateExcel(info);
        }
    }

    formatRecordDate(recordDate) {
        if (!recordDate || recordDate === '-' || recordDate === '0001-01-01' || recordDate.includes('0001')) {
            return '-';
        }

        const date = new Date(recordDate);

        // Pastikan valid date
        if (isNaN(date.getTime())) return '-';

        // Format: "29 Okt 2025"
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

}