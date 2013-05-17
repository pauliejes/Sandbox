var root = '/adl/sandbox';

exports.index = function(req, res){

	res.locals = {root: root, title: ''};
	res.render('index');
}
exports.create = function(req, res){


	res.locals = {root: root, title:''};
	res.render('create');
}
exports.signup = function(req, res){


	res.locals = {root: root, title:''};
	res.render('signup');
}
exports.login = function(req, res){


	res.locals = {root: root, title:''};
	res.render('login');
}
exports.logout = function(req, res){


	res.locals = {root: root, title:''};
	res.render('logout');
}
exports.edit = function(req, res){

	res.locals = { sid: root + '/' + (req.query.id?req.query.id:'') + '/', root: root, title:''};
	res.render('editInstance');
}
exports.remove = function(req, res){


	res.locals = { sid: root + '/' + (req.query.id?req.query.id:'') + '/', root: root, title: 'Warning!'};
	res.render('deleteInstance');
}
exports.user = function(req, res){


	res.locals = { sid: root + '/' + (req.query.id?req.query.id:'') + '/', root: root, title: 'Account'};
	res.render('userManagement');
}