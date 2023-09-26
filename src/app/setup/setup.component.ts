import { Component, inject, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Zones } from 'src/shared/enums/zones.enum';
import { SetupService } from '../services/setup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent {
  
  readonly setUpService = inject(SetupService);

  readonly Zone = Zones;
  
  frm = new FormGroup({
    qtyRounds: new FormControl('', [Validators.required]),
    qtyExercises: new FormControl('', [Validators.required]),
    totalMinPerExcercise: new FormControl('', [Validators.required]),
    timeoutTime: new FormControl('', [Validators.required]),
    qtyPeople: new FormControl('', [Validators.required]),
    zone: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) { }

  start(): void {
    if (this.frm.invalid) return;

    this.setUpService.setInitialSetup({
      qtyRounds: Number.parseInt(this.frm.value.qtyRounds ?? '1', 10),
      qtyExercises: Number.parseInt(this.frm.value.qtyExercises ?? '1', 10),
      totalMinPerExcercise: Number.parseInt(this.frm.value.totalMinPerExcercise ?? '1', 10),
      timeoutTime: Number.parseInt(this.frm.value.timeoutTime ?? '1', 10),
      qtyPeople: Number.parseInt(this.frm.value.qtyPeople ?? '1', 10),
      zone: this.frm.value.zone as Zones
    });

    this.router.navigate(['/main']);
  }
 
}
