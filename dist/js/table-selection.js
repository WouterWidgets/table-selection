/*!
 * TableSelection library v0.9.0 (https://github.com/WouterWidgets/table-selection)
 * Copyright (c) 2018 Wouter Smit
 * Licensed under MIT (https://github.com/WouterWidgets/table-selection/blob/master/LICENSE)
 *
 * Requires jQuery
*/

class TableSelection {

    constructor(selector = null) {
        console.log('selector:', selector);

        this.selection = null;
        this.nativeSelection = null;
        this.targets = document.querySelectorAll(selector);

        this.setEventHandlers();
    }

    setEventHandlers() {

        document.addEventListener('selectionchange', e => {
            this.selectionChangeHandler(e);
        });
        document.addEventListener('copy', e => {
            this.copyHandler(e);
        });
        window.addEventListener('blur', e => {
            this.deselect();
        })
    }

    isWithinTarget(element) {
        this.targets.forEach(target => {
            if (target.contains(element)) {
                return true;
            }
        });

        return false;
    }

    selectionChangeHandler(e) {
        this.nativeSelection = window.getSelection ? getSelection() : null;

        if (!this.nativeSelection) {
            return;
        }

        let selectedElement = this.nativeSelection.anchorNode;
        if (selectedElement.nodeType !== 1) {
            selectedElement = selectedElement.parentNode;
        }

        if (
            !this.isWithinTarget(selectedElement)
        ) {
            console.warn(selectedElement, 'not within targets', this.nativeSelection);
            return;
        }
        // if (!this.isWithinTarget(e.target)) {
        //     console.warn('not in target', e.currentTarget);
        //     return;
        // }
        console.log('selectionchange', e);
    }

    copyHandler(e) {
        console.log('copy', e);
    }

    select() {
        this.deselect();
    }

    deselect() {
        if (!this.selection) {
            return;
        }
        this.selection = null;
        this.nativeSelection = null;
        console.log('deselect');
    }

}

new TableSelection('table');



(function TableSelect() {
return;
    if ( !window.jQuery ) {
        window.console && console.warn("TableSelect requires %cjQuery%c.", 'font-weight:bold', 'font-weight:normal');
        return;
    }

    var $selection;

    function init() {
        // $(document)
        //     .on('selectionchange', select)
        //     .on('copy', clipboardCopyHandler)
        // ;
        // $(window)
        //     .on('blur', deselect)
    }

    function select() {

        // Clear previous selection
        $selection && $selection.removeClass('selected');

        // Get current selection
        var selection = window.getSelection ? getSelection() : null;
        if ( !selection || !selection.anchorNode || !$(selection.anchorNode).parents('.table-selection').length ) {
            return;
        }

        // Get cell / row refs
        var $startCell = $(selection.anchorNode).closest('td'),
            $endCell = $(selection.focusNode).closest('td'),
            $startRow = $startCell.closest('tr'),
            $endRow = $endCell.closest('tr'),
            $tbody = $startRow.closest('tbody')
        ;

        // Normalize to allow all directions
        var startCellIndex = Math.min($startCell.index(), $endCell.index()),
            endCellIndex = Math.max($startCell.index(), $endCell.index()),
            startRowIndex = Math.min($startRow.index(), $endRow.index()),
            endRowIndex = Math.max($startRow.index(), $endRow.index())
        ;

        // Get elements in current selection
        $selection = $(null);
        $tbody
            .find('tr')
            .slice(startRowIndex, endRowIndex + 1)
            .each(function() {
                $selection = $selection.add(
                    $(this)
                        .find('td')
                        .slice(startCellIndex, endCellIndex + 1)
                )
                ;
            })
        ;

        // Highlight them
        $selection.addClass('selected');
    }

    function deselect() {
        var selection = window.getSelection ? getSelection() : null;
        selection && selection.empty();
    }

    function getSelectionText() {

        var rowData = {},
            data = [];

        $selection.each(function() {
            var rowIndex = $(this).parent().index();
            rowData[rowIndex] = rowData[rowIndex] || [];
            rowData[rowIndex].push($(this).text());
        });

        for ( var i in rowData ) {
            data.push(rowData[i].join("\t"));
        }

        return data.join("\n");

    }

    function clipboardCopyHandler(e) {
        e.originalEvent.clipboardData.setData('text/plain', getSelectionText());
        e.preventDefault();
    }

    $(init);

})();
