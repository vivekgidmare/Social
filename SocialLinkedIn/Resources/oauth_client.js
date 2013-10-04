/**
 * @author indianic
 */
Ti.include('/lib/sha1.js');
Ti.include('/lib/oauth.js');
var oauth_client = function() {

    // You will get this key and secret when you create the application in LinkedIn or twitter.
    var CONSUMER_KEY = 'j6k97tcirr9q';
    var CONSUMER_SECRET = 'R1NhSZqBxy3W9SrL';

    // these are the linkedIn REST API
    var AUTHORIZE_URL = 'https://www.linkedin.com/uas/oauth2/authorization?';
    var ACCESS_TOKEN_URL = 'https://api.linkedin.com/uas/oauth2/accessToken?';

    var url_scope = 'r_fullprofile%20r_emailaddress%20r_network%20r_contactinfo%20rw_nus%20rw_groups%20w_messages';
    var url_state = '45453sdffef424HKDJHKJD';
    var url_redirectURL = 'https://www.google.com';

    // these are the twitter REST API
    /*var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
    var AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize';
    var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';*/

    // the accessor is used when communicating with the OAuth libraries to sign the messages
    var accessor = {
        consumerSecret : CONSUMER_SECRET,
        tokenSecret : ''
    };

    var pin = null;
    var oauth_token = null;
    var oauth_token_secret = null;

    //@method get_oauth_token
    this.get_oauth_token = function() {
        return oauth_token;
    };

    //@method get_oauth_token_secret
    this.get_oauth_token_secret = function() {
        return oauth_token_secret;
    };

    //@method get_pin
    this.get_pin = function() {
        return pin;
    };

    //@method get_pin
    this.set_pin = function(html) {

        // for Twitter
        //var regExp = '<code>(.*?)</code>';

        // for linkedIn
        var regExp = /<div class="access-code">(.*?)<\/div>/;

        var result = RegExp(regExp).exec(html);
        if (result == null || result.length < 2) {
            pin = null;
            Ti.API.debug('Result : ' + result);
            return null;
        }
        pin = result[1];
        Ti.API.info('PIN:' + pin);
        return pin;
    }
    /**
     * 2nd step of oAuth.
     * @method get_authorize_url_with_token
     */
    this.get_authorize_url_with_token = function() {

        return AUTHORIZE_URL + 'response_type=code&client_id=' + CONSUMER_KEY + '&scope=' + url_scope + '&state=' + url_state + '&redirect_uri=' + url_redirectURL;
    };

    this.getAccessCode = function() {
        accessor.tokenSecret = oauth_token_secret;
        var grantType = 'authorization_code';
        var authorizeCode = Ti.App.Properties.getString('AUTHORIZATION_CODE');
        var postURL = 'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=' + grantType + '&code=' + authorizeCode + '&redirect_uri=' + url_redirectURL + '&client_id=' + CONSUMER_KEY + '&client_secret=' + CONSUMER_SECRET;

        var client = Ti.Network.createHTTPClient();
        Ti.API.info('URL:' + postURL);
        client.open('POST', postURL);

        client.onload = function() {
            var jsonData = JSON.parse(client.responseText);
            var accessToken = jsonData.access_token;
            Ti.API.info('Expires In:' + jsonData.expires_in + 'AccessToken:' + accessToken);
            Ti.App.Properties.setString('ACCESS_TOKEN', accessToken);

            getPeople();

        }
        client.onerror = function(e) {
            Ti.API.info('Access Token Error:' + e.error);
        }
        client.send(null);
    };

    ///GetPeople
    getPeople = function() {
        var accessToken = Ti.App.Properties.getString('ACCESS_TOKEN');

        /**
         * ONLY USE HTTPS NEVER USE HTTP
         */

        //*********************Working Urls *********************//

        //People
        //Users Basic Profile
        // var peopleURL= 'https://api.linkedin.com/v1/people/~?oauth2_access_token='+accessToken; //to access user basic info  <1

        //Users Full Profile You can customize this by fields parameters Both basic and full profile Fields
        //var peopleURL ="https://api.linkedin.com/v1/people/~:(id,first-name,last-name,date-of-birth,email-address,languages,skills,certifications,educations,courses,volunteer,num-recommenders,recommendations-received,following,job-bookmarks,member-url-resources,last-modified-timestamp,proposal-comments,associations,honors,interests,publications,patents,)?oauth2_access_token="+accessToken;

        //Basic Profile Fields
        //var peopleURL ="https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,headline,summary,specialties,positions,maiden-name,picture-url,num-connections,num-connections-capped,public-profile-url)?oauth2_access_token="+accessToken;

        /*
        * Full profile fields are only available for the current viewer (the authenticated user of your app).
        * You can only retrieve basic profile fields of 1st and 2nd degree connections.
        */

        //Full Profile Fields and Email Fields ?/You can not retrive full_profile  Fields og 1st and 2nd Degree connections
        //var peopleURL ="https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,date-of-birth,email-address,languages,skills,certifications,educations,courses,volunteer,num-recommenders,recommendations-received,following,job-bookmarks,member-url-resources,last-modified-timestamp,proposal-comments,associations,honors,interests,publications,patents,)?oauth2_access_token="+accessToken;

        //Search People
        //var peopleURL="https://api.linkedin.com/v1/people-search?oauth2_access_token="+accessToken;
        //http://api.linkedin.com/v1/people-search? keywords=[space delimited keywords]& first-name=[first name]& last-name=[last name]& company-name=[company name]& current-company=[true|false]& title=[title]& current-title=[true|false]& school-name=[school name]& current-school=[true|false]& country-code=[country code]& postal-code=[postal code]& distance=[miles]& start=[number]& count=[1-25]&  facet=[facet code, values]& facets=[facet codes]&  sort=[connections|recommenders|distance|relevance]

        // var peopleURL="https://api.linkedin.com/v1/people/~/connections?oauth2_access_token="+accessToken;//access your connections
        //   var peopleURL = "https://api.linkedin.com/v1/people/~/network/updates?oauth2_access_token="+accessToken;
        // var peopleURL ="https://api.linkedin.com/v1/people/~/connections:(headline,first-name,last-name)?oauth2_access_token="+accessToken;

        /*************/
        //Groups link http://developer.linkedin.com/documents/groups-api

        //Get Groups
        //var peopleURL = "https://api.linkedin.com/v1/people/~/group-memberships?oauth2_access_token="+accessToken;

        //Getgroups with Custom Fields
        //1 With Simple Parameter
        //var peopleURL = "https://api.linkedin.com/v1/people/~/group-memberships:(group:(id,name,short-description,description,posts,counts-by-category,is-open-to-non-members,category,website-url,locale,allow-member-invites,site-group-url,small-logo-url,large-logo-url))?oauth2_access_token="+accessToken;
        //2 With nested Parameter
        var peopleURL = "https://api.linkedin.com/v1/people/~/group-memberships:(group:(id,name,short-description,description,posts,counts-by-category,is-open-to-non-members,category,website-url,locale,allow-member-invites,site-group-url,small-logo-url,large-logo-url,relation-to-viewer:(membership-state,available-actions),location:(country,postal-code)))?oauth2_access_token=" + accessToken;

        //Not Working
        //var peopleURL ="https://api.linkedin.com/v1/groups/{group-id}:(id,name,short-description,description,relation-to-viewer:(membership-state,available-actions),posts,counts-by-category,is-open-to-non-members,category,website-url,locale,location:(country,postal-code),allow-member-invites,site-group-url,small-logo-url,large-logo-url)?oauth2_access_token="+accessToken;

        /*************/

        Ti.API.info('People URL:' + peopleURL);

        var xhr = Ti.Network.createHTTPClient();
        xhr.open('GET', peopleURL);

        xhr.onload = function() {
            Ti.API.info('People Response:' + xhr.responseText);
            /*   var xml=xhr.responseXML;

             Ti.API.info('Firstname:'+xml.documentElement.getElementsByTagName('first-name').item(0).textContent +' '+xml.documentElement.getElementsByTagName('last-name').item(0).textContent);
             Ti.API.info(''+xml.documentElement.getElementsByTagName('headline').item(0).textContent);
             var siteStandardProfileRequestURL=xml.documentElement.getElementsByTagName('url').item(0).textContent;
             Ti.API.info('Public URL:'+siteStandardProfileRequestURL);*/
        }
        xhr.onerror = function(e) {
            Ti.API.info('People Error:' + e.error + ':' + this.responseText + ':' + this.status);
        }
        xhr.send();

    };

    getPublicProfile = function(siteUrl) {
        var publicProfileUrl = 'http://api.linkedin.com/v1/people/url=' + siteUrl;
        var xhr = Ti.Network.createHTTPClient();
        xhr.open('GET', publicProfileUrl);

        xhr.onload = function() {
            Ti.API.info('People Response:' + xhr.responseText);
        }
        xhr.onerror = function(e) {
            Ti.API.info('People Error:' + e.error);
        }
        xhr.send();
    }
}

