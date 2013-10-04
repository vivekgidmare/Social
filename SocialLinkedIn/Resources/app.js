Ti.include('oauth_client.js');
 
var popup_window = Ti.UI.createWindow({
    backgroundColor : "#fff"
});
 
//Create the client instance.
var client = new oauth_client();
 
 

//Create the label that shows "loading" message so user knows that something is happening.
var loadingLabel = Ti.UI.createLabel({
    text : 'Loading... Please wait.',
});

loadingLabel.addEventListener("click",function(e){
    login();
    
});

popup_window.add(loadingLabel);
 var str=[];
/**
 * This is the 2nd step of oAuth. It will show the authentication page for you to enter user name and password to authorize the app.
 */
var show_on_webview = function(url) {
    
    var view = Ti.UI.createView({
        width : "100%",
        height : "100%",
        border : 10,
        backgroundColor : 'white',
        borderColor : '#aaa',
        borderWidth : 5,
    });
    var closeLabel = Ti.UI.createLabel({
        textAlign : 'right',
        font : {
            fontWeight : 'bold',
            fontSize : '8sp'
        },
        text : '(X)',
        top : 10,
        right : 12,
        height : 15
    });
    var webView = Ti.UI.createWebView({
        url : url,
        top : "55dp",
        width : "100%",
        height : "100%",
    });
    view.add(webView);
    webView.addEventListener('beforeload', function(e) {
        if (Ti.Platform.osname == "android")
            view.visible = false;
    });
    webView.addEventListener('load', function(e) {
        Ti.API.info('Load URL:'+e.source.getUrl());
        var urlLoaded=e.source.getUrl();

       if(urlLoaded.indexOf("?code=") !== -1)
       {
            var myStr=e.source.getUrl();
            str=myStr.split('&');
            str=str[0].split('='); 
            Ti.API.info("Auth Code:"+str[1]); 
            Ti.App.Properties.setString('AUTHORIZATION_CODE',str[1]);
            client.getAccessCode();
            
             popup_window.remove(view);
             
             loadingLabel.text="Done";
       }
    
            
    });
    closeLabel.addEventListener('click', function() {
        popup_window.close();
    });
    view.add(closeLabel);
    popup_window.add(view);
    return;
};
 

 
/**
 * Save the token, secret and pin in file.
 */
/*var save_token_and_secret = function() {
    
    Ti.API.info('Saved Data:1)'+client.get_oauth_token()+" 2>"+client.get_oauth_token_secret()+" 3>"+client.get_pin());
    
    
    Ti.App.Properties.setString("oauth_token", client.get_oauth_token());
    Ti.App.Properties.setString("oauth_token_secret", client.get_oauth_token_secret());
    Ti.App.Properties.setString("pin", client.get_pin());
    alert("Authentication Complete");
    client.getPeople();
}*/
/**
 * Save the token, secret and pin in file.
 */
/*var get_access_token = function() {
    client.access_token(function() {
        save_token_and_secret();
    });
}*/
var login = function() {
   // client.request_token();
   show_on_webview(client.get_authorize_url_with_token());
   /* client.request_token(function() {
        show_on_webview(client.get_authorize_url_with_token(), get_access_token);
    });*/
  /* 
   <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
   <person>
    <first-name>Vivek</first-name>
   <last-name>Gidmare</last-name>
  <headline>Developer- Mobile App at IndiaNIC Infotech Ltd</headline>
   <site-standard-profile-request>
     <url>http://www.linkedin.com/profile/view?id=195084877&amp;authType=name&amp;authToken=gdJ0&amp;trk=api*a269907*s277628*</url>
    </site-standard-profile-request>
  </person>
   
   */
   
   
}


popup_window.open();