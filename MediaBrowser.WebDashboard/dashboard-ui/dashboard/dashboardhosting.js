define(["loading","libraryMenu","globalize","emby-checkbox"],function(loading,libraryMenu,globalize){"use strict";function onSubmit(e){var form=this,localAddress=form.querySelector("#txtLocalAddress").value,enableUpnp=form.querySelector("#chkEnableUpnp").checked;confirmSelections(localAddress,enableUpnp,function(){var enableHttps=form.querySelector("#chkEnableHttps").checked,certPath=form.querySelector("#txtCertificatePath").value||null,validationResult=getValidationAlert(form);return validationResult?void alertText(validationResult):void validateHttps(enableHttps,certPath).then(function(){loading.show(),ApiClient.getServerConfiguration().then(function(config){config.RequireHttps=enableHttps,config.LocalNetworkSubnets=form.querySelector("#txtLanNetworks").value.split(",").map(function(s){return s.trim()}).filter(function(s){return s.length>0}),config.PublicPort=form.querySelector("#txtPublicPort").value,config.PublicHttpsPort=form.querySelector("#txtPublicHttpsPort").value,config.EnableHttps=enableHttps,config.RequireHttps=enableHttps,config.HttpsPortNumber=form.querySelector("#txtHttpsPort").value,config.HttpServerPortNumber=form.querySelector("#txtPortNumber").value,config.EnableUPnP=enableUpnp,config.WanDdns=form.querySelector("#txtDdns").value,config.EnableRemoteAccess=form.querySelector("#chkRemoteAccess").checked,config.CertificatePath=certPath,config.CertificatePassword=form.querySelector("#txtCertPassword").value||null,config.LocalNetworkAddresses=localAddress?[localAddress]:[],ApiClient.updateServerConfiguration(config).then(Dashboard.processServerConfigurationUpdateResult,Dashboard.processErrorResponse)})})}),e.preventDefault()}function getValidationAlert(form){return form.querySelector("#txtPublicPort").value===form.querySelector("#txtPublicHttpsPort").value?"The public http and https ports must be different.":form.querySelector("#txtPortNumber").value===form.querySelector("#txtHttpsPort").value?"The http and https ports must be different.":null}function validateHttps(enableHttps,certPath){return!enableHttps||certPath?Promise.resolve():new Promise(function(resolve,reject){return alertText({title:globalize.translate("TitleHostingSettings"),text:globalize.translate("HttpsRequiresCert")}).then(reject,reject)})}function alertText(options){return new Promise(function(resolve,reject){require(["alert"],function(alert){alert(options).then(resolve,reject)})})}function confirmSelections(localAddress,enableUpnp,callback){localAddress||!enableUpnp?alertText({title:globalize.translate("TitleHostingSettings"),text:globalize.translate("SettingsWarning")}).then(callback):callback()}function getTabs(){return[{href:"dashboardhosting.html",name:globalize.translate("TabHosting")},{href:"serversecurity.html",name:globalize.translate("TabSecurity")}]}return function(view,params){function loadPage(page,config){page.querySelector("#txtPortNumber").value=config.HttpServerPortNumber,page.querySelector("#txtPublicPort").value=config.PublicPort,page.querySelector("#txtPublicHttpsPort").value=config.PublicHttpsPort,page.querySelector("#txtLocalAddress").value=config.LocalNetworkAddresses[0]||"",page.querySelector("#txtLanNetworks").value=(config.LocalNetworkSubnets||[]).join(", "),page.querySelector("#chkRemoteAccess").checked=null==config.EnableRemoteAccess||config.EnableRemoteAccess;var chkEnableHttps=page.querySelector("#chkEnableHttps");chkEnableHttps.checked=null==config.RequireHttps?config.EnableHttps:config.RequireHttps,page.querySelector("#txtHttpsPort").value=config.HttpsPortNumber,page.querySelector("#txtDdns").value=config.WanDdns||"";var txtCertificatePath=page.querySelector("#txtCertificatePath");txtCertificatePath.value=config.CertificatePath||"",page.querySelector("#txtCertPassword").value=config.CertificatePassword||"",page.querySelector("#chkEnableUpnp").checked=config.EnableUPnP,onCertPathChange.call(txtCertificatePath),loading.hide()}function onCertPathChange(){this.value?view.querySelector("#txtDdns").setAttribute("required","required"):view.querySelector("#txtDdns").removeAttribute("required")}view.querySelector("#btnSelectCertPath").addEventListener("click",function(){require(["directorybrowser"],function(directoryBrowser){var picker=new directoryBrowser;picker.show({includeFiles:!0,includeDirectories:!0,callback:function(path){path&&(view.querySelector("#txtCertificatePath").value=path),picker.close()},header:globalize.translate("HeaderSelectCertificatePath")})})}),view.querySelector(".dashboardHostingForm").addEventListener("submit",onSubmit),view.querySelector("#txtCertificatePath").addEventListener("change",onCertPathChange),view.addEventListener("viewshow",function(e){libraryMenu.setTabs("adminadvanced",0,getTabs),loading.show(),ApiClient.getServerConfiguration().then(function(config){loadPage(view,config)})})}});