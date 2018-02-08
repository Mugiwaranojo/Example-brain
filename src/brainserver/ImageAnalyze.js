/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import cv from 'opencv';

export default class ImageAnalyse{
    
    static getFileName(absoluteFileName){
        var fileName = absoluteFileName.substring(absoluteFileName.lastIndexOf('/')+1);
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
    
    static findContours(imageFile, callback, agent){
        console.log("traitement of file : "+imageFile);
        var lowThresh = 50;
        var highThresh = 500;
        var nIters = 10;
        var maxArea = 2500;
        var self = this;
        var GREEN = [0, 255, 0]; // B, G, R
        var WHITE = [255, 255, 255]; // B, G, R
        var RED = [0, 0, 255]; // B, G, R
        cv.readImage(imageFile, function(err, im){
            if (err) throw err;
            var width = im.width();
            var height = im.height();
            if (width < 1 || height < 1) throw new Error('Image has no size');
            
            var big = new cv.Matrix(height, width);
            var all = new cv.Matrix(height, width);
            var screen = im;
            var im_canny = im.copy();
            im_canny.convertGrayscale();
            im_canny.canny(lowThresh, highThresh);
            im_canny.dilate(nIters);

            var contours = im_canny.findContours();
            const lineType = 8;
            const maxLevel = 0;
            const thickness = 1;
            
            var datas = {}
            var cpt = 0;
            for(var i = 0; i < contours.size(); i++) {
                for(var j = 0; j < contours.cornerCount(i); ++j) {
                    if(j%10==0){
                        var point = contours.point(i, j);
                        datas[cpt+'_x'] = point.x;
                        datas[cpt+'_y'] = point.y;
                        screen.line([point.x - 5, point.y], [point.x + 5, point.y], RED);
                        screen.line([point.x, point.y - 5], [point.x, point.y + 5], RED);
                        cpt++;
                    }
                }
            }
            //screen.save('./tmp/'+self.getFileName(imageFile)+'.png');
            callback(imageFile, datas, agent);
            //console.log('Images saved to ./tmp');
        });
    }
    
}