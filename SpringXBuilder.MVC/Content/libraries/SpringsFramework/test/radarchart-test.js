sp.namespace('sp.ui.charts.test.RadarChartTest');

sp.ui.charts.test.RadarChartTest = Class.extend
(
{
    run: function()
    {
        var opts = new sp.ui.charts.RadarChartOptions();
        opts.width = 640;
        opts.height = 480;
        opts.dataSets = [
            {label: 'test', color: 'blue'},
            {label: 'test2', color: 'green'},
            {label: 'test3', color: 'red'},
            {label: 'test7', color: 'green'}
        ]
        opts.dataSetItemLabels = ["Test", "Test2", "Test3", "Test4", "Test5", "Test6 long long long"];
        opts.tickMarkLabels = [0, 5, 10];
//        opts.legendWidth = 50;

        var chart = new sp.ui.charts.RadarChart($('#chartcontainer'), opts);
        chart.setSeries(0, [4,4,7,1,5,6]);
        chart.setSeries(1, [4,8,9,5,7,8]);
        chart.setSeries(2, [3,4,10,3,2,5]);
        // or
        chart.setDataProvider([[4,4,7,1,5,6],[4,8,9,5,7,8],[3,4,10,3,2,5]])
        chart.draw();
    },

    test: function (desc, val1, val2)
    {
        if (val1 === val2)
        {
            console.log('[success] '+desc);
        }
        else
        {
            console.error('[fail] '+desc+' ::: expected '+val2+' but got '+val1);
        }
    }
}
);