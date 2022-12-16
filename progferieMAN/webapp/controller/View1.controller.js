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

        //let INDICATOR_IDS = ["indicator0", "indicator1"];
        let monteOreDisponibile = 432;


        return Controller.extend("ui5.ui.controller.Inserisci", {
            onInit: function () {
                this.getView().setModel(new JSONModel());

                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onAjaxSearch, this)
            },

            onChanged: function () {
                let that = this;
                this.getView().setBusy(true);
                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/progferieMAN/db/odata/v4/CatalogService/Prenotazioni?$filter=isApproved eq true or isRejected eq true",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR, oResults) {
                        that.getView().setModel(new JSONModel(data.value), "Prenotazioni");
                        that.getView().setBusy(false);
                        that.getView().getModel("Prenotazioni").getData();
                    },
                    error: function (oError) {
                        MessageBox.error("Errore del servizio!");
                        console.log(oError);
                        that.getView().setBusy(false);
                    }
                });
            },

            onAjaxSearch: function () {
                let that = this;
                this.getView().setBusy(true);
                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/progferieMAN/db/odata/v4/CatalogService/Prenotazioni",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR, oResults) {
                        that.getView().setModel(new JSONModel(data.value), "Prenotazioni");
                        that.getView().setBusy(false);
                        that.getView().getModel("Prenotazioni").getData();
                    },
                    error: function (oError) {
                        MessageBox.error("Errore del servizio!");
                        console.log(oError);
                        that.getView().setBusy(false);
                    }
                });
            },

            onPending: function () {
                let that = this;
                this.getView().setBusy(true);
                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/progferieMAN/db/odata/v4/CatalogService/Prenotazioni?$filter=isApproved eq false and isRejected eq false",
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR, oResults) {
                        that.getView().setModel(new JSONModel(data.value), "Prenotazioni");
                        that.getView().setBusy(false);
                        that.getView().getModel("Prenotazioni").getData();
                    },
                    error: function (oError) {
                        MessageBox.error("Errore del servizio!");
                        console.log(oError);
                        that.getView().setBusy(false);
                    }
                });
            },

            onApprove: function (oEvent) {
                let that = this;
                let obj = oEvent.getSource().getBindingContext("Prenotazioni").getObject();
                MessageBox.confirm("Confermare la modifica?", {
                    onClose: async function (oAction) {
                        let oModel;

                        if (oAction === 'OK') {

                            const today = new Date();
                            const anno = today.getFullYear();
                            let mese = today.getMonth() + 1; // Months start at 0!
                            let giorno = today.getDate();
                            let ore = today.getHours();
                            let minuti = today.getMinutes();
                            if (minuti < 10) { minuti = "0" + minuti }
                            if (ore < 10) { ore = "0" + ore }
                            if (giorno < 10) { giorno = "0" + giorno }
                            if (mese < 10) { mese = "0" + mese }

                            const formattedToday = anno + "-" + mese + "-" + giorno + "T" + ore + ":" + minuti + "Z";
                            oModel = {
                                "dataPrenotazione": obj.dataPrenotazione,
                                "dataInizio": obj.dataInizio,
                                "dataFine": obj.dataFine,
                                "isApproved": true
                            };
                        }
                        jQuery.ajax({
                            type: "PUT",
                            contentType: "application/json",
                            url: "/progferieMAN/db/odata/v4/CatalogService/Prenotazioni(" + obj.ID + ")",
                            dataType: "json",
                            data: JSON.stringify(oModel),
                            async: false,
                            success: function () {
                                that.getView().setBusy(false);
                                MessageBox.success("Operazione eseguita!", {
                                    onClose: function () {
                                        that.onAjaxSearch();
                                        //that.onCloseDialog();
                                    }
                                });
                            },
                            error: function (oError) {
                                //MessageBox.error("Errore di servizio");
                                console.log(oError);
                                that.getView().setBusy(false);
                            }
                        });
                    }
                });
            },

            onReject: function (oEvent) {
                let that = this;
                let obj = oEvent.getSource().getBindingContext("Prenotazioni").getObject();
                MessageBox.confirm("Confermare la modifica?", {
                    onClose: async function (oAction) {
                        let oModel;

                        if (oAction === 'OK') {

                            const today = new Date();
                            const anno = today.getFullYear();
                            let mese = today.getMonth() + 1; // Months start at 0!
                            let giorno = today.getDate();
                            let ore = today.getHours();
                            let minuti = today.getMinutes();
                            if (minuti < 10) { minuti = "0" + minuti }
                            if (ore < 10) { ore = "0" + ore }
                            if (giorno < 10) { giorno = "0" + giorno }
                            if (mese < 10) { mese = "0" + mese }

                            const formattedToday = anno + "-" + mese + "-" + giorno + "T" + ore + ":" + minuti + "Z";
                            oModel = {
                                "dataPrenotazione": obj.dataPrenotazione,
                                "dataInizio": obj.dataInizio,
                                "dataFine": obj.dataFine,
                                "isRejected": true
                            };
                        }
                        jQuery.ajax({
                            type: "PUT",
                            contentType: "application/json",
                            url: "/progferieMAN/db/odata/v4/CatalogService/Prenotazioni(" + obj.ID + ")",
                            dataType: "json",
                            data: JSON.stringify(oModel),
                            async: false,
                            success: function () {
                                that.getView().setBusy(false);
                                MessageBox.success("Operazione eseguita!", {
                                    onClose: function () {
                                        that.onAjaxSearch();
                                        //that.onCloseDialog();
                                    }
                                });
                            },
                            error: function (oError) {
                                //MessageBox.error("Errore di servizio");
                                console.log(oError);
                                that.getView().setBusy(false);
                            }
                        });
                    }
                });
            }
        });


    });