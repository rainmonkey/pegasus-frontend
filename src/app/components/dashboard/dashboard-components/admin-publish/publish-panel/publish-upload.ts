import { AdminPublishService } from "../../../../../services/http/admin-publish.service";

export default class UploadAdapter {
  loader;
  constructor(loader, public adminPublishService: AdminPublishService) {
    this.loader = loader;
  }

  upload = () => {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("photo", file);
          this.adminPublishService.uploadTitleImage(data).subscribe(
            res => {
              console.log(res["Data"]);
              resolve({ default: "http://gradspace.org:5000/" + res["Data"] });
            },
            err => reject(err)
          );
        })
    );
  };

  abort = () => {};
}
