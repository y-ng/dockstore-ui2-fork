import { Component, Input, OnInit } from '@angular/core';

import { DockstoreService } from '../../shared/dockstore.service';
import { ContainerService } from '../container/container.service';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewContainerComponent implements OnInit {
  @Input() tag;

  constructor(private dockstoreService: DockstoreService,
              private containerService: ContainerService) { }

  getDateTimeString(timestamp) {
    return this.dockstoreService.getDateTimeString(timestamp);
  }

  getSizeString(size) {
    return this.containerService.getSizeString(size);
  }

  ngOnInit() {
  }

}