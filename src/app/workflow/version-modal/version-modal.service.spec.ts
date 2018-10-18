/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { inject, TestBed } from '@angular/core/testing';

import { RefreshService } from '../../shared/refresh.service';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { RefreshStubService, WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { VersionModalService } from './version-modal.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';

describe('Service: version-modal.service.ts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VersionModalService,
              SessionQuery,
                { provide: WorkflowService, useClass: WorkflowStubService },
                { provide: WorkflowsService, useClass: WorkflowsStubService },
                { provide: RefreshService, useClass: RefreshStubService}
            ]
        });
    });
    const expectedError: any = {
        'message': 'oh no!',
        'errorDetails': 'oh yes'
    };
    const expectedWorkflow: any = {
        'repository': 'GitHub',
        'descriptorType': 'cwl',
        'gitUrl': 'asdf',
        'workflowName': ''
    };
    const expectedVersion: WorkflowVersion = {
        'name': 'expectedName',
        'reference': 'expectedReference'
    };
    it('should ...', inject([VersionModalService], (service: VersionModalService) => {
        expect(service).toBeTruthy();
    }));
    it('should be initially not visible', inject([VersionModalService], (service: VersionModalService) => {
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeFalsy());
    }));
    it('should be shown after set to true', inject([VersionModalService], (service: VersionModalService) => {
        service.setIsModalShown(true);
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeTruthy());
    }));
    it('should be able to set version', inject([VersionModalService], (service: VersionModalService) => {
        service.setVersion(expectedVersion);
        service.version.subscribe(version => expect(version).toEqual(expectedVersion));
    }));
    it('should be able to set test parameter files', inject([VersionModalService], (service: VersionModalService) => {
        service.setTestParameterFiles([]);
        service.testParameterFiles.subscribe(files => expect(files).toEqual([]));
    }));
    it('should be able to save version and clear refreshing state', inject([VersionModalService, SessionQuery, WorkflowQuery],
        (service: VersionModalService, sessionQuery: SessionQuery, workflowQuery: WorkflowQuery) => {
          spyOn(workflowQuery, 'getActive').and.returnValue({id: 1});
        service.saveVersion(expectedVersion, ['a', 'b'], ['b', 'c'], 'FULL');
        // Refresh service takes modifying the refreshMessage from the third message
        sessionQuery.refreshMessage$.subscribe(refreshMessage => expect(refreshMessage).toEqual('Modifying test parameter files...'));
    }));

});
