sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, filter, filterOperator, ODataModel, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("ui5.ui.controller.Inserisci", {
            onInit: function () {
                this.getView().setModel(new JSONModel());

                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onAjaxSearch, this)
            },

            onNavigationMatched: function (oEevent) {
            },

            onConfirm: function () {
                let that = this;
                MessageBox.confirm("Si è sicuri di voler procedere?", {
                    onClose: function (oAction) {
                        if (oAction === 'OK') {
                            let dataInizio = that.getView().byId("dataI").getValue();
                            let dataFine = that.getView().byId("dataF").getValue();
                            const today = new Date();
                            const anno = today.getFullYear();
                            let mese = today.getMonth() + 1; // Months start at 0!
                            let giorno = today.getDate();
                            let ore = today.getHours();
                            let minuti = today.getMinutes();
                            if(minuti < 10) {minuti = "0"+minuti}
                            if(ore < 10) {ore = "0"+ore}
                            if(giorno < 10) {giorno = "0"+giorno}
                            if(mese < 10) {mese = "0"+mese}

                            const formattedToday = anno+"-"+mese+"-"+giorno+"T"+ore+":"+minuti+"Z";

                            console.log(formattedToday);
                            dataInizio += "Z";
                            dataFine += "Z";
                            console.log(dataInizio);
                            console.log(dataFine);

                            let oModel = {
                                "dataPrenotazione": formattedToday,
                                "dataInizio": dataInizio,
                                "dataFine": dataFine,
                                "isApproved": false,
                                "isRejected": false,
                                "infoDipendente": "Dip",
                                "infoManager": "Man"
                            }
        
                            let aData = jQuery.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni",
                                dataType: "json",
                                data: JSON.stringify(oModel),
                                async: false,
                                success: function () {
                                    that.getView().setBusy(false);
                                    MessageBox.success("Operazione eseguita!", {
                                        onClose: function () {
                                            that.onAjaxSearch();
                                            //that.onCloseDialog();
                                            that.getOwnerComponent().getRouter().navTo("RouteMaster");
                                        }
                                    });
                                },
                                error: function (oError) {
                                    MessageBox.error("Errore del servizio!");
                                    console.log(oError);
                                    that.getView().setBusy(false);
                                }
                            });
                        }
                    }
                });     
            },

            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMaster")
            },

            onAjaxSearch: function () 
            {
                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni",
                    dataType: "json",
                    async: false,
                    success: function () {
                        this.getView().setBusy(false);
                        MessageBox.success("Operazione eseguita!", {
                            onClose: function () {
                                //that.onAjaxSearch();
                                //that.onCloseDialog();
                                this.getOwnerComponent().getRouter().navTo("RouteMaster");
                            }
                        });
                    },
                    error: function (oError) {
                        MessageBox.error("Errore del servizio!");
                        console.log(oError);
                        //that.getView().setBusy(false);
                    }
                });
            }
        });


    });



