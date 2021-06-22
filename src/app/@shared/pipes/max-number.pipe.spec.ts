import { MaxNumberPipe } from './max-number.pipe';

describe('MaxNumberPipe', () => {
    it('create an instance', () => {
        const pipe = new MaxNumberPipe();
        expect(pipe).toBeTruthy();
    });
});
