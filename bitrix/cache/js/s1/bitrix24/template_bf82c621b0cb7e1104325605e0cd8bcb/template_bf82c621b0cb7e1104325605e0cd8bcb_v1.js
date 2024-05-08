
; /* Start:"a:4:{s:4:"full";s:91:"/bitrix/components/bitrix/tasks.iframe.popup/templates/.default/logic.min.js?17127225217131";s:6:"source";s:72:"/bitrix/components/bitrix/tasks.iframe.popup/templates/.default/logic.js";s:3:"min";s:76:"/bitrix/components/bitrix/tasks.iframe.popup/templates/.default/logic.min.js";s:3:"map";s:76:"/bitrix/components/bitrix/tasks.iframe.popup/templates/.default/logic.map.js";}"*/
BX.namespace("Tasks.Component");BX.Tasks.Component.IframePopup=function(t){this.opts=BX.merge({},t);this.vars={skip:true,callbacks:{},resizeInterval:false,resizeLock:true,lastHeight:false};this.sys={scope:null};this.instances={win:false};this.ctrls={iframe:null,wrap:null,close:null};this.setCallbacks(t.callbacks);this.bindEvents()};BX.mergeEx(BX.Tasks.Component.IframePopup.prototype,{add:function(t){this.edit(0,t)},view:function(t){this.open("view",t)},edit:function(t,e){this.open("edit",t,{urlParams:e})},open:function(t,e,n){e=parseInt(e);if(isNaN(e)||e<0){return}n=n||{};var i=this.getPath(t,e,n.urlParams);if(BX.Bitrix24&&"PageSlider"in BX.Bitrix24){BX.Bitrix24.PageSlider.open(i)}else{this.toggleLoading(true);this.getWindow().show();this.getWindow().setBindElement(this.getWindowCoords());this.getWindow().adjustPosition();this.getIframe().src=i}},close:function(){this.getWindow().close()},bindEvents:function(){BX.bind(window,"resize",BX.throttle(this.onWindowResize,100,this));BX.addCustomEvent(window,"tasksIframeLoad",this.onContentLoaded.bind(this));BX.addCustomEvent(window,"tasksIframeUnload",this.onContentUnLoaded.bind(this))},bindInnerDocumentEvents:function(){var t=this.getContentDocument();if(t){BX.bind(t,"keydown",this.onInnerDocumentKeyDown.bind(this))}},getIframe:function(){if(this.ctrls.iframe===null){this.ctrls.iframe=BX.create("iframe",{attrs:{scrolling:"no",frameBorder:"0"}})}return this.ctrls.iframe},getWindow:function(){if(this.instances.win===false){this.instances.win=new BX.PopupWindow("tasks-iframe-popup",{top:0,left:0},{autoHide:false,closeByEsc:true,content:this.getIframeContainer(),overlay:true,lightShadow:false,closeIcon:true,contentNoPaddings:true,draggable:false,titleBar:true,events:{onPopupClose:BX.delegate(this.onPopupClose,this),onPopupShow:BX.delegate(this.onPopupOpen,this)}});this.ctrls.close=BX.create("div",{props:{className:"hidden"},attrs:{id:"tasks-popup-close",title:BX.message("TASKS_TIP_COMPONENT_TEMPLATE_CLOSE_WINDOW")},events:{click:BX.delegate(this.onCloseClicked,this)},children:[BX.create("span")]});BX.insertAfter(this.ctrls.close,BX("popup-window-overlay-tasks-iframe-popup"))}return this.instances.win},setTitle:function(t,e){var n="";if(t!=false){t=t=="view"?"VIEW":"EDIT";e=parseInt(e);if(isNaN(e)||e<=0){e=0}if(t=="EDIT"&&e==0){t="NEW"}n=BX.message("TASKS_TIP_COMPONENT_TEMPLATE_"+t+"_TASK_TITLE");if(e>0){n=n.replace("#TASK_ID#",e)}}this.getWindow().setTitleBar(n)},getPath:function(t,e,n){t=t=="view"?"view":"edit";e=parseInt(e);var i=this.opts.pathToTasks.replace("#task_id#",e);i=i+(i.indexOf("?")==-1?"?":"&")+"IFRAME=Y";if(BX.type.isPlainObject(n)){for(var s in n){i+="&"+s+"="+encodeURIComponent(n[s])}}i=i.replace("#action#",t);return i},getWindowCoords:function(){var t=BX.pos(this.getIframeContainer()).width;var e=BX.GetWindowSize().innerWidth;var n=BX.GetWindowScrollPos().scrollTop;return{left:Math.floor((e-t)/2),top:30+n}},getContentDocument:function(){var t=this.getIframe();var e=null;if(t.contentDocument){e=t.contentDocument}if(t.contentWindow){e=t.contentWindow.document}return e&&e.body?e:null},getIframeContainer:function(){if(this.ctrls.wrap===null){this.ctrls.wrap=this.ctrls.wrap=BX.create("div",{props:{className:"tasks-iframe-wrap loading fixedHeight"},attrs:{id:"tasks-iframe-wrap"},children:[this.getIframe()]})}return this.ctrls.wrap},getContentContainer:function(){var t=this.getContentDocument();if(t){return t.getElementById("tasks-content-outer")}return null},onCloseClicked:function(){this.getWindow().close()},onTaskGlobalEvent:function(t,e){if(BX.type.isNotEmptyString(t)){var n=t.toString().toUpperCase();e=e||{};e.task=e.task||{};e.options=e.options||{};var i=[];var s=parseInt(e.task.ID);if(n=="DELETE"&&!isNaN(s)&&s){i.push(e.task.ID)}else if(n=="ADD"||n=="UPDATE"){if(e.taskUgly){i.push(e.taskUgly)}else{return}}if(!e.options.STAY_AT_PAGE){this.close()}if(typeof this.vars.callbacks[n]!="undefined"&&this.vars.callbacks[n]!==false){var o=this.vars.callbacks[n];if(BX.type.isString(o)){o=BX.Tasks.deReference(o,window)}if(BX.type.isFunction(o)){o.apply(window,i)}}}},onContentLoaded:function(){var t=this.getContentDocument();if(t){var e=this.parseUrl(t.location.pathname);if(e){this.setTitle(e.action,e.taskId)}}this.toggleLoading(false);this.startMonitorContent();this.bindInnerDocumentEvents()},onContentUnLoaded:function(){this.setTitle(false);this.stopMonitorContent()},onPopupOpen:function(){BX.toggleClass(this.ctrls.close,"hidden");this.toggleLoading(true)},onPopupClose:function(){BX.toggleClass(this.ctrls.close,"hidden");this.lockHeight();this.stopMonitorContent();this.toggleLoading(true);this.vars.lastHeight=false;this.getIframe().src="about:blank"},onWindowResize:function(){if(this.getWindow().isShown()){this.getWindow().setBindElement(this.getWindowCoords())}},onContentResize:function(){if(this.getWindow().isShown()&&!this.vars.resizeLock){var t=this.getContentDocument();if(t){var e=this.getContentContainer();if(e){var n=e.offsetHeight;if(n!=this.vars.lastHeight){this.getIframeContainer().style.height=n+"px";this.vars.lastHeight=n;this.unLockHeight()}this.getWindow().popupContainer.style.marginBottom="40px";this.getWindow().resizeOverlay()}}}},onInnerDocumentKeyDown:function(t){if(BX.Tasks.Util.isEsc(t)){this.close()}},lockHeight:function(){this.toggleFixedHeight(true)},unLockHeight:function(){this.toggleFixedHeight(false)},toggleFixedHeight:function(t){BX[t?"addClass":"removeClass"](this.getIframeContainer(),"fixedHeight")},toggleLoading:function(t){BX[t?"addClass":"removeClass"](this.getIframeContainer(),"loading")},stopMonitorContent:function(){this.vars.resizeLock=true},startMonitorContent:function(){this.vars.resizeLock=false;if(this.vars.resizeInterval===false){this.vars.resizeInterval=setInterval(BX.proxy(this.onContentResize,this),300)}},setCallbacks:function(t){if(BX.type.isPlainObject(t)){BX.Tasks.each(t,function(t,e){if(t=="#SHOW_ADDED_TASK_DETAIL#"){return}if(t!==false&&(BX.type.isFunction(t)||BX.type.isNotEmptyString(t))){this.vars.callbacks[e]=t}}.bind(this))}},showCreateForm:function(){this.add()},parseUrl:function(t){var e=this.opts.pathToTasks;if(e){e=e.toLowerCase().replace("#action#","(view|edit){1}").replace("#task_id#","(\\d+)");var n=t.match(new RegExp(e));if(n&&BX.type.isArray(n)){var i=n[1]||false;var s=n[2]||false;if(i&&s){return{action:i,taskId:parseInt(s)}}}}return null},onTaskAdded:function(t,e,n,i,s){BX.onCustomEvent(this,"onTaskAdded",[t,e,n,i,s])},onTaskChanged:function(t,e,n,i,s){BX.onCustomEvent(this,"onTaskChanged",[t,e,n,i,s])},onTaskDeleted:function(t){BX.onCustomEvent(this,"onTaskDeleted",[t])}});BX.Tasks.Component.IframePopup.create=function(t){if(window.top!=window){return}if(typeof BX.Tasks.Singletons=="undefined"){BX.Tasks.Singletons={}}if(typeof BX.Tasks.Singletons.iframePopup=="undefined"){BX.Tasks.Singletons.iframePopup=new BX.Tasks.Component.IframePopup(t);window.taskIFramePopup=BX.Tasks.Singletons.iframePopup;window.BX.TasksIFrameInst=BX.Tasks.Singletons.iframePopup}else{BX.Tasks.Singletons.iframePopup.setCallbacks(t.callbacks)}return BX.Tasks.Singletons.iframePopup};
/* End */
;
; /* Start:"a:4:{s:4:"full";s:67:"/bitrix/components/bitrix/search.title/script.min.js?17127224976443";s:6:"source";s:48:"/bitrix/components/bitrix/search.title/script.js";s:3:"min";s:52:"/bitrix/components/bitrix/search.title/script.min.js";s:3:"map";s:52:"/bitrix/components/bitrix/search.title/script.map.js";}"*/
function JCTitleSearch(t){var e=this;this.arParams={AJAX_PAGE:t.AJAX_PAGE,CONTAINER_ID:t.CONTAINER_ID,INPUT_ID:t.INPUT_ID,MIN_QUERY_LEN:parseInt(t.MIN_QUERY_LEN)};if(t.WAIT_IMAGE)this.arParams.WAIT_IMAGE=t.WAIT_IMAGE;if(t.MIN_QUERY_LEN<=0)t.MIN_QUERY_LEN=1;this.cache=[];this.cache_key=null;this.startText="";this.running=false;this.runningCall=false;this.currentRow=-1;this.RESULT=null;this.CONTAINER=null;this.INPUT=null;this.WAIT=null;this.ShowResult=function(t){if(BX.type.isString(t)){e.RESULT.innerHTML=t}e.RESULT.style.display=e.RESULT.innerHTML!==""?"block":"none";var s=e.adjustResultNode();var i;var n;var l=BX.findChild(e.RESULT,{tag:"table",class:"title-search-result"},true);if(l){n=BX.findChild(l,{tag:"th"},true)}if(n){var r=BX.pos(l);r.width=r.right-r.left;var a=BX.pos(n);a.width=a.right-a.left;n.style.width=a.width+"px";e.RESULT.style.width=s.width+a.width+"px";e.RESULT.style.left=s.left-a.width-1+"px";if(r.width-a.width>s.width)e.RESULT.style.width=s.width+a.width-1+"px";r=BX.pos(l);i=BX.pos(e.RESULT);if(i.right>r.right){e.RESULT.style.width=r.right-r.left+"px"}}var o;if(l)o=BX.findChild(e.RESULT,{class:"title-search-fader"},true);if(o&&n){i=BX.pos(e.RESULT);o.style.left=i.right-i.left-18+"px";o.style.width=18+"px";o.style.top=0+"px";o.style.height=i.bottom-i.top+"px";o.style.display="block"}};this.onKeyPress=function(t){var s=BX.findChild(e.RESULT,{tag:"table",class:"title-search-result"},true);if(!s)return false;var i;var n=s.rows.length;switch(t){case 27:e.RESULT.style.display="none";e.currentRow=-1;e.UnSelectAll();return true;case 40:if(e.RESULT.style.display=="none")e.RESULT.style.display="block";var l=-1;for(i=0;i<n;i++){if(!BX.findChild(s.rows[i],{class:"title-search-separator"},true)){if(l==-1)l=i;if(e.currentRow<i){e.currentRow=i;break}else if(s.rows[i].className=="title-search-selected"){s.rows[i].className=""}}}if(i==n&&e.currentRow!=i)e.currentRow=l;s.rows[e.currentRow].className="title-search-selected";return true;case 38:if(e.RESULT.style.display=="none")e.RESULT.style.display="block";var r=-1;for(i=n-1;i>=0;i--){if(!BX.findChild(s.rows[i],{class:"title-search-separator"},true)){if(r==-1)r=i;if(e.currentRow>i){e.currentRow=i;break}else if(s.rows[i].className=="title-search-selected"){s.rows[i].className=""}}}if(i<0&&e.currentRow!=i)e.currentRow=r;s.rows[e.currentRow].className="title-search-selected";return true;case 13:if(e.RESULT.style.display=="block"){for(i=0;i<n;i++){if(e.currentRow==i){if(!BX.findChild(s.rows[i],{class:"title-search-separator"},true)){var a=BX.findChild(s.rows[i],{tag:"a"},true);if(a){window.location=a.href;return true}}}}}return false}return false};this.onTimeout=function(){e.onChange(function(){setTimeout(e.onTimeout,500)})};this.onChange=function(t){if(e.running){e.runningCall=true;return}e.running=true;if(e.INPUT.value!=e.oldValue&&e.INPUT.value!=e.startText){e.oldValue=e.INPUT.value;if(e.INPUT.value.length>=e.arParams.MIN_QUERY_LEN){e.cache_key=e.arParams.INPUT_ID+"|"+e.INPUT.value;if(e.cache[e.cache_key]==null){if(e.WAIT){var s=BX.pos(e.INPUT);var i=s.bottom-s.top-2;e.WAIT.style.top=s.top+1+"px";e.WAIT.style.height=i+"px";e.WAIT.style.width=i+"px";e.WAIT.style.left=s.right-i+2+"px";e.WAIT.style.display="block"}BX.ajax.post(e.arParams.AJAX_PAGE,{ajax_call:"y",INPUT_ID:e.arParams.INPUT_ID,q:e.INPUT.value,l:e.arParams.MIN_QUERY_LEN},function(s){e.cache[e.cache_key]=s;e.ShowResult(s);e.currentRow=-1;e.EnableMouseEvents();if(e.WAIT)e.WAIT.style.display="none";if(!!t)t();e.running=false;if(e.runningCall){e.runningCall=false;e.onChange()}});return}else{e.ShowResult(e.cache[e.cache_key]);e.currentRow=-1;e.EnableMouseEvents()}}else{e.RESULT.style.display="none";e.currentRow=-1;e.UnSelectAll()}}if(!!t)t();e.running=false};this.onScroll=function(){if(BX.type.isElementNode(e.RESULT)&&e.RESULT.style.display!=="none"&&e.RESULT.innerHTML!==""){e.adjustResultNode()}};this.UnSelectAll=function(){var t=BX.findChild(e.RESULT,{tag:"table",class:"title-search-result"},true);if(t){var s=t.rows.length;for(var i=0;i<s;i++)t.rows[i].className=""}};this.EnableMouseEvents=function(){var t=BX.findChild(e.RESULT,{tag:"table",class:"title-search-result"},true);if(t){var s=t.rows.length;for(var i=0;i<s;i++)if(!BX.findChild(t.rows[i],{class:"title-search-separator"},true)){t.rows[i].id="row_"+i;t.rows[i].onmouseover=function(t){if(e.currentRow!=this.id.substr(4)){e.UnSelectAll();this.className="title-search-selected";e.currentRow=this.id.substr(4)}};t.rows[i].onmouseout=function(t){this.className="";e.currentRow=-1}}}};this.onFocusLost=function(t){setTimeout(function(){e.RESULT.style.display="none"},250)};this.onFocusGain=function(){if(e.RESULT.innerHTML.length)e.ShowResult()};this.onKeyDown=function(t){if(!t)t=window.event;if(e.RESULT.style.display=="block"){if(e.onKeyPress(t.keyCode))return BX.PreventDefault(t)}};this.adjustResultNode=function(){if(!(BX.type.isElementNode(e.RESULT)&&BX.type.isElementNode(e.CONTAINER))){return{top:0,right:0,bottom:0,left:0,width:0,height:0}}var t=BX.pos(e.CONTAINER);e.RESULT.style.position="absolute";e.RESULT.style.top=t.bottom+2+"px";e.RESULT.style.left=t.left+"px";e.RESULT.style.width=t.width+"px";return t};this._onContainerLayoutChange=function(){if(BX.type.isElementNode(e.RESULT)&&e.RESULT.style.display!=="none"&&e.RESULT.innerHTML!==""){e.adjustResultNode()}};this.Init=function(){this.CONTAINER=document.getElementById(this.arParams.CONTAINER_ID);BX.addCustomEvent(this.CONTAINER,"OnNodeLayoutChange",this._onContainerLayoutChange);this.RESULT=document.body.appendChild(document.createElement("DIV"));this.RESULT.className="title-search-result";this.INPUT=document.getElementById(this.arParams.INPUT_ID);this.startText=this.oldValue=this.INPUT.value;BX.bind(this.INPUT,"focus",function(){e.onFocusGain()});BX.bind(this.INPUT,"blur",function(){e.onFocusLost()});this.INPUT.onkeydown=this.onKeyDown;if(this.arParams.WAIT_IMAGE){this.WAIT=document.body.appendChild(document.createElement("DIV"));this.WAIT.style.backgroundImage="url('"+this.arParams.WAIT_IMAGE+"')";if(!BX.browser.IsIE())this.WAIT.style.backgroundRepeat="none";this.WAIT.style.display="none";this.WAIT.style.position="absolute";this.WAIT.style.zIndex="1100"}BX.bind(this.INPUT,"bxchange",function(){e.onChange()});var t=BX.findParent(this.CONTAINER,BX.is_fixed);if(BX.type.isElementNode(t)){BX.bind(window,"scroll",BX.throttle(this.onScroll,100,this))}};BX.ready(function(){e.Init(t)})}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:93:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/script.min.js?171272285896620";s:6:"source";s:73:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/script.js";s:3:"min";s:77:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/script.min.js";s:3:"map";s:77:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/script.map.js";}"*/
this.BX=this.BX||{};(function(e,t,n,i,a,r,s){"use strict";var o=function(){function e(){babelHelpers.classCallCheck(this,e)}babelHelpers.createClass(e,null,[{key:"eventName",value:function e(t){return["BX.Intranet.LeftMenu:"].concat(babelHelpers.toConsumableArray(i.Type.isStringFilled(t)?[t]:t)).join(":")}}]);return e}();babelHelpers.defineProperty(o,"version","2021.10");babelHelpers.defineProperty(o,"eventNameSpace","BX.Intranet.LeftMenu:");babelHelpers.defineProperty(o,"isExtranet",false);babelHelpers.defineProperty(o,"isAdmin",false);babelHelpers.defineProperty(o,"isCustomPresetRestricted",false);function l(e,t,n){u(e,t);t.set(e,n)}function u(e,t){if(t.has(e)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}var c=new WeakMap;var d=function(){function e(t,n){var i=this;var a=n.events;babelHelpers.classCallCheck(this,e);l(this,c,{writable:true,value:null});this.container=t;if(a){Array.from(Object.keys(a)).forEach((function(e){r.EventEmitter.subscribe(i,o.eventName(e),a[e])}))}}babelHelpers.createClass(e,[{key:"getContainer",value:function e(){return this.container}},{key:"createPopup",value:function e(){}},{key:"getPopup",value:function e(){return babelHelpers.classPrivateFieldGet(this,c)}},{key:"show",value:function e(){var t=this;if(babelHelpers.classPrivateFieldGet(this,c)===null){babelHelpers.classPrivateFieldSet(this,c,this.createPopup.apply(this,arguments));r.EventEmitter.subscribe(babelHelpers.classPrivateFieldGet(this,c),"onClose",(function(){r.EventEmitter.emit(t,o.eventName("onClose"))}));r.EventEmitter.subscribe(babelHelpers.classPrivateFieldGet(this,c),"onShow",(function(){r.EventEmitter.emit(t,o.eventName("onShow"))}));r.EventEmitter.subscribe(babelHelpers.classPrivateFieldGet(this,c),"onDestroy",(function(){babelHelpers.classPrivateFieldSet(t,c,null)}))}babelHelpers.classPrivateFieldGet(this,c).show()}},{key:"hide",value:function e(){if(babelHelpers.classPrivateFieldGet(this,c)){babelHelpers.classPrivateFieldGet(this,c).close()}}}]);return e}();var m;var h=function(e){babelHelpers.inherits(n,e);function n(){var e;var t;babelHelpers.classCallCheck(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++){a[r]=arguments[r]}t=babelHelpers.possibleConstructorReturn(this,(e=babelHelpers.getPrototypeOf(n)).call.apply(e,[this].concat(a)));babelHelpers.defineProperty(babelHelpers.assertThisInitialized(t),"isReady",true);return t}babelHelpers.createClass(n,[{key:"createPopup",value:function e(){var n=this;var s=i.Tag.render(m||(m=babelHelpers.taggedTemplateLiteral(['\n\t\t\t<form id="customPresetForm" style="min-width: 350px;">\n\t\t\t\t<div style="margin: 15px 0 15px 9px;">\n\t\t\t\t\t<input type="radio" name="userScope" id="customPresetCurrentUser" value="currentUser">\n\t\t\t\t\t<label for="customPresetCurrentUser">','</label>\n\t\t\t\t</div>\n\t\t\t\t<div style="margin: 0 0 38px 9px;">\n\t\t\t\t\t<input type="radio" name="userScope" id="customPresetNewUser" value="newUser" checked>\n\t\t\t\t\t<label for="customPresetNewUser">','</label>\n\t\t\t\t</div>\n\t\t\t\t<hr style="background-color: #edeef0; border: none; color:  #edeef0; height: 1px;">\n\t\t\t</form>'])),i.Loc.getMessage("MENU_CUSTOM_PRESET_CURRENT_USER"),i.Loc.getMessage("MENU_CUSTOM_PRESET_NEW_USER"));var l;return a.PopupManager.create(this.constructor.toString(),null,{overlay:true,contentColor:"white",contentNoPaddings:true,lightShadow:true,draggable:{restrict:true},closeByEsc:true,titleBar:i.Loc.getMessage("MENU_CUSTOM_PRESET_POPUP_TITLE"),offsetTop:1,offsetLeft:20,cacheable:false,closeIcon:true,content:s,buttons:[l=new t.SaveButton({onclick:function e(){if(n.isReady===false){return}l.setWaiting(true);n.isReady=false;r.EventEmitter.emit(n,o.eventName("onPresetIsSet"),s.elements["userScope"].value==="newUser").forEach((function(e){e.then((function(){l.setWaiting(false);n.hide();a.PopupManager.create("menu-custom-preset-success-popup",null,{closeIcon:true,contentColor:"white",titleBar:i.Loc.getMessage("MENU_CUSTOM_PRESET_POPUP_TITLE"),content:i.Loc.getMessage("MENU_CUSTOM_PRESET_SUCCESS")}).show()}))["catch"]((function(){console.log("Error!!")}))}))}}),new t.CancelButton({onclick:function e(){n.hide()}})]})}}]);return n}(d);function f(e,t,n,i){b(e,t);g(n,"set");p(e,n,i);return i}function p(e,t,n){if(t.set){t.set.call(e,n)}else{if(!t.writable){throw new TypeError("attempted to set read only private field")}t.value=n}}function v(e,t,n){b(e,t);g(n,"get");return y(e,n)}function g(e,t){if(e===undefined){throw new TypeError("attempted to "+t+" private static field before its declaration")}}function b(e,t){if(e!==t){throw new TypeError("Private static access of wrong provenance")}}function y(e,t){if(t.get){return t.get.call(e)}return t.value}var E=function(){function e(){babelHelpers.classCallCheck(this,e);this.container=BX("bx-panel");if(this.container){this.bindEvents()}}babelHelpers.createClass(e,[{key:"bindEvents",value:function e(){BX.addCustomEvent("onTopPanelCollapse",function(e){r.EventEmitter.emit(this,o.eventName("onPanelHasChanged"),this.top)}.bind(this));BX.addCustomEvent("onTopPanelFix",function(){r.EventEmitter.emit(this,o.eventName("onPanelHasChanged"),this.top)}.bind(this))}},{key:"height",get:function e(){return this.container?this.container.offsetHeight:0}},{key:"fixedHeight",get:function e(){var t=BX.getClass("BX.admin.panel.state");if(t&&t.fixed){return this.height}return 0}},{key:"top",get:function e(){if(this.container){var t=this.container.getBoundingClientRect();if(t.bottom>0){return Math.max(t.bottom,this.fixedHeight)}return Math.max(0,this.fixedHeight)}return 0}}],[{key:"getInstance",value:function t(){if(!v(this,e,k)){f(this,e,k,new e)}return v(this,e,k)}}]);return e}();var k={writable:true,value:null};function C(e,t,n,i){T(e,t);S(n,"set");M(e,n,i);return i}function M(e,t,n){if(t.set){t.set.call(e,n)}else{if(!t.writable){throw new TypeError("attempted to set read only private field")}t.value=n}}function I(e,t,n){T(e,t);S(n,"get");return w(e,n)}function S(e,t){if(e===undefined){throw new TypeError("attempted to "+t+" private static field before its declaration")}}function T(e,t){if(e!==t){throw new TypeError("Private static access of wrong provenance")}}function w(e,t){if(t.get){return t.get.call(e)}return t.value}var L=function(){function e(){babelHelpers.classCallCheck(this,e)}babelHelpers.createClass(e,null,[{key:"getCurPage",value:function t(){if(I(this,e,A)===null){C(this,e,A,document.location.pathname+document.location.search)}return I(this,e,A)===""?null:I(this,e,A)}},{key:"getCurUri",value:function t(){if(I(this,e,H)===null){C(this,e,H,new i.Uri(document.location.href))}return I(this,e,H)}},{key:"catchError",value:function e(t){BX.UI.Notification.Center.notify({content:[i.Loc.getMessage("MENU_ERROR_OCCURRED"),t.errors?": "+t.errors[0].message:""].join(" "),position:"bottom-left",category:"menu-self-item-popup",autoHideDelay:3e3})}},{key:"refineUrl",value:function e(t){t=String(t).trim();if(t!==""){if(!t.match(/^https?:\/\//i)&&!t.match(/^\//i)){t="http://"+t}else{var n=document.createElement("a");n.href=t;if(document.location.host===n.host){t=n.pathname+n.search+n.hash}}}return t}},{key:"adminPanel",get:function e(){return E.getInstance()}}]);return e}();var A={writable:true,value:null};var H={writable:true,value:null};var x=function(e){babelHelpers.inherits(n,e);function n(){var e;var t;babelHelpers.classCallCheck(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++){a[r]=arguments[r]}t=babelHelpers.possibleConstructorReturn(this,(e=babelHelpers.getPrototypeOf(n)).call.apply(e,[this].concat(a)));babelHelpers.defineProperty(babelHelpers.assertThisInitialized(t),"isReady",true);return t}babelHelpers.createClass(n,[{key:"createPopup",value:function e(n){var s=this;var l;var u=document.querySelector("#left-menu-preset-popup").cloneNode(true);return a.PopupManager.create(this.constructor.name.toString(),null,{overlay:true,contentColor:"white",contentNoPaddings:true,lightShadow:true,draggable:{restrict:true},closeByEsc:true,offsetTop:1,offsetLeft:20,cacheable:false,closeIcon:true,content:u,events:{onFirstShow:function e(){babelHelpers.toConsumableArray(u.querySelectorAll(".js-left-menu-preset-item")).forEach((function(e){e.addEventListener("click",(function(){babelHelpers.toConsumableArray(u.querySelectorAll(".js-left-menu-preset-item")).forEach((function(t){t.classList[t===e?"add":"remove"]("left-menu-popup-selected")}))}))}))}},buttons:[l=new t.CreateButton({text:i.Loc.getMessage("MENU_CONFIRM_BUTTON"),onclick:function e(){if(l.isWaiting()){return}l.setWaiting(true);var t="";if(document.forms["left-menu-preset-form"]){babelHelpers.toConsumableArray(document.forms["left-menu-preset-form"].elements["presetType"]).forEach((function(e){if(e.checked){t=e.value}}))}r.EventEmitter.emit(s,o.eventName("onPresetIsSet"),{presetId:t,mode:n}).forEach((function(e){e.then((function(e){l.setWaiting(false);s.hide();if(e.data.hasOwnProperty("url")){document.location.href=e.data.url}else{document.location.reload()}}))["catch"](L.catchError)}))}}),new t.CancelButton({text:i.Loc.getMessage("MENU_DELAY_BUTTON"),onclick:function e(){r.EventEmitter.emit(s,o.eventName("onPresetIsPostponed"),{mode:n});s.hide()}})]})}}]);return n}(d);var B=function(e){babelHelpers.inherits(t,e);function t(){var e;var n;babelHelpers.classCallCheck(this,t);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++){a[r]=arguments[r]}n=babelHelpers.possibleConstructorReturn(this,(e=babelHelpers.getPrototypeOf(t)).call.apply(e,[this].concat(a)));babelHelpers.defineProperty(babelHelpers.assertThisInitialized(n),"menuId","leftMenuSettingsPopup");return n}babelHelpers.createClass(t,[{key:"createPopup",value:function e(){var t=new a.Menu({bindElement:this.container,items:this.getItems(),angle:true,offsetTop:0,offsetLeft:50});return t.getPopupWindow()}},{key:"getItems",value:function e(){var t=[];Array.from.apply(Array,babelHelpers.toConsumableArray(r.EventEmitter.emit(this,o.eventName("onGettingSettingMenuItems")))).forEach((function(e){var n=e.text,i=e.html,a=e.onclick,r=e.className;if(!n&&!i){return}t.push(Object.assign(i?{html:i}:{text:n},{className:["menu-popup-no-icon",r!==null&&r!==void 0?r:""].join(" "),onclick:function e(t,n){n.getMenuWindow().close();a(t,n)}}))}));return t}}]);return t}(d);var P=function(){function e(){babelHelpers.classCallCheck(this,e)}babelHelpers.createClass(e,null,[{key:"toggleMenu",value:function e(t){if(i.Loc.getMessage("USER_ID")<=0){return}return i.ajax.runAction("intranet.leftmenu.".concat(t?"collapseMenu":"expandMenu"),{data:{},analyticsLabel:{leftmenu:{action:t?"collapseMenu":"expandMenu"}}})}},{key:"saveSelfItemMenu",value:function e(t){var n=t.id>0?"update":"add";return i.ajax.runAction("intranet.leftmenu.".concat(n,"SelfItem"),{data:{itemData:t},analyticsLabel:{leftmenu:{action:"selfItemAddOrUpdate"}}})}},{key:"deleteSelfITem",value:function e(t){return i.ajax.runAction("intranet.leftmenu.deleteSelfItem",{data:{menuItemId:t},analyticsLabel:{leftmenu:{action:"selfItemDelete"}}})}},{key:"addFavoritesItemMenu",value:function e(t){return i.ajax.runAction("intranet.leftmenu.addStandartItem",{data:{itemData:t},analyticsLabel:{leftmenu:{action:"standardItemAdd"}}})}},{key:"deleteFavoritesItemMenu",value:function e(t){return i.ajax.runAction("intranet.leftmenu.deleteStandartItem",{data:{itemData:t},analyticsLabel:{leftmenu:{action:"standardItemDelete"}}})}},{key:"updateFavoritesItemMenu",value:function e(t){return i.ajax.runAction("intranet.leftmenu.updateStandartItem",{data:{itemText:t.text,itemId:t.id},analyticsLabel:{leftmenu:{action:"standardItemUpdate"}}})}},{key:"addAdminSharedItemMenu",value:function e(t){return i.ajax.runAction("intranet.leftmenu.addItemToAll",{data:{itemInfo:t},analyticsLabel:{leftmenu:{action:"adminItemAdd"}}})}},{key:"deleteAdminSharedItemMenu",value:function e(t){return i.ajax.runAction("intranet.leftmenu.deleteItemFromAll",{data:{menu_item_id:t},analyticsLabel:{leftmenu:{action:"adminItemDelete"}}})}},{key:"saveItemsSort",value:function e(t,n,a){return i.ajax.runAction("intranet.leftmenu.saveItemsSort",{data:{items:t,firstItemLink:n,version:o.version},analyticsLabel:{leftmenu:a}})}},{key:"setFirstPage",value:function e(t){return i.ajax.runAction("intranet.leftmenu.setFirstPage",{data:{firstPageUrl:t},analyticsLabel:{leftmenu:{action:"mainPageIsSet"}}})}},{key:"setDefaultPreset",value:function e(){return i.ajax.runAction("intranet.leftmenu.setDefaultMenu",{data:{},analyticsLabel:{leftmenu:{action:"defaultMenuIsSet"}}})}},{key:"setCustomPreset",value:function e(t,n,a,r){return i.ajax.runAction("intranet.leftmenu.saveCustomPreset",{data:{userApply:t===true?"newUser":"currentUser",itemsSort:n,customItems:a,firstItemLink:r,version:o.version},analyticsLabel:{leftmenu:{action:"customPresetIsSet"}}})}},{key:"deleteCustomItem",value:function e(t){return i.ajax.runAction("intranet.leftmenu.deleteCustomItemFromAll",{data:{menu_item_id:t},analyticsLabel:{leftmenu:{action:"customItemDelete"}}})}},{key:"setSystemPreset",value:function e(t,n){return i.ajax.runAction("intranet.leftmenu.setPreset",{data:{preset:n,mode:t==="global"?"global":"personal"},analyticsLabel:{leftmenu:{action:"systemPresetIsSet",presetId:n,mode:t,analyticsFirst:t==="global"?"y":"n"}}})}},{key:"postponeSystemPreset",value:function e(t){return i.ajax.runAction("intranet.leftmenu.delaySetPreset",{data:{},analyticsLabel:{leftmenu:{action:"systemPresetIsPostponed",mode:t,analyticsFirst:t==="global"?"y":"n"}}})}},{key:"clearCache",value:function e(){return i.ajax.runAction("intranet.leftmenu.clearCache",{data:{},analyticsLabel:{leftmenu:{action:"clearCache"}}})}},{key:"expandGroup",value:function e(t){if(i.Loc.getMessage("USER_ID")<=0){return}return i.ajax.runAction("intranet.leftmenu.expandMenuGroup",{data:{id:t},analyticsLabel:{leftmenu:{action:"expandMenuGroup"}}})}},{key:"collapseGroup",value:function e(t){if(i.Loc.getMessage("USER_ID")<=0){return}return i.ajax.runAction("intranet.leftmenu.collapseMenuGroup",{data:{id:t},analyticsLabel:{leftmenu:{action:"collapseMenuGroup"}}})}}]);return e}();var D,N,_,U;var O=function(){function e(t,n){var i=this;babelHelpers.classCallCheck(this,e);babelHelpers.defineProperty(this,"links",[]);babelHelpers.defineProperty(this,"isDraggable",true);babelHelpers.defineProperty(this,"storage",[]);this.parentContainer=t;this.container=n;this.init();this.onDeleteAsFavorites=this.onDeleteAsFavorites.bind(this);setTimeout((function(){r.EventEmitter.subscribe(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"),i.onDeleteAsFavorites);r.EventEmitter.incrementMaxListeners(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"));r.EventEmitter.subscribe(i,o.eventName("onItemDelete"),i.destroy.bind(i))}),0);this.showError=this.showError.bind(this);this.showMessage=this.showMessage.bind(this)}babelHelpers.createClass(e,[{key:"getId",value:function e(){return this.container.dataset.id}},{key:"getCode",value:function e(){return this.constructor.code}},{key:"getName",value:function e(){return this.container.querySelector("[data-role='item-text']").textContent}},{key:"canDelete",value:function e(){return false}},{key:"delete",value:function e(){}},{key:"init",value:function e(){var t=this;this.links=[];if(this.container.hasAttribute("data-link")&&i.Type.isStringFilled(this.container.getAttribute("data-link"))){this.links.push(this.container.getAttribute("data-link"))}if(this.container.hasAttribute("data-all-links")){this.container.getAttribute("data-all-links").split(",").forEach((function(e){e=String(e).trim();if(i.Type.isStringFilled(e)){t.links.push(e)}}))}this.makeTextIcons();this.storage=this.container.dataset.storage.split(",")}},{key:"update",value:function e(t){var n=t.link,a=t.openInNewPage,r=t.text;a=a==="Y"?"Y":"N";if(this.container.hasAttribute("data-link")){this.container.setAttribute("data-link",i.Text.encode(n));this.container.setAttribute("data-new-page",a)}var s=this.container.querySelector("a");if(s){s.setAttribute("href",i.Text.encode(n));s.setAttribute("target",a==="Y"?"_blank":"_self")}this.container.querySelector("[data-role='item-text']").innerHTML=i.Text.encode(r);this.init()}},{key:"destroy",value:function e(){r.EventEmitter.unsubscribe(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"),this.onDeleteAsFavorites);r.EventEmitter.decrementMaxListeners(r.EventEmitter.GLOBAL_TARGET,"onItemDeleteAsFavorites")}},{key:"getSimilarToUrl",value:function e(t){var n=[];this.links.forEach((function(e,i){if(X(e,t)){n.push({priority:i>0?0:1,url:e})}}));return n}},{key:"makeTextIcons",value:function e(){if(!this.container.classList.contains("menu-item-no-icon-state")){return}var t=this.container.querySelector(".menu-item-icon");var n=this.container.querySelector(".menu-item-link-text");if(t&&n){t.textContent=R(n.textContent)}}},{key:"getCounterValue",value:function e(){var t=this.container.querySelector('[data-role="counter"]');if(!t){return null}return parseInt(t.dataset.counterValue)}},{key:"updateCounter",value:function e(t){var n=this.container.querySelector('[data-role="counter"]');if(!n){return}var i=parseInt(n.dataset.counterValue)||0;n.dataset.counterValue=t;if(t>0){n.innerHTML=t>99?"99+":t;this.container.classList.add("menu-item-with-index")}else{n.innerHTML="";this.container.classList.remove("menu-item-with-index");if(t<0){var a=BX("menu-counter-warning-"+this.getId());if(a){a.style.display="inline-block"}}}return{oldValue:i,newValue:t}}},{key:"markAsActive",value:function e(){console.error("This action is only for the group")}},{key:"showWarning",value:function e(t,n){this.removeWarning();var a=this.container.querySelector("a.menu-item-link");if(!a){return}t=t?i.Text.encode(t):"";var r=i.Tag.render(D||(D=babelHelpers.taggedTemplateLiteral(['<a class="menu-post-warn-icon" title="','"></a>'])),t);if(n){Object.keys(n).forEach((function(e){i.Event.bind(r,e,n[e])}))}this.container.classList.add("menu-item-warning-state");a.appendChild(r)}},{key:"removeWarning",value:function e(){if(!this.container.classList.contains("menu-item-warning-state")){return}this.container.classList.remove("menu-item-warning-state");var t;while(t=this.container.querySelector("a.menu-post-warn-icon")){t.parentNode.removeChild(t)}}},{key:"showMessage",value:function e(t){var n=this;if(this.showMessagePopup){this.showMessagePopup.close()}this.showMessagePopup=a.PopupManager.create("left-menu-message",this.container,{content:'<div class="left-menu-message-popup">'+t+"</div>",darkMode:true,offsetTop:2,offsetLeft:0,angle:true,events:{onClose:function e(){n.showMessagePopup=null}},autoHide:true});this.showMessagePopup.show();setTimeout((function(){if(n.showMessagePopup){n.showMessagePopup.close()}}),3e3)}},{key:"showError",value:function e(t){var n=[];if(t.errors){n.push(t.errors[0].message)}else if(t instanceof TypeError){n.push(t.message)}var a=[i.Loc.getMessage("MENU_ERROR_OCCURRED")].concat(n).join(" ");this.showMessage(a)}},{key:"getDropDownActions",value:function e(){return[]}},{key:"getEditFields",value:function e(){return{id:this.getId(),text:this.getName()}}},{key:"onDeleteAsFavorites",value:function e(t){var n=t.data;if(String(n.id)===String(this.getId())){if(this.getCode()==="standard"){r.EventEmitter.emit(this,o.eventName("onItemDelete"),{item:this,animate:true})}else{this.storage=babelHelpers.toConsumableArray(this.storage).filter((function(e){return e!=="standard"}));this.container.dataset.storage=this.storage.join(",")}r.EventEmitter.unsubscribe(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"),this.onDeleteAsFavorites);r.EventEmitter.decrementMaxListeners(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"))}}}],[{key:"detect",value:function e(t){return t.getAttribute("data-role")!=="group"&&t.getAttribute("data-type")===this.code}},{key:"createNode",value:function e(t){var n=t.id,a=t.text,r=t.link,s=t.openInNewPage,o=t.counterId,l=t.counterValue,u=t.topMenuId;n=i.Text.encode(n);a=i.Text.encode(a);r=i.Text.encode(r);o=o?i.Text.encode(o):"";l=l?parseInt(l):0;s=s==="Y"?"Y":"N";return i.Tag.render(N||(N=babelHelpers.taggedTemplateLiteral(['<li \n\t\t\tid="bx_left_menu_','" \n\t\t\tdata-status="show" \n\t\t\tdata-id="','" \n\t\t\tdata-role="item"\n\t\t\tdata-storage="" \n\t\t\tdata-counter-id="','" \n\t\t\tdata-link="','" \n\t\t\tdata-all-links="" \n\t\t\tdata-type="','" \n\t\t\tdata-delete-perm="Y" \n\t\t\t','\n\t\t\tdata-new-page="','" \n\t\t\tclass="menu-item-block menu-item-no-icon-state">\n\t\t\t\t<span class="menu-favorites-btn menu-favorites-draggable">\n\t\t\t\t\t<span class="menu-fav-draggable-icon"></span>\n\t\t\t\t</span>\n\t\t\t\t<a class="menu-item-link" data-slider-ignore-autobinding="true" href="','" target="','">\n\t\t\t\t\t<span class="menu-item-icon-box">\n\t\t\t\t\t\t<span class="menu-item-icon">W</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="menu-item-link-text " data-role="item-text">',"</span>\n\t\t\t\t\t",'\n\t\t\t\t</a>\n\t\t\t\t<span data-role="item-edit-control" class="menu-fav-editable-btn menu-favorites-btn">\n\t\t\t\t\t<span class="menu-favorites-btn-icon"></span>\n\t\t\t\t</span>\n\t\t\t</li>'])),n,n,o,r,this.code,u?'data-top-menu-id="'.concat(i.Text.encode(u),'"'):"",s,r,s==="Y"?"_blank":"_self",a,o?'<span class="menu-item-index-wrap">\n\t\t\t\t\t\t<span data-role="counter"\n\t\t\t\t\t\t\tdata-counter-value="'.concat(l,'" class="menu-item-index" id="menu-counter-').concat(o,'">').concat(l,"</span>\n\t\t\t\t\t</span>"):"")}},{key:"backendSaveItem",value:function e(t){throw"Function backendSaveItem must be replaced"}},{key:"showUpdate",value:function e(t){var n=this;return new Promise((function(e,i){n.showForm(t.container,t.getEditFields(),e,i)}))}},{key:"checkForm",value:function e(t){if(String(t.elements["text"].value).trim().length<=0){t.elements["text"].classList.add("menu-form-input-error");t.elements["text"].focus();return false}if(t.elements["link"]){if(String(t.elements["link"].value).trim().length<=0||L.refineUrl(t.elements["link"].value).length<=0){t.elements["link"].classList.add("menu-form-input-error");t.elements["link"].focus();return false}else{t.elements["link"].value=L.refineUrl(t.elements["link"].value)}}return true}},{key:"showForm",value:function e(n,r,s,o){var l=this;if(this.popup){this.popup.close()}var u=r.id!=="";var c=i.Tag.render(_||(_=babelHelpers.taggedTemplateLiteral(['\n<form name="menuAddToFavoriteForm">\n\t<input type="hidden" name="id" value="','">\n\t<label for="menuPageToFavoriteName" class="menu-form-label">','</label>\n\t<input name="text" type="text" id="menuPageToFavoriteName" class="menu-form-input" value="','" >\n\t',"\n\t","\n</form>"])),i.Text.encode(r.id||""),i.Loc.getMessage("MENU_ITEM_NAME"),i.Text.encode(r.text||""),r["link"]!==undefined?'<br><br>\n\t<label for="menuPageToFavoriteLink" class="menu-form-label">'.concat(i.Loc.getMessage("MENU_ITEM_LINK"),'</label>\n\t<input name="link" id="menuPageToFavoriteLink" type="text" class="menu-form-input" value="').concat(i.Text.encode(r.link),'" >'):"",r["openInNewPage"]!==undefined?'<br><br>\n\t<input name="openInNewPage" id="menuOpenInNewPage" type="checkbox" value="Y" '.concat(r.openInNewPage==="Y"?"checked":"",' >\n\t<label for="menuOpenInNewPage" class="menu-form-label">').concat(i.Loc.getMessage("MENU_OPEN_IN_NEW_PAGE"),"</label>"):"");Object.keys(r).forEach((function(e){if(["id","text","link","openInNewPage"].indexOf(e)<0){var t=i.Text.encode(e);var n=i.Text.encode(r[e]);c.appendChild(i.Tag.render(U||(U=babelHelpers.taggedTemplateLiteral(['<input type="hidden" name="','" value="','">'])),t,n))}}));this.popup=a.PopupManager.create("menu-self-item-popup",n,{className:"menu-self-item-popup",titleBar:r["link"]===undefined?i.Loc.getMessage("MENU_RENAME_ITEM"):u?i.Loc.getMessage("MENU_EDIT_SELF_PAGE"):i.Loc.getMessage("MENU_ADD_SELF_PAGE"),offsetTop:1,offsetLeft:20,cacheable:false,closeIcon:true,lightShadow:true,draggable:{restrict:true},closeByEsc:true,content:c,buttons:[new t.SaveButton({onclick:function e(){if(l.checkForm(c)){var t={};babelHelpers.toConsumableArray(c.elements).forEach((function(e){t[e.name]=e.value}));if(c.elements["openInNewPage"]){t["openInNewPage"]=c.elements["openInNewPage"].checked?"Y":"N"}l.backendSaveItem(t).then((function(){s(t);l.popup.close()}))["catch"](L.catchError)}}}),new t.CancelButton({onclick:function e(){l.popup.close()}})]});this.popup.show()}}]);return e}();babelHelpers.defineProperty(O,"code","abstract");function X(e,t){var n=new i.Uri(e);var a=n.getPath().replace("/index.php","").replace("/index.html","");var r=t.getPath().replace("/index.php","").replace("/index.html","");if(n.getHost()!==""&&n.getHost()!==t.getHost()){return false}if(r.indexOf(a)!==0){return false}return true}function R(e){if(!i.Type.isStringFilled(e)){return"..."}e=e.replace(/['`".,:;~|{}*^$#@&+\-=?!()[\]<>\n\r]+/g,"").trim();if(e.length<=0){return"..."}var t;var n=e.split(/[\s,]+/);if(n.length<=1){t=e.substring(0,1)}else if(n.length===2){t=n[0].substring(0,1)+n[1].substring(0,1)}else{var a=n[0];var r=n[1];for(var s=1;s<n.length;s++){if(n[s].length>3){r=n[s];break}}t=a.substring(0,1)+r.substring(0,1)}return t.toUpperCase()}function F(e,t,n,i){W(e,t);j(n,"set");q(e,n,i);return i}function q(e,t,n){if(t.set){t.set.call(e,n)}else{if(!t.writable){throw new TypeError("attempted to set read only private field")}t.value=n}}function G(e,t,n){W(e,t);j(n,"get");return V(e,n)}function j(e,t){if(e===undefined){throw new TypeError("attempted to "+t+" private static field before its declaration")}}function W(e,t){if(e!==t){throw new TypeError("Private static access of wrong provenance")}}function V(e,t){if(t.get){return t.get.call(e)}return t.value}var z=function(e){babelHelpers.inherits(t,e);function t(){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments))}babelHelpers.createClass(t,[{key:"canDelete",value:function e(){return true}},{key:"delete",value:function e(){var t=this;P.deleteFavoritesItemMenu({id:this.getId(),storage:this.storage}).then((function(){t.destroy();r.EventEmitter.emit(t,o.eventName("onItemDelete"),{animate:true});var e=t.getSimilarToUrl(L.getCurUri()).length>0?window:{doesnotmatter:""};BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuItemDeleted",[{id:t.getId()},t]);BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",[{isActive:false,context:e}])}))}},{key:"getDropDownActions",value:function e(){var n=this;var a=[];a.push({text:i.Loc.getMessage("MENU_RENAME_ITEM"),onclick:function e(){n.constructor.showUpdate(n).then(n.update.bind(n))["catch"](n.showError)}});a.push({text:i.Loc.getMessage("MENU_REMOVE_STANDARD_ITEM"),onclick:function e(){n["delete"]()}});if(o.isAdmin){a.push({text:i.Loc.getMessage("MENU_ADD_ITEM_TO_ALL"),onclick:function e(){var a=n.container.querySelector("a");P.addAdminSharedItemMenu({id:n.getId(),link:n.links[0],text:n.getName(),counterId:n.container.dataset.counterId,openInNewPage:a&&a.getAttribute("target")==="_blank"?"Y":"N"}).then((function(){n.showMessage(i.Loc.getMessage("MENU_ITEM_WAS_ADDED_TO_ALL"));n.container.dataset.type=K.code;n.storage.push(t.code);n.container.dataset.storage=n.storage.join(",");r.EventEmitter.emit(n,o.eventName("onItemConvert"),n)}))["catch"](n.showError)}})}return a}}],[{key:"backendSaveItem",value:function e(t){return P.updateFavoritesItemMenu(t)}},{key:"getActiveTopMenuItem",value:function e(){if(G(this,t,Y)){return G(this,t,Y)}if(!BX.Main||!BX.Main.interfaceButtonsManager){return null}var n=Array.from(Object.values(BX.Main.interfaceButtonsManager.getObjects())).shift();if(n){var i=n.getActive();if(i&&babelHelpers["typeof"](i)==="object"){var a=document.createElement("a");a.href=i["URL"];var r=a.pathname[0]!=="/"?"/"+a.pathname:a.pathname;F(this,t,Y,{ID:i["ID"]||null,NODE:i["NODE"]||null,URL:r+a.search,TEXT:i["TEXT"],DATA_ID:i["DATA_ID"],COUNTER_ID:i["COUNTER_ID"],COUNTER:i["COUNTER"],SUB_LINK:i["SUB_LINK"]})}}return G(this,t,Y)}},{key:"isCurrentPageStandard",value:function e(t){if(t&&t["URL"]){var n=document.location.pathname+document.location.search;return t.URL===n&&t.URL.indexOf("workgroups")<0}return false}},{key:"saveCurrentPage",value:function e(t){var n=this;var i=t.pageTitle,a=t.pageLink;var r=this.getActiveTopMenuItem();var s,o,l;if(r&&r.NODE&&this.isCurrentPageStandard(r)&&(a===L.getCurPage()||a===r.URL||!a)){var u=r.NODE.getBoundingClientRect();o=u.left;l=u.top;s={id:r.DATA_ID,text:i||r.TEXT,link:L.getCurPage()||r.URL,counterId:r.COUNTER_ID,counterValue:r.COUNTER,isStandardItem:true,subLink:r.SUB_LINK}}else{s={text:i||document.getElementById("pagetitle").innerText,link:a||L.getCurPage(),isStandardItem:a===L.getCurPage()};var c=BX("pagetitle").getBoundingClientRect();o=c.left;l=c.top}return P.addFavoritesItemMenu(s).then((function(e){var t=e.data.itemId;s.id=t;s.topMenuId=s.id;return{node:n.createNode(s),animateFromPoint:{startX:o,startY:l},itemInfo:s}}))}},{key:"deleteCurrentPage",value:function e(t){var n=t.pageLink;var i=this.getActiveTopMenuItem();var a={},s,l;if(i&&this.isCurrentPageStandard(i)){a["id"]=i.DATA_ID;var u=i.NODE.getBoundingClientRect();s=u.left;l=u.top}else{a["link"]=n||L.getCurPage();var c=BX("pagetitle").getBoundingClientRect();s=c.left;l=c.top}return P.deleteFavoritesItemMenu(a).then((function(e){var t=e.data;if(!a.id&&t&&t["itemId"]){a.id=t["itemId"]}r.EventEmitter.emit(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"),{id:a.id});return{itemInfo:a,animateToPoint:{startX:s,startY:l}}}))}},{key:"saveStandardPage",value:function e(t){var n=this;var i=t.DATA_ID,a=t.TEXT,r=t.SUB_LINK,s=t.COUNTER_ID,o=t.COUNTER,l=t.NODE,u=t.URL;var c={id:i,text:a,link:u,subLink:r,counterId:s,counterValue:o};var d=l.getBoundingClientRect();var m=d.left;var h=d.top;return P.addFavoritesItemMenu(c).then((function(e){var t=e.data.itemId;c.id=t;c.topMenuId=c.id;var a=n.getActiveTopMenuItem();BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuItemAdded",[c,n]);BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",[{isActive:true,context:a&&a.DATA_ID===i?window:null}]);return{node:n.createNode(c),animateFromPoint:{startX:m,startY:h}}}))}},{key:"deleteStandardPage",value:function e(t){var n=this;var i=t.DATA_ID;var a={id:i};return P.deleteFavoritesItemMenu(a).then((function(){r.EventEmitter.emit(r.EventEmitter.GLOBAL_TARGET,o.eventName("onItemDeleteAsFavorites"),{id:a.id});BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuItemDeleted",[a,n]);BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",[{isActive:false}]);return{itemInfo:a}}))}}]);return t}(O);babelHelpers.defineProperty(z,"code","standard");var Y={writable:true,value:null};var J=function(e){babelHelpers.inherits(t,e);function t(){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments))}babelHelpers.createClass(t,[{key:"canDelete",value:function e(){return true}},{key:"delete",value:function e(){var t=this;return P.deleteSelfITem(this.getId()).then((function(){if(t.storage.indexOf(z.code)>=0){P.deleteFavoritesItemMenu({id:t.getId()})}r.EventEmitter.emit(t,o.eventName("onItemDelete"),{animate:true})}))["catch"](this.showError)}},{key:"getDropDownActions",value:function e(){var n=this;var a=[];a.push({text:i.Loc.getMessage("MENU_EDIT_ITEM"),onclick:function e(){n.constructor.showUpdate(n).then(n.update.bind(n))["catch"](n.showError)}});a.push({text:i.Loc.getMessage("MENU_DELETE_SELF_ITEM"),onclick:function e(){s.MessageBox.confirm(i.Loc.getMessage("MENU_DELETE_SELF_ITEM_CONFIRM"),i.Loc.getMessage("MENU_DELETE_SELF_ITEM"),(function(e){n["delete"]();e.close()}),i.Loc.getMessage("MENU_DELETE"))}});if(o.isAdmin){a.push({text:i.Loc.getMessage("MENU_ADD_ITEM_TO_ALL"),onclick:function e(){var a=n.container.querySelector("a");P.addAdminSharedItemMenu({id:n.getId(),link:n.links[0],text:n.getName(),counterId:n.container.dataset.counterId,openInNewPage:a&&a.getAttribute("target")==="_blank"?"Y":"N"}).then((function(){n.showMessage(i.Loc.getMessage("MENU_ITEM_WAS_ADDED_TO_ALL"));n.container.dataset.type=K.code;n.storage.push(t.code);n.container.dataset.storage=n.storage.join(",");r.EventEmitter.emit(n,o.eventName("onItemConvert"),n)}))["catch"](n.showError)}})}return a}},{key:"getEditFields",value:function e(){return{id:this.getId(),text:this.getName(),link:this.links[0],openInNewPage:this.container.getAttribute("data-new-page")}}}],[{key:"backendSaveItem",value:function e(t){return P.saveSelfItemMenu(t).then((function(e){var n=e.data;if(n&&n["itemId"]){t.id=n["itemId"]}return t}))}},{key:"showAdd",value:function e(t){var n=this;return new Promise((function(e,i){n.showForm(t,{id:0,name:"",link:"",openInNewPage:"Y"},e,i)})).then((function(e){return{node:n.createNode(e)}}))}}]);return t}(O);babelHelpers.defineProperty(J,"code","self");var K=function(e){babelHelpers.inherits(t,e);function t(){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments))}babelHelpers.createClass(t,[{key:"canDelete",value:function e(){return this.container.dataset.deletePerm==="Y"}},{key:"delete",value:function e(){var t=this;P.deleteAdminSharedItemMenu(this.getId()).then((function(){if(t.storage.indexOf(z.code)>=0){P.deleteFavoritesItemMenu({id:t.getId()})}if(t.storage.indexOf(J.code)>=0){P.deleteSelfITem(t.getId())}r.EventEmitter.emit(t,o.eventName("onItemDelete"),{animate:true})}))["catch"](this.showError)}},{key:"getDropDownActions",value:function e(){var t=this;if(!this.canDelete()){return[]}var n=[];if(this.storage.filter((function(e){return e===z.code||e===J.code})).length>0){n.push({text:i.Loc.getMessage("MENU_REMOVE_STANDARD_ITEM"),onclick:this["delete"].bind(this)});n.push({text:i.Loc.getMessage("MENU_DELETE_CUSTOM_ITEM_FROM_ALL"),onclick:function e(){P.deleteAdminSharedItemMenu(t.getId()).then((function(){t.showMessage(i.Loc.getMessage("MENU_ITEM_WAS_DELETED_FROM_ALL"));var e=t.storage.indexOf(J.code)>=0?J.code:z.code;t.container.dataset.type=e;t.container.dataset.storage=t.storage.filter((function(t){return t!==e})).join(",");r.EventEmitter.emit(t,o.eventName("onItemConvert"),t)}))["catch"](t.showError)}})}else{n.push({text:i.Loc.getMessage("MENU_DELETE_CUSTOM_ITEM_FROM_ALL"),onclick:this["delete"].bind(this)})}return n}}]);return t}(O);babelHelpers.defineProperty(K,"code","admin");var Q=function(e){babelHelpers.inherits(t,e);function t(){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments))}babelHelpers.createClass(t,[{key:"canDelete",value:function e(){return this.container.dataset.deletePerm==="Y"}},{key:"delete",value:function e(){var t=this;if(this.canDelete()){P.deleteCustomItem(this.getId()).then((function(){if(t.storage.indexOf(z.code)>=0){P.deleteFavoritesItemMenu({id:t.getId()})}r.EventEmitter.emit(t,o.eventName("onItemDelete"),{animate:true})}))["catch"](this.showError)}}},{key:"getDropDownActions",value:function e(){var t=[];if(this.canDelete()){t.push({text:i.Loc.getMessage("MENU_DELETE_ITEM_FROM_ALL"),onclick:this["delete"].bind(this)})}return t}}]);return t}(O);babelHelpers.defineProperty(Q,"code","custom");var $=function(e){babelHelpers.inherits(t,e);function t(){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments))}babelHelpers.createClass(t,[{key:"canDelete",value:function e(){return false}}]);return t}(O);babelHelpers.defineProperty($,"code","default");function Z(e,t,n){ee(e,t);t.set(e,n)}function ee(e,t){if(t.has(e)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}var te=new WeakMap;var ne=function(e){babelHelpers.inherits(t,e);function t(){var e;babelHelpers.classCallCheck(this,t);e=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments));Z(babelHelpers.assertThisInitialized(e),te,{writable:true,value:void 0});e.container.addEventListener("click",e.toggleAndSave.bind(babelHelpers.assertThisInitialized(e)),true);e.container.addEventListener("mouseleave",(function(){i.Dom.removeClass(e.container,"menu-item-group-actioned")}));e.groupContainer=e.container.parentNode.querySelector('[data-group-id="'.concat(e.getId(),'"]'));if(e.container.getAttribute("data-collapse-mode")==="collapsed"){e.groupContainer.style.display="none"}setTimeout((function(){e.updateCounter()}),0);return e}babelHelpers.createClass(t,[{key:"toggleAndSave",value:function e(t){var n=this;t.preventDefault();t.stopPropagation();if(this.container.getAttribute("data-collapse-mode")==="collapsed"){P.expandGroup(this.getId());this.expand().then((function(){n.container.setAttribute("data-collapse-mode","expanded")}))}else{P.collapseGroup(this.getId());this.collapse().then((function(){n.container.setAttribute("data-collapse-mode","collapsed")}))}return false}},{key:"checkAndCorrect",value:function e(){var t=this;var n=this.groupContainer;if(n.parentNode===this.container){i.Dom.insertAfter(n,this.container)}babelHelpers.toConsumableArray(n.querySelectorAll(".menu-item-block")).forEach((function(e){e.setAttribute("data-status",t.container.getAttribute("data-status"))}));return this}},{key:"collapse",value:function e(t){var n=this;return new Promise((function(e){var a=n.groupContainer;if(babelHelpers.classPrivateFieldGet(n,te)){babelHelpers.classPrivateFieldGet(n,te).stop()}a.style.overflow="hidden";i.Dom.addClass(n.container,"menu-item-group-collapsing");i.Dom.addClass(n.container,"menu-item-group-actioned");i.Dom.addClass(a,"menu-item-group-collapsing");var r={height:a.offsetHeight,display:a.style.display};babelHelpers.classPrivateFieldSet(n,te,new BX.easing({duration:500,start:{height:r.height,opacity:100},finish:{height:0,opacity:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function e(t){a.style.height=t.height+"px";a.style.opacity=t.opacity/100},complete:function r(){a.style.display="none";a.style.opacity="auto";a.style.height="auto";if(n.container.getAttribute("data-contains-active-item")==="Y"){i.Dom.addClass(n.container,"menu-item-active")}i.Dom.removeClass(n.container,"menu-item-group-collapsing");i.Dom.removeClass(a,"menu-item-group-collapsing");babelHelpers.classPrivateFieldSet(n,te,null);if(t===true){n.container.appendChild(a)}e()}}));babelHelpers.classPrivateFieldGet(n,te).animate()}))}},{key:"expand",value:function e(t){var n=this;return new Promise((function(e){var a=n.container;var r=n.groupContainer;if(t===true&&a.getAttribute("data-collapse-mode")==="collapsed"){return e()}var s=r.querySelectorAll("li").length*a.offsetHeight;i.Dom.addClass(a,"menu-item-group-expanding");i.Dom.addClass(a,"menu-item-group-actioned");i.Dom.addClass(r,"menu-item-group-expanding");if(r.parentNode===n.container){i.Dom.insertAfter(r,n.container)}r.style.display="block";babelHelpers.classPrivateFieldSet(n,te,new BX.easing({duration:500,start:{height:0,opacity:0},finish:{height:s,opacity:100},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function e(t){r.style.height=t.height+"px";r.style.opacity=t.opacity/100},complete:function t(){i.Dom.removeClass(a,"menu-item-group-expanding menu-item-active");i.Dom.removeClass(r,"menu-item-group-expanding");r.style.height="auto";r.style.opacity="auto";e()}}));babelHelpers.classPrivateFieldGet(n,te).animate()}))}},{key:"canDelete",value:function e(){return false}},{key:"updateCounter",value:function e(){var t=0;babelHelpers.toConsumableArray(this.container.parentNode.querySelector('[data-group-id="'.concat(this.getId(),'"]')).querySelectorAll('[data-role="counter"]')).forEach((function(e){t+=parseInt(e.dataset.counterValue)}));var n=this.container.querySelector('[data-role="counter"]');if(t>0){n.innerHTML=t>99?"99+":t;this.container.classList.add("menu-item-with-index")}else{n.innerHTML="";this.container.classList.remove("menu-item-with-index")}}},{key:"markAsActive",value:function e(){this.container.setAttribute("data-contains-active-item","Y");if(this.container.getAttribute("data-collapse-mode")==="collapsed")i.Dom.addClass(this.container,"menu-item-active")}},{key:"markAsInactive",value:function e(){this.container.removeAttribute("data-contains-active-item");i.Dom.removeClass(this.container,"menu-item-active")}},{key:"isActive",value:function e(){return this.container.getAttribute("data-contains-active-item")==="Y"}}],[{key:"detect",value:function e(t){return t.getAttribute("data-role")==="group"&&t.getAttribute("data-type")===this.code}}]);return t}(O);babelHelpers.defineProperty(ne,"code","group");var ie=function(e){babelHelpers.inherits(t,e);function t(){var e;babelHelpers.classCallCheck(this,t);e=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).apply(this,arguments));e.container.querySelector('[data-role="item-edit-control"]').style.display="none";return e}return t}(ne);babelHelpers.defineProperty(ie,"code","system_group");var ae=[O,K,z,Q,J,$,ne,ie];function re(e){var t=O;ae.forEach((function(n){if(n.detect(e)){t=n}}));return t}function se(e,t,n){oe(e,t);t.set(e,n)}function oe(e,t){if(t.has(e)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}var le=new WeakMap;var ue=new WeakMap;var ce=function(){function e(){babelHelpers.classCallCheck(this,e);se(this,le,{writable:true,value:void 0});se(this,ue,{writable:true,value:void 0});this.highlight=i.Runtime.debounce(this.highlight,200,this);babelHelpers.classPrivateFieldSet(this,ue,new i.Uri(window.location.href))}babelHelpers.createClass(e,[{key:"checkAndSet",value:function e(t,n){var a=this;if(t===this.item){return false}var r=babelHelpers.classPrivateFieldGet(this,le);n.forEach((function(e){var n=new i.Uri(e.url);var s=false;if(!r||r.uri.getPath().length<n.getPath().length){s=true}else if(r.uri.getPath().length===n.getPath().length){var o=babelHelpers.classPrivateFieldGet(a,ue).getQueryParams();var l=Object.keys(o).length;var u={params:r.uri.getQueryParams(),mismatches:l};var c={params:n.getQueryParams(),mismatches:l};Array.from(Object.keys(o)).forEach((function(e){if(String(o[e])===String(u.params[e])){u.mismatches--}if(String(o[e])===String(c.params[e])){c.mismatches--}}));if(e.priority>0&&t instanceof $){e.priority+=1}if(u.mismatches>c.mismatches||r.priority<e.priority){s=true}}if(s){r={priority:e.priority,url:e.url,uri:n}}}));if(r!==babelHelpers.classPrivateFieldGet(this,le)){if(this.item){this.unhighlight(this.item)}babelHelpers.classPrivateFieldSet(this,le,r);this.item=t;this.highlight();return true}return false}},{key:"checkAndUnset",value:function e(t){if(t instanceof O&&t===this.item){this.unhighlight(this.item);this.item=null;babelHelpers.classPrivateFieldSet(this,le,null)}}},{key:"highlight",value:function e(){if(this.item){this.item.container.classList.add("menu-item-active");var t=this.item.container.closest('[data-role="group-content"]');var n;while(t){n=t.parentNode.querySelector('[data-id="'.concat(t.getAttribute("data-group-id"),'"]'));if(n){n.setAttribute("data-contains-active-item","Y");if(n.getAttribute("data-collapse-mode")==="collapsed"){n.classList.add("menu-item-active")}}t=t.closest('[data-relo="group-content"]')}}}},{key:"unhighlight",value:function e(t){if(!(t instanceof O)){t=this.item}if(t instanceof O){t.container.classList.remove("menu-item-active");var n=t.container.closest('[data-role="group-content"]');var i;while(n){i=n.parentNode.querySelector('[data-id="'.concat(n.getAttribute("data-group-id"),'"]'));if(i){i.removeAttribute("data-contains-active-item");i.classList.remove("menu-item-active")}n=n.closest('[data-relo="group-content"]')}return t}return null}}]);return e}();function de(e,t){he(e,t);t.add(e)}function me(e,t,n){he(e,t);t.set(e,n)}function he(e,t){if(t.has(e)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}function fe(e,t,n){if(!t.has(e)){throw new TypeError("attempted to get private field on non-instance")}return n}var pe=new WeakMap;var ve=new WeakMap;var ge=new WeakSet;var be=new WeakSet;var ye=new WeakSet;var Ee=new WeakSet;var ke=new WeakSet;var Ce=new WeakMap;var Me=new WeakSet;var Ie=new WeakSet;var Se=new WeakSet;var Te=new WeakSet;var we=new WeakSet;var Le=new WeakMap;var Ae=new WeakSet;var He=new WeakSet;var xe=new WeakSet;var Be=new WeakSet;var Pe=new WeakSet;var De=new WeakSet;var Ne=new WeakSet;var _e=function(e){babelHelpers.inherits(t,e);function t(e,n){var i;var a=n.events;babelHelpers.classCallCheck(this,t);i=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).call(this,e,{events:a}));de(babelHelpers.assertThisInitialized(i),Ne);de(babelHelpers.assertThisInitialized(i),De);de(babelHelpers.assertThisInitialized(i),Pe);de(babelHelpers.assertThisInitialized(i),Be);de(babelHelpers.assertThisInitialized(i),xe);de(babelHelpers.assertThisInitialized(i),He);de(babelHelpers.assertThisInitialized(i),Ae);de(babelHelpers.assertThisInitialized(i),we);de(babelHelpers.assertThisInitialized(i),Te);de(babelHelpers.assertThisInitialized(i),Se);de(babelHelpers.assertThisInitialized(i),Ie);de(babelHelpers.assertThisInitialized(i),Me);de(babelHelpers.assertThisInitialized(i),ke);de(babelHelpers.assertThisInitialized(i),Ee);de(babelHelpers.assertThisInitialized(i),ye);de(babelHelpers.assertThisInitialized(i),be);de(babelHelpers.assertThisInitialized(i),ge);babelHelpers.defineProperty(babelHelpers.assertThisInitialized(i),"items",new Map);me(babelHelpers.assertThisInitialized(i),pe,{writable:true,value:new ce});me(babelHelpers.assertThisInitialized(i),ve,{writable:true,value:false});me(babelHelpers.assertThisInitialized(i),Ce,{writable:true,value:null});me(babelHelpers.assertThisInitialized(i),Le,{writable:true,value:void 0});i.parentContainer=e;i.container=e.querySelector(".menu-items");i.hiddenContainer=e.querySelector("#left-menu-hidden-items-block");e.querySelectorAll("li.menu-item-block").forEach(i.registerItem.bind(babelHelpers.assertThisInitialized(i)));e.querySelector("#left-menu-hidden-separator").addEventListener("click",i.toggleHiddenContainer.bind(babelHelpers.assertThisInitialized(i)));if(i.getActiveItem()&&i.getActiveItem().container.getAttribute("data-status")==="hide"){fe(babelHelpers.assertThisInitialized(i),ge,Ue).call(babelHelpers.assertThisInitialized(i),true)}return i}babelHelpers.createClass(t,[{key:"registerItem",value:function e(t){var n=this;var i=re(t);var a=new i(this.container,t);this.items.set(a.getId(),a);fe(this,xe,Je).call(this,a);if(babelHelpers.classPrivateFieldGet(this,pe).checkAndSet(a,a.getSimilarToUrl(L.getCurUri()))===true){var s=fe(this,Te,We).call(this,a);while(s){s.markAsActive();s=fe(this,Te,We).call(this,s)}}r.EventEmitter.subscribe(a,o.eventName("onItemDelete"),(function(e){var t=e.data;n.deleteItem(a,t)}));r.EventEmitter.subscribe(a,o.eventName("onItemConvert"),(function(e){var t=e.data;n.convertItem(a,t)}));babelHelpers.toConsumableArray(a.container.querySelectorAll("a")).forEach((function(e){e.addEventListener("click",(function(e){if(babelHelpers.classPrivateFieldGet(n,ve)===true){e.preventDefault();e.stopPropagation();return false}}),true)}));a.container.querySelector('[data-role="item-edit-control"]').addEventListener("click",(function(e){n.openItemMenu(a,e.target)}));return a}},{key:"unregisterItem",value:function e(t){if(!this.items.has(t.getId())){return}this.items["delete"](t.getId());babelHelpers.classPrivateFieldGet(this,pe).checkAndUnset(t,t.getSimilarToUrl(L.getCurUri()));r.EventEmitter.unsubscribeAll(t,o.eventName("onItemDelete"));r.EventEmitter.unsubscribeAll(t,o.eventName("onItemConvert"));t.container.parentNode.replaceChild(t.container.cloneNode(true),t.container)}},{key:"switchToEditMode",value:function e(){if(babelHelpers.classPrivateFieldGet(this,ve)){return}babelHelpers.classPrivateFieldSet(this,ve,true);r.EventEmitter.emit(this,o.eventName("EditMode"))}},{key:"switchToViewMode",value:function e(){if(!babelHelpers.classPrivateFieldGet(this,ve)){return}babelHelpers.classPrivateFieldSet(this,ve,false);r.EventEmitter.emit(this,o.eventName("ViewMode"))}},{key:"isHiddenContainerVisible",value:function e(){return this.hiddenContainer.classList.contains("menu-item-favorites-more-open")}},{key:"toggleHiddenContainer",value:function e(t){if(this.hiddenContainer.classList.contains("menu-item-favorites-more-open")){fe(this,be,Oe).call(this,t)}else{fe(this,ge,Ue).call(this,t)}}},{key:"setItemAsAMainPage",value:function e(t){var n=this;var a=t.container;a.setAttribute("data-status","show");var r=a.offsetTop;var s=i.Dom.create("div",{attrs:{className:"menu-draggable-wrap"},style:{top:r}});var o=a.nextElementSibling;if(o){a.parentNode.insertBefore(s,o)}else{a.parentNode.appendChild(s)}s.appendChild(a);i.Dom.addClass(a,"menu-item-draggable");new BX.easing({duration:500,start:{top:r},finish:{top:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function e(t){s.style.top=t.top+"px"},complete:function e(){n.container.insertBefore(a,BX("left-menu-empty-item").nextSibling);i.Dom.removeClass(a,"menu-item-draggable");i.Dom.remove(s);fe(n,Se,je).call(n,{action:"mainPageIsSet",itemId:t.getId()})}}).animate()}},{key:"showItem",value:function e(t){var n=fe(this,Te,We).call(this,t);var i=this.container;t.container.setAttribute("data-status","show");if(fe(this,we,Ve).call(this,t)){i.appendChild(t.container);fe(this,ke,Fe).call(this,t,n)}else if(n){i.appendChild(n.container);n.container.setAttribute("data-status","show");i.appendChild(n.groupContainer)}if(this.hiddenContainer.querySelector(".menu-item-block")===null){r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsEmpty"));fe(this,be,Oe).call(this,false)}fe(this,Ee,Re).call(this,t);fe(this,Se,je).call(this,{action:"showItem",itemId:t.getId()})}},{key:"hideItem",value:function e(t){var n=fe(this,Te,We).call(this,t);var i=this.hiddenContainer.querySelector("#left-menu-hidden-items-list");var a=i.querySelector(".menu-item-block")===null;t.container.setAttribute("data-status","hide");if(fe(this,we,Ve).call(this,t)){i.appendChild(t.container);fe(this,ke,Fe).call(this,t,n)}else if(n){i.appendChild(n.container);n.container.setAttribute("data-status","hide");i.appendChild(n.groupContainer)}if(a){r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsNotEmpty"))}fe(this,Ee,Re).call(this,t);fe(this,Se,je).call(this,{action:"hideItem",itemId:t.getId()})}},{key:"updateCounters",value:function e(t,n){var a=this;var r={};n=n!==false;babelHelpers.toConsumableArray(Object.entries(t)).forEach((function(e){var t=babelHelpers.slicedToArray(e,2),i=t[0],s=t[1];babelHelpers.toConsumableArray(fe(a,Me,qe).call(a,i)).forEach((function(e){var t=e.updateCounter(s),n=t.oldValue,o=t.newValue;var l=e.container.getAttribute("data-status");if((i.indexOf("crm_")<0||i.indexOf("crm_all")>=0)&&(i.indexOf("tasks_")<0||i.indexOf("tasks_total")>=0)){r[l]=r[l]||0;r[l]+=o-n}var u=fe(a,Te,We).call(a,e);while(u){u.updateCounter();u=fe(a,Te,We).call(a,u)}}));if(n){BX.localStorage.set("lmc-"+i,s,5)}}));if(r["hide"]!==undefined&&r["hide"]!==0){var s=this.parentContainer.querySelector("#menu-hidden-counter");s.dataset.counterValue=Math.max(0,Number(s.dataset.counterValue)+Number(r["hide"]));if(s.dataset.counterValue>0){s.classList.remove("menu-hidden-counter");s.innerHTML=s.dataset.counterValue>99?"99+":s.dataset.counterValue}else{s.classList.add("menu-hidden-counter");s.innerHTML=""}}if(typeof BXIM!=="undefined"){if(babelHelpers.classPrivateFieldGet(this,Ce)===null){babelHelpers.classPrivateFieldSet(this,Ce,0);babelHelpers.toConsumableArray(this.items.entries()).forEach((function(e){var t=babelHelpers.slicedToArray(e,2),n=t[0],i=t[1];if(i instanceof ne){return}var r=i.getCounterValue();if(r>0){var s="doesNotMatter";if(n.indexOf("menu_crm")>=0||n.indexOf("menu_tasks")>=0){var o=i.container.querySelector('[data-role="counter"]');if(o){s=o.id}}if(s==="doesNotMatter"||s.indexOf("crm_all")>=0||s.indexOf("tasks_total")>=0){babelHelpers.classPrivateFieldSet(a,Ce,babelHelpers.classPrivateFieldGet(a,Ce)+r)}}}))}else{babelHelpers.classPrivateFieldSet(this,Ce,babelHelpers.classPrivateFieldGet(this,Ce)+(r["show"]!==undefined?r["show"]:0));babelHelpers.classPrivateFieldSet(this,Ce,babelHelpers.classPrivateFieldGet(this,Ce)+(r["hide"]!==undefined?r["hide"]:0))}var o=babelHelpers.classPrivateFieldGet(this,Ce)>99?"99+":babelHelpers.classPrivateFieldGet(this,Ce)<0?"0":babelHelpers.classPrivateFieldGet(this,Ce);var l=i.Reflection.getClass("BXIM.desktop");if(l){l.setBrowserIconBadge(o)}}}},{key:"decrementCounter",value:function e(t){var n=this;babelHelpers.toConsumableArray(Object.entries(t)).forEach((function(e){var i=babelHelpers.slicedToArray(e,2),a=i[0],r=i[1];var s=fe(n,Me,qe).call(n,a).shift();if(s){var o=s.getCounterValue();t[a]=o>r?o-r:0}else{delete t[a]}}));this.updateCounters(t,false)}},{key:"addItem",value:function e(t){var n=t.node,i=t.animateFromPoint;if(!(n instanceof Element)){return}var a=n.style.display;if(i){n.dataset.styleDisplay=n.style.display;n.style.display="none"}if(this.items.has(n.dataset.id)&&n.dataset.type===z.code){var r=this.items.get(n.dataset.id);r.storage.push(z.code);r.container.dataset.storage=r.storage.join(",");n=r.container}else{this.container.appendChild(n);this.registerItem(n);fe(this,Se,je).call(this)}if(i){fe(this,Ae,ze).call(this,n,i).then((function(){n.style.display=n.dataset.styleDisplay}))}}},{key:"updateItem",value:function e(t){var n=t.id;if(this.items.has(n)){this.items.get(n).update(t)}}},{key:"deleteItem",value:function e(t,n){var i=this;var a=n.animate;this.items["delete"](t.getId());babelHelpers.classPrivateFieldGet(this,pe).checkAndUnset(t);if(t instanceof z||a){fe(this,He,Ye).call(this,t.container).then((function(){t.container.parentNode.removeChild(t.container);fe(i,Se,je).call(i)}))}else if(t.container){t.container.parentNode.removeChild(t.container);fe(this,Se,je).call(this)}}},{key:"convertItem",value:function e(t){this.unregisterItem(t);this.registerItem(this.parentContainer.querySelector('li.menu-item-block[data-id="'.concat(t.getId(),'"]')))}},{key:"getActiveItem",value:function e(){return babelHelpers.classPrivateFieldGet(this,pe).item}},{key:"export",value:function e(){return fe(this,Ie,Ge).call(this)}},{key:"openItemMenu",value:function e(t,n){var s=this;if(babelHelpers.classPrivateFieldGet(this,Le)){babelHelpers.classPrivateFieldGet(this,Le).close()}var l=[];if(t.container.getAttribute("data-status")==="show"){l.push({text:i.Loc.getMessage("hide_item"),onclick:function e(){s.hideItem(t)}})}else{l.push({text:i.Loc.getMessage("show_item"),onclick:function e(n,i){s.showItem(t)}})}if(!o.isExtranet&&!(t instanceof J)&&!(t instanceof ne)&&this.container.querySelector('li.menu-item-block[data-role="item"]')!==t.container){l.push({text:i.Loc.getMessage("MENU_SET_MAIN_PAGE"),onclick:function e(){s.setItemAsAMainPage(t)}})}t.getDropDownActions().forEach((function(e){l.push(e)}));l.push({text:babelHelpers.classPrivateFieldGet(this,ve)?i.Loc.getMessage("MENU_EDIT_READY_FULL"):i.Loc.getMessage("MENU_SETTINGS_MODE"),onclick:function e(){babelHelpers.classPrivateFieldGet(s,ve)?s.switchToViewMode():s.switchToEditMode()}});l.forEach((function(e){var t;e["className"]=["menu-popup-no-icon",(t=e["className"])!==null&&t!==void 0?t:""].join(" ");var n=e.onclick;e["onclick"]=function(e,t){t.getMenuWindow().close();n.call(e,t)}}));babelHelpers.classPrivateFieldSet(this,Le,new a.Menu({bindElement:n,items:l,offsetTop:0,offsetLeft:12,angle:true,events:{onClose:function e(){r.EventEmitter.emit(s,o.eventName("onClose"));t.container.classList.remove("menu-item-block-hover");babelHelpers.classPrivateFieldSet(s,Le,null)},onShow:function e(){t.container.classList.add("menu-item-block-hover");r.EventEmitter.emit(s,o.eventName("onShow"))}}}));babelHelpers.classPrivateFieldGet(this,Le).show()}},{key:"isEditMode",get:function e(){return babelHelpers.classPrivateFieldGet(this,ve)}}]);return t}(d);function Ue(e){r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsVisible"));if(e===false){return this.hiddenContainer.classList.add("menu-item-favorites-more-open")}this.hiddenContainer.style.height="0px";this.hiddenContainer.style.opacity=0;fe(this,ye,Xe).call(this,true,this.hiddenContainer,this.hiddenContainer.scrollHeight)}function Oe(e){r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsHidden"));if(e===false){return this.hiddenContainer.classList.remove("menu-item-favorites-more-open")}fe(this,ye,Xe).call(this,false,this.hiddenContainer,this.hiddenContainer.offsetHeight)}function Xe(e,t,n){t.style.overflow="hidden";new BX.easing({duration:200,start:{opacity:e?0:100,height:e?0:n},finish:{opacity:e?100:0,height:e?n:0},transition:BX.easing.transitions.linear,step:function e(n){t.style.opacity=n.opacity/100;t.style.height=n.height+"px"},complete:function n(){if(e){t.classList.add("menu-item-favorites-more-open")}else{t.classList.remove("menu-item-favorites-more-open")}t.style.opacity="";t.style.overflow="";t.style.height=""}}).animate()}function Re(e){var t=0;if(e.container.querySelector('[data-role="counter"]')){t=e.container.querySelector('[data-role="counter"]').dataset.counterValue}if(t<=0){return}babelHelpers.toConsumableArray(this.items.entries()).forEach((function(e){var t=babelHelpers.slicedToArray(e,2),n=t[0],i=t[1];if(i instanceof ne){i.updateCounter()}}));var n=0;babelHelpers.toConsumableArray(this.parentContainer.querySelectorAll(".menu-item-block[data-status=\"hide\"][data-role='item']")).forEach((function(e){var t=e.querySelector('[data-role="counter"]');if(t){n+=parseInt(t.dataset.counterValue)}}));var i=this.parentContainer.querySelector("#menu-hidden-counter");i.dataset.counterValue=Math.max(0,n);if(i.dataset.counterValue>0){i.classList.remove("menu-hidden-counter");i.innerHTML=i.dataset.counterValue>99?"99+":i.dataset.counterValue}else{i.classList.add("menu-hidden-counter");i.innerHTML=""}}function Fe(e,t){if(this.getActiveItem()!==e){return}var n=fe(this,Te,We).call(this,e);if(t!==n){if(t instanceof ne){t.markAsInactive()}if(n instanceof ne){n.markAsActive()}}}function qe(e){var t=[];babelHelpers.toConsumableArray(this.items.values()).forEach((function(n){var i=n.container.querySelector('[data-role="counter"]');if(i&&i.id.indexOf(e)>=0){t.push(n)}}));return t}function Ge(){var e=this;var t={show:[],hide:[]};var n=[];var a=null;["show","hide"].forEach((function(r){var s=t[r];var o=null;var l=[];Array.from(e.parentContainer.querySelectorAll('.menu-item-block[data-status="'.concat(r,'"]'))).forEach((function(e){if(e.dataset.role==="group"){var u=e.parentNode.hasAttribute("data-group-id")?e.parentNode.getAttribute("data-group-id"):null;s=t[r];var c;while(c=l.pop()){if(c["group_id"]===u){l.push(c);s=c.items;break}}var d={group_id:e.dataset.id,items:[]};s.push(d);l.push(d);s=d.items;o=e.dataset.id}else{if([Q.code,J.code,z.code].indexOf(e.getAttribute("data-type"))>=0){var m={ID:e.getAttribute("data-id"),LINK:e.getAttribute("data-link"),TEXT:i.Text.decode(e.querySelector("[data-role='item-text']").innerHTML)};if(e.getAttribute("data-new-page")==="Y"){m.NEW_PAGE="Y"}n.push(m)}if(a===null&&i.Type.isStringFilled(e.getAttribute("data-link"))){a=e.getAttribute("data-link")}if(e.closest('[data-group-id="'.concat(o,'"][data-role="group-content"]'))){s.push(e.dataset.id)}else{var h=e.parentNode.hasAttribute("data-group-id")?e.parentNode.getAttribute("data-group-id"):null;s=t[r];var f;while(f=l.pop()){if(f["group_id"]===h){l.push(f);s=f.items;break}}s.push(e.dataset.id)}}}))}));return{saveSortItems:t,firstItemLink:a,customItems:n}}function je(e){var t=fe(this,Ie,Ge).call(this),n=t.saveSortItems,i=t.firstItemLink;P.saveItemsSort(n,i,e||{action:"sortItem"})}function We(e){if(!(e instanceof O)){return null}var t=e.container.closest('[data-role="group-content"]');if(t&&this.items.has(t.getAttribute("data-group-id"))){return this.items.get(t.getAttribute("data-group-id"))}return null}function Ve(e){if(e instanceof ne){return false}var t=fe(this,Te,We).call(this,e);if(t instanceof ne&&e.container.parentNode.querySelectorAll("li.menu-item-block").length<=1){return false}return true}function ze(e,t){var n=this;return new Promise((function(a){var r=t.startX,s=t.startY;var o=document.createElement("DIV");o.style="position: absolute; z-index: 1000; top: ".concat(s+25,"px;");var l=e.cloneNode(true);l.style.display=e.dataset.styleDisplay;document.body.appendChild(o);o.appendChild(l);var u=n.hiddenContainer.getBoundingClientRect().top;new BX.easing({duration:500,start:{left:r},finish:{left:30},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function e(t){o.style.left=t.left+"px"},complete:function e(){new BX.easing({duration:500,start:{top:s+25},finish:{top:u},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function e(t){o.style.top=t.top+"px"},complete:function e(){i.Dom.remove(o);a()}}).animate()}}).animate()}))}function Ye(e){return new Promise((function(t){new BX.easing({duration:700,start:{left:e.offsetLeft,opacity:1},finish:{left:400,opacity:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function t(n){e.style.paddingLeft=n.left+"px";e.style.opacity=n.opacity},complete:function e(){t()}}).animate()}))}function Je(e){var t=this;jsDD.Enable();e.container.onbxdragstart=fe(this,Be,Ke).bind(this,e);e.container.onbxdrag=function(e,n){fe(t,Pe,Qe).call(t,e,n)};e.container.onbxdraghover=function(e,n,i){fe(t,De,$e).call(t,e,n,i)};e.container.onbxdragstop=fe(this,Ne,Ze).bind(this,e);jsDD.registerObject(e.container)}function Ke(e){var t=this;r.EventEmitter.emit(r.EventEmitter.GLOBAL_TARGET,"BX.Bitrix24.LeftMenuClass:onDragStart");if(!(e instanceof ne)&&e.container.parentNode.querySelectorAll("li.menu-item-block").length<=1&&fe(this,Te,We).call(this,e)!==null){e=fe(this,Te,We).call(this,e)}r.EventEmitter.emit(this,o.eventName("onDragModeOn"));this.dnd={container:this.container.parentNode,itemDomBlank:i.Dom.create("div",{style:{display:"none"}}),itemMoveBlank:i.Dom.create("div",{style:{height:e.container.offsetHeight+"px"}}),draggableBlock:i.Dom.create("div",{attrs:{className:"menu-draggable-wrap"},style:{top:[e.container.offsetTop-e.container.offsetHeight,"px"].join("")}}),item:e,oldParent:fe(this,Te,We).call(this,e),isHiddenContainerVisible:this.isHiddenContainerVisible()};fe(this,ge,Ue).call(this,false);var n=function n(){babelHelpers.toConsumableArray(t.parentContainer.querySelectorAll("li.menu-item-block")).forEach((function(n){if(e instanceof ne&&fe(t,Te,We).call(t,t.items.get(n.getAttribute("data-id")))!==null){return}jsDD.registerDest(n,100)}));var i=t.parentContainer.querySelector("#left-menu-empty-item");if(e instanceof J){jsDD.unregisterDest(i)}else{jsDD.registerDest(i,100)}jsDD.registerDest(t.parentContainer.querySelector("#left-menu-hidden-empty-item"),100);jsDD.registerDest(t.parentContainer.querySelector("#left-menu-hidden-separator"),100)};if(e instanceof ne){e.collapse(true).then((function(){if(t.dnd){t.dnd.pos=BX.pos(t.container.parentNode);n()}}))}else{n()}var a=e.container;i.Dom.addClass(this.dnd.container,"menu-drag-mode");i.Dom.addClass(a,"menu-item-draggable");a.parentNode.insertBefore(this.dnd.itemDomBlank,a);a.parentNode.insertBefore(this.dnd.itemMoveBlank,a);this.dnd.draggableBlock.appendChild(e.container);this.dnd.container.style.position="relative";this.dnd.container.appendChild(this.dnd.draggableBlock);this.dnd.pos=BX.pos(this.container.parentNode)}function Qe(e,t){var n=this.dnd.item;var i=this.dnd.pos.height;t=Math.max(0,t-this.dnd.pos.top);this.dnd.draggableBlock.style.top=[Math.min(i-n.container.offsetHeight,t)-5,"px"].join("")}function $e(e,t,n){var a=this.dnd.item;var r=a.container;if(e===r){this.dnd.itemDomBlank.parentNode.insertBefore(this.dnd.itemMoveBlank,this.dnd.itemDomBlank);return}if(e.id==="left-menu-empty-item"&&(r.getAttribute("data-type")==="self"||r.getAttribute("data-disable-first-item")==="Y")){return}if(e.getAttribute("data-role")==="group"){var s=e.parentNode.querySelector('[data-group-id="'.concat(e.getAttribute("data-id"),'"]'));if(e.getAttribute("data-collapse-mode")==="collapsed"){i.Dom.insertAfter(this.dnd.itemMoveBlank,s)}else if(a instanceof ne){i.Dom.insertBefore(this.dnd.itemMoveBlank,e)}else{i.Dom.prepend(this.dnd.itemMoveBlank,s.querySelector("ul"))}}else if(this.dnd.container.contains(e)){var o=e;if(a instanceof ne&&e.closest('[data-role="group-content"]')){o=e.closest('[data-role="group-content"]')}i.Dom.insertAfter(this.dnd.itemMoveBlank,o)}}function Ze(){var e=this.dnd.item;var t=this.dnd.oldParent;var n=e.container;i.Dom.removeClass(this.dnd.container,"menu-drag-mode");i.Dom.removeClass(n,"menu-item-draggable");this.dnd.container.style.position="";var a=null;var s=false;if(this.parentContainer.querySelector(".menu-item-block")===e.container){if(e instanceof J){a=i.Loc.getMessage("MENU_SELF_ITEM_FIRST_ERROR")}else if(e.container.getAttribute("data-disable-first-item")==="Y"){a=i.Loc.getMessage("MENU_FIRST_ITEM_ERROR")}}if(a!==null){this.dnd.itemDomBlank.parentNode.replaceChild(n,this.dnd.itemDomBlank);e.showMessage(a)}else if(!this.dnd.container.contains(this.dnd.itemMoveBlank)){this.dnd.itemDomBlank.parentNode.replaceChild(n,this.dnd.itemDomBlank)}else{try{this.dnd.itemMoveBlank.parentNode.replaceChild(n,this.dnd.itemMoveBlank);if(this.hiddenContainer.contains(n)){e.container.setAttribute("data-status","hide");if(this.dnd.itemDomBlank.closest("#left-menu-hidden-items-block")===null&&this.hiddenContainer.querySelectorAll(".menu-item-block").length===1){r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsNotEmpty"))}}else{e.container.setAttribute("data-status","show");if(this.hiddenContainer.querySelectorAll(".menu-item-block").length<=0){s=true;r.EventEmitter.emit(this,o.eventName("onHiddenBlockIsEmpty"))}}if(e instanceof ne){e.checkAndCorrect().expand(true)}fe(this,ke,Fe).call(this,e,t);fe(this,Ee,Re).call(this,e);var l={action:"sortItem"};if(this.parentContainer.querySelector(".menu-item-block")===e.container&&!this.isExtranet){e.showMessage(i.Loc.getMessage("MENU_ITEM_MAIN_PAGE"));l.action="mainPage";l.itemId=e.getId()}fe(this,Se,je).call(this,l)}catch(e){this.dnd.itemDomBlank.parentNode.replaceChild(n,this.dnd.itemDomBlank)}}i.Dom.remove(this.dnd.draggableBlock);i.Dom.remove(this.dnd.itemDomBlank);i.Dom.remove(this.dnd.itemMoveBlank);jsDD.enableDest(n);this.container.style.position="static";if(!this.dnd.isHiddenContainerVisible||s===true){fe(this,be,Oe).call(this,false)}delete this.dnd;babelHelpers.toConsumableArray(this.parentContainer.querySelectorAll("li.menu-item-block")).forEach((function(e){jsDD.registerDest(e)}));var u=this.parentContainer.querySelector("#left-menu-empty-item");jsDD.unregisterDest(u);jsDD.unregisterDest(this.parentContainer.querySelector("#left-menu-hidden-empty-item"));jsDD.unregisterDest(this.parentContainer.querySelector("#left-menu-hidden-separator"));jsDD.refreshDestArea();r.EventEmitter.emit(this,o.eventName("onDragModeOff"))}var et=function(e){babelHelpers.inherits(t,e);function t(e,n){babelHelpers.classCallCheck(this,t);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(t).call(this,e,n))}babelHelpers.createClass(t,[{key:"saveCurrentPage",value:function e(t){var n=this;return z.saveCurrentPage(t).then((function(e){r.EventEmitter.emit(n,o.eventName("onItemHasBeenAdded"),e);return e}))["catch"](L.catchError)}},{key:"saveStandardPage",value:function e(t){var n=this;return z.saveStandardPage(t).then((function(e){r.EventEmitter.emit(n,o.eventName("onItemHasBeenAdded"),e);return e}))["catch"](L.catchError)}},{key:"deleteCurrentPage",value:function e(t){var n=this;var i=t.pageLink;return z.deleteCurrentPage({pageLink:i}).then((function(e){r.EventEmitter.emit(n,o.eventName("onItemHasBeenDeleted"),e);return e}))["catch"](L.catchError)}},{key:"deleteStandardPage",value:function e(t){var n=this;return z.deleteStandardPage(t).then((function(e){r.EventEmitter.emit(n,o.eventName("onItemHasBeenDeleted"),e);return e}))["catch"](L.catchError)}},{key:"showAddToSelf",value:function e(t){var n=this;J.showAdd(t).then((function(e){r.EventEmitter.emit(n,o.eventName("onItemHasBeenAdded"),e)}))["catch"](L.catchError)}}]);return t}(d);function tt(e,t,n){it(e,t);t.set(e,n)}function nt(e,t){it(e,t);t.add(e)}function it(e,t){if(t.has(e)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}function at(e,t,n){if(!t.has(e)){throw new TypeError("attempted to get private field on non-instance")}return n}var rt=new WeakSet;var st=new WeakSet;var ot=new WeakMap;var lt=new WeakSet;var ut=function(){function e(t){babelHelpers.classCallCheck(this,e);nt(this,lt);nt(this,st);nt(this,rt);babelHelpers.defineProperty(this,"cache",new i.Cache.MemoryCache);babelHelpers.defineProperty(this,"scrollModeThreshold",20);babelHelpers.defineProperty(this,"lastScrollOffset",0);babelHelpers.defineProperty(this,"slidingModeTimeoutId",0);babelHelpers.defineProperty(this,"topMenuSelectedNode",null);babelHelpers.defineProperty(this,"topItemSelectedObj",null);babelHelpers.defineProperty(this,"isMenuMouseEnterBlocked",false);babelHelpers.defineProperty(this,"isMenuMouseLeaveBlocked",[]);babelHelpers.defineProperty(this,"isCollapsedMode",false);babelHelpers.defineProperty(this,"workgroupsCounterData",{});tt(this,ot,{writable:true,value:0});this.menuContainer=document.getElementById("menu-items-block");if(!this.menuContainer){return false}t=babelHelpers["typeof"](t)==="object"?t:{};o.isExtranet=t.isExtranet==="Y";o.isAdmin=t.isAdmin;o.isCustomPresetRestricted=t.isCustomPresetAvailable!=="Y";this.isCollapsedMode=t.isCollapsedMode;this.workgroupsCounterData=t.workgroupsCounterData;this.initAndBindNodes();this.bindEvents();this.getItemsController();this.handleDocumentScroll()}babelHelpers.createClass(e,[{key:"initAndBindNodes",value:function e(){var t=this;this.menuContainer.addEventListener("dblclick",this.handleMenuDoubleClick.bind(this));this.menuContainer.addEventListener("mouseenter",this.handleMenuMouseEnter.bind(this));this.menuContainer.addEventListener("mouseleave",this.handleMenuMouseLeave.bind(this));this.menuContainer.addEventListener("transitionend",this.handleSlidingTransitionEnd.bind(this));this.menuHeader=this.menuContainer.querySelector(".menu-items-header");this.menuBody=this.menuContainer.querySelector(".menu-items-body");this.menuItemsBlock=this.menuContainer.querySelector(".menu-items");this.header=document.querySelector("#header");this.headerBurger=this.header.querySelector(".menu-switcher");var n=this.header.querySelector(".header-logo-block");this.headerSettings=this.header.querySelector(".header-logo-block-settings");if(this.headerSettings){n.addEventListener("mouseenter",this.handleHeaderLogoMouserEnter.bind(this));n.addEventListener("mouseleave",this.handleHeaderLogoMouserLeave.bind(this));this.menuHeader.addEventListener("mouseenter",this.handleHeaderLogoMouserEnter.bind(this));this.menuHeader.addEventListener("mouseleave",this.handleHeaderLogoMouserLeave.bind(this))}document.addEventListener("scroll",this.handleDocumentScroll.bind(this));this.mainTable=document.querySelector(".bx-layout-table");this.menuHeaderBurger=this.menuHeader.querySelector(".menu-switcher");this.menuHeaderBurger.addEventListener("click",this.handleBurgerClick.bind(this));this.menuHeader.querySelector(".menu-items-header-title").addEventListener("click",this.handleBurgerClick.bind(this,true));this.upButton=this.menuContainer.querySelector(".menu-btn-arrow-up");this.upButton.addEventListener("click",this.handleUpButtonClick.bind(this));this.menuMoreButton=this.menuContainer.querySelector(".menu-favorites-more-btn");this.menuMoreButton.addEventListener("click",this.handleShowHiddenClick.bind(this));var i=this.menuContainer.querySelector(".menu-help-btn");if(i){i.addEventListener("click",this.handleHelperClick.bind(this))}var a=this.menuContainer.querySelector(".menu-sitemap-btn");if(a){a.addEventListener("click",this.handleSiteMapClick.bind(this))}var r=this.menuContainer.querySelector(".menu-settings-save-btn");if(r){r.addEventListener("click",this.handleViewMode.bind(this))}this.menuContainer.querySelector(".menu-settings-btn").addEventListener("click",(function(){t.getSettingsController().show()}))}},{key:"getItemsController",value:function e(){var t=this;return this.cache.remember("itemsController",(function(){return new _e(t.menuContainer,{events:{EditMode:function e(){t.toggle(true);t.menuContainer.classList.add("menu-items-edit-mode");t.menuContainer.classList.remove("menu-items-view-mode")},ViewMode:function e(){t.toggle(true);t.menuContainer.classList.add("menu-items-view-mode");t.menuContainer.classList.remove("menu-items-edit-mode")},onDragModeOn:function e(n){var i=n.target;t.switchToSlidingMode(true);t.isMenuMouseLeaveBlocked.push("drag")},onDragModeOff:function e(n){var i=n.target;t.isMenuMouseLeaveBlocked.pop()},onHiddenBlockIsVisible:t.onHiddenBlockIsVisible.bind(t),onHiddenBlockIsHidden:t.onHiddenBlockIsHidden.bind(t),onHiddenBlockIsEmpty:t.onHiddenBlockIsEmpty.bind(t),onHiddenBlockIsNotEmpty:t.onHiddenBlockIsNotEmpty.bind(t),onShow:function e(){t.isMenuMouseLeaveBlocked.push("items")},onClose:function e(){t.isMenuMouseLeaveBlocked.pop()}}})}))}},{key:"getItemDirector",value:function e(){var t=this;return this.cache.remember("itemsCreator",(function(){return new et(t.menuContainer,{events:{onItemHasBeenAdded:function e(n){var i=n.data;t.getItemsController().addItem(i)}}})}))}},{key:"getSettingsController",value:function e(){var t=this;return this.cache.remember("presetController",(function(){return new B(t.menuContainer.querySelector(".menu-settings-btn"),{events:{onGettingSettingMenuItems:t.onGettingSettingMenuItems.bind(t),onShow:function e(){t.isMenuMouseLeaveBlocked.push("settings")},onClose:function e(){t.isMenuMouseLeaveBlocked.pop()}}})}))}},{key:"getCustomPresetController",value:function e(){var t=this;return this.cache.remember("customPresetController",(function(){return new h(t.menuContainer,{events:{onPresetIsSet:function e(n){var i=n.data;var a=t.getItemsController()["export"](),r=a.saveSortItems,s=a.firstItemLink,o=a.customItems;return P.setCustomPreset(i,r,o,s)},onShow:function e(){t.isMenuMouseLeaveBlocked.push("presets")},onClose:function e(){t.isMenuMouseLeaveBlocked.pop()}}})}))}},{key:"getDefaultPresetController",value:function e(){var t=this;return this.cache.remember("defaultPresetController",(function(){return new x(t.menuContainer,{events:{onPresetIsSet:function e(t){var n=t.data,i=n.mode,a=n.presetId;return P.setSystemPreset(i,a)},onPresetIsPostponed:function e(n){var i=n.data.mode;var a=P.postponeSystemPreset(i);r.EventEmitter.emit(t,o.eventName("onPresetIsPostponed"));return a}}})}))}},{key:"bindEvents",value:function e(){var t=this;BX.addCustomEvent("BX.Bitrix24.GroupPanel:onOpen",this.handleGroupPanelOpen.bind(this));BX.addCustomEvent("BX.Bitrix24.GroupPanel:onClose",this.handleGroupPanelClose.bind(this));BX.addCustomEvent("BX.Main.InterfaceButtons:onFirstItemChange",(function(e,n){if(!e||!i.Type.isDomNode(n)){return}var a=n.getAttribute("data-top-menu-id");var r=t.menuBody.querySelector('[data-top-menu-id="'.concat(a,'"]'));if(r){r.setAttribute("data-link",e);var s=r.querySelector("a.menu-item-link");if(s){s.setAttribute("href",e)}if(r.previousElementSibling===t.menuContainer.querySelector("#left-menu-empty-item")){P.setFirstPage(e)}else{P.clearCache()}}t.showMessage(n,i.Loc.getMessage("MENU_ITEM_MAIN_SECTION_PAGE"))}));BX.addCustomEvent("BX.Main.InterfaceButtons:onHideLastVisibleItem",(function(e){t.showMessage(e,i.Loc.getMessage("MENU_TOP_ITEM_LAST_HIDDEN"))}));BX.addCustomEvent("BX.Main.InterfaceButtons:onBeforeCreateEditMenu",(function(e,n,a){var r=at(t,rt,ct).call(t,n);if(!r&&n&&i.Type.isStringFilled(n.URL)&&!n.URL.match(/javascript:/)){e.addMenuItem({text:i.Loc.getMessage("MENU_ADD_TO_LEFT_MENU"),onclick:function e(i,a){t.getItemDirector().saveStandardPage(n);a.getMenuWindow().close()}})}else if(r instanceof z){e.addMenuItem({text:i.Loc.getMessage("MENU_DELETE_FROM_LEFT_MENU"),onclick:function e(i,a){t.getItemDirector().deleteStandardPage(n);a.getMenuWindow().close()}})}}));top.BX.addCustomEvent("UI.Toolbar:onRequestMenuItemData",(function(e){var n=e.currentFullPath,a=e.context;if(i.Type.isStringFilled(n)){BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onSendMenuItemData",[{currentPageInMenu:t.menuContainer.querySelector('.menu-item-block[data-link="'.concat(n,'"]')),context:a}])}}));r.EventEmitter.subscribe("UI.Toolbar:onStarClick",(function(e){var n=babelHelpers.slicedToArray(e.compatData,1),i=n[0];if(i.isActive){t.getItemDirector().deleteCurrentPage({context:i.context,pageLink:i.pageLink}).then((function(e){var n=e.itemInfo;BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuItemDeleted",[n,t]);BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",[{isActive:false,context:i.context}])}))}else{t.getItemDirector().saveCurrentPage({pageTitle:i.pageTitle,pageLink:i.pageLink}).then((function(e){var n=e.itemInfo;BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuItemAdded",[n,t]);BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",[{isActive:true,context:i.context}])}))}}));r.EventEmitter.subscribe("BX.Main.InterfaceButtons:onBeforeResetMenu",(function(e){var t=babelHelpers.slicedToArray(e.compatData,1),n=t[0];n.push((function(){var e=new BX.Promise;P.clearCache().then((function(){e.fulfill()}),(function(t){e.reject("Error: "+t.errors[0].message)}));return e}))}))}},{key:"isEditMode",value:function e(){return this.getItemsController().isEditMode}},{key:"isCollapsed",value:function e(){return this.isCollapsedMode}},{key:"showMessage",value:function e(t,n,i){var r=a.PopupManager.create("left-menu-message",t,{content:'<div class="left-menu-message-popup">'+n+"</div>",darkMode:true,offsetTop:i==="right"?-45:2,offsetLeft:i==="right"?215:0,angle:i==="right"?{position:"left"}:true,cacheable:false,autoHide:true,events:{onDestroy:function e(){r=null}}});r.show();setTimeout((function(){if(r){r.close();r=null}}),3e3)}},{key:"showError",value:function e(t){this.showMessage(t,i.Loc.getMessage("edit_error"))}},{key:"showGlobalPreset",value:function e(){this.getDefaultPresetController().show("global")}},{key:"handleShowHiddenClick",value:function e(){this.getItemsController().toggleHiddenContainer(true)}},{key:"onHiddenBlockIsVisible",value:function e(){i.Dom.addClass(this.menuMoreButton,"menu-favorites-more-btn-open");this.menuMoreButton.querySelector("#menu-more-btn-text").innerHTML=i.Loc.getMessage("more_items_hide")}},{key:"onHiddenBlockIsHidden",value:function e(){i.Dom.removeClass(this.menuMoreButton,"menu-favorites-more-btn-open");this.menuMoreButton.querySelector("#menu-more-btn-text").innerHTML=i.Loc.getMessage("more_items_show")}},{key:"onHiddenBlockIsEmpty",value:function e(){i.Dom.addClass(this.menuMoreButton,"menu-favorites-more-btn-hidden")}},{key:"onHiddenBlockIsNotEmpty",value:function e(){i.Dom.removeClass(this.menuMoreButton,"menu-favorites-more-btn-hidden")}},{key:"setDefaultMenu",value:function e(){s.MessageBox.show({message:i.Loc.getMessage("MENU_SET_DEFAULT_CONFIRM"),onYes:function e(t,n){n.setWaiting();P.setDefaultPreset().then((function(){n.setWaiting(false);t.close();document.location.reload()}))},buttons:s.MessageBoxButtons.YES_CANCEL})}},{key:"clearCompositeCache",value:function e(){i.ajax.runAction("intranet.leftmenu.clearCache",{data:{}})}},{key:"onGettingSettingMenuItems",value:function e(){var t=this;var n=z.getActiveTopMenuItem();var a=null;if(n){var r=this.menuContainer.querySelector('.menu-item-block[data-link="'.concat(n["URL"],'"]'));if(!r){a={text:i.Loc.getMessage("MENU_ADD_TO_LEFT_MENU"),onclick:function e(i,a){t.getItemDirector().saveStandardPage(n);a.getMenuWindow().destroy()}}}else if(r.getAttribute("data-type")===z.code){a={text:i.Loc.getMessage("MENU_DELETE_FROM_LEFT_MENU"),onclick:function e(i,a){t.getItemDirector().deleteStandardPage(n);a.getMenuWindow().destroy()}}}else{a={text:i.Loc.getMessage("MENU_DELETE_PAGE_FROM_LEFT_MENU"),className:"menu-popup-disable-text",onclick:function e(){}}}}var s=[{text:i.Loc.getMessage("SORT_ITEMS"),onclick:function e(){t.getItemsController().switchToEditMode()}},{text:this.isCollapsed()?i.Loc.getMessage("MENU_EXPAND"):i.Loc.getMessage("MENU_COLLAPSE"),onclick:function e(n,i){t.toggle();i.getMenuWindow().destroy()}},a,{text:i.Loc.getMessage("MENU_ADD_SELF_PAGE"),onclick:function e(n,i){t.getItemDirector().showAddToSelf(t.getSettingsController().getContainer())}},o.isExtranet?null:{text:i.Loc.getMessage("MENU_SET_DEFAULT2"),onclick:function e(){t.getDefaultPresetController().show("personal")}},o.isExtranet?null:{text:i.Loc.getMessage("MENU_SET_DEFAULT"),onclick:this.setDefaultMenu.bind(this)}];if(o.isAdmin){var l=i.Loc.getMessage("MENU_SAVE_CUSTOM_PRESET");if(o.isCustomPresetRestricted){l+="<span class='menu-lock-icon'></span>"}s.push({html:l,className:o.isCustomPresetRestricted?" menu-popup-disable-text":"",onclick:function e(n,i){if(o.isCustomPresetRestricted){BX.UI.InfoHelper.show("limit_office_menu_to_all")}else{t.getCustomPresetController().show()}}})}return s.filter((function(e){return e!==null}))}},{key:"handleSiteMapClick",value:function e(){this.switchToSlidingMode(false);BX.SidePanel.Instance.open((i.Loc.getMessage("SITE_DIR")||"/")+"sitemap/",{allowChangeHistory:false,customLeftBoundary:0})}},{key:"handleHelperClick",value:function e(){this.switchToSlidingMode(false);BX.Helper.show()}},{key:"blockSliding",value:function e(){this.stopSliding();this.isMenuMouseEnterBlocked=true}},{key:"releaseSliding",value:function e(){this.isMenuMouseEnterBlocked=false}},{key:"stopSliding",value:function e(){clearTimeout(this.slidingModeTimeoutId);this.slidingModeTimeoutId=0}},{key:"startSliding",value:function e(){this.stopSliding();if(this.isMenuMouseEnterBlocked===true){return}this.slidingModeTimeoutId=setTimeout(function(){this.slidingModeTimeoutId=0;this.switchToSlidingMode(true)}.bind(this),400)}},{key:"handleBurgerClick",value:function e(t){this.getItemsController().switchToViewMode();this.menuHeaderBurger.classList.add("menu-switcher-hover");this.toggle(t,function(){this.blockSliding();setTimeout(function(){this.menuHeaderBurger.classList.remove("menu-switcher-hover");this.releaseSliding()}.bind(this),100)}.bind(this))}},{key:"handleMenuMouseEnter",value:function e(t){if(!this.isCollapsed()){return}this.startSliding()}},{key:"handleMenuMouseLeave",value:function e(t){this.stopSliding();if(this.isMenuMouseLeaveBlocked.length<=0){this.switchToSlidingMode(false)}}},{key:"handleMenuDoubleClick",value:function e(t){if(t.target===this.menuBody){this.toggle()}}},{key:"handleHeaderLogoMouserEnter",value:function e(t){BX.addClass(this.headerSettings,"header-logo-block-settings-show")}},{key:"handleHeaderLogoMouserLeave",value:function e(t){if(!this.headerSettings.hasAttribute("data-rename-portal")){BX.removeClass(this.headerSettings,"header-logo-block-settings-show")}}},{key:"handleUpButtonClick",value:function e(){this.blockSliding();if(this.isUpButtonReversed()){window.scrollTo(0,this.lastScrollOffset);this.lastScrollOffset=0;this.unreverseUpButton()}else{this.lastScrollOffset=window.pageYOffset;window.scrollTo(0,0);this.reverseUpButton()}setTimeout(this.releaseSliding.bind(this),100)}},{key:"handleUpButtonMouseLeave",value:function e(){this.releaseSliding()}},{key:"handleDocumentScroll",value:function e(){at(this,lt,mt).call(this);this.applyScrollMode();if(window.pageYOffset>document.documentElement.clientHeight){this.showUpButton();if(this.isUpButtonReversed()){this.unreverseUpButton();this.lastScrollOffset=0}}else if(!this.isUpButtonReversed()){this.hideUpButton()}if(window.pageXOffset>0){this.menuContainer.style.left=-window.pageXOffset+"px";this.upButton.style.left=-window.pageXOffset+(this.isCollapsed()?0:172)+"px"}else{this.menuContainer.style.removeProperty("left");this.upButton.style.removeProperty("left")}}},{key:"switchToSlidingMode",value:function e(t,n){if(t===false){this.stopSliding();if(BX.hasClass(this.mainTable,"menu-sliding-mode")){if(n!==true){BX.addClass(this.mainTable,"menu-sliding-closing-mode")}BX.removeClass(this.mainTable,"menu-sliding-mode menu-sliding-opening-mode")}}else if(this.isCollapsedMode&&!BX.hasClass(this.mainTable,"menu-sliding-mode")){BX.removeClass(this.mainTable,"menu-sliding-closing-mode");if(n!==true){BX.addClass(this.mainTable,"menu-sliding-opening-mode")}BX.addClass(this.mainTable,"menu-sliding-mode")}}},{key:"handleSlidingTransitionEnd",value:function e(t){if(t.target===this.menuContainer){BX.removeClass(this.mainTable,"menu-sliding-opening-mode menu-sliding-closing-mode")}}},{key:"switchToScrollMode",value:function e(t){if(t===false){this.mainTable.classList.remove("menu-scroll-mode")}else if(!this.mainTable.classList.contains("menu-scroll-mode")){this.mainTable.classList.add("menu-scroll-mode")}}},{key:"switchToLogoMaskMode",value:function e(t){if(!at(this,st,dt).call(this)){return}if(t===false){this.mainTable.classList.remove("menu-logo-mask-mode")}else if(!this.mainTable.classList.contains("menu-logo-mask-mode")){this.mainTable.classList.add("menu-logo-mask-mode")}}},{key:"toggle",value:function e(t,n){var i=BX("layout-left-column");if(!i){return}var a=!this.mainTable.classList.contains("menu-collapsed-mode");if(t===a||this.mainTable.classList.contains("menu-animation-mode")){return}BX.onCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuToggle",[t,this]);var r=this.menuHeader.querySelector(".logo-image-container");if(r){var s=this.header.querySelector(".logo-image-container").offsetWidth;if(s>0){r.style.width=s+"px"}}this.blockSliding();this.switchToSlidingMode(false,true);this.applyScrollMode();i.style.overflow="hidden";this.mainTable.classList.add("menu-animation-mode",a?"menu-animation-closing-mode":"menu-animation-opening-mode");var o=[].slice.call(i.querySelectorAll(".menu-item-link"));var l=i.querySelector(".menu-collapsed-more-btn");var u=i.querySelector(".menu-default-more-btn");var c=i.querySelector(".menu-sitemap-icon-box");var d=i.querySelector(".menu-sitemap-btn-text");var m=i.querySelector(".menu-invite-employees-text");var h=i.querySelector(".menu-invite-icon-box");var f=i.querySelector(".menu-license-all-container");var p=i.querySelector(".menu-license-all-default");var v=p?p.offsetHeight:0;var g=i.querySelector(".menu-license-all-collapsed");var b=this.menuContainer.querySelector(".menu-settings-icon-box");var y=this.menuContainer.querySelector(".menu-settings-btn-text");var E=this.menuContainer.querySelector(".menu-help-icon-box");var k=this.menuContainer.querySelector(".menu-help-btn-text");var C=i.querySelector(".menu-item-separator");var M=i.querySelector(".menu-item-index-more");var I=this.mainTable.querySelector(".page-header");var S=document.getElementById("bx-im-bar");var T=S?S.offsetWidth:0;new BX.easing({duration:300,start:{translateIcon:a?-100:0,translateText:a?0:-100,translateMoreBtn:a?0:-84,translateLicenseBtn:a?0:-100,heightLicenseBtn:a?v:40,burgerMenuWidth:a?33:66,sidebarWidth:a?240:66,opacity:a?100:0,opacityRevert:a?0:100},finish:{translateIcon:a?0:-100,translateText:a?-100:-18,translateMoreBtn:a?-84:0,translateLicenseBtn:a?-100:0,heightLicenseBtn:a?40:v,burgerMenuWidth:a?66:33,sidebarWidth:a?66:240,opacity:a?0:100,opacityRevert:a?100:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(e){i.style.width=e.sidebarWidth+"px";this.menuContainer.style.width=e.sidebarWidth+"px";this.menuHeaderBurger.style.width=e.burgerMenuWidth+"px";this.headerBurger.style.width=e.burgerMenuWidth+"px";if(I){I.style.maxWidth="calc(100vw - "+e.sidebarWidth+"px - "+T+"px)"}if(a){if(c){c.style.transform="translateX("+e.translateIcon+"px)";c.style.opacity=e.opacityRevert/100}if(d){d.style.transform="translateX("+e.translateText+"px)";d.style.opacity=e.opacity/100}if(h){h.style.transform="translateX("+e.translateIcon+"px)";h.style.opacity=e.opacityRevert/100}if(m){m.style.transform="translateX("+e.translateText+"px)";m.style.opacity=e.opacity/100}b.style.transform="translateX("+e.translateIcon+"px)";b.style.opacity=e.opacityRevert/100;y.style.transform="translateX("+e.translateText+"px)";y.style.opacity=e.opacity/100;E.style.transform="translateX("+e.translateIcon+"px)";E.style.opacity=e.opacityRevert/100;k.style.transform="translateX("+e.translateText+"px)";k.style.opacity=e.opacity/100;l.style.transform="translateX("+e.translateIcon+"px)";l.style.opacity=e.opacityRevert/100;u.style.transform="translateX("+e.translateMoreBtn+"px)";u.style.opacity=e.opacity/100;if(M){M.style.transform="translateX("+e.translateIcon+"px)";M.style.opacity=e.opacityRevert/100}if(f){p.style.transform="translateX("+e.translateLicenseBtn+"px)";p.style.opacity=e.opacity/100;p.style.height=e.heightLicenseBtn+"px";g.style.transform="translateX("+e.translateIcon+"px)";g.style.opacity=e.opacityRevert/100}o.forEach((function(t){var n=t.querySelector(".menu-item-icon-box");var i=t.querySelector(".menu-item-link-text");var a=t.querySelector(".menu-item-index");var r=t.querySelector(".menu-item-link-arrow");i.style.transform="translateX("+e.translateText+"px)";i.style.opacity=e.opacity/100;n.style.transform="translateX("+e.translateIcon+"px)";n.style.opacity=e.opacityRevert/100;if(r){r.style.transform="translateX("+e.translateText+"px)";r.style.opacity=e.opacity/100}if(a){a.style.transform="translateX("+e.translateIcon+"px)";a.style.opacity=e.opacityRevert/100}}))}else{C.style.opacity=0;if(c){c.style.transform="translateX("+e.translateIcon+"px)";c.style.opacity=e.opacityRevert/100}if(d){d.style.transform="translateX("+e.translateText+"px)";d.style.opacity=e.opacity/100}if(h){h.style.transform="translateX("+e.translateIcon+"px)";h.style.opacity=e.opacityRevert/100}if(m){m.style.transform="translateX("+e.translateText+"px)";m.style.opacity=e.opacity/100}b.style.transform="translateX("+e.translateIcon+"px)";b.style.opacity=e.opacityRevert/100;y.style.transform="translateX("+e.translateText+"px)";y.style.opacity=e.opacity/100;E.style.transform="translateX("+e.translateIcon+"px)";E.style.opacity=e.opacityRevert/100;k.style.transform="translateX("+e.translateText+"px)";k.style.opacity=e.opacity/100;l.style.transform="translateX("+e.translateIcon+"px)";l.style.opacity=e.opacityRevert/100;u.style.transform="translateX("+e.translateMoreBtn+"px)";u.style.opacity=e.opacity/100;if(M){M.style.transform="translateX("+e.translateText+"px)"}if(f){p.style.transform="translateX("+e.translateLicenseBtn+"px)";p.style.opacity=e.opacity/100;p.style.height=e.heightLicenseBtn+"px";g.style.transform="translateX("+e.translateIcon+"px)";g.style.opacity=e.opacityRevert/100}o.forEach((function(t){var n=t.querySelector(".menu-item-icon-box");var i=t.querySelector(".menu-item-link-text");var a=t.querySelector(".menu-item-index");var r=t.querySelector(".menu-item-link-arrow");i.style.transform="translateX("+e.translateText+"px)";i.style.opacity=e.opacity/100;i.style.display="inline-block";n.style.transform="translateX("+e.translateIcon+"px)";n.style.opacity=e.opacityRevert/100;if(r){r.style.transform="translateX("+e.translateText+"px)"}if(a){a.style.transform="translateX("+e.translateText+"px)"}}))}var t=document.createEvent("Event");t.initEvent("resize",true,true);window.dispatchEvent(t)}.bind(this),complete:function(){if(a){this.isCollapsedMode=true;BX.addClass(this.mainTable,"menu-collapsed-mode")}else{this.isCollapsedMode=false;BX.removeClass(this.mainTable,"menu-collapsed-mode")}BX.removeClass(this.mainTable,"menu-animation-mode menu-animation-opening-mode menu-animation-closing-mode");var e=[i,C,this.menuHeaderBurger,this.headerBurger,b,y,E,k,u,l,r,c,d,h,m,M,p,g,this.menuContainer,I];e.forEach((function(e){if(e){e.style.cssText=""}}));o.forEach((function(e){var t=e.querySelector(".menu-item-icon-box");var n=e.querySelector(".menu-item-link-text");var i=e.querySelector(".menu-item-index");var a=e.querySelector(".menu-item-link-arrow");e.style.cssText="";n.style.cssText="";t.style.cssText="";if(a){a.style.cssText=""}if(i){i.style.cssText=""}}));this.releaseSliding();at(this,lt,mt).call(this);if(BX.type.isFunction(n)){n()}P.toggleMenu(a);var t=document.createEvent("Event");t.initEvent("resize",true,true);window.dispatchEvent(t)}.bind(this)}).animate()}},{key:"handleViewMode",value:function e(){this.getItemsController().switchToViewMode()}},{key:"applyScrollMode",value:function e(){this.switchToLogoMaskMode(true);var t=this.scrollModeThreshold+L.adminPanel.height;this.switchToScrollMode(window.pageYOffset>t)}},{key:"handleGroupPanelOpen",value:function e(){this.isMenuMouseLeaveBlocked.push("group")}},{key:"handleGroupPanelClose",value:function e(){this.isMenuMouseLeaveBlocked.pop()}},{key:"showUpButton",value:function e(){this.menuContainer.classList.add("menu-up-button-active")}},{key:"hideUpButton",value:function e(){this.menuContainer.classList.remove("menu-up-button-active")}},{key:"reverseUpButton",value:function e(){this.menuContainer.classList.add("menu-up-button-reverse")}},{key:"unreverseUpButton",value:function e(){this.menuContainer.classList.remove("menu-up-button-reverse")}},{key:"isUpButtonReversed",value:function e(){return this.menuContainer.classList.contains("menu-up-button-reverse")}},{key:"isDefaultTheme",value:function e(){return document.body.classList.contains("bitrix24-default-theme")}},{key:"getTopPadding",value:function e(){return this.isDefaultTheme()?0:9}},{key:"initPagetitleStar",value:function e(){return z.isCurrentPageStandard(z.getActiveTopMenuItem())}},{key:"getStructureForHelper",value:function e(){var t=this;var n={menu:{}};["show","hide"].forEach((function(e){Array.from(t.menuContainer.querySelectorAll('[data-status="'.concat(e,'"][data-type="').concat($.code,'"]'))).forEach((function(t){n[e]=n[e]||[];n[e].push(t.getAttribute("data-id"))}))}));return n}},{key:"showItemWarning",value:function e(t){var n=t.itemId,i=t.title,a=t.events;if(this.getItemsController().items.has(n)){this.getItemsController().items.get(n).showWarning(i,a)}}},{key:"removeItemWarning",value:function e(t){if(this.getItemsController().items.has(t)){this.getItemsController().items.get(t).removeWarning()}}},{key:"decrementCounter",value:function e(t,n){if(!t||t.id!=="menu-counter-live-feed"){return}babelHelpers.classPrivateFieldSet(this,ot,babelHelpers.classPrivateFieldGet(this,ot)+parseInt(n));this.getItemsController().decrementCounter({"live-feed":parseInt(n)})}},{key:"updateCounters",value:function e(t,n){if(!t){return}if(t["**"]!==undefined){t["live-feed"]=t["**"];delete t["**"]}var a=false;if(!i.Type.isUndefined(t["**SG0"])){this.workgroupsCounterData["livefeed"]=t["**SG0"];delete t["**SG0"];a=true}if(!i.Type.isUndefined(t[i.Loc.getMessage("COUNTER_PROJECTS_MAJOR")])){this.workgroupsCounterData[i.Loc.getMessage("COUNTER_PROJECTS_MAJOR")]=t[i.Loc.getMessage("COUNTER_PROJECTS_MAJOR")];delete t[i.Loc.getMessage("COUNTER_PROJECTS_MAJOR")];a=true}if(!i.Type.isUndefined(t[i.Loc.getMessage("COUNTER_SCRUM_TOTAL_COMMENTS")])){this.workgroupsCounterData[i.Loc.getMessage("COUNTER_SCRUM_TOTAL_COMMENTS")]=t[i.Loc.getMessage("COUNTER_SCRUM_TOTAL_COMMENTS")];delete t[i.Loc.getMessage("COUNTER_SCRUM_TOTAL_COMMENTS")];a=true}if(a){t["workgroups"]=Object.entries(this.workgroupsCounterData).reduce((function(e,t){var n=babelHelpers.slicedToArray(t,2),i=n[1];return e+Number(i)}),0)}if(t["live-feed"]){if(t["live-feed"]<=0){babelHelpers.classPrivateFieldSet(this,ot,0)}else{t["live-feed"]-=babelHelpers.classPrivateFieldGet(this,ot)}}this.getItemsController().updateCounters(t,n)}}]);return e}();function ct(e){var t;var n=e.DATA_ID,i=e.NODE;var a=this.getItemsController().items.get(n);if(!a){var r=i.getAttribute("data-top-menu-id");if(i===i.parentNode.querySelector("[data-top-menu-id]")){var s=this.menuItemsBlock.querySelector('[data-top-menu-id="'.concat(r,'"]'));if(s){a=this.getItemsController().items.get(s.getAttribute("data-id"))}}}return(t=a)!==null&&t!==void 0?t:null}function dt(){var e=this;return this.cache.remember("isLogoMaskNeeded",(function(){var t=e.menuHeader.querySelector(".logo");var n=false;if(t&&!t.querySelector(".logo-image-container")){var i=t.offsetWidth===0?e.header.querySelector(".logo")?e.header.querySelector(".logo").offsetWidth:0:t.offsetWidth;n=i>200}return n}))}function mt(){var e=this;if(!this["menuAdjustAdminPanel"]){this["menuAdjustAdminPanel"]=function(t){var n=t.data;e.menuContainer.style.top=[n,"px"].join("")};r.EventEmitter.subscribe(L.adminPanel,o.eventName("onPanelHasChanged"),this["menuAdjustAdminPanel"])}this.menuContainer.style.top=[L.adminPanel.top,"px"].join("")}e.Menu=ut})(this.BX.Intranet=this.BX.Intranet||{},BX.UI,BX,BX,BX.Main,BX.Event,BX.UI.Dialogs);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:90:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/map.min.js?171272285810918";s:6:"source";s:70:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/map.js";s:3:"min";s:74:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/map.min.js";s:3:"map";s:74:"/bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/map.map.js";}"*/
BX.namespace("BX.Bitrix24");BX.Bitrix24.SlidingPanel=function(t){this.containerClassName=this.containerClassName||"sliding-panel-window";this.container=BX.create("div",{props:{className:this.containerClassName}});this.overlayClassName=this.overlayClassName||"sliding-panel-overlay";this.overlay=BX.create("div",{props:{className:this.overlayClassName}});this.isOpen=false;this.header=BX("header");this.menuItems=BX("menu-items-block");this.imBar=BX("bx-im-bar");this.panel=BX("panel");this.creatorConfirmedPanel=BX("creatorconfirmed");this.animation=null;this.startParams=this.startParams||{};this.endParams=this.endParams||{};this.currentParams=null;BX.bind(this.container,"click",this.onContainerClick.bind(this));BX.addCustomEvent("onTopPanelCollapse",this.onTopPanelCollapse.bind(this))};BX.Bitrix24.SlidingPanel.prototype={animateStep:function(t){},setContent:function(){},open:function(){if(this.isOpen){return}this.isOpen=true;BX.bind(document,"keyup",BX.proxy(this.onDocumentKeyUp,this));BX.bind(document,"click",BX.proxy(this.onDocumentClick,this));this.header.addEventListener("click",BX.proxy(this.onHeaderClick,this),true);if(!this.overlay.parentNode){document.body.appendChild(this.overlay);BX.ZIndexManager.register(this.overlay)}BX.ZIndexManager.bringToFront(this.overlay);if(!this.container.parentNode){this.setContent();this.overlay.appendChild(this.container)}var t=window.innerWidth-document.documentElement.clientWidth;document.body.style.paddingRight=t+"px";if(this.imBar){this.imBar.style.right=t+"px"}if(this.panel){this.panel.style.zIndex=3001}if(this.creatorConfirmedPanel){this.creatorConfirmedPanel.style.zIndex=3e3}document.body.style.overflow="hidden";this.adjustPosition();if(this.animation){this.animation.stop()}this.animation=new BX.easing({duration:300,start:this.currentParams?this.currentParams:this.startParams,finish:this.endParams,transition:BX.easing.transitions.linear,step:BX.proxy(function(t){this.currentParams=t;this.animateStep(t)},this),complete:BX.proxy(function(){this.onTrasitionEnd()},this)});this.animation.animate()},close:function(t){if(!this.isOpen){if(this.animation){this.animation.stop(true)}return}this.isOpen=false;BX.unbind(document,"keyup",BX.proxy(this.onDocumentKeyUp,this));BX.unbind(document,"click",BX.proxy(this.onDocumentClick,this));this.header.removeEventListener("click",BX.proxy(this.onHeaderClick,this),true);this.container.classList.remove(this.containerClassName+"-open");if(this.animation){this.animation.stop()}if(t===true){this.currentParams=this.startParams;this.onTrasitionEnd()}else{this.animation=new BX.easing({duration:300,start:this.currentParams,finish:this.startParams,transition:BX.easing.transitions.linear,step:BX.proxy(function(t){this.currentParams=t;this.animateStep(t)},this),complete:BX.proxy(function(){this.onTrasitionEnd()},this)});this.animation.animate()}},adjustPosition:function(){var t=BX.pos(this.menuItems);var i=window.pageYOffset||document.documentElement.scrollTop;if(i>0){this.overlay.style.bottom=-i+"px"}var e=i>t.top?i:t.top;this.overlay.style.top=e+"px"},onTrasitionEnd:function(){this.animation=null;if(this.isOpen){this.currentParams=this.endParams;this.container.classList.add(this.containerClassName+"-open")}else{this.currentParams=this.startParams;if(this.overlay.parentNode){BX.ZIndexManager.unregister(this.overlay);this.overlay.parentNode.removeChild(this.overlay)}if(this.imBar){this.imBar.style.right=""}if(this.panel){this.panel.style.cssText=""}if(this.creatorConfirmedPanel){this.creatorConfirmedPanel.style.cssText=""}document.body.style.cssText="";this.container.style.cssText="";this.header.style.cssText="";this.overlay.style.cssText=""}},onContainerClick:function(t){t.stopPropagation()},onDocumentKeyUp:function(t){if(t.keyCode===27){this.close()}},onDocumentClick:function(t){if(BX.isParentForNode(this.container,t.target)){return}this.close()},onHeaderClick:function(t){if(this.isOpen&&t.target.className.match(/help-/)){this.close(true)}},onTopPanelCollapse:function(){if(this.isOpen){this.adjustPosition()}}};BX.Bitrix24.GroupPanel=function(t){this.containerClassName="group-panel-window";this.overlayClassName="group-panel-overlay";this.startParams={translateX:-100,opacity:0};this.endParams={translateX:0,opacity:65};BX.Bitrix24.SlidingPanel.apply(this,arguments);t=t||{};this.ajaxPath=BX.type.isNotEmptyString(t.ajaxPath)?t.ajaxPath:null;this.siteId=BX.type.isNotEmptyString(t.siteId)?t.siteId:BX.message("SITE_ID");this.menu=BX("menu-all-groups-link");this.leftMenu=BX("menu-items-block");this.content=BX("group-panel-content");this.items=BX("group-panel-items");this.counter=BX("group-panel-header-filter-counter");var i=this.items.getElementsByClassName("group-panel-item-intranet");var e=this.items.getElementsByClassName("group-panel-item-extranet");if(i.length<=20&&e.length<=20){BX.addClass(this.container,"group-panel-window-one-column")}this.closeLink=BX("group-panel-close-link");this.filters=[].slice.call(this.content.getElementsByClassName("group-panel-header-filter"));for(var n=0;n<this.filters.length;n++){var s=this.filters[n];BX.bind(s,"click",BX.proxy(this.onFilterClick,this))}BX.bind(this.items,"click",this.onItemsClick.bind(this));BX.bind(this.closeLink,"click",this.close.bind(this));BX.bind(this.menu,"click",this.onMenuClick.bind(this));var a=function(){this.close(true)}.bind(this);BX.addCustomEvent("BX.Bitrix24.Map:onBeforeOpen",a);BX.addCustomEvent("BX.Bitrix24.LeftMenuClass:onDragStart",a);BX.addCustomEvent("BX.Bitrix24.LeftMenuClass:onMenuToggle",a)};BX.Bitrix24.GroupPanel.prototype=Object.create(BX.Bitrix24.SlidingPanel.prototype);BX.Bitrix24.GroupPanel.prototype.constructor=BX.Bitrix24.GroupPanel;BX.Bitrix24.GroupPanel.prototype.super=BX.Bitrix24.SlidingPanel.prototype;BX.Bitrix24.GroupPanel.prototype.setContent=function(){this.container.appendChild(this.content)};BX.Bitrix24.GroupPanel.prototype.animateStep=function(t){this.container.style.transform="translateX("+t.translateX+"%)";this.overlay.style.backgroundColor="rgba(0, 0, 0, "+t.opacity/100+")"};BX.Bitrix24.GroupPanel.prototype.open=function(){BX.onCustomEvent("BX.Bitrix24.GroupPanel:onBeforeOpen",[this]);if(window.pulse_loading&&window.pulse_loading.open){window.pulse_loading.close(true)}this.container.style.display="block";BX.addClass(this.menu.parentNode,"menu-item-block-hover");this.menu.innerHTML=BX.message("menu_hide");var t=BX.pos(this.leftMenu);this.overlay.style.left=t.right+"px";this.super.open.apply(this,arguments);BX.onCustomEvent("BX.Bitrix24.GroupPanel:onOpen",[this])};BX.Bitrix24.GroupPanel.prototype.close=function(){BX.onCustomEvent("BX.Bitrix24.GroupPanel:onBeforeClose",[this]);this.menu.innerHTML=BX.message("menu_show");this.super.close.apply(this,arguments);BX.onCustomEvent("BX.Bitrix24.GroupPanel:onClose",[this])};BX.Bitrix24.GroupPanel.prototype.onTrasitionEnd=function(){this.super.onTrasitionEnd.apply(this,arguments);if(!this.isOpen){this.leftMenu.style.removeProperty("z-index");BX.removeClass(this.menu.parentNode,"menu-item-block-hover")}};BX.Bitrix24.GroupPanel.prototype.onMenuClick=function(t){if(this.isOpen){this.close()}else{this.open()}t.stopPropagation()};BX.Bitrix24.GroupPanel.prototype.onFilterClick=function(t){var i=BX.type.isDomNode(BX.proxy_context)?BX.proxy_context:null;var e=this.content.dataset.filter?this.content.dataset.filter:"all";var n=i.dataset.filter?i.dataset.filter:"all";if(e!==n){this.content.dataset.filter=n;this.saveFilter(n);new BX.easing({duration:50,start:{opacity:1},finish:{opacity:0},transition:BX.easing.transitions.linear,step:BX.delegate(function(t){this.items.style.opacity=t.opacity/100},this),complete:BX.delegate(function(){BX.removeClass(this.content,"group-panel-content-"+e);BX.addClass(this.content,"group-panel-content-"+n);new BX.easing({duration:50,start:{opacity:0},finish:{opacity:1},transition:BX.easing.transitions.linear,step:BX.delegate(function(t){this.items.style.opacity=t.opacity/100},this),complete:BX.delegate(function(){this.items.style.cssText=""},this)}).animate()},this)}).animate()}t.stopPropagation()};BX.Bitrix24.GroupPanel.prototype.onItemsClick=function(t){if(!BX.hasClass(t.target,"group-panel-item-star")){return}var i=t.target;var e=i.parentNode;var n=e.dataset.id;var s=BX.hasClass(e,"group-panel-item-favorite")?"removeFromFavorites":"addToFavorites";BX.toggleClass(e,"group-panel-item-favorite");this.animateStart(i);this.animateCounter(s==="addToFavorites");BX.ajax.runAction("intranet.leftmenu."+s,{data:{groupId:n}});t.preventDefault()};BX.Bitrix24.GroupPanel.prototype.animateStart=function(t){var i=t.cloneNode();i.style.marginLeft="-"+t.offsetWidth+"px";t.parentNode.appendChild(i);new BX.easing({duration:200,start:{opacity:100,scale:100},finish:{opacity:0,scale:300},transition:BX.easing.transitions.linear,step:function(t){i.style.transform="scale("+t.scale/100+")";i.style.opacity=t.opacity/100},complete:function(){i.parentNode.removeChild(i)}}).animate()};BX.Bitrix24.GroupPanel.prototype.animateCounter=function(t){this.counter.innerHTML=t===false?"-1":"+1";new BX.easing({duration:400,start:{opacity:100,top:0},finish:{opacity:0,top:-20},transition:BX.easing.transitions.linear,step:function(t){this.counter.style.top=t.top+"px";this.counter.style.opacity=t.opacity/100}.bind(this),complete:function(){this.counter.style.cssText=""}.bind(this)}).animate()};BX.Bitrix24.GroupPanel.prototype.saveFilter=function(t){if(!this.ajaxPath||!BX.type.isNotEmptyString(t)){return}BX.ajax.runAction("intranet.leftmenu.setGroupFilter",{data:{filter:t}})};BX.Bitrix24.Map=function(t){this.containerClassName="sitemap-window";this.overlayClassName="sitemap-window-overlay";this.startParams={translateY:-100,opacity:0};this.endParams={translateY:0,opacity:65};BX.Bitrix24.SlidingPanel.apply(this,arguments);this.menu=BX("sitemap-menu");this.content=BX("sitemap-content");this.closeLink=BX("sitemap-close-link");BX.bind(this.menu,"click",this.onMenuClick.bind(this));BX.bind(this.closeLink,"click",this.close.bind(this))};BX.Bitrix24.Map.prototype=Object.create(BX.Bitrix24.SlidingPanel.prototype);BX.Bitrix24.Map.prototype.constructor=BX.Bitrix24.Map;BX.Bitrix24.Map.prototype.super=BX.Bitrix24.SlidingPanel.prototype;BX.Bitrix24.Map.prototype.setContent=function(){this.container.appendChild(this.content)};BX.Bitrix24.Map.prototype.animateStep=function(t){this.container.style.transform="translateY("+t.translateY+"%)";this.overlay.style.backgroundColor="rgba(0, 0, 0, "+t.opacity/100+")"};BX.Bitrix24.Map.prototype.open=function(){BX.onCustomEvent("BX.Bitrix24.Map:onBeforeOpen",[this]);this.menu.classList.add("sitemap-menu-open");this.super.open.apply(this,arguments)};BX.Bitrix24.Map.prototype.close=function(){this.menu.classList.remove("sitemap-menu-open");this.super.close.apply(this,arguments)};BX.Bitrix24.Map.prototype.onMenuClick=function(t){if(this.isOpen){this.close()}else{this.open()}t.stopPropagation()};
/* End */
;
; /* Start:"a:4:{s:4:"full";s:95:"/bitrix/templates/bitrix24/components/bitrix/im.messenger/.default/script.min.js?17127228574138";s:6:"source";s:76:"/bitrix/templates/bitrix24/components/bitrix/im.messenger/.default/script.js";s:3:"min";s:80:"/bitrix/templates/bitrix24/components/bitrix/im.messenger/.default/script.min.js";s:3:"map";s:80:"/bitrix/templates/bitrix24/components/bitrix/im.messenger/.default/script.map.js";}"*/
BX.namespace("BX.Intranet.Bitrix24.ImBar");(function(){var e=0;var n=null;var t=false;var i=false;var r=20;let a=false;function o(t=false){a=t;var i=u();if(i){var r=BX.getClass("BX.admin.panel.state");if(r&&r.fixed){e=f()}BX.addCustomEvent("onTopPanelCollapse",function(){n=null;if(BX.admin.panel.isFixed()){e=f()}d()}.bind(this));BX.addCustomEvent("onTopPanelFix",function(n){if(n){e=f()}else{e=0}d()}.bind(this));d()}BX.bind(window,"scroll",s);BX.bind(window,"resize",s);s();BX.bind(BX("bx-im-bar-notify"),"click",(function(){BX.Messenger.Public.openNotifications()}));BX.bind(BX("bx-im-bar-search"),"click",(function(){BX.Messenger.Public.openRecentSearch()}));BX.bind(BX("bx-im-bar-ol"),"click",(function(){BX.Messenger.Public.openLines()}));BX.bind(BX("bx-im-btn-call"),"click",(function(e){if(typeof BXIM=="undefined")return false;BXIM.webrtc.openKeyPad(e)}));BX.bind(window,"scroll",(function(){if(typeof BXIM=="undefined"||!BXIM.messenger.popupPopupMenu)return true;if(BX.util.in_array(BXIM.messenger.popupPopupMenu.uniquePopupId.replace("bx-messenger-popup-",""),["createChat","contactList"])){BXIM.messenger.popupPopupMenu.close()}}));BX.bindDelegate(BX("bx-im-external-recent-list"),"contextmenu",{className:"bx-messenger-cl-item"},(function(e){if(typeof BXIM=="undefined")return false;BXIM.messenger.openPopupMenu(this,"contactList",false);return BX.PreventDefault(e)}));BX.bindDelegate(BX("bx-im-external-recent-list"),"click",{className:"bx-messenger-cl-item"},(function(e){if(typeof BXIM=="undefined")return false;BXIM.openMessenger(this.getAttribute("data-userId"));return BX.PreventDefault(e)}));BX.addCustomEvent("onMessengerWindowBodyOverflow",(function(e,n){var t=BX.findChildrenByClassName(BX("im-workarea-popup"),"bx-im-fullscreen-popup-td",true);for(var i=0;i<t.length;i++){var r=getComputedStyle(t[i],null);r=r?parseInt(r.getPropertyValue("padding-left").toString().replace("px","")):85;t[i].style.paddingRight=r+n+"px"}document.body.style.paddingRight=n+"px";BX("bx-im-bar").style.right=n+"px"}));BX.addCustomEvent("onImUpdateCounterNotify",(function(e){var n=BX.findChildByClassName(BX("bx-im-bar-notify"),"bx-im-informer-num");if(!n)return false;if(e>0){n.innerHTML='<div class="bx-im-informer-num-digit">'+(e>99?"99+":e)+"</div>"}else{n.innerHTML=""}}));BX.addCustomEvent("onImUpdateCounterLines",(function(e,n){var t=null;if(n==="LINES"){t=BX("bx-im-bar-ol")}else{return false}var i=t&&BX.findChildByClassName(t,"bx-im-informer-num");if(!i)return false;if(e>0){i.innerHTML='<div class="bx-im-informer-num-digit">'+(e>99?"99+":e)+"</div>"}else{i.innerHTML=""}}));BX.bind(BX("im-workarea-backgound-selector"),"change",(function(){BX("im-workarea-backgound-selector-title").innerHTML=this.options[this.selectedIndex].text}));BX.addCustomEvent("onMessengerWindowInit",(function(){BX("im-workarea-backgound-selector-title").innerHTML=BX("im-workarea-backgound-selector").options[BX("im-workarea-backgound-selector").selectedIndex].text}));BX.addCustomEvent("onImInit",(function(e){e.notify.panelButtonCall=BX("bx-im-btn-call");e.notify.panelButtonCallAnlgePosition="bottom";e.notify.panelButtonCallAnlgeOffset=131;BX.MessengerCommon.recentListRedraw()}))}function s(){var n=l();if(!n||n.dataset.lockRedraw==="true"){return}d();var a=document.documentElement.scrollWidth-document.documentElement.clientWidth;if(a>0){if(!t){BX.addClass(n,"bx-im-bar-transparent");t=true}}else{if(t){BX.removeClass(n,"bx-im-bar-transparent");t=false}}var o=r;if(e===0&&u()){o+=f()}if(window.pageYOffset>o){if(!i){BX.addClass(n,"bx-im-bar-scroll-mode");i=true}}else{if(i){BX.removeClass(n,"bx-im-bar-scroll-mode");i=false}}}function l(){return BX("bx-im-bar")}function u(){return BX("bx-panel")}function d(){var n=u();var t=l();if(!n||!t){return}var i=n.getBoundingClientRect();if(i.bottom>0){t.style.top=Math.max(i.bottom,e)+"px"}else{t.style.top=Math.max(0,e)+"px"}}function f(){if(n!==null){return n}var e=u();if(e){n=e.offsetHeight}else{n=0}return n}function c(){BX.MessengerWindow.closePopup()}BX.Intranet.Bitrix24.ImBar.init=o;BX.Intranet.Bitrix24.ImBar.redraw=s;window.bxFullscreenClose=c})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:84:"/bitrix/components/bitrix/ui.toolbar/templates/.default/script.min.js?17127225376985";s:6:"source";s:65:"/bitrix/components/bitrix/ui.toolbar/templates/.default/script.js";s:3:"min";s:69:"/bitrix/components/bitrix/ui.toolbar/templates/.default/script.min.js";s:3:"map";s:69:"/bitrix/components/bitrix/ui.toolbar/templates/.default/script.map.js";}"*/
(function(){"use strict";BX.namespace("BX.UI");BX.UI.ToolbarManager={toolbars:{},create:function(t){var e=new BX.UI.Toolbar(t);if(this.get(e.getId())){throw new Error("The toolbar instance with the same 'id' already exists.")}this.toolbars[e.getId()]=e;return e},getDefaultToolbar:function(){return this.get("default-toolbar")},get:function(t){return t in this.toolbars?this.toolbars[t]:null}};BX.UI.Toolbar=function(t){t=BX.type.isPlainObject(t)?t:{};this.titleMinWidth=BX.type.isNumber(t.titleMinWidth)?t.titleMinWidth:158;this.titleMaxWidth=BX.type.isNumber(t.titleMaxWidth)?t.titleMaxWidth:"";this.filterMinWidth=BX.type.isNumber(t.filterMinWidth)?t.filterMinWidth:300;this.filterMaxWidth=BX.type.isNumber(t.filterMaxWidth)?t.filterMaxWidth:748;this.id=BX.Type.isStringFilled(t.id)?t.id:BX.Text.getRandom();this.toolbarContainer=t.target;if(!BX.Type.isDomNode(this.toolbarContainer)){throw new Error('BX.UI.Toolbar: "target" parameter is required.')}this.titleContainer=this.toolbarContainer.querySelector(".ui-toolbar-title-box");this.filterContainer=this.toolbarContainer.querySelector(".ui-toolbar-filter-box");this.filterButtons=this.toolbarContainer.querySelector(".ui-toolbar-filter-buttons");this.rightButtons=this.toolbarContainer.querySelector(".ui-toolbar-right-buttons");this.afterTitleButtons=this.toolbarContainer.querySelector(".ui-toolbar-after-title-buttons");if(!this.filterContainer){this.filterMinWidth=0;this.filterMaxWidth=0}this.buttons=Object.create(null);this.buttonIds=BX.Type.isArray(t.buttonIds)?t.buttonIds:[];if(!this.buttonIds.length){return}this.buttonIds.forEach(function(t){var e=BX.UI.ButtonManager.createByUniqId(t);if(e){e.getContainer().originalWidth=e.getContainer().offsetWidth;if(!e.getIcon()&&!BX.Type.isStringFilled(e.getDataSet()["toolbarCollapsedIcon"])){if(e.getColor()===BX.UI.ButtonColor.PRIMARY){e.setDataSet({toolbarCollapsedIcon:BX.UI.ButtonIcon.ADD})}else{console.warn('BX.UI.Toolbar: the button "'+e.getText()+'" '+"doesn't have an icon for collapsed mode. "+'Use the "data-toolbar-collapsed-icon" attribute.')}}this.buttons[t]=e}else{console.warn('BX.UI.Toolbar: the button "'+t+"\" wasn't initialized.")}},this);this.windowWidth=document.body.offsetWidth;this.reduceItemsWidth();window.addEventListener("resize",function(){if(this.isWindowIncreased()){this.increaseItemsWidth()}else{this.reduceItemsWidth()}}.bind(this))};BX.UI.Toolbar.prototype={getButtons:function(){return this.buttons},getButton:function(t){return t in this.buttons?this.buttons[t]:null},getId:function(){return this.id},isWindowIncreased:function(){var t=this.windowWidth;var e=document.body.offsetWidth;this.windowWidth=e;return e>t},getContainerSize:function(){return this.toolbarContainer.offsetWidth},getInnerTotalWidth:function(){return this.toolbarContainer.scrollWidth},reduceItemsWidth:function(){if(this.getInnerTotalWidth()<=this.getContainerSize()){return}var t=Object.values(this.getButtons());for(var e=t.length-1;e>=0;e--){var i=t[e];if(!i.getIcon()&&!BX.Type.isStringFilled(i.getDataSet()["toolbarCollapsedIcon"])){continue}if(i.isCollapsed()){continue}i.setCollapsed(true);if(!i.getIcon()){i.setIcon(i.getDataSet()["toolbarCollapsedIcon"])}if(this.getInnerTotalWidth()<=this.getContainerSize()){return}}},increaseItemsWidth:function(){var t=Object.values(this.getButtons());for(var e=0;e<t.length;e++){var i=t[e];var o=i.getContainer();if(!i.isCollapsed()){continue}var n=this.titleMinWidth+this.filterMinWidth+(this.afterTitleButtons?this.afterTitleButtons.offsetWidth:0)+(this.filterButtons?this.filterButtons.offsetWidth:0)+(this.rightButtons?this.rightButtons.offsetWidth:0)+(o.originalWidth-o.offsetWidth);if(n>this.getContainerSize()){break}i.setCollapsed(false);if(i.getIcon()===i.getDataSet()["toolbarCollapsedIcon"]){i.setIcon(null)}}}};BX.UI.Toolbar.Star=function(){this.initialized=false;this.currentPageInMenu=false;this.starContNode=null;BX.ready(function(){this.init()}.bind(this));BX.addCustomEvent("onFrameDataProcessed",function(){this.init()}.bind(this))};BX.UI.Toolbar.Star.prototype={init:function(){this.starContNode=document.getElementById("uiToolbarStar");if(!this.starContNode){return false}if(this.initialized){return false}this.initialized=true;var t=this.starContNode.getAttribute("data-bx-url");if(!BX.type.isNotEmptyString(t)){t=document.location.pathname+document.location.search}t=BX.Uri.removeParam(t,["IFRAME","IFRAME_TYPE"]);top.BX.addCustomEvent("BX.Bitrix24.LeftMenuClass:onSendMenuItemData",function(t){this.processMenuItemData(t)}.bind(this));top.BX.addCustomEvent("BX.Bitrix24.LeftMenuClass:onStandardItemChangedSuccess",function(t){this.onStandardItemChangedSuccess(t)}.bind(this));top.BX.onCustomEvent("UI.Toolbar:onRequestMenuItemData",[{currentFullPath:t,context:window}]);return true},processMenuItemData:function(t){if(t.context&&t.context!==window){return}this.currentPageInMenu=t.currentPageInMenu;if(BX.type.isNotEmptyObject(t.currentPageInMenu)){BX.addClass(this.starContNode,"ui-toolbar-star-active")}this.starContNode.title=BX.message(this.starContNode.classList.contains("ui-toolbar-star-active")?"UI_TOOLBAR_DELETE_PAGE_FROM_LEFT_MENU":"UI_TOOLBAR_ADD_PAGE_TO_LEFT_MENU");if(BX.type.isDomNode(this.currentPageInMenu)&&this.currentPageInMenu.getAttribute("data-type")!=="standard"){this.starContNode.title=BX.message("UI_TOOLBAR_STAR_TITLE_DEFAULT_PAGE");BX.bind(this.starContNode,"click",function(){this.showMessage(BX.message("UI_TOOLBAR_STAR_TITLE_DEFAULT_PAGE_DELETE_ERROR"))}.bind(this));return true}BX.bind(this.starContNode,"click",function(){var t=document.getElementById("pagetitle").innerText;var e=this.starContNode.getAttribute("data-bx-title-template");if(BX.type.isNotEmptyString(e)){t=e.replace(/#page_title#/i,t)}var i=this.starContNode.getAttribute("data-bx-url");if(!BX.type.isNotEmptyString(i)){i=document.location.pathname+document.location.search}i=BX.Uri.removeParam(i,["IFRAME","IFRAME_TYPE"]);top.BX.onCustomEvent("UI.Toolbar:onStarClick",[{isActive:BX.hasClass(this.starContNode,"ui-toolbar-star-active"),context:window,pageTitle:t,pageLink:i}])}.bind(this))},onStandardItemChangedSuccess:function(t){if(!BX.type.isBoolean(t.isActive)||!this.starContNode){return}if(t.context&&t.context!==window){return}if(t.isActive){this.showMessage(BX.message("UI_TOOLBAR_ITEM_WAS_ADDED_TO_LEFT"));this.starContNode.title=BX.message("UI_TOOLBAR_DELETE_PAGE_FROM_LEFT_MENU");BX.addClass(this.starContNode,"ui-toolbar-star-active")}else{this.showMessage(BX.message("UI_TOOLBAR_ITEM_WAS_DELETED_FROM_LEFT"));this.starContNode.title=BX.message("UI_TOOLBAR_ADD_PAGE_TO_LEFT_MENU");BX.removeClass(this.starContNode,"ui-toolbar-star-active")}},showMessage:function(t){var e=BX.PopupWindowManager.create("left-menu-message",this.starContNode,{content:t,darkMode:true,offsetTop:2,offsetLeft:0,angle:true,events:{onPopupClose:function(){if(e){e.destroy();e=null}}},autoHide:true});e.show();setTimeout(function(){if(e){e.destroy();e=null}},3e3)}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:95:"/bitrix/components/bitrix/intranet.notify.panel/templates/.default/script.min.js?17127224528950";s:6:"source";s:76:"/bitrix/components/bitrix/intranet.notify.panel/templates/.default/script.js";s:3:"min";s:80:"/bitrix/components/bitrix/intranet.notify.panel/templates/.default/script.min.js";s:3:"map";s:80:"/bitrix/components/bitrix/intranet.notify.panel/templates/.default/script.map.js";}"*/
this.BX=this.BX||{};(function(t,e,n,i,r,a){"use strict";var s,o;function l(t,e){u(t,e);e.add(t)}function c(t,e,n){u(t,e);e.set(t,n)}function u(t,e){if(e.has(t)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}function p(t,e,n){if(!e.has(t)){throw new TypeError("attempted to get private field on non-instance")}return n}var f=new WeakMap;var b=new WeakSet;var h=new WeakSet;var v=new WeakSet;var T=new WeakSet;var O=new WeakSet;var N=new WeakSet;var d=new WeakSet;var m=new WeakSet;var I=function(){function t(e){babelHelpers.classCallCheck(this,t);l(this,m);l(this,d);l(this,N);l(this,O);l(this,T);l(this,v);l(this,h);l(this,b);c(this,f,{writable:true,value:new r.Cache.MemoryCache});this.setOptions(e)}babelHelpers.createClass(t,[{key:"setOptions",value:function t(e){babelHelpers.classPrivateFieldGet(this,f).set("options",e)}},{key:"getOptions",value:function t(){return babelHelpers.classPrivateFieldGet(this,f).get("options",null)}},{key:"show",value:function t(){p(this,b,g).call(this).show()}},{key:"close",value:function t(){p(this,b,g).call(this).close()}}]);return t}();function g(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("popup",(function(){return new e.Popup({className:"bitrix24-notify-popup",width:800,padding:0,content:p(t,h,E).call(t),contentBackground:"transparent",overlay:true,closeIcon:true,titleBar:false,buttons:p(t,O,y).call(t),events:{onShow:function e(){r.ajax.runComponentAction(it.componentName,"setLicenseNotifyConfig",{mode:"class",data:{type:t.getOptions().type}})}}})}))}function E(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("popup-content",(function(){return r.Tag.render(s||(s=babelHelpers.taggedTemplateLiteral(['\n\t\t\t\t<div class="bitrix24-notify-popup-inner">\n\t\t\t\t\t<div class="bitrix24-notify-popup-title">\n\t\t\t\t\t\t','\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="bitrix24-notify-popup-block">\n\t\t\t\t\t\t',"\n\t\t\t\t\t</div>\n\t\t\t\t\t","\n\t\t\t\t</div>\n\t\t\t"])),t.getOptions().isExpired?r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_TITLE_EXPIRED",{"#DAY_MONTH#":p(t,v,_).call(t)}):r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_TITLE",{"#DAY_MONTH#":p(t,v,_).call(t)}),t.getOptions().isExpired?r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_EXPIRED_DESCRIPTION_1",{"#DAY_MONTH#":p(t,v,_).call(t)}):r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_DESCRIPTION_1"),t.getOptions().isPortalWithPartner?p(t,T,w).call(t):null)}))}function _(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("date",(function(){var e=a.DateTimeFormat.getFormat("DAY_MONTH_FORMAT");if(t.getOptions().isExpired){return a.DateTimeFormat.format(e,Number(t.getOptions().blockDate))}return a.DateTimeFormat.format(e,Number(t.getOptions().expireDate))}))}function w(){return babelHelpers.classPrivateFieldGet(this,f).remember("description-partner",(function(){return r.Tag.render(o||(o=babelHelpers.taggedTemplateLiteral(['\n\t\t\t\t<div class="bitrix24-notify-popup-block">\n\t\t\t\t\t',"\n\t\t\t\t</div>\n\t\t\t"])),r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_DESCRIPTION_2"))}))}function y(){return[p(this,d,P).call(this),this.getOptions().isAdmin?p(this,N,C).call(this):null,p(this,m,F).call(this)]}function C(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("partner-button",(function(){if(!t.getOptions().isPortalWithPartner){return null}return new n.Button({color:n.Button.Color.LIGHT_BORDER,text:r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_BUTTON_PARTNER"),round:true,onclick:function e(){window.open(t.getOptions().urlBuyWithPartner,"_self")}})}))}function P(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("renewal-button",(function(){return new n.Button({color:n.Button.Color.SUCCESS,text:r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_BUTTON_RENEW_LICENSE"),round:true,onclick:function e(){window.open(t.getOptions().urlDefaultBuy,"_blank")}})}))}function F(){var t=this;return babelHelpers.classPrivateFieldGet(this,f).remember("more-button",(function(){return new n.Button({color:n.Button.Color.LIGHT_BORDER,text:r.Loc.getMessage("INTRANET_NOTIFY_PANEL_LICENSE_NOTIFICATION_BUTTON_MORE"),round:true,onclick:function e(){window.open(t.getOptions().urlArticle,"_blank")}})}))}var k;function A(t,e){H(t,e);e.add(t)}function L(t,e,n){H(t,e);e.set(t,n)}function H(t,e){if(e.has(t)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}function S(t,e,n){D(t,e);x(n,"get");return B(t,n)}function x(t,e){if(t===undefined){throw new TypeError("attempted to "+e+" private static field before its declaration")}}function D(t,e){if(t!==e){throw new TypeError("Private static access of wrong provenance")}}function B(t,e){if(e.get){return e.get.call(t)}return e.value}function M(t,e,n){if(!e.has(t)){throw new TypeError("attempted to get private field on non-instance")}return n}var R=new WeakMap;var W=new WeakSet;var G=new WeakSet;var j=new WeakSet;var Y=new WeakSet;var X=new WeakSet;var U=function(){function t(e){babelHelpers.classCallCheck(this,t);A(this,X);A(this,Y);A(this,j);A(this,G);A(this,W);L(this,R,{writable:true,value:new r.Cache.MemoryCache});this.setOptions(e)}babelHelpers.createClass(t,[{key:"setOptions",value:function t(e){babelHelpers.classPrivateFieldGet(this,R).set("options",e)}},{key:"getOptions",value:function t(){return babelHelpers.classPrivateFieldGet(this,R).get("options",null)}},{key:"show",value:function t(){var e=document.querySelector(".bx-layout-table");if(e){r.Dom.insertBefore(M(this,G,K).call(this),e)}}},{key:"close",value:function e(){if(r.Dom.hasClass(M(this,G,K).call(this),S(t,t,V))){r.Dom.removeClass(M(this,G,K).call(this),S(t,t,V))}}}]);return t}();function z(){return this.getOptions().params}function K(){var t=this;var e=function e(){t.close()};return babelHelpers.classPrivateFieldGet(this,R).remember("panel-template",(function(){return r.Tag.render(k||(k=babelHelpers.taggedTemplateLiteral(['\n\t\t\t\t<div class="bx24-tariff-notify bx24-tariff-notify-show bx24-tariff-notify-panel">\n\t\t\t\t\t<div class="bx24-tariff-notify-wrap ','">\n\t\t\t\t\t\t<span class="bx24-tariff-notify-text">\n\t\t\t\t\t\t ','\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span onclick="','" class="bx24-tariff-notify-text-reload">\n\t\t\t\t\t\t\t<span class="bx24-tariff-notify-text-reload-title">\n\t\t\t\t\t\t\t\tx\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t'])),M(t,j,q).call(t),M(t,Y,J).call(t),e)}))}function q(){return this.getOptions().color&&this.getOptions().color==="blue"?"bx24-tariff-notify-blue":"bx24-tariff-notify-red"}function J(){if(this.getOptions().type==="license-expired"){return r.Loc.getMessage("INTRANET_NOTIFY_PANEL_FOOTER_LICENSE_NOTIFICATION_TEXT",{"#BLOCK_DATE#":M(this,X,Q).call(this),"#LINK_BUY#":M(this,W,z).call(this).urlBuy,"#ARTICLE_LINK#":M(this,W,z).call(this).urlArticle})}}function Q(){var t=a.DateTimeFormat.getFormat("DAY_MONTH_FORMAT");return a.DateTimeFormat.format(t,Number(this.getOptions().params.blockDate))}var V={writable:true,value:"bx24-tariff-notify-show"};function Z(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function $(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?Z(Object(n),!0).forEach((function(e){babelHelpers.defineProperty(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function tt(t,e,n){et(t,e);e.set(t,n)}function et(t,e){if(e.has(t)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}var nt=new WeakMap;var it=function(){function t(e){babelHelpers.classCallCheck(this,t);tt(this,nt,{writable:true,value:new r.Cache.MemoryCache});this.setOptions(e)}babelHelpers.createClass(t,[{key:"setOptions",value:function t(e){babelHelpers.classPrivateFieldGet(this,nt).set("options",e)}},{key:"getOptions",value:function t(){return babelHelpers.classPrivateFieldGet(this,nt).get("options",null)}},{key:"getLicenseNotificationPopup",value:function t(e){var n=this;return babelHelpers.classPrivateFieldGet(this,nt).remember("License-notification-popup",(function(){return new I($({isAdmin:n.getOptions().isAdmin},e))}))}},{key:"getNotifyPanel",value:function t(e){return babelHelpers.classPrivateFieldGet(this,nt).remember("notify-panel",(function(){return new U(e)}))}}]);return t}();babelHelpers.defineProperty(it,"componentName","bitrix:intranet.notify.panel");t.NotifyManager=it})(this.BX.Intranet=this.BX.Intranet||{},BX.Main,BX.UI,BX,BX,BX.Main);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:54:"/bitrix/templates/bitrix24/bitrix24.js?171272285834131";s:6:"source";s:38:"/bitrix/templates/bitrix24/bitrix24.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/

/*Global Settings */
(function() {

	var iframeMode = window !== window.top;
	var search = window.location.search;
	var sliderMode = search.indexOf("IFRAME=") !== -1 || search.indexOf("IFRAME%3D") !== -1;

	if (iframeMode && sliderMode)
	{
		return;
	}
	else if (iframeMode)
	{
		window.top.location = window.location.href;
		return;
	}

	BX.addCustomEvent("onFrameDataRequestFail", function(response) {
		top.location = "/auth/?backurl=" + encodeURIComponent(B24.getBackUrl());
	});

	BX.addCustomEvent("onAjaxFailure", function(status) {
		var redirectUrl = "/auth/?backurl=" + B24.getBackUrl();
		if (status == "auth" && typeof(window.frameRequestStart) !== "undefined")
		{
			top.location = redirectUrl;
		}
	});

	BX.addCustomEvent("onPopupWindowInit", function(uniquePopupId, bindElement, params) {
		//if (BX.util.in_array(uniquePopupId, ["task-legend-popup"]))
		//	params.lightShadow = true;

		if (uniquePopupId == "bx_log_filter_popup")
		{
			params.lightShadow = true;
			params.className = "";
		}
		else if (uniquePopupId == "task-legend-popup")
		{
			params.lightShadow = true;
			params.offsetTop = -15;
			params.offsetLeft = -670;
			params.angle = {offset : 740};
		}
		else if ((uniquePopupId == "task-gantt-filter") || (uniquePopupId == "task-list-filter"))
		{
			params.lightShadow = true;
			params.className = "";
		}
		else if (uniquePopupId.indexOf("sonet_iframe_popup_") > -1)
		{
			params.lightShadow = true;
		}
	});

	BX.addCustomEvent("onJCClockInit", function(config) {

		JCClock.setOptions({
			"centerXInline" : 83,
			"centerX" : 83,
			"centerYInline" : 67,
			"centerY" : 79,
			"minuteLength" : 31,
			"hourLength" : 26,
			"popupHeight" : 229,
			"inaccuracy" : 15,
			"cancelCheckClick" : true
		});
	});

	/*BX.PopupWindow.setOptions({
		"angleMinTop" : 35,
		"angleMinRight" : 10,
		"angleMinBottom" : 35,
		"angleMinLeft" : 10,
		"angleTopOffset" : 5,
		"angleLeftOffset" : 45,
		"offsetLeft" : 0 //-15,
		"offsetTop" : 2,
		"positionTopXOffset" : -11 //20
	});*/

	BX.addCustomEvent("onPullEvent-main", function(command,params){
		if (command == "user_counter" && params[BX.message("SITE_ID")])
		{
			var counters = BX.clone(params[BX.message('SITE_ID')]);
			B24.updateCounters(counters, false);
		}
	});

	BX.addCustomEvent("onPullEvent-tasks", function(command, params){
		if (
			command == "user_counter"
			&& Number(params.userId) === Number(BX.Loc.getMessage('USER_ID'))
		)
		{
			var counters = {};
			if (!BX.Type.isUndefined(params.projects_major))
			{
				counters.projects_major = params.projects_major;
			}
			if (!BX.Type.isUndefined(params.scrum_total_comments))
			{
				counters.scrum_total_comments = params.scrum_total_comments;
			}

			B24.updateCounters(counters, false);
		}
	});

	BX.addCustomEvent("onPullEvent-bitrix24", BX.delegate(function(command,params){
		if (command == "userLimitNotify")
		{
			BX.UI.Notification.Center.notify({
				content: params.message
			});
		}
	}, this));

	if (typeof(window.frameRequestStart) !== "undefined" && BX.PULL)
	{
		BX.PULL.subscribe({
			moduleId: "main",
			command: "composite-cache-up",
			callback: function () {
				setTimeout(function () {
					const value = BX.localStorage.get('ajax-composite-cache-up-lock');
					if (!value)
					{
						BX.localStorage.set('ajax-composite-cache-up-lock', 'EXECUTE', 2);
						BX.ajax({
							url: '/blank.php',
							method: 'GET',
							processData: false,
							skipBxHeader: true,
							emulateOnload: false,
						});
					}
				}, Math.floor(Math.random() * 500));
			}
		});
	}

	BX.addCustomEvent(window, "onImUpdateCounter", function(counters){

		if (!counters)
			return;

		B24.updateCounters(BX.clone(counters), false);
	});

	BX.addCustomEvent("onCounterDecrement", function(iDecrement) {
		B24.decrementCounter(BX("menu-counter-live-feed"), iDecrement)
	});

	BX.addCustomEvent("onImUpdateCounterNotify", function(counter) {
		B24.updateInformer(BX("im-informer-events", true), counter);
	});

	BX.addCustomEvent("onImUpdateCounterMessage", function(counter) {
		B24.updateInformer(BX("im-informer-messages", true), counter);
		B24.updateCounters({'im-message': counter}, false);
	});

	BX.addCustomEvent("onImUpdateCounterNetwork", function(counter) {
		B24.updateInformer(BX("b24network-informer-events", true), counter);
	});

	BX.addCustomEvent("Kanban.Grid:onFixedModeStart", function() {
		BX.ready(function() {
			BX("footer").style.visibility = "hidden";
		});
	});

	BX.addCustomEvent("Intranet.Search.Title:onFocusAction", function(type)
	{
		if (!BX.type.isDomNode(BX("header-buttons")) || !BX("header-buttons").querySelector(".ui-btn"))
		{
			return;
		}

		var timeman = BX('timeman-container');
		var header = BX('header');

		if (!BX.type.isDomNode(timeman) || !BX.type.isDomNode(header))
		{
			return;
		}

		if (type === "gain")
		{
			timeman.style.webkitTransition = 'min-width .2s, width .2s, opacity .1s, padding .2s';
			header.style.width = header.offsetWidth + 'px';
			if (document.body.offsetWidth < 1660) {
				timeman.style.opacity = '0';
				setTimeout(function() {
					BX.addClass(timeman, "timeman-container--hide");
				}.bind(this), 100);
			}
		}
		else if (type === "lost")
		{
			timeman.style.webkitTransition = 'min-width .2s, width .2s, opacity .3s, padding .2s';
			BX.removeClass(timeman, "timeman-container--hide");
			setTimeout(function() {
				timeman.style.opacity = '1';
				header.removeAttribute("style");
			}.bind(this), 300);
		}
	});

//connection status===
	BX.addCustomEvent("onPullError", BX.delegate(function(error, code) {
		if (error == 'AUTHORIZE_ERROR')
		{
			B24.connectionStatus("offline");
		}
		else if (error == 'RECONNECT' && (code == 1008 || code == 1006))
		{
			B24.connectionStatus("connecting");
		}
	}, this));

	BX.addCustomEvent("onImError", BX.delegate(function(error, sendErrorCode) {
		if (error == 'AUTHORIZE_ERROR' || error == 'SEND_ERROR' && sendErrorCode == 'AUTHORIZE_ERROR')
		{
			B24.connectionStatus("offline");
		}
		else if (error == 'CONNECT_ERROR')
		{
			B24.connectionStatus("offline");
		}
	}, this));

	BX.addCustomEvent("onPullStatus", BX.delegate(function(status){
		if (status == 'offline')
			B24.connectionStatus("offline");
		else
			B24.connectionStatus("online");
	}, this));

//==connection status

	if (BX.browser.SupportLocalStorage())
	{
		BX.addCustomEvent(window, 'onLocalStorageSet', function(params)
		{
			if (params.key.substring(0, 4) == 'lmc-')
			{
				var counters = {};
					counters[params.key.substring(4)] = params.value;
				B24.updateCounters(counters, false);
			}
		});
	}

	if (BX.getClass("BX.rest.AppLayout"))
	{
		var placementInterface = BX.rest.AppLayout.initializePlacement("DEFAULT");
		placementInterface.prototype.showHelper = function(params, cb)
		{
			var query = "";
			if (BX.type.isNumber(params))
			{
				query = "redirect=detail&code=" + params;
			}
			else if (BX.type.isNotEmptyString(params))
			{
				query = params;
			}
			else if (BX.type.isPlainObject(params))
			{
				for (var param in params)
				{
					if (query.length)
					{
						query += "&";
					}

					query += param + "=" + params[param];
				}
			}

			if (query.length)
			{
				BX.Helper.show(query);
			}
		};
	}

	BX.ready(function () {
		BX.bind(window, "scroll", BX.throttle(B24.onScroll, 150, B24));
	});
})();

var B24 = {

	b24ConnectionStatusState: "online",
	b24ConnectionStatus: null,
	b24ConnectionStatusText: null,
	b24ConnectionStatusTimeout: null,

	formateDate : function(time){
		return BX.util.str_pad(time.getHours(), 2, '0', 'left') + ':' + BX.util.str_pad(time.getMinutes(), 2, '0', 'left');
	},

	openLanguagePopup: function(button)
	{
		if (!BX.type.isDomNode(BX("b24LangPopupContent")))
			return;

		BX.PopupWindowManager.create('b24LangPopup', button, {
			content: BX("b24LangPopupContent"),
			closeIcon: false,
			autoHide: true,
			closeByEsc: true,
			angle: {offset: 50}
		}).show();
	},

	changeLanguage: function(lang)
	{
		window.location.href = "/auth/?user_lang=" + lang + "&backurl=" + B24.getBackUrl();
	},

	getBackUrl: function()
	{
		var backUrl = window.location.pathname;
		var query = B24.getQueryString(["logout", "login", "back_url_pub", "user_lang"]);
		return backUrl + (query.length > 0 ? "?" + query : "");
	},

	getQueryString : function(ignoredParams)
	{
		var query = window.location.search.substring(1);
		if (!BX.type.isNotEmptyString(query))
		{
			return "";
		}

		var vars = query.split("&");
		ignoredParams = BX.type.isArray(ignoredParams) ? ignoredParams : [];

		var result = "";
		for (var i = 0; i < vars.length; i++)
		{
			var pair = vars[i].split("=");
			var equal = vars[i].indexOf("=");
			var key = pair[0];
			var value = BX.type.isNotEmptyString(pair[1]) ? pair[1] : false;
			if (!BX.util.in_array(key, ignoredParams))
			{
				if (result !== "")
				{
					result += "&";
				}
				result += key + (equal !== -1 ? "=" : "") + (value !== false ? value : "" );
			}
		}

		return result;
	},

	updateInformer : function(informer, counter)
	{
		if (!informer)
			return false;

		if (counter > 0)
		{
			informer.innerHTML = counter;
			BX.addClass(informer, "header-informer-act");
		}
		else
		{
			informer.innerHTML = "";
			BX.removeClass(informer, "header-informer-act");
		}
	},

	updateCounters : function(counters, send)
	{
		BX.ready(function ()
		{
			if (BX.getClass("BX.Intranet.LeftMenu"))
			{
				BX.Intranet.LeftMenu.updateCounters(counters, send);
			}
		});
	},

	decrementCounter : function(node, iDecrement)
	{
		BX.ready(function ()
		{
			if (BX.getClass("BX.Intranet.LeftMenu"))
			{
				BX.Intranet.LeftMenu.decrementCounter(node, iDecrement);
			}
		});
	},

	showNotifyPopup : function(button)
	{
		if (BX.hasClass(button, "header-informer-press"))
		{
			BX.removeClass(button, "header-informer-press");
			BXIM.closeNotify();
		}
		else
		{
			BXIM.openNotify();
		}
	},

	showMessagePopup : function(button)
	{
		if (typeof(BXIM) == 'undefined')
			return false;

		BXIM.toggleMessenger();
	},

	closeBanner : function(bannerId)
	{
		BX.userOptions.save('bitrix24', 'banners',  bannerId, 'Y');
		var banner = BX("sidebar-banner-" + bannerId);
		if (banner)
		{
			banner.style.minHeight = "auto";
			banner.style.overflow = "hidden";
			banner.style.border = "none";
			(new BX.easing({
				duration : 500,
				start : { height : banner.offsetHeight, opacity : 100 },
				finish : { height : 0, opacity: 0 },
				transition : BX.easing.makeEaseOut(BX.easing.transitions.quart),
				step : function(state){
					if (state.height >= 0)
					{
						banner.style.height = state.height + "px";
						banner.style.opacity = state.opacity/100;
					}

					if (state.height <= 17)
					{
						banner.style.marginBottom = state.height + "px";
					}
				},
				complete : function() {
					banner.style.display = "none";
				}
			})).animate();
		}
	},

	showLoading: function(timeout)
	{
		timeout = timeout || 500;
		function show()
		{
			var loader = BX("b24-loader");
			if (loader)
			{
				BX.addClass(loader, "b24-loader-show intranet-loader-show");
				return true;
			}

			return false;
		}

		setTimeout(function() {
			if (!show() && !BX.isReady)
			{
				BX.ready(show);
			}
		}, timeout);
	}
};

/***************** UP button **********************/
B24.onScroll = function()
{
	var windowScroll = BX.GetWindowScrollPos();
	if (B24.b24ConnectionStatus)
	{
		if (B24.b24ConnectionStatus.getAttribute('data-float') == 'true')
		{
			if (windowScroll.scrollTop < 60)
			{
				BX.removeClass(B24.b24ConnectionStatus, 'bx24-connection-status-float');
				B24.b24ConnectionStatus.setAttribute('data-float', 'false');
			}
		}
		else
		{
			if (windowScroll.scrollTop > 60)
			{
				BX.addClass(B24.b24ConnectionStatus, 'bx24-connection-status-float');
				B24.b24ConnectionStatus.setAttribute('data-float', 'true');
			}
		}
	}
};

B24.goUp = function(fn)
{
	var windowScroll = BX.GetWindowScrollPos();

	(new BX.easing({
		duration : 500,
		start : { scroll : windowScroll.scrollTop },
		finish : { scroll : 0 },
		transition : BX.easing.makeEaseOut(BX.easing.transitions.quart),
		step : function(state){
			window.scrollTo(0, state.scroll);
		},
		complete: function() {
			BX.onCustomEvent(window, 'onGoUp');

			if (BX.type.isFunction(fn))
			{
				fn();
			}

		}
	})).animate();
};

/***************** Left Menu ************************/
B24.toggleMenu = function(menuItem, messageShow, messageHide)
{
	var menuBlock = BX.findChild(menuItem.parentNode, {tagName:'ul'}, false, false);

	var menuItems = BX.findChildren(menuBlock, {tagName : "li"}, false);
	if (!menuItems)
		return;

	var toggleText = BX.findChild(menuItem, {className:"menu-toggle-text"}, true, false);
	if (!toggleText)
		return;

	if (BX.hasClass(menuBlock, "menu-items-close"))
	{
		menuBlock.style.height = "0px";
		BX.removeClass(menuBlock, "menu-items-close");
		BX.removeClass(BX.nextSibling(BX.nextSibling(menuItem)), "menu-items-close");
		menuBlock.style.opacity = 0;
		animation(true, menuBlock, menuBlock.scrollHeight);

		toggleText.innerHTML = messageHide;
		BX.userOptions.save("bitrix24", menuItem.id, "hide", "N");
	}
	else
	{
		animation(false, menuBlock, menuBlock.offsetHeight);
		toggleText.innerHTML = messageShow;
		BX.userOptions.save("bitrix24", menuItem.id, "hide", "Y");
	}

	function animation(opening, menuBlock, maxHeight)
	{
		menuBlock.style.overflow = "hidden";
		(new BX.easing({
			duration : 200,
			start : { opacity: opening ? 0 : 100, height: opening ? 0 : maxHeight },
			finish : { opacity: opening ? 100 : 0, height: opening ? maxHeight : 0 },
			transition : BX.easing.transitions.linear,
			step : function(state)
			{
				menuBlock.style.opacity = state.opacity/100;
				menuBlock.style.height = state.height + "px";

			},
			complete : function()
			{
				if (!opening)
				{
					BX.addClass(menuBlock, "menu-items-close");
					BX.addClass(BX.nextSibling(BX.nextSibling(menuItem)), "menu-items-close");
				}
				menuBlock.style.cssText = "";
			}

		})).animate();
	}
};

B24.licenseInfoPopup = {
	show: function(popupId, title, content, showDemoButton)
	{
		if (BX.getClass("BX.Bitrix24.LicenseInfoPopup"))
		{
			BX.Bitrix24.LicenseInfoPopup.show(popupId, title, content, showDemoButton);
		}
	}
};

function showPartnerForm(arParams)
{
	BX = window.BX;
	BX.Bitrix24PartnerForm =
	{
		bInit: false,
		popup: null,
		arParams: {}
	};
	BX.Bitrix24PartnerForm.arParams = arParams;
	BX.message(arParams['MESS']);
	BX.Bitrix24PartnerForm.popup = BX.PopupWindowManager.create("BXPartner", null, {
		className: 'bitrix24-partner__popup',
		autoHide: false,
		zIndex: 0,
		offsetLeft: 0,
		offsetTop: 0,
		width: 540,
		height: 350,
		overlay : true,
		draggable: {restrict:true},
		closeByEsc: true,
		titleBar: BX.message('BX24_PARTNER_TITLE'),
		closeIcon: { right : "12px", top : "10px"},
		buttons: [
			new BX.PopupWindowButton({
				text: BX.message('BX24_BUTTON_SEND'),
				className: "ui-btn ui-btn-success",
				events: { click : function()
				{
					this.popupWindow.close();
					BX.UI.Feedback.Form.open({
						id: 'intranet-license-partner-form-' + parseInt(Math.random() * 1000),
						portalUri: 'https://bitrix24.team',
						forms: [
							{ zones: ['de'], id: 883, lang: 'de', sec: 'a12ty8', },
							{ zones: ['com', 'in', 'eu', 'uk'], id: 735, lang: 'en', sec: 'vlhmlv'},
							{ zones: ['es', 'co', 'mx'], id: 900, lang: 'es', sec: 'w3qmwq'},
							{ zones: ['com.br'], id: 901, lang: 'pt', sec: 'prnm4x', },
							{ zones: ['cn/tc'], id: 902, lang: 'cn-tc', sec: 'z8isyg', },
							{ zones: ['cn'], id: 903, lang: 'cn-sc', sec: 'hsxnam', },
							{ zones: ['pl'], id: 904, lang: 'pl', sec: '2ph9ph', },
							{ zones: ['it'], id: 905, lang: 'it', sec: '2r3owa', },
							{ zones: ['fr'], id: 906, lang: 'fr', sec: 'jt2fii' },
							{ zones: ['com.tr'], id: 907, lang: 'tr', sec: 'ovevp8' },
							{ zones: ['id'], id: 908, lang: 'id', sec: '7kq7v2' },
							{ zones: ['com/my'], id: 909, lang: 'ms', sec: 'kmncmj' },
							{ zones: ['com/th'], id: 910, lang: 'th', sec: 'sknbp9' },
							{ zones: ['vn'], id: 911, lang: 'vn', sec: 'a573fy' },
							{ zones: ['jp'], id: 912, lang: 'jp', sec: '3purdq' },
							{ zones: ['ru'], id: 2122, lang: 'ru', sec: '8vralr' },
							{ zones: ['kz'], id: 2128, lang: 'ru', sec: '054phh' },
							{ zones: ['by'], id: 2129, lang: 'ru', sec: 'srs85j' },
						],
						defaultForm: { id: 735, lang: 'en', sec: 'vlhmlv' },
					});
				}}
			})
		],
		events: {
			onPopupFirstShow: function()
			{
				var loader = new BX.Loader({ size: 80 });
				loader.show(this.getPopupContainer());
				BX.ajax.post(
					'/bitrix/tools/b24_site_partner.php',
					{
						lang: BX.message('LANGUAGE_ID'),
						site_id: BX.message('SITE_ID') || '',
						arParams: BX.Bitrix24PartnerForm.arParams
					},
					BX.delegate(function(result)
						{
							loader.hide();
							this.setContent(result);
						},
						this)
				);
			}
		}
	});

	BX.Bitrix24PartnerForm.popup.show();
}

/****************** Timemanager *********************/
B24.Timemanager = {

	inited : false,

	layout : {
		block : null,
		timer : null,
		info : null,
		event : null,
		tasks : null,
		status : null
	},

	data : null,
	timer : null,
	clock : null,

	formatTime : function(ts, bSec)
	{
		return BX.util.str_pad(parseInt(ts/3600), 2, '0', 'left')+':'+BX.util.str_pad(parseInt(ts%3600/60), 2, '0', 'left')+(!!bSec ? (':'+BX.util.str_pad(ts%60, 2, '0', 'left')) : '');
	},

	formatWorkTime : function(h, m, s)
	{
		return '<span class="tm-popup-notice-time-hours"><span class="tm-popup-notice-time-number">' + h + '</span></span><span class="tm-popup-notice-time-minutes"><span class="tm-popup-notice-time-number">' + BX.util.str_pad(m, 2, '0', 'left') + '</span></span><span class="tm-popup-notice-time-seconds"><span class="tm-popup-notice-time-number">' + BX.util.str_pad(s, 2, '0', 'left') + '</span></span>';
	},

	formatCurrentTime : function(hours, minutes, seconds)
	{
		var mt = "";
		if (BX.isAmPmMode())
		{
			mt = "AM";
			if (hours > 12)
			{
				hours = hours - 12;
				mt = "PM";
			}
			else if (hours == 0)
			{
				hours = 12;
				mt = "AM";
			}
			else if (hours == 12)
			{
				mt = "PM";
			}

			mt = '<span class="time-am-pm">' + mt + '</span>';
		}
		else
			hours = BX.util.str_pad(hours, 2, "0", "left");

		return '<span class="time-hours">' + hours + '</span>' +
			'<span class="time-semicolon">:</span>' +
			'<span class="time-minutes">' + BX.util.str_pad(minutes, 2, "0", "left") + '</span>' +
			mt;
	},

	init : function(reportJson)
	{
		BX.addCustomEvent("onTimeManDataRecieved", BX.proxy(this.onDataRecieved, this));
		BX.addCustomEvent("onTimeManNeedRebuild", BX.proxy(this.onDataRecieved, this));
		BX.addCustomEvent("onPlannerDataRecieved", BX.proxy(this.onPlannerDataRecieved, this));
		BX.addCustomEvent("onPlannerQueryResult", BX.proxy(this.onPlannerQueryResult, this));
		BX.addCustomEvent("onTaskTimerChange", BX.proxy(this.onTaskTimerChange, this));

		BX.timer.registerFormat("worktime_notice_timeman",BX.proxy(this.formatWorkTime, this));
		BX.timer.registerFormat("bitrix24_time",BX.proxy(this.formatCurrentTime, this));

		BX.addCustomEvent(window, "onTimemanInit", BX.proxy(function() {

			this.inited = true;

			this.layout.block = BX("timeman-block");
			this.layout.timer = BX("timeman-timer");
			this.layout.info = BX("timeman-info");
			this.layout.event = BX("timeman-event");
			this.layout.tasks = BX("timeman-tasks");
			this.layout.status = BX("timeman-status");
			this.layout.statusBlock = BX("timeman-status-block");
			this.layout.taskTime = BX("timeman-task-time");
			this.layout.taskTimer = BX("timeman-task-timer");

			window.BXTIMEMAN.ShowFormWeekly(reportJson);

			BX.bind(this.layout.block, "click", BX.proxy(this.onTimemanClick, this));

			BXTIMEMAN.setBindOptions({
				node: this.layout.block,
				mode: "popup",
				popupOptions: {
					angle : { position : "top", offset : 130},
					offsetTop : 10,
					autoHide : true,
					offsetLeft : -60,
					events : {
						onClose : function() {
							BX.removeClass(this.layout.block, "timeman-block-active");
						}.bind(this),
						onFirstShow: function(event) {
							var popup = event.getTarget();
							BX.Event.EventEmitter.subscribe('BX.Main.InterfaceButtons:onMenuShow', function() {
								popup.close();
							});
						}
					}
				}
			});

			this.redraw();

		}, this));
	},

	onTimemanClick : function()
	{
		BX.addClass(this.layout.block, "timeman-block-active");
		BXTIMEMAN.Open();
	},

	onTaskTimerChange : function(params)
	{
		if (params.action === 'refresh_daemon_event')
		{
			if(!!this.taskTimerSwitch)
			{
				this.layout.taskTime.style.display = '';
				if(this.layout.info.style.display != 'none')
				{
					this.layout.statusBlock.style.display = 'none';
				}
				this.taskTimerSwitch = false;
			}

			var s = '';
			s += this.formatTime(parseInt(params.data.TIMER.RUN_TIME||0) + parseInt(params.data.TASK.TIME_SPENT_IN_LOGS||0), true);

			if(!!params.data.TASK.TIME_ESTIMATE && params.data.TASK.TIME_ESTIMATE > 0)
			{
				s += ' / ' + this.formatTime(parseInt(params.data.TASK.TIME_ESTIMATE));
			}

			this.layout.taskTimer.innerHTML = s;
		}
		else if(params.action === 'start_timer')
		{
			this.taskTimerSwitch = true;
		}
		else if(params.action === 'stop_timer')
		{
			this.layout.taskTime.style.display = 'none';
			this.layout.statusBlock.style.display = '';
		}
	},

	setTimer : function()
	{
		if (this.timer)
		{
			this.timer.setFrom(new Date(this.data.INFO.DATE_START * 1000));
			this.timer.dt = -this.data.INFO.TIME_LEAKS * 1000;
		}
		else
		{
			this.timer = BX.timer(this.layout.timer, {
				from: new Date(this.data.INFO.DATE_START*1000),
				dt: -this.data.INFO.TIME_LEAKS * 1000,
				display: "simple"
			});
		}
	},

	stopTimer : function()
	{
		if (this.timer != null)
		{
			BX.timer.stop(this.timer);
			this.timer = null;
		}
	},

	redraw_planner: function(data)
	{
		if(!!data.TASKS_ENABLED)
		{
			data.TASKS_COUNT = !data.TASKS_COUNT ? 0 : data.TASKS_COUNT;
			this.layout.tasks.innerHTML = data.TASKS_COUNT;
			this.layout.tasks.style.display = data.TASKS_COUNT == 0 ? "none" : "inline-block";
		}

		if(!!data.CALENDAR_ENABLED)
		{
			this.layout.event.innerHTML = data.EVENT_TIME;
			this.layout.event.style.display = data.EVENT_TIME == '' ? 'none' : 'inline-block';
		}

		this.layout.info.style.display =
			(BX.style(this.layout.tasks, "display") == 'none' && BX.style(this.layout.event, "display") == 'none')
				? 'none'
				: 'block';
	},

	redraw : function()
	{
		this.redraw_planner(this.data.PLANNER);

		if (this.data.STATE == "CLOSED" && (this.data.CAN_OPEN == "REOPEN" || !this.data.CAN_OPEN))
			this.layout.status.innerHTML = this.getStatusName("COMPLETED");
		else
			this.layout.status.innerHTML = this.getStatusName(this.data.STATE);

		// if (this.data.STATE == "OPENED")
		// 	this.setTimer();
		// else
		// {
		// 	this.stopTimer();
		// 	var workedTime = (this.data.INFO.DATE_FINISH - this.data.INFO.DATE_START - this.data.INFO.TIME_LEAKS);
		// 	this.layout.timer.innerHTML = BX.timeman.formatTime(workedTime);
		// }
		if (!this.timer)
			this.timer = BX.timer({container: this.layout.timer, display : "bitrix24_time"}); //BX.timer.clock(this.layout.timer);

		var statusClass = "";
		if (this.data.STATE == "CLOSED")
		{
			if (this.data.CAN_OPEN == "REOPEN" || !this.data.CAN_OPEN)
				statusClass = "timeman-completed";
			else
				statusClass = "timeman-start";
		}
		else if (this.data.STATE == "PAUSED")
			statusClass = "timeman-paused";
		else if (this.data.STATE == "EXPIRED")
			statusClass = "timeman-expired";

		BX.removeClass(this.layout.block, "timeman-completed timeman-start timeman-paused timeman-expired");
		BX.addClass(this.layout.block, statusClass);

		if (statusClass == "timeman-start" || statusClass == "timeman-paused")
		{
			this.startAnimation();
		}
		else
		{
			this.endAnimation();
		}
	},

	getStatusName : function(id)
	{
		return BX.message("TM_STATUS_" + id);
	},

	onDataRecieved : function(data)
	{
		data.OPEN_NOW = false;

		this.data = data;

		if (this.inited)
			this.redraw();
	},

	onPlannerQueryResult : function(data, action)
	{
		if (this.inited)
			this.redraw_planner(data);
	},

	onPlannerDataRecieved : function(ob, data)
	{
		if (this.inited)
			this.redraw_planner(data);
	},

	animation : null,
	animationTimeout : 30000,
	blinkAnimation : null,
	blinkLimit : 10,
	blinkTimeout : 750,

	startAnimation : function()
	{
		if (this.animation !== null)
		{
			this.endAnimation();
		}

		this.startBlink();
		this.animation = setInterval(BX.proxy(this.startBlink, this), this.animationTimeout);
	},

	endAnimation : function()
	{
		this.endBlink();

		if (this.animation)
		{
			clearInterval(this.animation);
		}

		this.animation = null;
	},

	startBlink : function()
	{
		if (this.blinkAnimation !== null)
		{
			this.endBlink();
		}

		var counter = 0;
		this.blinkAnimation = setInterval(BX.proxy(function()
		{
			if (++counter >= this.blinkLimit)
			{
				clearInterval(this.blinkAnimation);
				BX.show(BX("timeman-background", true));
			}
			else
			{
				BX.toggle(BX("timeman-background", true));
			}

		}, this), this.blinkTimeout);
	},

	endBlink : function()
	{
		if (this.blinkAnimation)
		{
			clearInterval(this.blinkAnimation);
		}

		BX("timeman-background", true).style.cssText = "";
		this.blinkAnimation = null;
	}
};

/****************** Invite Dialog *******************/
B24.Bitrix24InviteDialog =
{
	bInit: false,
	popup: null,
	arParams: {}
};

B24.Bitrix24InviteDialog.Init = function(arParams)
{
	if(arParams)
		B24.Bitrix24InviteDialog.arParams = arParams;

	if(B24.Bitrix24InviteDialog.bInit)
		return;

	BX.message(arParams['MESS']);

	B24.Bitrix24InviteDialog.bInit = true;

	BX.ready(BX.delegate(function()
	{
		B24.Bitrix24InviteDialog.popup = BX.PopupWindowManager.create("B24InviteDialog", null, {
			autoHide: false,
			zIndex: 0,
			offsetLeft: 0,
			offsetTop: 0,
			overlay:true,
			draggable: {restrict:true},
			closeByEsc: true,
			titleBar: BX.message('BX24_INVITE_TITLE_INVITE'),
			contentColor: "white",
			contentNoPaddings: true,
			closeIcon: { right : "12px", top : "10px"},
			buttons: [
			],
			className: 'bx-b24-invite-dialog-popup',
			content: '<div style="width:500px;height:300px; background: url(/bitrix/templates/bitrix24/images/loader.gif) no-repeat center;"></div>',
			events: {
				onAfterPopupShow: function()
				{
					B24.Bitrix24InviteDialog.loadForm();
				},
				onPopupClose: function()
				{
					BX.InviteDialog.onInviteDialogClose();
				}
			}
		});
	}, this));
};

B24.Bitrix24InviteDialog.ShowForm = function(arParams)
{
	B24.Bitrix24InviteDialog.Init(arParams);
	B24.Bitrix24InviteDialog.popup.show();
};

B24.Bitrix24InviteDialog.loadForm = function()
{
	B24.Bitrix24InviteDialog.popup.setContent('<div style="width:500px;height:300px; background: url(/bitrix/templates/bitrix24/images/loader.gif) no-repeat center;"></div>');
	BX.ajax.post(
		'/bitrix/tools/intranet_invite_dialog.php',
		{
			lang: BX.message('LANGUAGE_ID'),
			site_id: BX.message('SITE_ID') || '',
			arParams: B24.Bitrix24InviteDialog.arParams
		},
		BX.delegate(function(result)
			{
				B24.Bitrix24InviteDialog.popup.setContent(result);
				B24.Bitrix24InviteDialog.popup.adjustPosition();
			},
			this)
	);
};

B24.Bitrix24InviteDialog.ReInvite = function(reinvite_user_id)
{
	BX.ajax.post(
		'/bitrix/tools/intranet_invite_dialog.php',
		{
			lang: BX.message('LANGUAGE_ID'),
			site_id: BX.message('SITE_ID') || '',
			reinvite: reinvite_user_id,
			sessid: BX.bitrix_sessid()
		},
		BX.delegate(function(result)
			{
			},
			this)
	);
};

B24.connectionStatus = function(status)
{
	if (!(status == 'online' || status == 'connecting' || status == 'offline'))
		return false;

	if (this.b24ConnectionStatusState == status)
		return false;

	this.b24ConnectionStatusState = status;

	var statusClass = '';

	if (status == 'offline')
	{
		b24ConnectionStatusStateText = BX.message('BITRIX24_CS_OFFLINE');
		statusClass = 'bx24-connection-status-offline';
	}
	else if (status == 'connecting')
	{
		b24ConnectionStatusStateText = BX.message('BITRIX24_CS_CONNECTING');
		statusClass = 'bx24-connection-status-connecting';
	}
	else if (status == 'online')
	{
		b24ConnectionStatusStateText = BX.message('BITRIX24_CS_ONLINE');
		statusClass = 'bx24-connection-status-online';
	}

	clearTimeout(this.b24ConnectionStatusTimeout);

	var connectionPopup = document.querySelector('[data-role="b24-connection-status"]');
	if (!connectionPopup)
	{
		var windowScroll = BX.GetWindowScrollPos();
		var isFloat = windowScroll.scrollTop > 60;

		this.b24ConnectionStatus = BX.create("div", {
			attrs : {
				className : "bx24-connection-status "+(this.b24ConnectionStatusState == 'online'? "bx24-connection-status-hide": "bx24-connection-status-show bx24-connection-status-"+this.b24ConnectionStatusState)+(isFloat? " bx24-connection-status-float": ""),
				"data-role" : "b24-connection-status",
				"data-float" : isFloat? "true": "false"
			},
			children : [
				BX.create("div", { props : { className : "bx24-connection-status-wrap" }, children : [
					this.b24ConnectionStatusText = BX.create("span", { props : { className : "bx24-connection-status-text"}, html: b24ConnectionStatusStateText}),
					BX.create("span", { props : { className : "bx24-connection-status-text-reload"}, children : [
						BX.create("span", { props : { className : "bx24-connection-status-text-reload-title"}, html: BX.message('BITRIX24_CS_RELOAD')}),
						BX.create("span", { props : { className : "bx24-connection-status-text-reload-hotkey"}, html: (BX.browser.IsMac()? "&#8984;+R": "Ctrl+R")})
					], events: {
						'click': function(){ location.reload() }
					}})
				]})
			]
		});
	}
	else
	{
		this.b24ConnectionStatus = connectionPopup;
	}

	if (!this.b24ConnectionStatus)
		return false;

	if (status == 'online')
	{
		clearTimeout(this.b24ConnectionStatusTimeout);
		this.b24ConnectionStatusTimeout = setTimeout(BX.delegate(function(){
			BX.removeClass(this.b24ConnectionStatus, "bx24-connection-status-show");
			this.b24ConnectionStatusTimeout = setTimeout(BX.delegate(function(){
				BX.removeClass(this.b24ConnectionStatus, "bx24-connection-status-hide");
			}, this), 1000);
		}, this), 4000);
	}

	this.b24ConnectionStatus.className = "bx24-connection-status bx24-connection-status-show "+statusClass+" "+(this.b24ConnectionStatus.getAttribute('data-float') == 'true'? 'bx24-connection-status-float': '');
	this.b24ConnectionStatusText.innerHTML = b24ConnectionStatusStateText;

	if (!connectionPopup)
	{
		var nextNode = BX.findChild(document.body, {className: "bx-layout-inner-table"}, true, false);
		nextNode.parentNode.insertBefore(this.b24ConnectionStatus, nextNode);
	}

	return true;
};

B24.showPartnerOrderForm = function (params)
{
	if (typeof params !== "object")
		return;

	BX.PopupWindowManager.create("B24PartnerOrderForm", null, {
		autoHide: true,
		zIndex: 0,
		offsetLeft: 0,
		offsetTop: 0,
		overlay: true,
		height: Math.min(document.documentElement.clientHeight - 100, 740),
		width: 560,
		draggable: {restrict:true},
		closeByEsc: true,
		contentColor: "white",
		contentNoPaddings: true,
		content:
			'<script data-b24-form="inline/'+params.id+'/'+params.sec+'" data-skip-moving="true">'+
				'(function(w,d,u){'+
					'var s=d.createElement("script");s.async=true;s.src=u+"?"+(Date.now()/180000|0);'+
					'var h=d.getElementsByTagName("script")[0];h.parentNode.insertBefore(s,h);'+
				'})(window,document,"https://bitrix24.team/upload/crm/form/loader_${params.id}_${params.sec}.js");'+
			'</script>',
		events: {
			onPopupFirstShow: function()
			{
				(function(w,d,u){
					var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
					var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
				})(window,document,'https://bitrix24.team/upload/crm/form/loader_'+params.id+'_'+params.sec+'.js')
			}
		}
	}).show();
};

B24.upgradeButtonRedirect = function(params)
{
	if (typeof params !== "object")
		return;

	var url = params.COUNTER_URL || "",
		licensePath = params.LICENSE_PATH || "",
		host = params.HOST || "";

	BX.ajax.post(
		url,
		{
			action: "upgradeButton",
			host: host
		},
		BX.proxy(function(){
			document.location.href = licensePath;
		}, this)
	);
}

B24.PopupBlur = function() {
	BX.PopupWindow.apply(this, arguments);
	this.setBlurBg();

	BX.Event.EventEmitter.subscribe("BX.Intranet.Bitrix24:ThemePicker:onThemeApply", this.setBlurBg.bind(this));
}

B24.PopupBlur.prototype = {
	__proto__: BX.PopupWindow.prototype,
	constructor: B24.PopupBlur,
	setBlurBg: function()
	{
		var container = this.getPopupContainer();
		var backgroundImage = window.getComputedStyle(document.body).backgroundImage;
		var backgroundColor = window.getComputedStyle(document.body).backgroundColor;

		if (BX.Type.isDomNode(container))
		{
			container.classList.add('popup-window-blur');
		}

		var style = BX.create('style', {
			attrs: {
				type: 'text/css'
			}
		});

		var styles = '.popup-window-content:after { ' + 'background-image: ' + backgroundImage + ';' + 'background-color: ' + backgroundColor + '} ';

		styles = document.createTextNode(styles);
		style.appendChild(styles);
		document.head.appendChild(style);

		if (this.angle) {
			this.setBlurBgAngle();
		}
	},
	setBlurBgAngle: function() {
		var backgroundColor = window.getComputedStyle(document.body).backgroundColor;

		var anglyStyle = BX.create('style', {
			attrs: {
				type: 'text/css'
			}
		});

		var anglyStyles = '.popup-window-angly:after { ' + 'background-color: ' + backgroundColor + '} ';

		anglyStyles = document.createTextNode(anglyStyles);
		anglyStyle.appendChild(anglyStyles);
		document.head.appendChild(anglyStyle);
	},
	setPadding: function(padding)
	{
		if (BX.Type.isNumber(padding) && padding >= 0)
		{
			this.padding = padding;
			this.getContentContainer().style.padding = padding + 'px';
		}
		else if (padding === null)
		{
			this.padding = null;
			this.getContentContainer().style.removeProperty('padding');
		}
	}
};
/* End */
;; /* /bitrix/components/bitrix/tasks.iframe.popup/templates/.default/logic.min.js?17127225217131*/
; /* /bitrix/components/bitrix/search.title/script.min.js?17127224976443*/
; /* /bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/script.min.js?171272285896620*/
; /* /bitrix/templates/bitrix24/components/bitrix/menu/left_vertical/map.min.js?171272285810918*/
; /* /bitrix/templates/bitrix24/components/bitrix/im.messenger/.default/script.min.js?17127228574138*/
; /* /bitrix/components/bitrix/ui.toolbar/templates/.default/script.min.js?17127225376985*/
; /* /bitrix/components/bitrix/intranet.notify.panel/templates/.default/script.min.js?17127224528950*/
; /* /bitrix/templates/bitrix24/bitrix24.js?171272285834131*/

//# sourceMappingURL=template_bf82c621b0cb7e1104325605e0cd8bcb.map.js