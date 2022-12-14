sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("project1.controller.login", {
            onInit: function () {

            },
            onLoginUser: function(){
                var username = this.getView().byId('inp_usernameId');
                var password = this.getView().byId('inp_passwordId');

                var user = "John";
                var pass = "1234";

                if(username.getValue() === '') {
                    MessageBox.error("Inserisci un nome!");
                    return;
                } else if (password.getValue() === '') {
                    MessageBox.error("Inserisci la password!");
                    return;
                } else {
                    if(username.getValue() === user && password.getValue() === pass ) {
                        MessageBox.success("Login effettuato.");
                        this.getOwnerComponent().getRouter().navTo("View2");
                    } else {
                        MessageBox.error("User e password errati");
                        return;
                    }
                }
            },
            onNavigationMatched: function(oEevent){
                this.getView().byId("genre").setValue(null);
                this.getView().byId("genre").setValue(null);
             },
        });
    });
