requirejs.config({
    paths: {
        jquery: '../libs/jquery/jquery.min',
        bootstrap: '../libs/bootstrap-3.0.3/bootstrap.min',
        paginator: '../libs/bootstrap-paginator/bootstrap-paginator.min',
        datatable: '../../src/jquery-datatable',
        dataset: './dataset'
    },
    shim:{
        paginator:{
            deps: ['jquery','bootstrap']
        },
        datatable:{
            deps: ['jquery','bootstrap', 'paginator']
        }
    }
});

requirejs(['dataset', 'jquery', 'datatable'],
function(dataset) {
    var data = dataset.generateData();
    var columns = dataset.getColumns();

    var myTable = $('.datagridContainer').Datatable({
        "sortable": true,
        "pagination": true,
        // "pageSizes": [5, 10, 15, 20],
        // "currentPageSize": 5,
	    "data": data,
	    "columns": columns,
        "searchable": true,
        "closeable": true,
        "afterClose": function() {
            console.log('Table has closed.');
        }
    });
});