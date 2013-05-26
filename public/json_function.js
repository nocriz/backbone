/*
	{
		"run":"{'run': 'function() { console.log(\\'running...\\');$.ajax({type:\\'GET\\',url:\\'http://localhost/\\'}); }'}"
	}
 */
var func = Config.loadJson('config/functions.json');
for(i in func){
  var json = eval('('+func[i]+')');
  eval('var '+i+'='+json[i]+';');
}

var r = {
	"ir":"run"
};
var action = 'ir';
eval(r[action]+'()');