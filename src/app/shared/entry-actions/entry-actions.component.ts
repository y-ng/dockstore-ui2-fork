import { Directive, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertQuery } from '../alert/state/alert.query';
import { EntryType } from '../enum/entry-type';
import { BioWorkflow, DockstoreTool, Service, Notebook } from '../swagger';
import { EntryActionsService } from './entry-actions.service';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class EntryActionsComponent {
  @Input() entryType: EntryType;
  publishDisabled: boolean;
  showButtons: boolean;
  viewPublicMessage: string;
  isRefreshing$: Observable<boolean>;
  pubUnpubMessage: string;
  isHosted: boolean;
  constructor(protected alertQuery: AlertQuery, protected entryActionsService: EntryActionsService) {
    // Temporary until I figure out what causes them to be out of sync
    this.showButtons = true;
  }

  commonNgOnInit(): void {
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }
  abstract publishToggle(): void;
  abstract refresh(): void;

  commonNgOnChanges(entry: DockstoreTool | BioWorkflow | Service | Notebook): void {
    this.pubUnpubMessage = this.entryActionsService.getPublishMessage(entry, this.entryType);
    this.isHosted = this.entryActionsService.isEntryHosted(entry);
    this.viewPublicMessage = this.entryActionsService.getViewPublicButtonTooltip(this.entryType);
  }
}
