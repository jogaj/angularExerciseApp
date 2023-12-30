import { Injectable, signal } from '@angular/core';
import { WorkerReturnType } from 'src/shared/enums/worker-return.enum';
import { Zones } from 'src/shared/enums/zones.enum';
import { Exercise } from 'src/shared/interfaces/exercise.model';
import { Setup } from 'src/shared/interfaces/setup.model';
import * as data from 'src/shared/json/data.json';

@Injectable({
    providedIn: 'root'
})
export class SetupService {
    public currentExecIdx = signal(-1);
    public countdown = signal<string>('');
    public isTimeout = signal(false);
    public isEnd = signal(false);
    public showNext = signal(false);
    public exercisesByPerson: any[] = [];
    public data: Exercise[] = [];
    private initialSetup?: Setup;
    private totalMinRemaining = 0;
    private exercisesCompleted = 0;

    get totalMinPerExcercise(): number {
        return this.initialSetup?.totalMinPerExcercise ?? 0;
    }

    get qtyRounds(): number {
        return this.initialSetup?.qtyRounds ?? 0;
    }

    get qtyExercises(): number {
        return this.initialSetup?.qtyExercises ?? 0;
    }

    get timeoutTime(): number {
        return this.initialSetup?.timeoutTime ?? 0;
    }

    get qtyPeople(): number {
        return this.initialSetup?.qtyPeople ?? 0;
    }

    get zone(): Zones {
        return this.initialSetup?.zone ?? Zones.core;
    }

    get isNextTimeOut(): boolean {
        return this.exercisesCompleted === (this.qtyExercises * 2);
    }

    constructor() {
        this.data = data as Exercise[];
    }

    setInitialSetup(value: Setup): void {
        this.initialSetup = {...value};        
    }

    start(): void {
        this.generateExerciseList();
        this.startWorker();
    }

    private changeIndexes(minutes: number, seconds: number): void {
        if ( minutes === (this.totalMinRemaining - this.totalMinPerExcercise)) {
            // console.log('B');
            // console.log('minutes '+minutes);
            // console.log('this.totalMinRemaining '+this.totalMinRemaining);
            // console.log('this.currentExecIdx '+this.currentExecIdx());
            if (this.exercisesCompleted === (this.qtyExercises * 2)) {
                this.exercisesCompleted = 0;
                this.totalMinRemaining = this.totalMinRemaining - this.timeoutTime;
                this.isTimeout.set(true);
            } else {
                this.totalMinRemaining = this.totalMinRemaining - this.totalMinPerExcercise;
                this.currentExecIdx.update((value)=> value + 1);
                this.exercisesCompleted += 1;
                this.isTimeout.set(false);
            }

            // console.log('exercisesCompleted '+this.exercisesCompleted);
            // console.log('this.totalMinRemaining '+this.totalMinRemaining);
            // console.log('this.currentExecIdx '+this.currentExecIdx());
        }
        
        // console.log(seconds);
        if(seconds > -1 && seconds < 10) {
            this.showNext.set(true);
        } else {
            this.showNext.set(false);
        }
    }

    private startWorker(): void {
        const worker = new Worker(new URL('../web-workers/worker.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
            switch(data.type) {
                case WorkerReturnType.isEnd:
                    this.isEnd.set(data.value);
                    break;
                case WorkerReturnType.countdown:
                    this.countdown.set(data.value);
                    break;
                case WorkerReturnType.span:
                    this.changeIndexes(data.value.minutes, data.value.seconds);
                    break;
                case WorkerReturnType.totalMinRemaining:
                    this.totalMinRemaining = data.value;
                    break;
            }
        };
        worker.postMessage({qtyExercises: this.qtyExercises, 
            totalMinPerExcercise: this.totalMinPerExcercise, 
            qtyRounds: this.qtyRounds, 
            timeoutTime: this.timeoutTime
        });
    }

    private generateExerciseList(): void {
        const randomIndexes = this.randomUnique(8, this.qtyExercises);
        // console.log(randomIndexes);
        const cardioEx = (this.data as any).default.filter((ex: Exercise) => ex.type === this.getKeyByValue(Zones.cardio, Zones));
        const selectedEx = (this.data as any).default.filter((ex: Exercise) => ex.type === this.zone);
        let list: Exercise[];
        for (let person = 0; person < this.qtyPeople; person++) {
            list = [];
            for (let round = 0; round < this.qtyRounds; round++) {
                randomIndexes.forEach(index => {
                    if (person % 2 === 0) {
                        list.push(selectedEx[index]);
                        list.push(cardioEx[index]);
                    } else {
                        list.push(cardioEx[index]);
                        list.push(selectedEx[index]);
                    }
                });
            }
            this.exercisesByPerson.push([...list]);
        }
        // console.log(this.exercisesByPerson);
    }

    private randomUnique(range: number, count: number): number[] {
        let nums = new Set<number>();
        while (nums.size < count) {
            nums.add((Math.floor(Math.random() * (range - 1 + 1) + 1)) - 1);
        }
        return [...nums];
    }

    private getKeyByValue(value: string, enumerator: any): string {
        const indexOfS = Object.values(enumerator).indexOf(value as unknown);
        const key = Object.keys(enumerator)[indexOfS];
        return key;
    }
}