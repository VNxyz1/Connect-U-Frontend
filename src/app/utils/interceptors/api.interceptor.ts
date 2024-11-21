import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('i18n')) {
    const newReq = req.clone({
      url: (environment.apiConfig.urlPrefix || '') + req.url,
      withCredentials: environment.apiConfig.withCredentials || false,
    });
    console.log(newReq)
    return next(newReq);
  }
  return next(req);
};
