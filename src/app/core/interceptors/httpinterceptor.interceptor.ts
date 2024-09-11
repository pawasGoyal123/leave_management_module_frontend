import { HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
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

  return next(req).pipe(map((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      if (event.status>=200 && event.status<300 && event.body.message) {
        
        toastr.success(event.body.message);
      }
    }
    return event;
  }),
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

      console.error('HTTP Error:', error);
      toastr.error(errorMessage);

      return throwError(() => error);
    })
  );
};
