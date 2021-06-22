import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maxNumber'
})
export class MaxNumberPipe implements PipeTransform {
    transform(value: number, max = 9): string | number {
        return value > max ? max + '+' : value;
    }
}
