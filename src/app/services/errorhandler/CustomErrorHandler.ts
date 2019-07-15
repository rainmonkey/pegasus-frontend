import { ErrorHandler, Injectable, Injector } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(
        private injector: Injector
        ) { }

    handleError(error) {
        Swal.fire({
            title: 'Error!',
            text: 'Sorry! Something wrong, ' + error,
            type: 'error',
        });
        //const router = this.injector.get(Router);
        //router.navigate(['/error/page']);
        //location.reload();
        throw error;
    }
}