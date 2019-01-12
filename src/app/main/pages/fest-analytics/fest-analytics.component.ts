import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { PageService } from './../pages.service';
import { FestAnalyticsOptions } from './fest-analytics.model';
import { Component, OnInit } from '@angular/core';
import { FestAnalyticsService } from './fest-analytics.service';

@Component({
    selector: 'app-fest-analytics',
    templateUrl: 'fest-analytics.component.html',
    styleUrls: ['fest-analytics.component.scss']
})

export class FestAnalyticsComponent implements OnInit {
    constructor(private festAnalyticsService: FestAnalyticsService, private pageService: PageService, private splash: FuseSplashScreenService) {
     }
     loaded = false;
    analyticsOptions = FestAnalyticsOptions;
    signedInGraph;
    signedUpGraph;
    otherUseAnalytics;
    eventAnalytics;
    packageAnalyticsNative;
    packageAnalyticsOther;
    soloWinners;
    teamWinners;
    upcomingEvent;
    upcomingPortal;
    ngOnInit() {
        this._registerCustomChartJSPlugin();
       
        this.splash.show();
        this.festAnalyticsService.getAnalytics().then(res => {
            return this.setUpAnalytics(res);
        })
        .then(() => {
            this.loaded = true;
        }).catch(e => {
            this.pageService.openSnackBar(e && e.message);
        }).then(() => {
            this.splash.hide();
        });
      
     }

     setUpAnalytics(FestAnalytics) {
        this.signedInGraph = this.getSignedInGraph(FestAnalytics);
        this.signedUpGraph = this.getSignedUpGraph(FestAnalytics);
        this.otherUseAnalytics = {
           datasets: [{ data: [FestAnalytics.userAnalytics.disabledCount, 
                FestAnalytics.userAnalytics.emailVerifiedCount,
                FestAnalytics.userAnalytics.nativeUsers,
                FestAnalytics.userAnalytics.paidUsers,
                FestAnalytics.userAnalytics.profilePictureCount,
                FestAnalytics.userAnalytics.signInViaReferralCount,
                FestAnalytics.userAnalytics.signedInToTcfCount,
                FestAnalytics.userAnalytics.tcfIdCount,
                FestAnalytics.userAnalytics.totalUsers,
                FestAnalytics.userAnalytics.userRegistrationCount,
                FestAnalytics.userAnalytics.adminCount,
                FestAnalytics.userAnalytics.ambassadorCount,
                FestAnalytics.userAnalytics.completeProfiles
            ],
            label: 'No of users'
        }],
        labels: ['Disabled', 'Verified Emails', 'Native', 'Paid', 
        'Profile Pictures',
        'referral sign-up', 'Signed into TCF NITP', 'TCF ID', 'Total',
        'Registrations', 'Admins', 'CAP', 'Complete Profles'
        ]
        };
        this.eventAnalytics = {
            datasets: [
                {
                    data: [
                        FestAnalytics.eventAnalytics.eventListLength,
                        FestAnalytics.eventAnalytics.registerableEvents,
                        FestAnalytics.eventAnalytics.soloEvents,
                        FestAnalytics.eventAnalytics.teamEvents,
                        FestAnalytics.eventAnalytics.eventsActive,
                        FestAnalytics.eventAnalytics.eventsClosed,
                        FestAnalytics.eventAnalytics.paidEvents,
                        FestAnalytics.eventAnalytics.pendingEvents,
                        FestAnalytics.eventAnalytics.pendingPortalsOpen,
                        FestAnalytics.eventAnalytics.portalsActive,
                        FestAnalytics.eventAnalytics.portalsClosed,
 
                    ],
                    label: 'Count'
                }
            ],
            labels: [
                'Total Events', 'Registerable Events', 'Solo Events', 'Team Events', 'Active Events',
                'Closed Events', 'Paid Events', 'Pending Events', 'Pending Portals', 'Active Portals',
                'Closed Portals'
            ]
        };
        this.packageAnalyticsNative = {
            datasets: [{
                data:  Object.keys(FestAnalytics.packagesCountNative).map(el => FestAnalytics.packagesCountNative[el].count),
                label: 'Count'
            }],
            labels: Object.keys(FestAnalytics.packagesCountNative).map(el => FestAnalytics.packagesCountNative[el].name)
        };
        
        this.packageAnalyticsOther = {
            datasets: [{
                data:  Object.keys(FestAnalytics.packagesCountOther).map(el => FestAnalytics.packagesCountOther[el].count),
                label: 'Count'
            }],
            labels: Object.keys(FestAnalytics.packagesCountOther).map(el => FestAnalytics.packagesCountOther[el].name)
        };
        this.soloWinners = Object.keys(FestAnalytics.winnerDeclarations.solo).map(el => {
            return {
                eventId: el,
                count: FestAnalytics.winnerDeclarations.solo[el]
            };
        });
        this.teamWinners = Object.keys(FestAnalytics.winnerDeclarations.team).map(el => {
            return {
                eventId: el,
                count: FestAnalytics.winnerDeclarations.team[el]
            };
        });
        this.upcomingEvent = {
             name: FestAnalytics.eventAnalytics.upcomingEventName,
              time: FestAnalytics.eventAnalytics.upcomingEventTime 
            };
        this.upcomingPortal = {
            name: FestAnalytics.eventAnalytics.upcomingPortalOpeningName,
            time: FestAnalytics.eventAnalytics.upcomingPortalStartTime
        };
     }

      getSignedUpGraph(FestAnalytics) {
          
           const signUpLabels = Object.keys(FestAnalytics.userAnalytics.creationData).sort(this.dateStorter);
           const creationDataSet = [{
            data: signUpLabels.map(date => FestAnalytics.userAnalytics.creationData[date]),
            label: 'Users Created',
            fill: 'start'
           }];
           return {signUpLabels, creationDataSet};
     }
      getSignedInGraph(FestAnalytics) {
        const signInLabels = Object.keys(FestAnalytics.userAnalytics.signInData).sort(this.dateStorter);
        const signInDataSet = [{
         data: signInLabels.map(date => FestAnalytics.userAnalytics.signInData[date]),
         label: 'Total Sign Ins',
         fill: 'start'
        }];
        return {signInLabels, signInDataSet};
     }
     dateStorter(a: string, b: string) {
        const date1 = a.split('/').map(e => parseInt(e, 10));
        const date2 = b.split('/').map(e => parseInt(e, 10));
        if (date1[2] !== date2[2]) {
            return date1[2] - date2[2];
        }
        if (date1[1] !== date2[1]) {
            return date1[1] - date1[1];
        }
        return date1[0] - date2[0];
     }

     private _registerCustomChartJSPlugin(): void
    {
        (<any>window).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function (element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() ;

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
        (<any>window).Chart.plugins.register({
            posX: null,
            isMouseOut: false,
            drawLine(chart, posX) {
               const ctx = chart.ctx,
                  x_axis = chart.scales['x-axis-0'],
                  y_axis = chart.scales['y-axis-0'],
                  x = posX,
                  topY = y_axis.top,
                  bottomY = y_axis.bottom;
               if (posX < x_axis.left || posX > x_axis.right) { return; }
               // draw line
               ctx.save();
               ctx.beginPath();
               ctx.moveTo(x, topY);
               ctx.lineTo(x, bottomY);
               ctx.lineWidth = chart.options.lineOnHover.lineWidth;
               ctx.strokeStyle = chart.options.lineOnHover.lineColor;
               ctx.stroke();
               ctx.restore();
            },
            beforeInit(chart) {
               chart.options.events.push('mouseover');
            },
            afterEvent(chart, event) {
               if (!chart.options.lineOnHover || !chart.options.lineOnHover.enabled) { return; }
               if (event.type !== 'mousemove' && event.type !== 'mouseover') {
                  if (event.type === 'mouseout') { this.isMouseOut = true; }
                  chart.clear();
                  chart.draw();
                  return;
               }
               this.posX = event.x;
               this.isMouseOut = false;
               chart.clear();
               chart.draw();
               this.drawLine(chart, this.posX);
         
               let metaData = chart.getDatasetMeta(0).data,
                  radius = chart.data.datasets[0].pointHoverRadius,
                  posX = metaData.map(e => e._model.x);
               posX.forEach(function(pos, posIndex) {
                  if (this.posX < pos + radius && this.posX > pos - radius) {
                     chart.updateHoverStyle([metaData[posIndex]], null, true);
                     chart.tooltip._active = [metaData[posIndex]];
                  } else { chart.updateHoverStyle([metaData[posIndex]], null, false); }
               }.bind(this));
               chart.tooltip.update();
            },
            afterDatasetsDraw(chart, ease) {
               if (!this.posX) { return; }
               if (!this.isMouseOut) { this.drawLine(chart, this.posX); }
            }
         });
    }
}
