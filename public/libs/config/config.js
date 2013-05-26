/*
 Config 0.9.12 Copyright (c) 2012, The Ramon Barros All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/rbarros/Config for details
*/
(function(){
	define(function(){
		return Config={
			version:"1.0",
			system: "intranet",
			dirname:window.location.protocol+'//'+window.location.host+window.location.pathname,
			client:{},
			settings:{},
			xmlhttp:{},
			restfulUrl:"",
			api:{},
			errors:{},
			html:{},
			loadSettigns:function(f){
				this.loadJson(this.dirname+f,function(settings){
					Config.settings = settings;
				});
			},
			loadJson:function(f,c){
				var $return;
				try{
					if(f) {
						var json = Config.loadRestfulData(f);
				       if(typeof c =='function'){
				       		c(json);
				       }else{ return $return = json; }
					}else{
						throw '[Config.loadJson] Você deve informar a url';
					}
				}catch(e){
					alert(e);
				}
			},
			loadCss:function(d,f,a){
				try{
					if(d && f){
						var json = Config.loadRestfulData(this.dirname+d+'/'+f+'.json');
						Config.loadObject(json,a);
					}else{
						throw '[Config.loadCss] Você deve informar a url';
					}
				}catch(e){}
			},
			loadScript:function(j,a) {
			   try{
					if(j){
						//var json = Config.loadRestfulData(this.dirname+d+'/'+f+'.json');
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
						var json = Config.loadRestfulData(this.dirname+d+'/'+f+'.json');
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
							this.CSS(this.dirname+a+'/'+o[i]);
						}else if(js.test(o[i]) === true){
							this.JS(this.dirname+a+'/'+o[i]);
						}else{
							this.HTML(i,o[i]);
						}
					}
				}
			},
			fileExists:function(f,t){
				var $return;
		        Config.ajax({
		        	method:'GET',
		            url: f,
		            dataType: t,
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
		    	Config.settings=s;
		    	try{
		    		if(typeof Config.settings == 'object'){
		    			Config._xmlhttprequest();
		    			Config.xmlhttp.open(Config.settings.method,Config.settings.url,Config.settings.async);
		    			if(Config.settings.data){
		    				Config.xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    				Config.xmlhttp.send(JSON.stringify(Config.settings.data));
		    			}else{
		    				Config.xmlhttp.send();
		    			}		    			
		    			Config.settings.success(Config.settings.result);
		    		}else{
		    			throw '[Config,ajax] Você deve passar um objeto.';
		    		}
		    		if(!Config.settings.url){
		    			throw '[Config.ajax] Você deve informar a url.';
		    		}
		    	}catch(e){ 
		    		if(typeof Config.settings.error == 'function'){
		    			Config.settings.error(e);
		    		}else{
		    			Config.settings.error = function(e){
		    				alert(e);
		    			}
		    			Config.settings.error(e);
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
						if(Config.settings.dataType=='json'){
							if(Config.xmlhttp.responseText){
								Config.settings.result = eval('(' + Config.xmlhttp.responseText + ')');
							}else{
								Config.settings.result =  Config.xmlhttp.responseText;
							}
						}else{
							Config.settings.result = Config.xmlhttp.responseText;
						}
					}
				}
		 	}
		}
	});
})();