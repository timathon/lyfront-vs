import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';
import { DataService } from '@app/shared/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-steel-home',
  templateUrl: './vehicle-steel-home.component.html',
  styleUrls: ['./vehicle-steel-home.component.scss']
})
export class VehicleSteelHomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private backend: DataService
  ) { }

  ngOnInit(): void {
  }

  refresh() {
    const loadingDialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      data: {
        message: '正在更新物料名称...'
      }
    });
    this.backend.dataPws.refreshPws()
      .subscribe(() => {
        loadingDialogRef.close();
      })
  }

}
