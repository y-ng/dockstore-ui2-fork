import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/base';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { DockstoreTool, Entry, Organization, Workflow } from '../shared/swagger';
import { UserQuery } from '../shared/user/user.query';
import { UsersService } from './../shared/swagger/api/users.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UntypedFormControl } from '@angular/forms';
import { ExtendedDockstoreTool } from 'app/shared/models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from 'app/shared/models/ExtendedWorkflow';
import { OrgLogoService } from '../shared/org-logo.service';
import { EntryType } from '../shared/enum/entry-type';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dockstore } from 'app/shared/dockstore.model';

@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
})
export class StarredEntriesComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  starredTools: Array<ExtendedDockstoreTool> | null;
  starredWorkflows: Array<ExtendedWorkflow> | null;
  starredServices: Array<Entry> | null;
  starredNotebooks: Array<ExtendedWorkflow> | null;
  starredOrganizations: Array<Organization> | null;
  user: any;
  starGazersClicked = false;
  organizationStarGazersClicked = false;
  readonly entryType = EntryType;
  // Default to workflows tab
  currentTab = 'workflows';
  selected = new UntypedFormControl();
  // TODO: Add 'services' to validTabs when implemented
  validTabs = ['workflows', 'tools', 'organizations'];
  // TODO: Remove validTabsWithNotebooks and simply include 'notebooks' in validTabs when notebooks Feature Flag is removed
  validTabsWithNotebooks = ['workflows', 'tools', 'notebooks', 'organizations'];

  constructor(
    private userQuery: UserQuery,
    private imageProviderService: ImageProviderService,
    private providerService: ProviderService,
    private usersService: UsersService,
    private orgLogoService: OrgLogoService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.setupTab(params.tab);
    });

    this.userQuery.user$.subscribe((user) => (this.user = user));
    this.usersService.getStarredTools().subscribe((starredTool) => {
      this.starredTools = <ExtendedDockstoreTool[]>starredTool.filter((entry: DockstoreTool) => entry.is_published);
      this.starredTools.forEach((tool) => {
        this.providerService.setUpProvider(tool);
        tool = this.imageProviderService.setUpImageProvider(tool);
      });
    });
    this.usersService.getStarredWorkflows().subscribe((starredWorkflow) => {
      this.starredWorkflows = <ExtendedWorkflow[]>starredWorkflow.filter((entry: Workflow) => entry.is_published);
      this.starredWorkflows.forEach((workflow) => {
        this.providerService.setUpProvider(workflow);
      });
    });
    this.usersService.getStarredNotebooks().subscribe((starredNotebook) => {
      this.starredNotebooks = <ExtendedWorkflow[]>starredNotebook.filter((entry: Workflow) => entry.is_published);
      this.starredNotebooks.forEach((workflow) => {
        this.providerService.setUpProvider(workflow);
      });
    });
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.starredOrganizations = starredOrganizations;
    });
  }
  isOwner(entryUsers: any): boolean {
    let isOwner = false;
    if (this.user) {
      for (const user of entryUsers) {
        if (user.id === this.user.id) {
          isOwner = true;
          break;
        }
      }
    }
    return isOwner;
  }

  starGazersChange() {
    this.starGazersClicked = !this.starGazersClicked;
  }

  organizationStarGazersChange() {
    this.organizationStarGazersClicked = !this.organizationStarGazersClicked;
  }

  // Runs on first page load
  public setupTab(tabName: string) {
    // If notebooks Feature Flag enabled, update validTabs to include the notebooks tab
    // Remove check once feature flag removed
    if (Dockstore.FEATURES.enableNotebooks) {
      this.validTabs = this.validTabsWithNotebooks;
    }
    const tabIndex = this.validTabs.indexOf(tabName);
    if (tabIndex >= 0) {
      this.currentTab = tabName;
    }
    this.selected.setValue(this.validTabs.indexOf(this.currentTab));
    this.updateStarredUrl(this.currentTab);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    this.currentTab = this.validTabs[matTabChangeEvent.index];
    this.updateStarredUrl(this.currentTab);
  }

  // Updates url query params
  updateStarredUrl(tabName: string) {
    this.location.replaceState('starred?tab=' + tabName);
  }
}
