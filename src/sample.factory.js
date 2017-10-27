angular.module("sample.mod",["jarom.asmx"])
.factory("ItemsApi",function(asmx){
	return {
		getRoles:function(){
			return asmx.get("/Roles",{_user_id:null});
		},
		//just for testing
		processResponse: asmx.processResponse,
	};
})