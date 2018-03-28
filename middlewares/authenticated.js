'use strinct'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_secreta';
const dd = require('dump-die')

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization) {
		return res.status(403).send({message: 'La peticion no tiene permisos'})
	}
	else{
		var token = req.headers.authorization.replace(/['"]+/g, '');
		try{
			var payload = jwt.decode(token, secret);
			if(payload.exp <= moment().unix() ){
				return res.status(401).send({message: 'El token ha expirado'})
			}
		}catch(ex){
			//console.log(ex);
			return res.status(403).send({message: 'El token no es valido'})
		}
		req.user = payload;
		next();
	}
};