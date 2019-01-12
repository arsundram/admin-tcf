import { PageService } from './../pages.service';
import { FuseSplashScreenService } from './../../../../@fuse/services/splash-screen.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AnalyticsService } from './analytics.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-analytics',
    templateUrl: 'analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AnalyticsComponent implements OnInit {
    widgets: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    totalPeople = 0;
    nativePeople = 0;
    nativeTeamCaptains = 0;
    totalTeams = 0;
    eventName;
    eventType;
    min;
    max;
    loaded = false;
    constructor(private analyticsService: AnalyticsService, private route: ActivatedRoute,
         private splash: FuseSplashScreenService, private pageService: PageService) {
        this.widgets = this.analyticsService.widgets;
        
        this._registerCustomChartJSPlugin();
    }
    ngOnInit() { 
        this.route.params.subscribe(res => {
            this.splash.show();
            this.analyticsService.getAnalytics(res['id']).then(resp => {
                this.totalPeople = this.analyticsService.totalPeople;
                this.nativePeople = this.analyticsService.nativePeople;
                this.nativeTeamCaptains = this.analyticsService.nativeTeamCaptains;
                this.totalTeams = this.analyticsService.totalTeams;
                this.eventName = this.analyticsService.eventName;
                this.eventType = this.analyticsService.eventType;
                this.min = this.analyticsService.min;
                this.max = this.analyticsService.max;
                this.loaded = true;
            }).catch(e => {
                this.pageService.openSnackBar(e && e.message);
            }).then(() => {
                this.splash.hide();
            });
        });

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
