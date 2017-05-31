import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';

import { HttpService } from './http.service';

@Injectable()
export class ToolService {

  constructor(private httpService: HttpService) { }

  getPublishedToolByPath(path: string, toolType: string) {
    console.log(`${ Dockstore.API_URI }/${ toolType }/path/${ path }/published`);
    return this.httpService.getResponse(`${ Dockstore.API_URI }/${ toolType }/path/${ path }/published`);
  }
  getPublishedWorkflowByPath(path: string) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/workflows/path/workflow/${ path }/published`);
  }

}
