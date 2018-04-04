'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
 var mongoose = require('mongoose');
var Artist = require('../models/artist');
var User = require('../models/user');
var Album = require('../models/album');
var Song = require('../models/song');
const dd = require('dump-die');

function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate('artist').exec((err, album) =>{
		if(err){
			res.status(500).send({message: err});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}
			else{
				res.status(200).send({album});
			}
		}
	});
}
function getAlbums(req, res){
	var artistId = req.params.artist;
	if(!artistId){
		//Sacar todos los albums
		var find = Album.find({}).sort('title');
	}
	else{
		var find = Album.find({artist: artistId}).sort('year');		
	}
	find.populate('artist').exec((err, albums) =>{
		if(err){
			res.status(500).send({message: err});
		}else{
			if(!albums){
			res.status(404).send({message: 'El album no existe'});
		}
			else{
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req, res){
	var album = new Album();
	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = mongoose.Types.ObjectId(params.artist);
	album.save((err, albumStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar al album'});	
		}
		else{
			if(!albumStored){
				res.status(404).send({message: 'El album no ha sido guardado'});	
			}
			else{
				res.status(200).send({album: albumStored});	
			}			
		}
		
	});

}


function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{

		if(err){
			res.status(500).send({message: 'Error en la peticion'});	
		}
		else{
			if(!albumUpdated){
				res.status(404).send({message: 'El album no ha sido guardado'});	
			}
			else{
				res.status(200).send({album: albumUpdated});	
			}			
		}
	});
}

function deleteAlbum(req,res){
	var albumId = req.params.id;

	Album.findByIdAndRemove( albumId, (err, albumRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error al eliminar el album'});	
		}
		else{
			if(!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});	
			}
			else{
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
					if(err){
						res.status(500).send({message: 'Error al eliminar el cancion'});	
					}
					else{
						if(!songRemoved){
							res.status(404).send({message: 'El cancion no ha sido eliminado'});	
						}
						else{
							res.status(200).send({albumRemoved});	
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		console.log(file_name);
		console.log(file_ext);

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) =>{
				if(err){
					res.status(404).send({message: 'Error al actualizar el album'});
				}
				else{
					res.status(200).send({album: albumUpdated});
				}
			});
		}
		else{
			res.status(200).send({message: 'Extension del archivo no valida'});
		}
	}else{
		res.status(200).send({message: 'No ha subido ninguna imagen'});
	}

}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_File = './uploads/album/'+imageFile;
	fs.exists(path_File, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_File));
		}
		else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}
module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile

};