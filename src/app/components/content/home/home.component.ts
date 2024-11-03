import { Component, ComponentRef, Inject, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { setColumnsConfig } from '@app/shared/utils/colums';
import { IRowSelected, ITableColumn } from '@app/components/commons/table/table.models';
import { MatDialog } from '@angular/material/dialog';
import { UniversalDialogComponent } from '@app/components/commons/universal-dialog/universal-dialog.component';
import { DocOpenTypes } from '@app/shared/types/doc-types';
import { IModal } from '@app/components/commons/universal-dialog/universal-dialog.models';
import { OpenDocTypeEnum } from '@app/shared/enums';
import { TableButtonsOpenType } from '@app/components/commons/table/table.enums';
import { getMaxIdByKey, removeById } from '@app/shared/utils/arrays-utils';
import { RxState } from '@rx-angular/state';
import { IPeriodicElements } from './home.model';
import { HomeService } from './home.service';
import { TableEditComponent } from './table-edit/table-edit.component';
import { GLOBAL_RX_STATE, GlobalState } from '@app/core/store/global-store';

const { ADD } = OpenDocTypeEnum;
const { DELETE } = TableButtonsOpenType;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent', { static: true }) dialogContent!: TemplateRef<any>;

  #service = inject(HomeService);

  columns$: Observable<ITableColumn[]> = of(setColumnsConfig(this.#service.columnConfig));

  data: IPeriodicElements[] = [];

  modal: IModal = {
    type: undefined,
    id: undefined,
  };

  constructor(
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.globalState
      .select('periodicElements')
      .pipe(map((data) => data?.map((el, i) => ({ id: i + 1, ...el })) ?? []))
      .subscribe((elements) => {
        this.data = elements;
      });
  }

  ngOnDestroy(): void {
    this.data = [];
  }

  onDocAction(event: IRowSelected): void {
    const { id, openType, row } = event || {};
    if (openType === DELETE) {
      this.onClickDelete(id);
    } else if (openType) {
      this.modal = {
        type: openType as DocOpenTypes,
      };

      this.openDialog(this.modal, openType === ADD ? {} : row);
    }
  }

  onClickAdd(): void {
    this.modal = {
      type: ADD,
    };
    this.openDialog(this.modal, {});
  }

  updateTableRow(row: IPeriodicElements): void {
    const { id } = row || {};
    if (id) {
      this.data = this.data?.map((el) => (el.id === row.id ? row : el)) ?? [];
    } else {
      this.data = [...this.data, { ...row, id: getMaxIdByKey(this.data) }];
    }
  }

  onClickDelete(id: number): void {
    this.data = removeById(this.data, id);
  }

  openDialog(modal: IModal, row): void {
    const { type } = modal || {};
    const dialogRef = this.dialog.open(UniversalDialogComponent, {
      width: '500px',
      data: { title: `modal.${type.toLowerCase()}` },
    });

    dialogRef.afterOpened().subscribe(() => {
      const { viewContainerRef } = dialogRef.componentInstance;
      const componentRef: ComponentRef<TableEditComponent> = viewContainerRef.createComponent(TableEditComponent);
      componentRef.instance.data = { rowData: row, modal: this.modal };

      componentRef.instance.closeModal.subscribe((data: IPeriodicElements) => {
        dialogRef.close();
        this.updateTableRow(data);
      });
    });
  }
}
