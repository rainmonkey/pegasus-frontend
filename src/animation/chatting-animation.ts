import { trigger, state, style, transition, animate } from '@angular/animations';

export const Animations = {
    unReadMessage: trigger('unReadTrigger', [
        state('on', style({
            color: 'orange',
        })),
        state('off', style({
            color: 'white',   
        })),
    ]),
}