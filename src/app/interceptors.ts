import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SpinnerService } from './services/spinner.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { LoadingService } from './services/loading.service';



export const interceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingService, multi: true }
]