import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ARTICLES } from '../../data/articles';

type SortOrder = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

@Component({
  selector: 'app-articles-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });

  protected readonly searchQuery = signal('');
  protected readonly activeFilters = signal<Set<string>>(new Set<string>());
  protected readonly currentSortOrder = signal<SortOrder>('date-desc');
  protected readonly showMoreFilters = signal(false);

  protected readonly allTags = computed(() => {
    const uniqueTags = new Set<string>();
    for (const article of ARTICLES) {
      for (const tag of article.tags) {
        uniqueTags.add(tag);
      }
    }

    return Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
  });

  protected readonly filteredArticles = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const activeFilterTags = this.activeFilters();

    return ARTICLES.filter((article) => {
      const matchesTags =
        activeFilterTags.size === 0 || article.tags.some((tag) => activeFilterTags.has(tag));

      if (!matchesTags) {
        return false;
      }

      if (!query) {
        return true;
      }

      const matchesTitle = article.title.toLowerCase().includes(query);
      const matchesSummary = article.summary.toLowerCase().includes(query);
      const matchesTagsQuery = article.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesTitle || matchesSummary || matchesTagsQuery;
    });
  });

  protected readonly sortedArticles = computed(() => {
    const sortOrder = this.currentSortOrder();
    const filtered = [...this.filteredArticles()];

    return filtered.sort((first, second) => {
      switch (sortOrder) {
        case 'date-asc':
          return new Date(first.date).getTime() - new Date(second.date).getTime();
        case 'title-asc':
          return first.title.localeCompare(second.title);
        case 'title-desc':
          return second.title.localeCompare(first.title);
        default:
          return new Date(second.date).getTime() - new Date(first.date).getTime();
      }
    });
  });

  constructor() {
    effect(() => {
      const tagFromQuery = this.queryParamMap().get('tag');
      if (tagFromQuery) {
        this.activeFilters.set(new Set([tagFromQuery]));
      }
    });
  }

  protected updateSortOrder(value: string): void {
    if (value === 'date-desc' || value === 'date-asc' || value === 'title-asc' || value === 'title-desc') {
      this.currentSortOrder.set(value);
    }
  }

  protected onSortSelectChange(event: Event): void {
    const selectElement = event.target;

    if (selectElement instanceof HTMLSelectElement) {
      this.updateSortOrder(selectElement.value);
    }
  }

  protected toggleTagFilter(tag: string): void {
    this.activeFilters.update((currentFilters) => {
      const nextFilters = new Set(currentFilters);

      if (nextFilters.has(tag)) {
        nextFilters.delete(tag);
      } else {
        nextFilters.add(tag);
      }

      return nextFilters;
    });
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.activeFilters.set(new Set());
  }

  protected toggleSearchFilter(): void {
    this.showMoreFilters.update((current) => !current);
  }

  protected isTagActive(tag: string): boolean {
    return this.activeFilters().has(tag);
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
