"use strict";
module.exports = ($) => {
    $('#main-view').on('click', '[role="tabpanel"] ul.nav[role="tablist"] li a[role="tab"]', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
};