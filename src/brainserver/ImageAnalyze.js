/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const cv = require('opencv4nodejs');

export default class ImageAnalyse{
    
    static getFileName(absoluteFileName){
        var fileName = absoluteFileName.substring(absoluteFileName.lastIndexOf('/')+1);
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
    
    static findContours(imageFile, callback, agent){
        console.log("traitement of file : "+imageFile);
        var lowThresh = 50;
        var highThresh = 500;
        var red = new cv.Vec3(0, 0, 255);
        var self= this;
        cv.imreadAsync(imageFile, function(err, im){
            if (err) throw err;
            var width = im.cols;
            var height = im.rows;
            if (width < 1 || height < 1) throw new Error('Image has no size');
       
            var screen = im;
            var im_canny = im.copy();
            im_canny = im_canny.bgrToGray();
            im_canny = im_canny.threshold(200, 255, cv.THRESH_BINARY);
            im_canny = im_canny.canny(lowThresh, highThresh);
            var contours = im_canny.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            
            var datas = {}
            var cpt = 0;
            for(var i = 0; i < contours.length; i++) {
                var points = contours[i].getPoints();
                for(var j in points){
                    var point= points[j];
                    if(cpt%50==0){
                        datas[cpt+'_x'] = point.x;
                        datas[cpt+'_y'] = point.y;
                        screen.drawCircle(point, 2, red);
                    }
                    cpt++;
                }
            }
            //im_canny= im_canny.drawContours(contours, red);
            //console.log(datas);
            cv.imwrite('./tmp/'+self.getFileName(imageFile)+'.png', screen);
            callback(imageFile, datas, agent);
            //console.log('Images saved to ./tmp');
        });
    }
    
}