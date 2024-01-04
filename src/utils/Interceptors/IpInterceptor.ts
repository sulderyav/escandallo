// ip.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IpInterceptor implements NestInterceptor {
  private readonly propertyName: string;
  private readonly location: 'body' | 'params' | 'query' = 'body';
  constructor(propertyName: string, location?: 'body' | 'params' | 'query') {
    this.propertyName = propertyName;
    this.location = location || 'body';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // const ipAddress = request.ip; // This will get the IP address from the request object
    console.log(request.headers['x-forwarded-for']);
    console.log(request.connection.remoteAddress);
    let ipAddress =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log('ORIGINAL: ipAddress', ipAddress);

    if (ipAddress.substr(0, 7) == '::ffff:') {
      ipAddress = ipAddress.substr(7);
    }
    // if (ipAddress.substr(0, 7) == '::1') {
    //   ipAddress = '127.0.0.1';
    // }
    console.log('ipAddress', ipAddress);

    switch (this.location) {
      case 'body':
        request.body[this.propertyName] = ipAddress;
        break;
      case 'params':
        request.params[this.propertyName] = ipAddress;
        break;
      case 'query':
        request.query[this.propertyName] = ipAddress;
        break;
      default:
        break;
    }

    return next.handle();
  }
}
