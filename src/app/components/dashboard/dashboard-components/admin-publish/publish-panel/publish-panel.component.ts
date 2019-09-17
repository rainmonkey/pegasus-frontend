import { Component, OnInit } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "./publish-upload";
import { AdminPublishService } from "../../../../../services/http/admin-publish.service";
import { UsersService } from "../../../../../services/http/users.service";

@Component({
  selector: "app-publish-panel",
  templateUrl: "./publish-panel.component.html",
  styleUrls: ["./publish-panel.component.css"]
})
export class PublishPanelComponent implements OnInit {
  public Editor = ClassicEditor;
  public model = {
    editorData: "<p>Hello, world!</p>",
    title: "",
    radio: 1
  };
  titleNode;
  node: Node;
  parser = new DOMParser();
  previewFlag: boolean;
  userId;

  constructor(
    private publishService: AdminPublishService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem("userID");
  }

  onReady = eventData => {
    eventData.plugins.get("FileRepository").createUploadAdapter = loader => {
      return new UploadAdapter(loader);
    };
  };

  prepareData = () => {
    this.node = document.querySelector("#previewContainer");
    this.titleNode = document.createElement("header");
    this.titleNode.innerHTML =
      "<h4><strong>" + this.model.title + "</strong></h4>";
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.firstChild);
    }
    const doc = this.parser.parseFromString(this.model.editorData, "text/html");
    const bodyElement = doc.documentElement.querySelector("body");
    bodyElement.insertBefore(this.titleNode, bodyElement.firstElementChild);
    bodyElement.classList.add("ck-content");
    bodyElement.style.setProperty("margin", "1rem", "important");
    const image = bodyElement.getElementsByTagName("img")[0]; // 默认第一张图为封面
    const data: any = {};
    if (image && this.model.title) {
      data.newsData = doc.documentElement.innerHTML;
      data.NewsTitle = this.model.title;
      // data.imgSrc = image.src || "";
      data.UserId = +this.userId;
      data.NewsType = this.model.radio + "";
      data.Categroy = 1;
      data.IsTop = 1;
      return data;
    } else {
      alert("Please fill all the fields");
    }
  };

  onClick = () => {
    const data = this.prepareData();
    this.publishService.postNews(data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
    console.log(data);
    // let prepareData =this.prepareData();
    // console.log(prepareData);
    // let postObj = {
    //   NewsTitle:"dd",
    //   NewsType:1,
    //   Categroy:1,
    //   IsTop:1,
    //   NewsData:"prepareData.imgSrc",
    //   UserId:Number(localStorage.getItem('userID'))
    // }
    // this.usersService.postNews(postObj).subscribe(
    //   res=>{
    //     console.log(res);
    //     },
    //     error=>{
    //       console.log(error);
    //     }
    // )
  };

  preview = () => {
    const data = this.prepareData();
    console.log(data.content);
    this.node.appendChild(data.content);
  };
}
