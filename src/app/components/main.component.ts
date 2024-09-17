import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoadingService } from '@app/core/loading/loading.service';
import { GLOBAL_RX_STATE } from '@app/core/store/global-store';
import { fadeInOut } from '@app/shared/animations/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { HomeService } from './content/home/home.service';

@UntilDestroy()
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  animations: [fadeInOut],
})
export class MainComponent implements OnInit {
  showOutlet = false;

  isLoading = true;

  constructor(
    @Inject(GLOBAL_RX_STATE) private state,
    private loadingService: LoadingService,
    private router: Router,
    private homeService: HomeService
  ) {
    // this.state.connect('periodicElements', this.homeService.getData());
    this.state.connect('periodicElements', this.homeService.getData());
  }

  ngOnInit(): void {
    this.loadingService.loading
      .pipe(
        untilDestroyed(this),
        tap((loading: boolean) => {
          setTimeout(() => {
            this.isLoading = loading;
          }, 5);
        })
      )
      .subscribe();
  }

  getActiveRoute(): string {
    return this.router.url;
  }

  onActivate(): void {
    this.showOutlet = true;
  }

  onDeactivate(): void {
    this.showOutlet = false;
  }

  getRouterOutletState(outlet: RouterOutlet): ActivatedRoute | string {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
