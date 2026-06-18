import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SharedService] });
    service = TestBed.inject(SharedService);
  });

  // ── creation ──────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── emitChange / changeEmitted$ ───────────────────────────────────────────

  describe('emitChange / changeEmitted$', () => {
    it('emits the supplied value to subscribers', (done) => {
      service.changeEmitted$.subscribe(val => {
        expect(val).toEqual({ action: 'refresh' });
        done();
      });
      service.emitChange({ action: 'refresh' });
    });

    it('emits multiple distinct values in order', () => {
      const received: any[] = [];
      service.changeEmitted$.subscribe(v => received.push(v));

      service.emitChange('first');
      service.emitChange('second');
      service.emitChange(42);

      expect(received).toEqual(['first', 'second', 42]);
    });

    it('delivers to multiple simultaneous subscribers', () => {
      const a: any[] = [];
      const b: any[] = [];

      service.changeEmitted$.subscribe(v => a.push(v));
      service.changeEmitted$.subscribe(v => b.push(v));

      service.emitChange({ action: 'broadcast' });

      expect(a).toEqual([{ action: 'broadcast' }]);
      expect(b).toEqual([{ action: 'broadcast' }]);
    });

    it('does not replay past values for new subscribers (Subject, not BehaviorSubject)', () => {
      const first: any[] = [];
      service.changeEmitted$.subscribe(v => first.push(v));
      service.emitChange('old-value');

      const late: any[] = [];
      service.changeEmitted$.subscribe(v => late.push(v));

      expect(late).toEqual([]);
    });
  });

  // ── emitChangeLoading / changeEmittedLoading$ ─────────────────────────────

  describe('emitChangeLoading / changeEmittedLoading$', () => {
    it('emits showLoader:true', (done) => {
      service.changeEmittedLoading$.subscribe(v => {
        expect(v).toEqual({ showLoader: true });
        done();
      });
      service.emitChangeLoading({ showLoader: true });
    });

    it('emits showLoader:false', (done) => {
      service.changeEmittedLoading$.subscribe(v => {
        expect(v).toEqual({ showLoader: false });
        done();
      });
      service.emitChangeLoading({ showLoader: false });
    });

    it('emits consecutive show/hide pairs correctly', () => {
      const received: any[] = [];
      service.changeEmittedLoading$.subscribe(v => received.push(v));

      service.emitChangeLoading({ showLoader: true });
      service.emitChangeLoading({ showLoader: false });
      service.emitChangeLoading({ showLoader: true });
      service.emitChangeLoading({ showLoader: false });

      expect(received).toEqual([
        { showLoader: true },
        { showLoader: false },
        { showLoader: true },
        { showLoader: false },
      ]);
    });
  });

  // ── emitChengesecDrawer / chengesecDrawer ─────────────────────────────────

  describe('emitChengesecDrawer / chengesecDrawer (EventEmitter)', () => {
    it('fires the EventEmitter when emitChengesecDrawer is called', (done) => {
      service.chengesecDrawer.subscribe(() => done());
      service.emitChengesecDrawer();
    });

    it('fires EventEmitter multiple times', () => {
      let count = 0;
      service.chengesecDrawer.subscribe(() => count++);

      service.emitChengesecDrawer();
      service.emitChengesecDrawer();
      service.emitChengesecDrawer();

      expect(count).toBe(3);
    });
  });

  // ── emitNameChange / changesName ──────────────────────────────────────────

  describe('emitNameChange / changesName', () => {
    it('emits the supplied name to subscribers', (done) => {
      service.changesName.subscribe(name => {
        expect(name).toBe('Alice');
        done();
      });
      service.emitNameChange('Alice');
    });

    it('emits null correctly', (done) => {
      service.changesName.subscribe(v => {
        expect(v).toBeNull();
        done();
      });
      service.emitNameChange(null);
    });
  });

  // ── clientApprovalUrl ─────────────────────────────────────────────────────

  describe('clientApprovalUrl', () => {
    it('is undefined by default', () => {
      expect(service.clientApprovalUrl).toBeUndefined();
    });

    it('can be set and read back', () => {
      service.clientApprovalUrl = { pathname: '/dashboard/home', search: '' };
      expect(service.clientApprovalUrl.pathname).toBe('/dashboard/home');
    });

    it('can be reset to empty string (login flow clears it)', () => {
      service.clientApprovalUrl = { pathname: '/somewhere' };
      service.clientApprovalUrl = '';
      expect(service.clientApprovalUrl).toBe('');
    });
  });
});
