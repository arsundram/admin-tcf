
export const FestAnalyticsOptions = {
    mainGraph: {
        colors   : [
            {
                borderColor              : '#42a5f5',
                backgroundColor          : '#42a5f5',
                pointBackgroundColor     : '#1e88e5',
                pointHoverBackgroundColor: '#1e88e5',
                pointBorderColor         : '#ffffff',
                pointHoverBorderColor    : '#ffffff'
            }
        ],
        options  : {
            responsive: true,
            showToolTips: true,
            spanGaps           : false,
            legend             : {
                display: false
            },
            maintainAspectRatio: false,
            layout             : {
                padding: {
                    top  : 32,
                    left : 32,
                    right: 32
                }
            },
            elements           : {
                point: {
                    radius          : 2,
                    borderWidth     : 2,
                    hoverRadius     : 4,
                    hoverBorderWidth: 2
                },
                line : {
                    tension: 0
                }
            },
            scales             : {
                xAxes: [
                    {
                        gridLines: {
                            display       : false,
                            drawBorder    : false,
                            tickMarkLength: 18
                        },
                        ticks    : {
                            fontColor: '#ffffff'
                        }
                    }
                ],
                yAxes: [
                    {
                       ticks: {
                           beginAtZero: true,
                           fontColor: '#ffffff'
                       }
                    }
                ]
            },
            plugins            : {
                filler      : {
                    propagate: false
                }
            }
        }
    },
    secondGraph: {
        colors   : [
            {
                borderColor              : '#000000',
                backgroundColor          : '#ffffff',
                pointBackgroundColor     : '#000000',
                pointHoverBackgroundColor: '#000000',
                pointBorderColor         : '#000000',
                pointHoverBorderColor    : '#000000'
            }
        ],
        options  : {
            responsive: true,
            showToolTips: true,
            spanGaps           : false,
            legend             : {
                display: false
            },
            maintainAspectRatio: false,
            layout             : {
                padding: {
                    top  : 32,
                    left : 32,
                    right: 32
                }
            },
            elements           : {
                point: {
                    radius          : 2,
                    borderWidth     : 2,
                    hoverRadius     : 4,
                    hoverBorderWidth: 2
                },
                line : {
                    tension: 0
                }
            },
            scales             : {
                xAxes: [
                    {
                        gridLines: {
                            display       : false,
                            drawBorder    : false,
                            tickMarkLength: 18
                        },
                        ticks    : {
                            fontColor: '#000000'
                        }
                    }
                ],
                yAxes: [
                    {
                       ticks: {
                           beginAtZero: true,
                           fontColor: '#000000'
                       }
                    }
                ]
            },
            plugins            : {
                filler      : {
                    propagate: false
                }
            }
        }
    },
    thirdGraph: {
        colors: [{
            borderColor              : '#CFD8DC',
            backgroundColor          : '#CFD8DC',
            pointBackgroundColor     : '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointBorderColor         : '#ffffff',
            pointHoverBorderColor    : '#ffffff'
        }]
    },
    fifthGraph: {
        colors: [{
            borderColor: '#9575CD',
        }],
        options: {
            legend: {
                display: false
            }
        }
    }

};

