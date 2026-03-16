import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { MyLibrary } from './pages/my-library/my-library';
import { AddBook } from './pages/add-book/add-book';
import { Exchanges } from './pages/exchanges/exchanges';
import { Browse } from './pages/browse/browse';
import { BookDetails } from './pages/book-details/book-details';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    { path : '', component : Home },
    { path : 'home', component : Home },
    { path : 'index', component : Home },
    { path : 'login', component : Login },
    { path : 'register', component : Register },
    { path : 'dashboard', component : Dashboard },
    { path : 'my-library', component : MyLibrary },
    { path : 'add-book', component : AddBook },
    { path : 'exchanges', component : Exchanges },
    { path : 'browse', component : Browse },
    { path : 'book/:id', component : BookDetails },
    { path : 'settings', component : Settings },
];
