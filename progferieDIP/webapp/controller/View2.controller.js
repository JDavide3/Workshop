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

                //this.getOwnerComponent().getRouter().getRoute("Inserisci").attachPatternMatched(this.onNavigationMatched, this)
            },

            onNavigationMatched: function (oEevent) {
            },

            onConfirm: function () {
                let that = this;
                MessageBox.confirm("Si è sicuri di voler procedere ?", {
                    onClose: function (oAction) {
                        if (oAction === 'OK') {
                            let dataInizio = that.getView().byId("dataInizio").getValue();
                            let dataFine = that.getView().byId("dataFine").getValue();
                            let oraInizio = that.getView().byId("oraInizio").getValue();
                            let oraFine = that.getView().byId("oraFine").getValue();
                            console.log(dataInizio);
                            console.log(dataFine);
                            console.log(oraInizio);
                            console.log(oraFine);

                            let oModel = {
                                "prID": 1,
                                "dataInizio": dataInizio,
                                "dataFine": dataFine,
                                "oraInizio": oraInizio,
                                "oraFine": oraFine,
                                "isApproved" : false,
                                "isRejected" : false,
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
                                            //that.onAjaxSearch();
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

            onAjaxSearch: function () {
            }
        });


    });



