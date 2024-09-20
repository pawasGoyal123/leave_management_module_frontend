import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { formatErrors } from '../../shared/utils/formatErrors';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error) {
        const errorContent = error.error;
        //errorContent contains the error which is being sent from the backend

        if (errorContent.Message) {
          errorMessage = errorContent.Message;
        } else if (errorContent.errors) {
          errorMessage = formatErrors(errorContent.errors);
        } else if (error.status === 500 || error.status === 0) {
          errorMessage = 'Internal Server Error !.Please Try Again';
        } else if (error.status === 404) {
          errorMessage = 'Not Found Error';
        }
      }

      toastr.error(errorMessage);
      //incase of error a error toaster is shown and the error is thrown

      return throwError(() => error);
    })
  );
};
