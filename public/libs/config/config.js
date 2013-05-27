/*
 Config 2.0 Copyright (c) 2012, The Ramon Barros All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/rbarros/Config for details
*/
(function(){
	define(['underscore',
			'text!templates/errors/message.html'
		   ],function(_,errorsTemplate){
		return Config={
			version:"2.0",
			system: {},
			language:[],
			baseurl:window.location.protocol+'//'+window.location.host+window.location.pathname,
			client:{},
			_ajax:{},
			settings:{},
			xmlhttp:{},
			restfulUrl: "../src/",
			api:{},
			errors:{},
			html:{},
			loadConfig:function(d,c){
				var load = this.loadJson(this.baseurl+d+'/load.json');
				if(typeof load =='object')
				{
					Config.api = load;
					Config.settings = this.loadJson(this.baseurl+d+'/config.json');
					Config.system = Config.settings.system.type || "Type system not found!";
					var lang = Config.settings.system.language || "pt";
					Config.language.push({"default":lang});
				}else{
					this.loadJson(this.baseurl+d+'/config.json',function(cf){
						Config.settings = cf;
						Config.system = Config.settings.system.type || "Type system not found!";
						for(x in cf){
							Config.system = cf[x].type;
							var lang = cf[x].language || "pt";
							Config.language.push({"default":lang});
							var url = cf[x].restfulUrl || Config.restfulUrl;
							var key = cf[x].publickey;
							var email = cf[x].email;
							Config.api = Config.loadRestfulData(url+'/'+key+'/'+email);
							
							Config.ajax({
					        	method:'POST',
					            url: 'json.php?load=true',
					            dataType: 'json',
					            data:Config.api,
					            success: function(data) {
					               $return = data;
					            },
					            error:function(error){
					            	$return = error;
					            }
					        });
						}					
					});
				}
			},
			loadJson:function(f,c){
				var $return;
				try{
					var load = this.fileExists(f,'json');
					if(typeof(load) !=='undefined'){
						if(f) {
							var json = load;//Config.loadRestfulData(f);
					       if(typeof c =='function'){
					       		c(json);
					       }else{ return $return = json; }
						}else{
							throw '[Config.loadJson] Você deve informar a url';
						}
					}else{
						throw '[Config.loadJson] Arquivo ['+f+'] não encontrado.';
					}
				}catch(e){
					console.warn(e);
				}
			},
			loadCss:function(d,f,a){
				try{
					if(d && f){
						var json = Config.loadRestfulData(this.baseurl+d+'/'+f+'.json');
						Config.loadObject(json,a);
					}else{
						throw '[Config.loadCss] Você deve informar a url';
					}
				}catch(e){}
			},
			loadScript:function(j,a) {
			   try{
					if(j){
						//var json = Config.loadRestfulData(this.baseurl+d+'/'+f+'.json');
						//Config.loadObject(json,a);
						Config.loadObject(j,a);
					}else{
						throw '[Config.loadCss] Você deve informar a url';
					}
				}catch(e){}
			},
			loadTag:function(d,f){
				try{
					if(d && f){
						var json = Config.loadRestfulData(this.baseurl+d+'/'+f+'.json');
						Config.loadObject(json);
					}else{
						throw '[Config.loadTag] Você deve informar a url';
					}
				}catch(e){}
			},
			loadObject:function(o,a,t){
				var css=/(.*).css/;
				var js=/(.*).js/;
				var meta=/meta/;
				for(i in o){
					if(typeof o[i] == 'object'){
						if(meta.test(i) === true){
							this.META(o[i]);
						}else{
							this.loadObject(o[i]);
						}
					}else if(typeof o[i] == 'string'){
						if(css.test(o[i]) === true) {
							this.CSS(this.baseurl+a+'/'+o[i]);
						}else if(js.test(o[i]) === true){
							this.JS(this.baseurl+a+'/'+o[i]);
						}else{
							this.HTML(i,o[i]);
						}
					}
				}
			},
			loadTranslate:function(){
				var lang = Config.language[0].default;
				var pagination = this.loadJson(this.baseurl+'language/'+lang+'/pagination.json');
				var validation = this.loadJson(this.baseurl+'language/'+lang+'/validation.json');
				if(typeof(pagination)!=='undefined'){
					Config.language.push(pagination);
				}
				if(typeof(validation)!=='undefined'){
					Config.language.push(validation);
				}
			},
			translate:function(key,l){
				var l = l || 0;
				var translate=null;
				if(Config.language.length<=1 && l==0){
					this.loadTranslate();
					this.translate(key,1);
				}
				console.info(Config.language);
				for(x in Config.language){
					console.info(Config.language[x].hasOwnProperty(key));
					console.info(key);
					if(Config.language[x].hasOwnProperty(key)){
						translate = Config.language[x][key];
					}
				}
				if(translate){
					return translate;
				}else{
					return "Tradução não encontrada.";
				}
			},
			loadCache:function(page){
				var $return;
		        Config.ajax({
		        	method:'GET',
		            url: 'json.php?cache='+page,
		            dataType: 'json',
		            success: function(data) {
		               $return = data;
		            },
		            error:function(error){
		            	$return = error;
		            }
		        });
		        return $return;
			},
			saveCache:function(page){
				var $return;
				var html = document.getElementsByTagName('body')[0].innerHTML;
				console.info(html);
		      	Config.ajax({
			        method:'POST',
			          url: 'json.php?cache=true&page='+page,
			          dataType: '',
			          data:{html:html,hash:sha256(html)},
			          success: function(data) {
			             $return = data;
			          },
			          error:function(error){
			            $return = error;
			          }
		      	});
		        return $return;
			},
			loadFunction:function(router){
				var func = this.loadJson(this.baseurl+'/config/functions.json');
			    for(i in func){
			      var json = eval('('+func[i]+')');
			      eval('var f='+json[i]+';');
			      router.on('route:'+i,f);
			    }
			},
			fileExists:function(f,t){
				var $return;
		        Config.ajax({
		        	method:'GET',
		            url: f,
		            dataType: t,
		            data:'',
		            success: function(d) {
		               $return = d;
		            },
		            error:function(e){
		            	$return = e;
		            }
		        });
		        return $return;
			},
			JS:function(f){
				var s= document.createElement('script');
				s.type= 'text/javascript';
				s.src= f;
				s.async = true;
				this.head(s);
			},
			CSS:function(f){
				var l = document.createElement("link");
				l.type = "text/css";
				l.rel = "stylesheet";
				l.href = f;
				this.head(l,"prepend");
			},
			META:function(o){
				for(atr in o){ var m = document.createElement('meta'); 
					for(x in o[atr]){
						m.setAttribute(x,o[atr][x]);
					}
					this.head(m,"prepend");
				} 
			},
			HTML:function(tag,text){
				var t = document.createElement(tag);
				t.appendChild(document.createTextNode(text));
				this.head(t,"prepend");
			},
			head:function(c,t){
				switch(t){
					case "prepend":
						var head = document.getElementsByTagName("head")[0];
						head.insertBefore(c, head.firstChild);						
					case "append": 
					default:
						document.getElementsByTagName("head")[0].appendChild(c);
					break;
				}
			},
			loadRestfulData: function(pageUrl) {
		        var $return;
		        Config.ajax({
		        	method:'GET',
		            url: pageUrl,
		            dataType: 'json',
		            data:'',
		            success: function(data) {
		               $return = data;
		            },
		            error:function(error){
		            	$return = error;
		            }
		        });
		        return $return;
		    },
		    ajax:function(s){
		    	Config._ajax=s;
		    	try{
		    		if(typeof Config._ajax == 'object'){
		    			Config._xmlhttprequest();
		    			Config.xmlhttp.open(Config._ajax.method,Config._ajax.url,Config._ajax.async);
		    			if(Config._ajax.data){
		    				Config.xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    				Config.xmlhttp.send(JSON.stringify(Config._ajax.data));
		    			}else{
		    				Config.xmlhttp.send();
		    			}		    			
		    			Config._ajax.success(Config._ajax.result);
		    		}else{
		    			throw '[Config,_ajax] Você deve passar um objeto.';
		    		}
		    		if(!Config._ajax.url){
		    			throw '[Config._ajax] Você deve informar a url.';
		    		}
		    	}catch(e){ 
		    		if(typeof Config._ajax.error == 'function'){
		    			Config._ajax.error(e);
		    		}else{
		    			Config._ajax.error = function(e){
		    				alert(e);
		    			}
		    			Config._ajax.error(e);
		    		} 
		    	}
		    },
		    _xmlhttprequest:function(){
		 		if (window.XMLHttpRequest)
				{
					// IE7+, Firefox, Chrome, Opera, Safari
					Config.xmlhttp = new XMLHttpRequest();
				}else{
					//IE6, IE5
					Config.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				Config.xmlhttp.onreadystatechange=function()
				{
					if (Config.xmlhttp.readyState==4 && Config.xmlhttp.status==200){
						if(Config._ajax.dataType=='json'){
							if(Config.xmlhttp.responseText){
								Config._ajax.result = eval('(' + Config.xmlhttp.responseText + ')');
							}else{
								Config._ajax.result =  Config.xmlhttp.responseText;
							}
						}else{
							Config._ajax.result = Config.xmlhttp.responseText;
						}
					}
				}
		 	},         
            
            /*
             * COOKIE HELPERS
             */
        	getCookie: function(c_name) {
            	var i, x, y, ARRcookies = document.cookie.split(";");
                
                for (i = 0; i < ARRcookies.length; i++) {
        	        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        	        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        	        x = x.replace(/^\s+|\s+$/g,"");
        	        if (x === c_name) {
        	        	return unescape(y);
        	        };
                };
        	},
            
        	setCookie: function(c_name, value, day) {
        		var exdate = new Date();
        		var day = day || 1;
                exdate.setHours(exdate.getHours() + day);
                var c_value = escape(value) + "; expires=" + exdate.toUTCString();
                document.cookie=c_name + "=" + c_value;
             },
              

            /*
             * ERRORS and ALERT HANDLING
             */ 
             
        	// Default alert when there is a validation error
        	displayValidationErrors: function (messages) {
                for (var key in messages) {
                    if (messages.hasOwnProperty(key)) {
                        this.addValidationError(key,messages[key]);
                    }
                }
            },
            addValidationError: function (field, message) {
                this.showAlert(field,'Atenção',message,'red');
            },
            removeValidationError: function (field) {
                //$("#"+field).remove();
            },            
        	// Show alert classes and hide after specified timeout
            showAlert: function(field,title, text, color) {
				var data ={
				  id:field,
		          title: title,
		          msg: text,
		          color: color,
		          _: _
		        }
		        var error = _.template(errorsTemplate,data);
		        $('.content').prepend(error);
		        $('.message ').fadeIn();
		        setTimeout(function() {
                	$('.message ').fadeOut();
                	$('.message ').remove();
                }, 2000 );
            },            
            jsonResponse: function(code){
            	jsonCodes = [],
            	jsonCodes[400] = 'Unrecognized command',
            	jsonCodes[401] = 'Permission denied',
            	jsonCodes[402] = 'Missing argument',
            	jsonCodes[401] = 'Incorrect password',
            	jsonCodes[404] = 'Account not found',
            	jsonCodes[405] = 'Email not validated',
            	jsonCodes[408] = 'Token expired',
            	jsonCodes[411] = 'Insufficient privileges',
            	jsonCodes[500] = 'Internal server error';
            	return jsonCodes[code];
            }
		}
	});
})();