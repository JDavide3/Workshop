sap.ui.define([], function () {
	"use strict";
	return {
		formatIconColor: function (approvato, rifiutato) {
            var colore;
			if(approvato && !(rifiutato)) 
            {
                colore = "#31ad00";
            }
            else if(rifiutato && !(approvato))
            {
                colore = "#ad1100";
            }
            else if(!(approvato) && !(rifiutato))
            {
                colore = "#d9db35";
            }
            return colore;
		},

        formatIcon: function (approvato, rifiutato) {
            var icona;
			if(approvato && !(rifiutato)) 
            {
                icona = "sap-icon://thumb-up";
            }
            else if(rifiutato && !(approvato))
            {
                icona = "sap-icon://thumb-down";
            }
            else if(!(approvato) && !(rifiutato))
            {
                icona = "sap-icon://pending";
            }
            return icona;
		},
	};
});