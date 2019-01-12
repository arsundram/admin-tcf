import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({providedIn: 'root'})
export class PageService {
    constructor(private snackBar: MatSnackBar) {}
    openSnackBar(message) {
        console.log(message);
        return this.snackBar.open(message, null , {
            duration: 2000,
        });
    }
    getEnumerableKeys(object) {
        return Object.keys(object);
    }
}
