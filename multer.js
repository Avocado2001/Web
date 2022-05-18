const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads' +file.originalname)
      
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname +'-' + Date.now() + '.jpg')
    }
  })

   
  var upload = multer({ storage: storage })