import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppTool, DockstoreTool, Workflow, Notebook } from '../../shared/swagger';
import { SearchState, SearchStore } from './search.store';

@Injectable({ providedIn: 'root' })
export class SearchQuery extends Query<SearchState> {
  public workflowhit$: Observable<any> = this.select((state) => state.workflowhit);
  public toolhit$: Observable<any> = this.select((state) => state.toolhit);
  public notebookhit$: Observable<any> = this.select((state) => state.notebookhit);
  public shortUrl$: Observable<string> = this.select((state) => state.shortUrl);
  public workflows$: Observable<Array<Workflow>> = this.workflowhit$.pipe(
    map((elasticSearchResults: Array<any>) =>
      elasticSearchResults ? elasticSearchResults.map((elasticSearchResult) => elasticSearchResult._source) : null
    )
  );
  public tools$: Observable<Array<DockstoreTool> | Array<AppTool>> = this.toolhit$.pipe(
    map((elasticSearchResults: Array<any>) =>
      elasticSearchResults ? elasticSearchResults.map((elasticSearchResult) => elasticSearchResult._source) : null
    )
  );
  public notebooks$: Observable<Array<Notebook>> = this.notebookhit$.pipe(
    map((elasticSearchResults: Array<any>) =>
      elasticSearchResults ? elasticSearchResults.map((elasticSearchResult) => elasticSearchResult._source) : null
    )
  );
  public savedTabIndex$: Observable<number> = this.select((state) => state.currentTabIndex);
  public noToolHits$: Observable<boolean> = this.tools$.pipe(map((tools: Array<DockstoreTool>) => this.haveNoHits(tools)));
  public noWorkflowHits$: Observable<boolean> = this.workflows$.pipe(map((workflows: Array<Workflow>) => this.haveNoHits(workflows)));
  public noNotebookHits$: Observable<boolean> = this.notebooks$.pipe(map((notebooks: Array<Notebook>) => this.haveNoHits(notebooks)));
  public searchText$: Observable<string> = this.select((state) => state.searchText);
  public basicSearchText$: Observable<string> = this.searchText$.pipe(map((searchText) => this.joinComma(searchText)));
  public showToolTagCloud$: Observable<boolean> = this.select((state) => state.showToolTagCloud);
  public showWorkflowTagCloud$: Observable<boolean> = this.select((state) => state.showWorkflowTagCloud);
  public showNotebookTagCloud$: Observable<boolean> = this.select((state) => state.showNotebookTagCloud);
  public filterKeys$: Observable<Array<string>> = this.select((state) => state.filterKeys);
  public autoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.autocompleteTerms);
  public hasAutoCompleteTerms$: Observable<boolean> = this.autoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public facetAutoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.facetAutocompleteTerms);
  public hasFacetAutoCompleteTerms$: Observable<boolean> = this.facetAutoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public suggestTerm$: Observable<string> = this.select((state) => state.suggestTerm);
  public pageSize$: Observable<number> = this.select((state) => state.pageSize);
  public pageIndex$: Observable<number> = this.select((state) => state.pageIndex);
  public noBasicSearchHits$: Observable<boolean> = combineLatest([
    this.noToolHits$,
    this.noWorkflowHits$,
    this.noNotebookHits$,
    this.searchText$,
  ]).pipe(
    map(([noToolHits, noWorkflowHits, noNotebookHits, searchText]) => {
      if (!searchText) {
        return false;
      } else {
        return noToolHits && noWorkflowHits && noNotebookHits;
      }
    })
  );

  constructor(protected store: SearchStore, private route: ActivatedRoute) {
    super(store);
  }

  haveNoHits(object: Array<any>): boolean {
    return !object || object.length === 0;
  }

  joinComma(searchTerm: string): string {
    return searchTerm.trim().split(' ').join(', ');
  }
}
