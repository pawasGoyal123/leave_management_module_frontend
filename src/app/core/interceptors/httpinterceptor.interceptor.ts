import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

function formatErrors(errors: { [key: string]: string[] }): string {
  return Object.entries(errors)
    .map(([category, messages]) => 
      `${category}:\n${messages.join('\n')}`
    )
    .join('\n\n');
}

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error) {
        const errorContent = error.error;
        
        if (errorContent.Message) {
          errorMessage = errorContent.Message;
        }

        if (errorContent.errors) {
          errorMessage = formatErrors(errorContent.errors);
        }
      }

      if (error.status === 500) {
        errorMessage = 'Internal Server Error. Please try again later.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      }

      console.error('HTTP Error:', error);
      toastr.error(errorMessage);

      return throwError(() => error);
    })
  );
};
