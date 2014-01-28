
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DreamFace Generator' });
};

exports.ibmbpm_to_dfcap = function(req, res){
    res.render('ibmbpm_to_dfcap', { title: 'DreamFace Generator' });
};