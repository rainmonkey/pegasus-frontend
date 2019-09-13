import { Component, OnInit } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "./publish-upload";

@Component({
  selector: "app-publish-panel",
  templateUrl: "./publish-panel.component.html",
  styleUrls: ["./publish-panel.component.css"]
})
export class PublishPanelComponent implements OnInit {
  public Editor = ClassicEditor;
  public model = {
    editorData: "<p>Hello, world!</p>",
    title: ""
  };
  titleNode;
  node: Node;
  parser = new DOMParser();
  previewFlag: boolean;

  constructor() {}

  ngOnInit() {}

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
    return doc.documentElement;
  };

  onClick = () => {
    console.log(this.prepareData());
  };

  preview = () => {
    const doc = this.prepareData();
    this.node.appendChild(doc);
  };
}
