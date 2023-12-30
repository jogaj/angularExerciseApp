import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { Exercise } from 'src/shared/interfaces/exercise.model';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  host: { class: 'app-exercise'}
})
export class ExerciseComponent implements OnChanges {
  @Input() personIdx: number;
  @Input() currentExecIdx: number;
  @Input() showNext: boolean;
  
  exercise = signal<any | Exercise>(undefined);
  next = signal<any | Exercise>(undefined); 

  readonly setUpService = inject(SetupService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personIdx']?.currentValue !== undefined || changes['currentExecIdx']?.currentValue !== undefined) {
      this.exercise.set(this.setUpService.exercisesByPerson[this.personIdx][this.currentExecIdx]);
    }
    if(changes['showNext']?.currentValue !== undefined) {
      if (changes['showNext'].currentValue === true && this.currentExecIdx + 1 < this.setUpService.data.length) {
        this.next.set(this.setUpService.exercisesByPerson[this.personIdx][this.currentExecIdx + 1]);
      } else {
        this.next.set(undefined);
      }
    }
  }
}
