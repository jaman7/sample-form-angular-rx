import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { fadeInOut } from '@app/shared/animations/animations';
import { HomeService } from './content/home/home.service';
import { GLOBAL_RX_STATE } from '@app/core/store/global-store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  animations: [fadeInOut],
})
export class MainComponent {
  showOutlet = false;

  constructor(
    @Inject(GLOBAL_RX_STATE) private state,
    private router: Router,
    private homeService: HomeService
  ) {
    this.state.connect('periodicElements', this.homeService.getData());
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
