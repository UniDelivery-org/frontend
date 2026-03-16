import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  ChevronRight,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-angular';
import { VerificationStatus, IdentityType } from '../../../../core/models/models';
import { Store } from '@ngrx/store';
import { identityVerificationActions } from '../../../identity-verifications/store/identity-verification.actions';
import {
  selectDocuments,
  selectIsLoading,
  selectTotalElements,
} from '../../../identity-verifications/store/identity-verification.reducer';
import { IdentityDocsFilter } from '../../../identity-verifications/data-access/identity-verification.dto';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { adminUserActions } from '../../store/admin-users.actions';
import { selectUsersPage } from '../../store/admin-users.reducer';
@Component({
  selector: 'app-verifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './verifications.html',
})
export class VerificationsComponent implements OnInit, AfterViewInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  readonly Search = Search;
  readonly Filter = Filter;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Eye = Eye;
  readonly FileText = FileText;
  readonly ChevronRight = ChevronRight;
  readonly Check = Check;
  readonly X = X;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly ArrowUpRight = ArrowUpRight;

  @ViewChildren('docCard') docCards!: QueryList<ElementRef>;

  readonly VerificationStatus = VerificationStatus;
  readonly IdentityType = IdentityType;
  statusOptions = Object.values(VerificationStatus);
  typeOptions = Object.values(IdentityType);

  filterForm!: FormGroup;

  currentPage = 0;
  pageSize = 10;

  isRejectModalOpen = false;
  documentToRejectId: string | null = null;
  rejectionReasonCtrl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  isInspectModalOpen = false;
  inspectedDoc: any | null = null;

  docs$ = this.store.select(selectDocuments);
  isLoading$ = this.store.select(selectIsLoading);
  totalElements$ = this.store.select(selectTotalElements);
  users = this.store.selectSignal(selectUsersPage);

  constructor() {}

  ngOnInit() {
    this.initFilterForm();
    this.loadDocuments();
    this.store.dispatch(adminUserActions.loadAllUsers({}));
  }

  ngAfterViewInit() {}

  initFilterForm() {
    this.filterForm = this.fb.group({
      ownerId: [''],
      type: [''],
      status: [''],
      createdAfter: [''],
      createdBefore: [''],
      rejectionReason: [''],
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadDocuments();
  }

  resetFilters() {
    this.filterForm.reset({
      status: '',
    });
    this.applyFilters();
  }

  loadDocuments() {
    const rawFormValue = this.filterForm.value;

    const activeFilters: IdentityDocsFilter = {
      page: this.currentPage,
      size: this.pageSize,
    };

    Object.keys(rawFormValue).forEach((key) => {
      const value = rawFormValue[key];
      if (value !== null && value !== undefined && value !== '') {
        (activeFilters as any)[key] = value;
      }
    });

    this.store.dispatch(
      identityVerificationActions.loadAllDocuments({
        filter: activeFilters,
      }),
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadDocuments();
  }

  approve(id: string) {
    this.store.dispatch(
      identityVerificationActions.verifyDocument({
        documentId: id,
        request: { status: VerificationStatus.APPROVED },
      }),
    );
  }

  openRejectModal(id: string) {
    this.documentToRejectId = id;
    this.rejectionReasonCtrl.reset();
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.documentToRejectId = null;
    this.rejectionReasonCtrl.reset();
  }

  confirmReject() {
    if (this.rejectionReasonCtrl.invalid || !this.documentToRejectId) {
      this.rejectionReasonCtrl.markAsTouched();
      return;
    }

    this.store.dispatch(
      identityVerificationActions.verifyDocument({
        documentId: this.documentToRejectId,
        request: {
          status: VerificationStatus.REJECTED,
          rejectionReason: this.rejectionReasonCtrl.value,
        },
      }),
    );

    this.closeRejectModal();
  }

  openInspectModal(doc: any) {
    this.inspectedDoc = doc;
    this.isInspectModalOpen = true;
  }

  closeInspectModal() {
    this.isInspectModalOpen = false;
    setTimeout(() => {
      this.inspectedDoc = null;
    }, 200);
  }
}
