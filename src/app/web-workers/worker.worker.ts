/// <reference lib="webworker" />

import { WorkerReturnType } from "src/shared/enums/worker-return.enum";

addEventListener('message', ({ data }) => {
  generateTimer(data.qtyExercises, data.totalMinPerExcercise, data.qtyRounds, data.timeoutTime);
});

function generateTimer(qtyExercises: number, totalMinPerExcercise: number, qtyRounds: number, timeoutTime: number): void {
  const target = getTargetDate(qtyExercises, totalMinPerExcercise, qtyRounds, timeoutTime).getTime();
  const interval = setInterval(() => {
      let now = new Date().getTime();
      let distance = target - now;
      if (distance < 0) {
          postMessage({type: WorkerReturnType.isEnd, value: true});
          clearInterval(interval);
          return;
      }
      const span = calculateSpan(distance);

      postMessage({type: WorkerReturnType.countdown, value: getTimeInString(span) });
      postMessage({type: WorkerReturnType.span, value: span });
  }, 1000);
}

function getTargetDate(qtyExercises: number, totalMinPerExcercise: number, qtyRounds: number, timeoutTime: number): Date {
  let dt = new Date();

  const totalMinRemaining = ((((qtyExercises * 2) * totalMinPerExcercise) * qtyRounds) + ((qtyRounds - 1) * timeoutTime));
  dt.setMinutes(dt.getMinutes() + totalMinRemaining);

  postMessage({type: WorkerReturnType.totalMinRemaining, value: totalMinRemaining });

  return dt;
}

function calculateSpan(distance: number): any {
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function getTimeInString(span: any): string {
  return `${span.hours}h : ${span.minutes}m : ${span.seconds}s`;
}