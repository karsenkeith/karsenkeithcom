import { Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ArticleDetailPageComponent } from './pages/article-detail-page/article-detail-page.component';
import { ArticlesPageComponent } from './pages/articles-page/articles-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
	{ path: '', component: HomePageComponent },
	{ path: 'about', component: AboutPageComponent },
	{ path: 'articles', component: ArticlesPageComponent },
	{ path: 'articles/:slug', component: ArticleDetailPageComponent },
	{ path: '**', redirectTo: '' }
];
