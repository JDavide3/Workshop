sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, filter, filterOperator, ODataModel, JSONModel, MessageBox, formatter) {
        "use strict";

        return Controller.extend("ui5.ui.controller.Inserisci", {
            formatter: formatter,
            onInit: function () {
                
                this.getView().setModel(new JSONModel());

                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onAjaxSearch, this);
                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onEdit, this);
            },

            onNavigationMatched: function (oEevent) {
            },

            onPending: function () {
                let that = this;
                this.getView().setBusy(true);
                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni?$filter=isApproved eq false and isRejected eq false",
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

            onDelete: function (oEvent) {
                let that = this;
                let obj = oEvent.getSource().getBindingContext("Prenotazioni").getObject();
                MessageBox.confirm("Si è sicuri di voler procedere?", {
                    onClose: function (oAction) {
                        if (oAction === 'OK') {
                            jQuery.ajax({
                                type: "DELETE",
                                contentType: "application/json",
                                url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni(" + obj.ID + ")",
                                dataType: "json",
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
                                    MessageBox.error("Errore di servizio");
                                    console.log(oError);
                                    that.getView().setBusy(false);
                                }
                            });
                        }
                    }
                });
            },

            onFilter: function(oEvent) {
                var that = this;
                var oFilteredPrenotazioni = [];
                if(oEvent.getSource().sId.search("approved") > -1)
                {
                    oFilteredPrenotazioni = this.oPrenotazioni.filter(function(n){return n.isApproved === true || n.isRejected === true})
                    console.log(oFilteredPrenotazioni);
                    that.getView().setModel(new JSONModel(oFilteredPrenotazioni), "Prenotazioni");
                }
                else
                {
                    oFilteredPrenotazioni = this.oPrenotazioni.filter(function(n){return n.isApproved === false && n.isRejected === false})
                    console.log(oFilteredPrenotazioni);
                    that.getView().setModel(new JSONModel(oFilteredPrenotazioni), "Prenotazioni");
                }
            },

            onResetFilters: function() {
                this.getView().setModel(new JSONModel(this.oPrenotazioni), "Prenotazioni");
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
                                    if (minuti < 10) { minuti = "0" + minuti }
                                    if (ore < 10) { ore = "0" + ore }
                                    if (giorno < 10) { giorno = "0" + giorno }
                                    if (mese < 10) { mese = "0" + mese }

                                    const formattedToday = anno + "-" + mese + "-" + giorno + "T" + ore + ":" + minuti + "Z";

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

                    onUpdate: function (oEvent) {
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
                                        "dataPrenotazione": formattedToday,
                                        "dataInizio": obj.dataInizio,
                                        "dataFine": obj.dataFine
                                    };
                                }
                                jQuery.ajax({
                                    type: "PUT",
                                    contentType: "application/json",
                                    url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni(" + obj.ID + ")",
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
                                        console.log(oError);
                                        that.getView().setBusy(false);
                                    }
                                });
                            }
                        });
                    },

                    onAjaxSearch: function () {
                        let that = this;
                        let aData = jQuery.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "/progferieDIP/db/odata/v4/CatalogService/Prenotazioni",
                            dataType: "json",
                            async: false,
                            success: function (data, textStatus, jqXHR, oResults) {
                                that.getView().setModel(new JSONModel(data.value), "Prenotazioni");
                                that.oPrenotazioni = data.value;
                                that.getView().setBusy(false);
                            },
                            error: function (oError) {
                                MessageBox.error("Errore del servizio!");
                                console.log(oError);
                                that.getView().setBusy(false);
                            }
                        });
                    }
        });
    }
)