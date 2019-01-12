import { LiveStreamService } from './live-stream.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { PageService } from '../pages.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-live-stream',
    templateUrl: 'live-stream.component.html',
    styleUrls: ['live-stream.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class LiveStreamComponent implements OnInit {
    constructor(private liveStreamService: LiveStreamService, 
        private splash: FuseSplashScreenService,
        private pageService: PageService
        ) { }
    streams = [];
    ngOnInit() {
        this.liveStreamService.getLiveStreams().then(res => {
            this.streams = res;
            console.log(res);
        });
     }
     deleteStream(i) {
         this.streams.splice(i, 1);
     }
     addStream() {
         this.streams.push({
            startsAt: new Date(),
            endsAt: new Date(),
            title: 'Stream Title',
            description: 'Stream Description',
            script: 'Enter script here...'
         });
     }
     saveStreams() {
         this.splash.show();
         this.liveStreamService.updateLiveStreams(this.streams.slice()).then(() => {
            this.pageService.openSnackBar('Streams Updated');
         })
         .catch(e => {
             this.pageService.openSnackBar(e && e.message);
         })
         .then(() => {
            this.splash.hide();
         });
     }
}

