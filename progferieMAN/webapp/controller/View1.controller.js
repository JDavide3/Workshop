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
                            let dataI = that.getView().byId("dataI").getValue();
                            let dataF = that.getView().byId("dataF").getValue();

                            let oModel = {
                                "dataInizio": dataI,
                                "dataFine": dataF
                            }

                            let odataModel = new ODataModel("/ui5ui/Odata/odata/v4/CatalogService/");
                            that.getView().setBusy(true);
                            odataModel.read("/Prenotazioni", {
                                async : true,
                                success : function(){
                                    that.getView().setBusy(false);
                                    MessageBox.success("Operazione eseguita!" ,{
                                        onClose: function(){
                                            that.getOwnerComponent().getRouter().navTo("RouteMaster");
                                        }
                                    });
                                },
                                error: function(oError){
                                    MessageBox.error("Errore del servizio!");
                                    that.getView().setBusy(false);
                                

                            }});
                            /*let aData = jQuery.ajax({
                                type: "GET",
                                contentType: "application/json",
                                url: "/odata/v4/CatalogService/Prenotazioni",
                                dataType: "json",
                                //data: JSON.stringify(oModel),
                                async: false,
                                success: function () {
                                    that.getView().setBusy(false);
                                    MessageBox.success("Operazione eseguita!", {
                                        onClose: function () {
                                            that.onAjaxSearch();
                                            that.onCloseDialog();
                                            that.getOwnerComponent().getRouter().navTo("RouteMaster");
                                        }
                                    });
                                },
                                error: function (oError) {
                                    MessageBox.error("Errore del servizio!");
                                    that.getView().setBusy(false);
                                }
                            });*/

                        }
                    }
                });
            },

            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMaster")
            },

            onAjaxSearch: function () {
                let bookName = this.getView().byId("bookName").getValue();
                let that = this;
                this.getView().setBusy(true);

                let aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/ui5ui/Odata/odata/v4/CatalogService/Prenotazioni", //%20 è lo spazio  %27 sono gli apostrofi
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR, oResults) {

                        this.getView().setModel(new JSONModel(data.value), "Books");
                        this.getView().setBusy(false);
                    }
                });
            }
        });


    });



