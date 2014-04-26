/* Copyright (c) 2014
 * Licensed under the MIT License.
 *
 * Version: 0.1.0
 *
 * Requires: jQuery v1.10.2 and Bootstrap v3.0.3
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
        "datatable": this,
        "sortable": false,
        init: function() {
            this.masterData = this.data.slice();
            this.$el.append(generateDatatableTemplate());
            this.updateTable();
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

            $.each(this.data, function(i, feature){
                var bodyRowHtml = '';
                $.each(feature, function(k, v){
                    if((i%2) !== 0) {
                        bodyRowHtml += '<td class="cellDiv oddRow"><span>'+v+'</span></td>';
                    } else {
                        bodyRowHtml += '<td class="cellDiv evenRow"><span>'+v+'</span></td>';
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

            for(i=0; i<this.data.length; i++) {
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
            for(i=0; i<this.data.length; i++) {
                for(j=0; j<this.columns.length; j++) {
                    $('.bodyTable table').children().eq(0).children().eq(i).children().eq(j).css('width', columnWidths[j]);
                }
            }

            for(i=0; i<columnWidths.length; i++) {
                tableWidth += columnWidths[i];
            }

            $('.outerTable').innerWidth(tableWidth+15);
            $('.headTable').innerWidth(tableWidth+15);
            $('.bodyTable').innerWidth(tableWidth+15);
            $('.bodyTable').innerHeight($('.tableContainer').innerHeight()-40);

            if(this.sortable) {
                $('.headTable .cellDiv').on('click', function(evt){
                    var i,
                        newTableWidth;
                    var colIndex = $(this).index();

                    if(datatable.sortBy === datatable.columns[colIndex] && datatable.reverse === false) {
                        datatable.reverse = true;
                        datatable.sort(datatable.columns[colIndex], true);
                        datatable.updateTable();
                    } else {
                        datatable.sortBy = datatable.columns[colIndex];
                        datatable.reverse = false;
                        datatable.sort(datatable.columns[colIndex], false);
                        datatable.updateTable();
                    }
                });
            }
        },
        sort: function(field, reverse) {
            if(reverse) {
                this.data.sort(dynamicSort('-'+field));
            } else {
                this.data.sort(dynamicSort(field));
            }
        }

    };

    function generateDatatableTemplate() {
        var tableTemplate = 
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
        return tableTemplate;
    }

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
