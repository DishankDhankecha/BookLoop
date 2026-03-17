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
import { authGuard } from './guards/auth-guard';
import { userGuard } from './guards/user-guard';
import { Admin } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'index', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard, canActivate: [userGuard] },
    { path: 'my-library', component: MyLibrary, canActivate: [userGuard] },
    { path: 'add-book', component: AddBook, canActivate: [userGuard] },
    { path: 'exchanges', component: Exchanges, canActivate: [userGuard] },
    { path: 'browse', component: Browse, canActivate: [userGuard] },
    { path: 'book/:id', component: BookDetails, canActivate: [userGuard] },
    { path: 'settings', component: Settings, canActivate: [userGuard] },
    { path: 'admin', component: Admin, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];
