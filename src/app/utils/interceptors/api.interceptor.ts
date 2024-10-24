import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const newReq = req.clone({
        url: (environment.apiConfig.urlPrefix || '') + req.url,
        withCredentials: environment.apiConfig.withCredentials || false,
    });
    return next(newReq);
};
