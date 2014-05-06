/* Copyright (c) 2014
 * Licensed under the MIT License.
 *
 * Version: 0.1.0
 *
 * Requires: jQuery v1.10.2
 *           Bootstrap v3.0.3
 *           Bootstrap-paginator
 */
(function($) {

    /*
     * Below is an example of how to initiate a Datatable in a specified div container.
     * The height and width of the table will be based on the extent of the div container.
     *
     * "data": array of objects that contain data to be populated in the table body
     * "columns": array of Strings that specify the columns in the table header
     * 
     * var myTable = $('.datagridContainer').Datatable({
     *     "data": data,
     *     "columns": columns
     * });
     */

    $.fn.Datatable = function(options) {
        return this.each(function() { 
            var $el = $(this);
            var data = $el.data('datatable'); 
            if(!data) { 
                $el.data('datatable', (data = new Datatable(this, options))); 
            }
        }).data('datatable');
    };

    var Datatable = function(element, options) { 
        this.$el = $(element); 
        if(options) { $.extend(this, options); }
        this.init();
    };

    Datatable.prototype = {
        "sortable": true,
        "searchable": true,
        "searchBy": '',
        "pagination": true,
        "paginatorSize": 5,
        "pageSizes": [5, 10, 20],
        "currentPage": 1,
        "totalPages": 1,
        "closeable": false,
        "afterClose": undefined,
        init: function() {
            var datatable = this;

            this.scrubData();
            this.masterData = this.data.slice();
            this.$el.append(this.generateDatatableTemplate());
            if(!this.currentPageSize) {
                this.currentPageSize = this.pageSizes[0];
            }

            if(this.pagination) {
                var pageSizeOptionsHtml = '';
                for(var i=0; i<datatable.pageSizes.length; i++) {
                    pageSizeOptionsHtml += '<option value="'+datatable.pageSizes[i]+'">'+datatable.pageSizes[i]+'</option>';
                }
                $('.pageSizeSelector select').append(pageSizeOptionsHtml);
                $('.pageSizeSelector select').val(datatable.currentPageSize);
                $('.pageSizeSelector select').change(function() {
                    datatable.currentPageSize = parseInt($(this).val());
                    datatable.updateResultsCount();
                    datatable.updateTable();
                    datatable.updatePaginator();
                    datatable.updatePageSelect();
                });

                $('.pageSelector select').change(function() {
                    datatable.currentPage = parseInt($(this).val());
                    datatable.updateResultsCount();
                    datatable.updateTable();
                    datatable.updatePaginator();
                });

                this.updateResultsCount();
                this.updatePaginator();
                this.updatePageSelect();
            } else {
                this.currentPageSize = this.data.length;
            }

            if(this.searchable) {
                $('.searchField input').bind('keydown', function(e) {
                    if (e.keyCode === 13) {
                        datatable.filter($('.searchField input').val());
                        datatable.searchBy = $('.searchField input').val();
                        if(datatable.sortBy && datatable.reverse) {
                            datatable.sort(datatable.sortBy, datatable.reverse);
                        }
                        datatable.currentPage = 1;
                        datatable.updateResultsCount();
                        datatable.updatePaginator();
                        datatable.updatePageSelect();
                        datatable.updateTable();
                    }
                });
                $('.searchField button').on('click', function(evt) {
                    datatable.filter($('.searchField input').val());
                    datatable.searchBy = $('.searchField input').val();
                    if(datatable.sortBy && datatable.reverse) {
                        datatable.sort(datatable.sortBy, datatable.reverse);
                    }
                    datatable.currentPage = 1;
                    datatable.updateResultsCount();
                    datatable.updatePaginator();
                    datatable.updatePageSelect();
                    datatable.updateTable();
                });
            }

            if(this.closeable) {
                $('.datagridCloseBtn').on('click', function() {
                    datatable.$el.hide();
                    datatable.afterClose();
                })
            }

            this.updateTable();
        },
        addData: function(newData) {
            $.merge(this.data, newData);
            $.merge(this.masterData, newData);
            this.filter(this.searchBy);
            if(this.sortBy) {
                this.sort(this.sortBy, this.reverse);
            }
            this.updateResultsCount();
            this.updatePaginator();
            this.updatePageSelect();
            this.updateTable();
        },
        removeAllData: function() {
            this.data = [];
            this.masterData = [];
            this.currentPage = 1;
            this.updateResultsCount();
            this.updatePaginator();
            this.updatePageSelect();
            this.updateTable();
        },
        updateColumns: function(newCols) {
            this.columns = newCols;
            this.currentPage = 1;
            this.updateResultsCount();
            this.updatePaginator();
            this.updatePageSelect();
            this.updateTable();
        },
        scrubData: function() {
            var datatable = this;
            $.each(datatable.data, function(i, feature){
                $.each(datatable.columns, function(index, value){
                    if(feature[value] === null || feature[value] === undefined) {
                        // Scrubbing data to clean null and undefined values
                        feature[value] = '';
                    }
                });
            });
        },
        updateTable: function() {
            var i,
                j,
                currentCellWidth,
                headerHtml = '',
                minColumnWidths = [],
                columnWidths = [],
                tableWidth = 0,
                datatable = this;

            $('.headTable table thead tr').empty();
            $('.bodyTable table').empty();

            $.each(this.columns, function(k, v){
                if(datatable.sortable && v === datatable.sortBy) {
                    if(datatable.reverse) {
                        //down arrow
                        headerHtml += '<th class="cellDiv"><span>'+v+'</span><span class="ui-arrow">&#x25BC;</span></th>';
                    } else {
                        //up arrow
                        headerHtml += '<th class="cellDiv"><span>'+v+'</span><span class="ui-arrow">&#x25B2;</span></th>';
                    }
                } else {
                    headerHtml += '<th class="cellDiv"><span>'+v+'</span></th>';
                }
            });
            $('.headTable table thead tr').append(headerHtml);
            if(this.sortable) {
                $('.headTable table thead th.cellDiv').addClass('sortableHeader');
            }

            $.each(this.data.slice(this.startFeature, this.endFeature), function(i, feature){
                var bodyRowHtml = '';
                $.each(datatable.columns, function(index, value){
                    if((i%2) !== 0) {
                        bodyRowHtml += '<td class="cellDiv oddRow"><span>'+feature[value]+'</span></td>';
                    } else {
                        bodyRowHtml += '<td class="cellDiv evenRow"><span>'+feature[value]+'</span></td>';
                    }
                });
                $('.bodyTable table').append('<tr class="rowDiv">'+bodyRowHtml+'</tr>');
            });

            for(j=0; j<this.columns.length; j++) {
                currentCellWidth = $('.headTable table').children().eq(0).children().eq(0).children().eq(j).outerWidth();
                minColumnWidths[j] = currentCellWidth;
                if(columnWidths[j]) {
                    if(currentCellWidth > columnWidths[j]) {
                        columnWidths[j] = currentCellWidth;
                    } 
                } else {
                    columnWidths[j] = currentCellWidth;
                }
            }

            for(i=0; i<this.currentPageSize; i++) {
                for(j=0; j<this.columns.length; j++) {
                    currentCellWidth = $('.bodyTable table').children().eq(0).children().eq(i).children().eq(j).outerWidth();
                    if(columnWidths[j]) {
                        if(currentCellWidth > columnWidths[j]) {
                            columnWidths[j] = currentCellWidth;
                        } 
                    } else {
                        columnWidths[j] = currentCellWidth;
                    }
                }
            }

            for(j=0; j<this.columns.length; j++) {
                $('.headTable table').children().eq(0).children().eq(0).children().eq(j).css('width', columnWidths[j]);
            }
            for(i=0; i<this.currentPageSize; i++) {
                for(j=0; j<this.columns.length; j++) {
                    $('.bodyTable table').children().eq(0).children().eq(i).children().eq(j).css('width', columnWidths[j]);
                }
            }

            for(i=0; i<columnWidths.length; i++) {
                tableWidth += columnWidths[i];
            }

            $('.bodyTable').innerHeight($('.tableContainer').innerHeight()-55);
            $('.outerTable').innerWidth(tableWidth+15);
            $('.headTable').innerWidth(tableWidth+15);
            $('.bodyTable').innerWidth(tableWidth+15);

            if($('.bodyTable').width() <= $('.tableContainer').width()) {
                $('.outerTable').css('width', '100%');
                $('.headTable').css('width', '100%');
                $('.bodyTable').css('width', '100%');
                $('.headTable table').css('width', '100%');
                $('.bodyTable table').css('width', '100%');
                $('.cellDiv').css('display', 'table-cell');
            }

            if(this.sortable) {
                $('.headTable .cellDiv').on('click', function(evt){
                    var i,
                        newTableWidth;
                    var colIndex = $(this).index();

                    if(datatable.sortBy === datatable.columns[colIndex] && datatable.reverse === false) {
                        datatable.reverse = true;
                        datatable.sort(datatable.columns[colIndex], true);
                    } else {
                        datatable.sortBy = datatable.columns[colIndex];
                        datatable.reverse = false;
                        datatable.sort(datatable.columns[colIndex], false);
                    }
                    datatable.currentPage = 1;
                    datatable.updateResultsCount();
                    datatable.updatePaginator();
                    datatable.updatePageSelect();
                    datatable.updateTable();
                });
            }
        },
        updatePaginator: function() {
            var datatable = this;

            if(this.pagination) {
                //PAGINATION
                var options = {
                    bootstrapMajorVersion: 3,
                    currentPage: datatable.currentPage,
                    numberOfPages: datatable.paginatorSize,
                    totalPages: datatable.totalPages,
                    onPageClicked: function(e,originalEvent,type,page){
                        datatable.currentPage = page;
                        datatable.updateResultsCount();
                        datatable.updateTable();
                        datatable.updatePageSelect();
                    }
                };
                $('.centerFooterDiv ul').bootstrapPaginator(options);
            }
        },
        updatePageSelect: function() {
            var datatable = this;

            if(this.pagination) {
                var pageSelectorOptionsHtml = '';
                $('.pageSelector select').empty();
                for(var i=1; i<=datatable.totalPages; i++) {
                    pageSelectorOptionsHtml += '<option value="'+i+'">'+i+'</option>';
                }
                $('.pageSelector select').append(pageSelectorOptionsHtml);
                $('.pageSelector select').val(datatable.currentPage);
            }
        },
        updatePageSizeSelect: function() {
            if(this.pagination) {
                $('.pageSizeSelector select').val(datatable.currentPageSize);
            }
        },
        updateResultsCount: function() {
            var datatable = this;

            if(this.pagination) {
                if(datatable.data.length === 0) {
                    datatable.totalPages = 1;
                    datatable.currentPage = 1;
                } else if(datatable.data.length % datatable.currentPageSize === 0) {
                    datatable.totalPages = parseInt(datatable.data.length / datatable.currentPageSize); 
                } else {
                    datatable.totalPages = parseInt(datatable.data.length / datatable.currentPageSize) + 1;
                }

                if(datatable.currentPage > datatable.totalPages) {
                    datatable.currentPage = datatable.totalPages;
                }

                datatable.startFeature = (datatable.currentPage-1)*datatable.currentPageSize;
                if(datatable.currentPage === datatable.totalPages) {
                    datatable.endFeature = datatable.data.length;
                } else {
                    datatable.endFeature = parseInt(datatable.startFeature) + datatable.currentPageSize;
                }

                $('.resultsCountDiv').empty();
                if(datatable.data.length === 0) {
                    $('.resultsCountDiv').append('No items');
                } else {
                    // $('#resultsCountDiv').append('fake - fake of '+datatable.data.length+' items');
                    $('.resultsCountDiv').append((
                        datatable.startFeature+1)+
                        ' - '+
                        datatable.endFeature+
                        ' of '+
                        datatable.data.length+
                        ' items'
                    );
                }
            }
        },
        generateDatatableTemplate: function() {
            var tableTemplate = '';

            var closeBtn = '<button type="button" class="datagridCloseBtn close" data-dismiss="dialog" aria-hidden="true">'+
                        '&times;'+
                    '</button>';

            var tableHeaderTemplate = 
                '<div class="tableHeader">'+
                    '<div class="searchField input-group">'+
                        '<input type="text" class="form-control" data-placement="bottom" title="Search on field text">'+
                        '<span class="input-group-btn">'+
                            '<button class="btn btn-default-text" type="button">'+
                                '<span class="glyphicon glyphicon-search"></span>'+
                            '</button>'+
                        '</span>'+
                    '</div>';
            if(this.closeable) {
                tableHeaderTemplate += closeBtn;
            }
            tableHeaderTemplate += '</div>';
            var tableBodyTemplate = 
                '<div class="tableContainer">'+
                    '<div class="outerTable">'+
                        '<div class="headTable">'+
                            '<table>'+
                                '<thead>'+
                                    '<tr class="rowDiv"></tr>'+
                                '</thead>'+
                            '</table>'+
                        '</div>'+
                        '<div class="bodyTable">'+
                            '<table>'+
                            '</table>'+
                        '</div>'+
                    '</div>'+
                '</div>';
            var tableFooterTemplate = 
                '<div class="tableFooter">'+
                    '<div class="leftFooterDiv">'+
                        '<div class="pageSelector">'+
                            'Go to page:'+
                            '<select class="form-control">'+
                            '</select>'+
                        '</div>'+
                        '<div class="resultsCountDiv"></div>'+
                    '</div>'+
                    '<div class="centerFooterDiv">'+
                        '<ul>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="rightFooterDiv">'+
                        '<div class="pageSizeSelector">'+
                            'Page size:'+
                            '<select class="form-control">'+
                            '</select>'+
                        '</div>'+
                    '</div>'+
                '</div>';

            if(this.searchable) {
                tableTemplate += tableHeaderTemplate;
            }

            tableTemplate += tableBodyTemplate;

            if(this.pagination) {
                tableTemplate += tableFooterTemplate;
            }

            return tableTemplate;
        },
        sort: function(field, reverse) {
            if(this.sortable) {
                if(reverse) {
                    this.data.sort(dynamicSort('-'+field));
                } else {
                    this.data.sort(dynamicSort(field));
                }
            }
        },
        filter: function(query) {
            if(this.searchable) {
                this.data = this.masterData.slice();
                if(query) {
                    this.data = $.grep(this.data, function(obj, key) {
                        var val,
                            re;
                        for(val in obj) { 
                            if(typeof obj[val] === 'string') { 
                                re = new RegExp(query,"gi"); 
                                if(obj[val].match(re)) { 
                                    return true;
                                }
                            } else if(typeof obj[val] === 'number') { 
                                if(obj[val] == query) {
                                    return true;
                                }
                            }
                        }            
                        return false;
                    });
                }
            }
        }
    };

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function bindTemplate(template, data) {
        $.each(data, function(key, val){
            var re = new RegExp('{{'+key+'}}', 'g');
            template = template.replace(re, val);
        });
        return template;
    }

})(jQuery);
