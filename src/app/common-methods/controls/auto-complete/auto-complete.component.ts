import {
  Component, OnInit, OnChanges, OnDestroy,
  Input, Output, EventEmitter, ViewChild, SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AutoCompleteDropDown } from '../../models/autoComplete';

@Component({
  standalone: false,
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit, OnChanges, OnDestroy {

  @Input() selectProperties!: AutoCompleteDropDown;
  @Output() selectionChange = new EventEmitter<any>();
  @Output() propValueEvent = new EventEmitter<any>();

  // ✅ Matches #autoCmpt in template; static: false because it's inside *ngIf
  @ViewChild('autoCmpt', { static: false }) autoCmpt!: any;

  keyUp = false;
  filterList: any[] = [];
  limit = 25;
  offset = 0;

  private valueee: any;
  private destroy$ = new Subject<void>();

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.filterOptions('');
    this.applyDisabledState();
    this.subscribeToValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['selectProperties']) return;

    this.valueee = this.ctrl?.value;
    this.filterOptions('');

    // Re-subscribe when the bound object is swapped out entirely
    if (!changes['selectProperties'].firstChange) {
      this.destroy$.next();
      this.subscribeToValueChanges();
    }

    setTimeout(() => {
      this.ctrl?.setValue(this.valueee);
      this.applyDisabledState();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private get ctrl() {
    return this.selectProperties?.selectFormGroup
      ?.controls[this.selectProperties?.formControlName];
  }

  private applyDisabledState(): void {
    const shouldDisable =
      this.selectProperties?.disabled || this.ctrl?.disabled;
    shouldDisable ? this.ctrl?.disable() : this.ctrl?.enable();
  }

  private subscribeToValueChanges(): void {
    this.ctrl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        const v = this.ctrl?.value;
        this.offset = 0;
        this.filterOptions(typeof v === 'string' ? v : '');
      });
  }

  // ─── Filtering ──────────────────────────────────────────────────────────────

  filterOptions(searchTerm: any): void {
    const items = this.selectProperties?.items;
    if (!items?.length) { this.filterList = []; return; }

    const term = searchTerm != null ? String(searchTerm).toLowerCase().trim() : '';
    const source = term
      ? items.filter(o =>
          o[this.selectProperties.controlName]?.toString().toLowerCase().includes(term))
      : items;

    this.filterList = source.slice(0, this.offset + this.limit);
  }

  // Replaces the old setItems + assignResourceCopy
  setItems(value: any): void {
    this.offset = 0;
    this.filterOptions(value);
  }

  // ─── Scroll ─────────────────────────────────────────────────────────────────

  onScroll(): void {
    const panel: HTMLElement = this.autoCmpt?.panel?.nativeElement;
    if (!panel) return;

    if (panel.scrollHeight - (panel.scrollTop + panel.clientHeight) < 200) {
      this.offset += this.limit;
      this.filterOptions(this.ctrl?.value ?? '');
    }
  }

  // ─── Keyboard ───────────────────────────────────────────────────────────────

  keyUpFunction(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return;
    }

    this.propValueEvent.emit({
      propertyName: this.selectProperties?.formControlName,
      value
    });

    if (value) {
      const match = this.filterList.find(
        e => e[this.selectProperties.controlName]?.toLowerCase() === value.toLowerCase()
      );
      this.keyUp = !match;
    } else {
      this.keyUp = false;
    }
  }

  // ─── Appearance ─────────────────────────────────────────────────────────────

  get appearance(): 'outline' | 'fill' {
    const a = this.selectProperties?.appearance;
    return (a === 'fill') ? 'fill' : 'outline';
  }

  // ─── Display ────────────────────────────────────────────────────────────────

  get displayDataFn() {
    return (data: any) => {
      if (data == null || data === '') return null;
      const found = this.selectProperties?.items?.find(
        x => x[this.selectProperties.controlId] === data
      );
      return found ? found[this.selectProperties.controlName] : null;
    };
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  checVal(value: string): void {
    if (this.selectProperties?.showDefaultSelect === false) {
      const match = this.selectProperties.items?.find(
        e => e[this.selectProperties.controlName]?.toLowerCase()?.trim()
          === value?.toLowerCase()?.trim()
      );

      if (match) {
        this.ctrl?.setValue(match[this.selectProperties.controlId]);
        this.keyUp = false;
      }

      this.checkValidValue();
    }
  }

  private checkValidValue(): void {
    const value = this.ctrl?.value;
    if (value == null || value === '') return;

    if (this.keyUp) {
      this.ctrl?.setValue('');
      this.ctrl?.setErrors({ incorrect: true });
    } else {
      this.ctrl?.setErrors(null);
    }
  }

  // ─── Selection ──────────────────────────────────────────────────────────────

  getId(event: any): void {
    const value = event.option.value;
    this.selectionChange.emit(value);
    this.propValueEvent.emit({
      propertyName: this.selectProperties?.formControlName,
      value
    });
  }
}