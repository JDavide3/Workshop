sap.ui.define([], function () {
	"use strict";
	return {
		formatIconColor: function (approved, rejected) {
            var colore;
			if(approved && !(rejected)) 
            {
                colore = "#31ad00";
            }
            else if(rejected && !(approved))
            {
                colore = "#ad1100";
            }
            else if(!(approved) && !(rejected))
            {
                colore = "#d9db35";
            }
            return colore;
		},

        formatIcon: function (approved, rejected) {
            var icona;
			if(approved && !(rejected)) 
            {
                icona = "sap-icon://thumb-up";
            }
            else if(rejected && !(approved))
            {
                icona = "sap-icon://thumb-down";
            }
            else if(!(approved) && !(rejected))
            {
                icona = "sap-icon://pending";
            }
            return icona;
		},

        formatDate: function(date) {
            var formattedDate = date.replace(/[TZ]/g, " ");
            return formattedDate;
        }
	};
});