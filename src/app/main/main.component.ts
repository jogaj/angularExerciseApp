import { OnInit, Component, inject } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  readonly setUpService = inject(SetupService);
  
  ngOnInit(): void {
    this.setUpService.start();
  }
}
