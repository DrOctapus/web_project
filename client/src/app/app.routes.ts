import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Courses } from './pages/courses/courses';
import { About } from './pages/about/about';
import { Books } from './pages/books/books';
import { CourseDetails } from './pages/course-details/course-details';

export const routes: Routes = [
    { path: '', component: Home, title: 'Home - Book & Byte' },
    { path: 'register', component: Register, title: 'Sign Up / Sign In - Book & Byte' },
    { path: 'courses', component: Courses, title: 'Courses - Book & Byte' },
    { path: 'about', component: About, title: 'About Us - Book & Byte' },
    { path: 'books', component: Books, title: 'Books - Book & Byte' },
    { path: 'course-details/:id', component: CourseDetails, title: 'Course - Book & Byte' },
];