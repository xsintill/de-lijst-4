// import { CustomMaterialModule } from "../material/material.module";
import { Component, OnInit, Input, Output } from "@angular/core";


@Component({
  selector: "lsn-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @Input() public title = "De Lijst 4.1";
  @Output() public goToListPage() {
    alert("goto list");
  }
  @Output() public goToEditPage() {
    alert("goto Edit");
  }
  @Output() public goToAddPage() {
    alert("goto Add");
  }

  constructor() { }

  ngOnInit() {
  }
}
