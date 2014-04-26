requirejs.config({
    paths: {
        jquery: '../libs/jquery/jquery.min',
        bootstrap: '../libs/bootstrap-3.0.3/bootstrap.min',
        paginator: '../libs/bootstrap-paginator/bootstrap-paginator.min',
        datatable: '../../src/jquery-datatable',
        dataset: './dataset'
    },
    shim:{
        datatable:{
            deps: ['jquery','bootstrap']
        }
    }
});

requirejs(['dataset', 'jquery', 'datatable'],
function(dataset) {
    var data = dataset.generateData();
    var columns = dataset.getColumns();

    var myTable = $('.datagridContainer').Datatable({
	    "data": data,
	    "columns": columns
    });
});