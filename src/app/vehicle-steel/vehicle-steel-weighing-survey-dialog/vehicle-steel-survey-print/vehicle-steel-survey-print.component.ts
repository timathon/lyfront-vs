import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@app/shared/services/auth.service';
import { SurveyedMaterial, VehicleSteelWeighingSurvey } from '@app/shared/services/data/data-vehicle-steel';
import { UtilsService } from '@app/shared/services/utils.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-vehicle-steel-survey-print',
  templateUrl: './vehicle-steel-survey-print.component.html',
  styleUrls: ['./vehicle-steel-survey-print.component.scss']
})
export class VehicleSteelSurveyPrintComponent implements OnInit {

  paddingForm: FormGroup;
  materialsArr: any[];
  selectedPws: any[];
  todayDate = new Date();
  userName: any;
  valueLessPwId = '60b046d142632c04fb202b57';
  taxRatioCtrl = new FormControl();

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { vsws: VehicleSteelWeighingSurvey, pws: any[], prices: any[], changesSaved$$: Subject<any> },
    public utils: UtilsService,
    private dialogRef: MatDialogRef<VehicleSteelSurveyPrintComponent>,

  ) {
    this.userName = this.auth.getCurrentUser()?.displayName;
    // this.userName = 'a';

    const paddingCache = localStorage.getItem('surveyPrintPaddingCache') ?
      JSON.parse(localStorage.getItem('surveyPrintPaddingCache') as string) :
      {
        top: 0, bottom: 0, left: 0, right: 0
      };
    this.paddingForm = this.fb.group(paddingCache);
    this.materialsArr = this.prepareMaterialsArr(this.data.vsws.survey.materials);
    this.selectedPws = this.data.pws.filter(pw => pw.name.indexOf('废钢') > -1 && pw.name.indexOf('公斤') > -1);
  }

  prepareMaterialsArr(materials: SurveyedMaterial[]) {
    // at least 5 rows
    if (materials.length > 4) {
      return materials;
    } else {
      const thatArr = Array(5).fill(null).map((item, index) => {
        return materials[index] ? materials[index] : null
      });
      console.log(thatArr);
      return thatArr;
    }
  }

  getPwCode(material: SurveyedMaterial) {
    const pwName = this.getPwName(material);
    switch (true) {
      case pwName.indexOf('轻薄料') > -1:
        return 23;
      case pwName.indexOf('中型') > -1:
        return '待查';
      case pwName.indexOf('汽油') > -1:
        return '待查';
      case pwName.indexOf('柴油') > -1:
        return '待查';
      case pwName.indexOf('杂质') > -1:
        return 27;
      default:
        return '待查'
    }
  }

  getWeightTon(material: SurveyedMaterial) {
    return ((material.weightKG as number) / 1000);
  }

  getTotalWeightTon(materials: SurveyedMaterial[]) {
    // filter out 杂质 60b046d142632c04fb202b57
    return materials.reduce((acc, curr) => {
      return curr.pwId !== this.valueLessPwId ?
        (curr.weightKG ? (curr.weightKG as number) / 1000 + acc : acc) :
        acc;
    }, 0)
  }

  getTotalAmount(materials: SurveyedMaterial[]) {
    const totalAmount0 = materials.reduce((acc, curr) => {
      return curr.pwId !== this.valueLessPwId ?
        (curr.price ? (curr.price as number) * (curr.weightKG as number) + acc : acc) :
        acc;
    }, 0)
    return totalAmount0 * (1 + (this.data.vsws.taxRatio ? this.data.vsws.taxRatio * 0.01 : 0));
  }

  getAveragePrice(materials: SurveyedMaterial[]) {
    return Math.round((this.getTotalAmount(materials) / this.getTotalWeightTon(materials) * 100)) / 100;
  }

  getAmount(material: SurveyedMaterial) {
    return (material.price || 0) * (material.weightKG || 0);
  }

  getDefaultPrice(material: SurveyedMaterial, prices: any[]) {
      const pwId = material.pwId;
        const [priceItem] = prices.filter(item => item.pwId === pwId);
        if (priceItem) {
          return priceItem.numbers.default * 1000;
        } else {
          return '';
        }

  }

  ngOnInit(): void {
    console.log(this.data);
  }

  getPwName(material: SurveyedMaterial) {
    if (material) {
      const [pw] = this.selectedPws.filter(item => item._id === material.pwId);
      return (pw as any).name.replace('（公斤）', '');
    } else {
      return '';
    }
  }

  ngOnDestroy() {
    if (this.paddingForm.dirty) {
      console.log('changed');
      localStorage.setItem('surveyPrintPaddingCache', JSON.stringify(this.paddingForm.getRawValue()));
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get padding() {
    const paddingObj = this.paddingForm.getRawValue();
    return `${paddingObj.top}px ${paddingObj.right}px ${paddingObj.bottom}px ${paddingObj.left}px`;
  }

  onBtnPrintClick() {
    window.print();
    // let printData = document.getElementById('dataToPrint')?.cloneNode(true);
    // if (printData) {
    //   document.body.appendChild(printData);
    //   window.print();
    //   document.body.removeChild(printData);
    // }
  }


}
