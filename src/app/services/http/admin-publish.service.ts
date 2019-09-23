import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class AdminPublishService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getNews = () => {
    return this.http.get(this.baseUrl + "News");
  };

  postNews = data => {
    return this.http.post(this.baseUrl + "News", data);
  };

  uploadTitleImage = data => {
    return this.http.post(this.baseUrl + "News/UploadTitlePhoto", data);
  };
}
