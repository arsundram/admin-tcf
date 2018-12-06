import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform
{
    /**
     * Transform
     *
     * @param {string} value
     * @param {any[]} args
     * @returns {string}
     */
    constructor(private sanitizer: DomSanitizer) {}
    transform(value: string, args: any[] = [])
    {
       return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}
