import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { ApiService } from "../api/api.service";



@Injectable()
export class NewsletterService {

    constructor(
      private http: HttpClient,
      private apiService: ApiService
    ) {

    }

    addPushSubscriber(sub:any) {
      return this.apiService.post('notifications', sub);
        // return this.http.post('/api/notifications', sub);
    }

    send() {
        return this.http.post('/api/newsletter', null);
    }

}
