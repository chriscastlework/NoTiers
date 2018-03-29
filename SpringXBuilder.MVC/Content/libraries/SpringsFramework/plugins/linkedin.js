/* Requires

 sp.core.events.EventDispatcher
    and
 <script type="text/javascript" src="http://platform.linkedin.com/in.js">
     api_key: your_api_key_goes_here
     authorize: true
 </script>
    and the following string constants:
                 "LINKEDIN_1", "LinkedIn Search"
                 "LINKEDIN_2", "None of the LinkedIn.com users matched this contact details."
                 "LINKEDIN_3", "Modify Search"
                 "LINKEDIN_4", "Choose from my own LinkedIn connections"
                 "LINKEDIN_5", "Company"
                 "LINKEDIN_6", "No LinkedIn connections found."
                 "LINKEDIN_7", "The following error has occurred while trying to access LinkedIn data:"
                 "LINKEDIN_8", "Your LinkedIn authorization has expired. Please login again."
                 "LINKEDIN_9", "Login to LinkedIn"
                 "LINKEDIN_10", "Search is taking too long. Please save your data, refresh the page and try again."
                 "LINKEDIN_11", "<< Previous page"
                 "LINKEDIN_12", "Next page >>"
                 "LINKEDIN_13", "All LinkedIn"
                 "LINKEDIN_14", "My Contacts"
                 "LINKEDIN_15", "Search for"
                 "LINKEDIN_16", "Unable to connect to Linkedin at this time, please try again later"

 Notice: isUserAuthorized(), authorizeUser() and searchPeople(...) are the only functions that need to be called from outside classes.
         Also plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS and plugins.linkedin.LinkedInEvent.LINKEDIN_CONTACT_SELECTED are the only events that need to be listened for.
         All other functions, events and the dialog are there just to serve the searchPeople(...) function and they shouldn't be called manually from outside.

*/
sp.namespace("plugins.linkedin.LinkedInApi",
             "plugins.linkedin.LinkedInApiOptions",
             "plugins.linkedin.LinkedInSearchDialog",
             "plugins.linkedin.LinkedInEvent",
             "plugins.linkedin.SearchResultsTableItemRenderer",
             "plugins.linkedin.PictureRenderer"
);

plugins.linkedin.LinkedInApi = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(options)
    {
        this.__super();
        this.options = options || new plugins.linkedin.LinkedInApiOptions();
        if (!this.options.connectionsPerPage) this.options.connectionsPerPage = 100;
        this.init();
    },

    init: function()
    {
        var __this = this;

        this.searchDialog = new plugins.linkedin.LinkedInSearchDialog(this);
        this.searchDialog.addEventListener(this, sp.ui.dialogs.DialogEvent.CLOSE, this.onSearchDialogClose);
    },

    isUserAuthorized: function()
    {
        var isAuthorized = sp.core.data.DataUtils.toBoolean(IN.User.isAuthorized());
        return isAuthorized;
    },

    authorizeUser: function()
    {
        var __this = this;
        IN.User.authorize(function(){__this.onUserAuthorized()});
    },

    onUserAuthorized: function()
    {
        this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS, null));
    },

    refreshUserAuthorization: function()
    {
        IN.User.refresh()
    },

    logoutUser: function()
    {
        var __this = this;
        IN.User.logout(function(){__this.onLogoutSuccess()});
    },

    onLogoutSuccess: function()
    {
        this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.USER_LOGOUT_SUCCESS, null));
    },

    getUserConnections: function(startPoint)
    {
        var __this = this;
        var startPoint = startPoint || 0;

        //store search params (necessary to recreate the search after login expired error)
        this.currentRequest = "allConn";
        this.currentRequestParams = {};

        IN.API.Connections("me")
            .params({"start": startPoint, "count": this.options.connectionsPerPage})
            .fields("public-profile-url", "firstName", "lastName", "headline", "industry", "location", "pictureUrl;secure=true")
            .result( function(result){ __this.onGetUserConnectionsSuccess(result) } )
            .error( function(error){ __this.onLinkedInError(error) } );
    },

    onGetUserConnectionsSuccess: function(connections)
    {
        this.currentRequest = null;
        this.currentRequestParams = null;
        this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.GET_USER_CONNECTIONS_SUCCESS, connections));
    },

    searchPeople: function(firstName, lastName, company, doNotReopenDialog)
    {
        var __this = this;
        firstName = firstName || "";
        lastName = lastName || "";
        company = company || "";

        //store search params (necessary to recreate the search after login expired error)
        this.currentRequest = "search";
        this.currentRequestParams = {firstName: firstName, lastName: lastName, company: company};

        if (!doNotReopenDialog) this.searchDialog.open();
        IN.API.PeopleSearch()
            .params({"first-name": firstName, "last-name":  lastName, company: company})
            .fields(["public-profile-url", "firstName", "lastName", "headline", "industry", "location", "pictureUrl;secure=true"])
            .result( function(result) { __this.onSearchResult(result) } )
            .error( function(error) { __this.onLinkedInError(error) } )
    },

    onSearchResult: function(result)
    {
        var data = {searchResults: result.people.values, requestParams: this.currentRequestParams};
        this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.LINKEDIN_SEARCH_SUCCESS, data));
        this.currentRequest = null;
        this.currentRequestParams = null;
    },

    onLinkedInError: function(error)
    {
        if (error.status == 401 && error.message != "Access to people search denied.")
        {
            this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.AUTHORIZATION_EXPIRED, null));
        }
        else
        {
            this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.LINKEDIN_ERROR, error.message));
        }
    },

    onSearchDialogClose: function(event)
    {
        if (event.result != sp.ui.dialogs.Dialog.OK) return;
        var contact = event.target.getData();
        this.dispatchEvent(new plugins.linkedin.LinkedInEvent(this, plugins.linkedin.LinkedInEvent.LINKEDIN_CONTACT_SELECTED, contact));
    }
}
);

plugins.linkedin.LinkedInApiOptions = Class.extend
(
{
    __constructor:function()
    {
        this.connectionsPerPage = 100;
    }
}
);

plugins.linkedin.LinkedInSearchDialog = sp.ui.dialogs.Dialog.extend
(
{
    __constructor: function(linkedInApi)
    {
        this.__super();
        this.linkedInApi = linkedInApi;
        this.connectionsPerPage = this.linkedInApi.options.connectionsPerPage || 100;
        this.ownConnectionsInitialized = false;
        this.init();
    },

    getSettings: function()
    {
        var locale = sp.core.locale.getLocale();
        return {title: locale.getString("LINKEDIN_1", "LinkedIn Search"), width: "650px", resizable: false}
    },

    init: function()
    {
        var locale = sp.core.locale.getLocale();
        var tabTitle1 = locale.getString("LINKEDIN_13", "All LinkedIn");
        var tabTitle2 = locale.getString("LINKEDIN_14", "My Contacts");

        this.addDialogClass("linkedin_dialog");

        this.tabsContainer = this.addElement(this.createElement("div", {width: "100%", float: "left"}, ["linkedin_tabs"]));
        var tabOptions = new sp.ui.tabset.TabSetOptions();
        tabOptions.ids = ["tab0001", "tab0002"];
        tabOptions.titles = [tabTitle1, tabTitle2];
        tabOptions.labels = [tabTitle1, tabTitle2];
        this.tabs = new sp.ui.tabset.TabSet(tabOptions);
        this.tabs.build();
        this.tabs.addEventListener(this, sp.ui.tabset.TabSetEvent.TABSSHOW, this.onTabsShow);
        $(this.tabsContainer).append(this.tabs.getGraphic());

        this.linkedinErrorContainer = this.addElement(this.createElement("div", {width: "100%", float: "left", "text-align": "center"}, ["error_msg_container"]));
        $(this.linkedinErrorContainer).hide();

        this.allLinkedInTab = $("#tab0001");
        this.myContactsTab = $("#tab0002");
        this.initAllLinkedInTab();
        this.initContactsTab();
    },

    initAllLinkedInTab: function()
    {
        var __this = this;
        var locale = sp.core.locale.getLocale();
        var firstNameLbl = locale.getString('CONTACT_DIALOG_FIRST_NAME', 'First Name');
        var lastNameLbl  = locale.getString('CONTACT_DIALOG_LAST_NAME', 'Last Name');
        var companyLbl = locale.getString('LINKEDIN_5', 'Company');
        var searchLbl = locale.getString('CONTACT_DIALOG_SEARCH', 'Search');

        this.clearTabContent(this.allLinkedInTab);
        var searchPanel = this.createElement('div', {width: "28%", float: "left"}, ["search_panel"]);
        var resultsPanel = this.createElement('div', {width: "70%", float: "left", "margin-left": "10px"}, ["results_panel"]);
        $(this.allLinkedInTab).append(searchPanel, resultsPanel);

        //search panel
        var label = this.createElement("div", {width: '98%', float: 'left'}, ["label search_for_label"], {}, {}, locale.getString('CONTACT_DIALOG_SEARCH_FOR', 'Search for...'));

        var labelWidth = '98%'; 
        var inputWidth = '98%';

        var firstNameLabel = this.createElement('div', {width: labelWidth, clear: 'both', float: 'left', 'margin-right': '5px', 'margin-top': '10px'}, ["label first_name_label"], {}, {}, firstNameLbl);
        this.firstNameInput = this.createElement("input", {width: inputWidth, float: 'left', 'margin-top': '5px'}, ["input name first_name"]);

        var lastNameLabel = this.createElement('div', {width: labelWidth, clear: 'both', float: 'left', 'margin-right': '5px', 'margin-top': '10px'}, ["label last_name_label"], {}, {}, lastNameLbl);
        this.lastNameInput = this.createElement("input", {width: inputWidth, float: 'left', 'margin-top': '5px'}, ["input name last_name"]);

        var companyLabel = this.createElement('div', {width: labelWidth, clear: 'both', float: 'left', 'margin-right': '5px', 'margin-top': '10px'}, ["label company_label"], {}, {}, companyLbl);
        this.companyInput = this.createElement("input", {width: inputWidth, float: 'left', 'margin-top': '5px'}, ["input name company"]);

        var searchBtn = this.createElement('button', {clear: 'both', float: 'left', 'margin-top': '10px', 'background-color': 'gray'}, ['search_btn'], {}, {}, searchLbl);
        $(searchBtn).button();
        $(searchBtn).click(function() { __this.startNewSearch($(__this.firstNameInput).val(), $(__this.lastNameInput).val(), $(__this.companyInput).val()) });

        $(searchPanel).append(label, firstNameLabel, this.firstNameInput, lastNameLabel, this.lastNameInput, companyLabel, this.companyInput, searchBtn);
        
        //results panel
            //error msg container
        this.searchResultsErrorContainer = this.createElement('div', {width: "98%", height: "100%", float: "left", "text-align": "center"});
        $(resultsPanel).append(this.searchResultsErrorContainer);
        $(this.searchResultsErrorContainer).hide();

            //results table container
        this.searchResultsContainer = this.createElement('div', {width: "98%", float: "left", height: "100%"});
        $(resultsPanel).append(this.searchResultsContainer);
        
        this.searchParamsContainer = this.createElement('div', {width: "98%", float: "left", "margin-bottom": "10px", "font-weight":"bold"});
        this.searchResultsTableContainer = this.createElement('div', {width: "98%", float: "left"});
        $(this.searchResultsContainer).append(this.searchParamsContainer, this.searchResultsTableContainer);

        var options = this.getTableOptions();
        this.searchResultsTable = new sp.ui.table.Table(this.searchResultsTableContainer, options);
        $(this.searchResultsTable.rowContainer).addClass('search_results_table');
        $(this.searchResultsTable.rowContainer).css('min-height', '200px');
    },

    initContactsTab: function()
    {
        var __this = this;
        var locale = sp.core.locale.getLocale();
        var prevPageLabel = locale.getString("LINKEDIN_11", "<< Previous page");
        var nextPageLabel = locale.getString("LINKEDIN_12", "Next page >>");

        this.clearTabContent(this.myContactsTab);

        //error msg container
        this.myContactsErrorContainer = this.createElement('div', {width: "98%", height: "100%", float: "left", "text-align": "center"});
        $(this.myContactsTab).append(this.myContactsErrorContainer);
        $(this.myContactsErrorContainer).hide();

        //results table container
        this.myContactsTableContainer = this.createElement('div', {width: "98%", height: "100%", float: "left"});
        $(this.myContactsTab).append(this.myContactsTableContainer);

        var options = this.getTableOptions();
        this.myContactsTable = new sp.ui.table.Table(this.myContactsTableContainer, options);
        $(this.myContactsTable.rowContainer).addClass('my_contacts_table');
        $(this.myContactsTable.rowContainer).css('min-height', '200px');

        //prev and next btns
        this.nextPageBtn = this.createElement('div', {float: 'right', 'margin-top': '10px', cursor: 'pointer'}, ['next_page_btn'], {}, {}, nextPageLabel);
        $(this.nextPageBtn).click(function(){__this.showNextPage()});
        $(this.nextPageBtn).hide();

        this.prevPageBtn = this.createElement('div', {float: 'left', 'margin-top': '10px', cursor: 'pointer'}, ['prev_page_btn'], {}, {}, prevPageLabel);
        $(this.prevPageBtn).click(function(){__this.showPrevPage()});
        $(this.prevPageBtn).hide();

        $(this.myContactsTab).append(this.prevPageBtn, this.nextPageBtn);
    },
    
    getTableOptions: function()
    {
        var locale = sp.core.locale.getLocale();
        var firstNameLbl = locale.getString('CONTACT_DIALOG_FIRST_NAME', 'First Name');
        var lastNameLbl  = locale.getString('CONTACT_DIALOG_LAST_NAME', 'Last Name');
        var titleLbl = locale.getString('CONTACT_DIALOG_TITLE', 'Title');
        
        var options = new sp.ui.table.TableOptions();
        options.props = ["pictureUrl", "firstName", "lastName", "headline"];
        options.labels = ["", firstNameLbl, lastNameLbl, titleLbl];
        options.widths = ["20%", "20%", "20%", "40%"];
        options.itemRenderer = new plugins.linkedin.SearchResultsTableItemRenderer();
        
        return options;
    },

    onOpen: function()
    {
        this.resetTabs();
        this.getPreloader().show();
        this.linkedInApi.addEventListener(this, plugins.linkedin.LinkedInEvent.LINKEDIN_SEARCH_SUCCESS, this.onSearchResult);
        this.linkedInApi.addEventListener(this, plugins.linkedin.LinkedInEvent.GET_USER_CONNECTIONS_SUCCESS, this.onGetUserConnectionsResult);
        this.linkedInApi.addEventListener(this, plugins.linkedin.LinkedInEvent.LINKEDIN_ERROR, this.onSearchError);
        this.linkedInApi.addEventListener(this, plugins.linkedin.LinkedInEvent.AUTHORIZATION_EXPIRED, this.onAuthorizationExpired);
    },

    close: function()
    {
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.LINKEDIN_SEARCH_SUCCESS, this.onSearchResult);
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.GET_USER_CONNECTIONS_SUCCESS, this.onGetUserConnectionsResult);
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.LINKEDIN_ERROR, this.onSearchError);
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.AUTHORIZATION_EXPIRED, this.onAuthorizationExpired);
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS, this.onAuthorizationSuccess);
        this.__super();
    },

    resetTabs: function()
    {
        this.tabs.selectTab(0);
        $(this.tabsContainer).show();
        $(this.linkedinErrorContainer).hide();
        $(this.firstNameInput).val("");
        $(this.lastNameInput).val("");
        $(this.companyInput).val("");
    },

    onSearchResult: function(event)
    {
        var locale = sp.core.locale.getLocale();
        var result = event.data.searchResults;
        var searchParams = event.data.requestParams || {};

        this.getPreloader().hide();

        if (!result)
        {
            $(this.searchResultsErrorContainer).show();
            $(this.searchResultsContainer).hide();
            var msg = locale.getString("LINKEDIN_2", "None of the LinkedIn.com users matched this contact details.")
            $(this.searchResultsErrorContainer).html(msg);
        }
        else
        {
            $(this.searchResultsErrorContainer).hide();
            $(this.searchResultsContainer).show();

            var searchParamsStr = locale.getString("LINKEDIN_15", "Search for") + " " + (searchParams.firstName || "") + " " + (searchParams.lastName || "");
            if (searchParams.company && searchParams.company!="") searchParamsStr += ", " + locale.getString("LINKEDIN_5","Company") + ": " + searchParams.company;
            searchParamsStr += ":";

            $(this.searchParamsContainer).html(searchParamsStr);
            this.searchResultsTable.setDataProvider(result);
        }
    },

    startNewSearch: function(firstName, lastName, company)
    {
        this.getPreloader().show();
        this.linkedInApi.searchPeople(firstName, lastName, company, true);
    },

    onTabsShow: function(event)
    {
        var tabHash = event.selectedTabHash.replace("#", "");
        if (tabHash == 'tab0002' && !(this.ownConnectionsInitialized))
        {
            this.getPreloader().show();
            this.currentlyShownContacts = {start: 0, end: this.connectionsPerPage};
            this.linkedInApi.getUserConnections(this.currentlyShownContacts.start);
            this.ownConnectionsInitialized = true;
        }
    },

    onGetUserConnectionsResult: function(event)
    {
        var locale = sp.core.locale.getLocale();
        var noResultsMsg = locale.getString("LINKEDIN_6", "No linkedIn connections found.");

        this.getPreloader().hide();
        $(this.nextPageBtn).hide();
        $(this.prevPageBtn).hide();

        var totalConnections = event.data._total;
        var userConnections = event.data.values;
        if (!userConnections || userConnections.length==0)
        {
            $(this.myContactsErrorContainer).show();
            $(this.myContactsTableContainer).hide();
            $(this.myContactsErrorContainer).html(noResultsMsg);
        }
        else
        {
            $(this.myContactsErrorContainer).hide();
            $(this.myContactsTableContainer).show();
            this.myContactsTable.setDataProvider(userConnections);
            $(this.myContactsTable.rowContainer).scrollTop(0);
            if (this.currentlyShownContacts.end < totalConnections)
            {
                $(this.nextPageBtn).show();
            }
            if (this.currentlyShownContacts.start > 0)
            {
                $(this.prevPageBtn).show();
            }
        }
    },

    showNextPage: function()
    {
        $(this.nextPageBtn).hide();
        $(this.prevPageBtn).hide();
        this.currentlyShownContacts.start += this.connectionsPerPage;
        this.currentlyShownContacts.end += this.connectionsPerPage;
        this.getPreloader().show();
        this.linkedInApi.getUserConnections(this.currentlyShownContacts.start);
    },

    showPrevPage: function()
    {
        $(this.nextPageBtn).hide();
        $(this.prevPageBtn).hide();
        this.currentlyShownContacts.start -= this.connectionsPerPage;
        if (this.currentlyShownContacts.start < 0) this.currentlyShownContacts.start=0;
        this.currentlyShownContacts.end -= this.connectionsPerPage;
        this.getPreloader().show();
        this.linkedInApi.getUserConnections(this.currentlyShownContacts.start);
    },

    onSearchError: function(event)
    {
        var locale = sp.core.locale.getLocale();
//        var msg = locale.getString("LINKEDIN_7", "The following error has occurred while trying to access linkedIn data:");
        var msg = locale.getString("LINKEDIN_16", "Unable to connect to Linkedin at this time, please try again later");

        this.getPreloader().hide();
        $(this.searchResultsErrorContainer).show();
        $(this.searchResultsContainer).hide();

//        var errorMsg = event.data;
//        $(this.searchResultsErrorContainer).html(msg + " " + errorMsg);
        $(this.searchResultsErrorContainer).html(msg);
    },

    onAuthorizationExpired: function()
    {
        var __this = this;
        this.currentToken = IN.ENV.auth.oauth_token;
        this.linkedInApi.refreshUserAuthorization();

        //poll the token while it gets updated (no other way to check when it gets refreshed since the IN.User.refresh() doesn't support a callback)
        var tokenUpdateTries = 0;
        (function isTokenUpdated() {
            if (__this.currentToken == IN.ENV.auth.oauth_token)
            {
                if (tokenUpdateTries > 30) //if token still hasn't updated after 6sec show error msg
                {
                    var locale = sp.core.locale.getLocale();
                    __this.tabsContainer.hide();
                    __this.linkedinErrorContainer.show();
                    var msg = locale.getString("LINKEDIN_10", "Search is taking too long. Please save your data, refresh the page and try again.");
                    $(__this.linkedinErrorContainer).html(msg);
                    return;
                }
                tokenUpdateTries++;
                setTimeout(isTokenUpdated, 200);
            }
            else
            {
                __this.onTokenUpdated();
            }
        })();
    },

    onTokenUpdated: function()
    {
        var __this = this;

        if (IN.ENV.auth.oauth_token == "") //user has to login again
        {
            this.getPreloader().hide();
            var locale = sp.core.locale.getLocale();
            var msg = locale.getString("LINKEDIN_8", "Your LinkedIn authorization has expired. Please login again.");
            var loginBtnLbl = locale.getString("LINKEDIN_9", "Login to LinkedIn");

            $(this.tabsContainer).hide();
            $(this.linkedinErrorContainer).show();
            $(this.linkedinErrorContainer).html(msg);

            var loginBtn = this.createElement('button', {clear: 'both', float: 'left', 'margin-top': '10px', 'margin-left': '40%', 'background-color': 'gray'}, ['login_btn'], {}, {}, loginBtnLbl);
            $(loginBtn).button();
            $(loginBtn).click(function() {
                __this.linkedInApi.authorizeUser();
                __this.linkedInApi.addEventListener(__this, plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS, __this.onAuthorizationSuccess);
            });
            $(this.linkedinErrorContainer).append(loginBtn)
        }
        else //token has been automatically renewed (no re-logging necessary)
        {
            this.recreateSavedSearch();
        }
    },

    onAuthorizationSuccess: function()
    {
        this.linkedInApi.removeEventListener(this, plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS, this.onAuthorizationSuccess);
        this.recreateSavedSearch();
    },

    recreateSavedSearch: function()
    {
        $(this.linkedinErrorContainer).hide();
        $(this.tabsContainer).show();

        if (!this.linkedInApi.currentRequest)
        {
            this.close();
            return;
        }
        if (this.linkedInApi.currentRequest == "search")
        {
            var params = this.linkedInApi.currentRequestParams || {};
            this.getPreloader().show();
            this.linkedInApi.searchPeople(params.firstName, params.lastName, params.company, true);
        }
        else if (this.linkedInApi.currentRequest == "allConn")
        {
            this.getPreloader().show();
            this.linkedInApi.getUserConnections(this.currentlyShownContacts.start);
        }
    },

    getData: function()
    {
        var table;
        var currTabId = this.tabs.getSelectedTabId();
        if (currTabId == 0) table = this.searchResultsTable
        else table = this.myContactsTable;

        return table.getSelectedRowData();
    },

    clearTabContent: function(tab)
    {
        $(tab).empty();
    },

    getPreloader: function()
    {
        var appInstance = ws.applet.Applet.getInstance();
        var preloaderPath='';
        if (appInstance && typeof(appInstance.getPreloaderPath) == "function")
        {
            preloaderPath = appInstance.getPreloaderPath();
        }
        else
        {
            preloaderPath = "/SpringsFramework/res/images/main/preloader.gif";
        }
        if (!this.preloader) this.preloader = new sp.ui.preloader.Preloader(new sp.ui.preloader.PreloaderOptions({ container: this.getGraphic(), imageURL: preloaderPath, label: sp.core.locale.getString('CONTACT_PRELOADER_TEXT','Searching...')}));
        return this.preloader;
    }
}
);

plugins.linkedin.SearchResultsTableItemRenderer =  Class.extend
(
{
    __constructor: function()
    {
        this.defaultRenderer = new sp.ui.table.TableItemRenderer();
        this.pictureRenderer = new plugins.linkedin.PictureRenderer();
    },

    render: function(cell, columnIndex, rowIndex, data, prop, table)
    {
        var renderer = this.defaultRenderer;
        if (prop == 'pictureUrl') renderer = this.pictureRenderer;

        cell = renderer.render(cell, columnIndex, rowIndex, data, prop, table);
        return cell;
    }
}
);

plugins.linkedin.PictureRenderer = Class.extend
(
{
    render: function(cell, columnIndex, rowIndex, data, prop, table)
    {
        var __this = this;
        var imageUrl = data[rowIndex][prop];

        if (!cell) cell = document.createElement('td');
        $(cell).css('text-align', 'center');
        if (!imageUrl || imageUrl == "") return cell;

        var img = document.createElement('img');
        $(img).css('border', '1px solid gray');
        $(img).addClass('contact_picture');
        $(img).attr({src: imageUrl, width: '80px', height: '80px'});
        $(cell).append(img);

        return cell;
    }
}
);

plugins.linkedin.LinkedInEvent = sp.core.events.Event.extend
(
{
    __constructor:function(target,type,data)
    {
        this.__super(target,type);
        this.data = data;
    }
}
);
plugins.linkedin.LinkedInEvent.LINKEDIN_BTN_CLICK = "linked_in_btn_click";
plugins.linkedin.LinkedInEvent.USER_AUTHORIZATION_SUCCESS = "user_authorization_success";
plugins.linkedin.LinkedInEvent.USER_LOGOUT_SUCCESS = "user_logout_success";
plugins.linkedin.LinkedInEvent.GET_USER_CONNECTIONS_SUCCESS = "get_user_connections_success";
plugins.linkedin.LinkedInEvent.LINKEDIN_SEARCH_SUCCESS = "linkedin_search_success";
plugins.linkedin.LinkedInEvent.AUTHORIZATION_EXPIRED = "authorization_expired";
plugins.linkedin.LinkedInEvent.LINKEDIN_ERROR = "linkedin_error";
plugins.linkedin.LinkedInEvent.LINKEDIN_CONTACT_SELECTED = "linkedin_contact_selected";
