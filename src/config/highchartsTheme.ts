// src/config/highchartsTheme.ts
import Highcharts from 'highcharts';

// Define the theme options object
export const matrixThemeOptions: Highcharts.Options = {
    colors: ['#33ff33', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107'], // Matrix-like colors
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: 'monospace',
            color: '#e5e7eb' // Light gray text for general elements
        }
    },
    title: {
        style: {
            color: '#33ff33',
            fontSize: '16px'
        }
    },
    subtitle: {
        style: {
            color: '#e5e7eb'
        }
    },
    xAxis: {
        gridLineColor: 'rgba(51, 255, 51, 0.1)',
        labels: {
            style: {
                color: '#e5e7eb',
                 fontSize: '10px'
            }
        },
        lineColor: 'rgba(51, 255, 51, 0.3)',
        minorGridLineColor: 'rgba(51, 255, 51, 0.07)',
        tickColor: 'rgba(51, 255, 51, 0.3)',
        title: {
            style: {
                color: '#e5e7eb'
            }
        }
    },
    yAxis: {
        gridLineColor: 'rgba(51, 255, 51, 0.1)',
        labels: {
            style: {
                color: '#e5e7eb',
                 fontSize: '10px'
            }
        },
        lineColor: 'rgba(51, 255, 51, 0.3)',
        minorGridLineColor: 'rgba(51, 255, 51, 0.07)',
        tickColor: 'rgba(51, 255, 51, 0.3)',
        tickWidth: 1,
        title: {
            style: {
                color: '#e5e7eb'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#e5e7eb'
        },
         borderColor: '#33ff33',
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#F0F0F3', // Lighter data labels if needed
                style: {
                    fontSize: '13px'
                }
            },
            marker: {
                 enabled: false // Disable markers globally for cleaner lines/performance
                // lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        },
    },
    legend: {
        backgroundColor: 'transparent',
        itemStyle: {
            color: '#e5e7eb'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        },
        title: {
            style: {
                color: '#C0C0C0'
            }
        }
    },
    credits: {
        enabled: false // Disable Highcharts credits
    },
    labels: {
        style: {
            color: '#707073'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: '#505053', stroke: '#000000', style: { color: '#CCC' },
            states: {
                hover: { fill: '#707073', stroke: '#000000', style: { color: 'white' } },
                select: { fill: '#000003', stroke: '#000000', style: { color: 'white' } }
            }
        },
        inputBoxBorderColor: '#505053', inputStyle: { backgroundColor: '#333', color: 'silver' }, labelStyle: { color: 'silver' }
    },
    navigator: {
        handles: { backgroundColor: '#666', borderColor: '#AAA' }, outlineColor: '#CCC', maskFill: 'rgba(180,180,255,0.2)',
        series: { color: '#7798BF', lineColor: '#A6C7ED' }, xAxis: { gridLineColor: '#505053' }
    },
    scrollbar: {
        barBackgroundColor: '#808083', barBorderColor: '#808083', buttonArrowColor: '#CCC', buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063', rifleColor: '#FFF', trackBackgroundColor: '#404043', trackBorderColor: '#404043'
    }
};

// Function to apply the theme globally
export const applyHighchartsTheme = () => {
    Highcharts.setOptions(matrixThemeOptions);
    console.log("Matrix Highcharts theme applied."); // Optional: for debugging
};