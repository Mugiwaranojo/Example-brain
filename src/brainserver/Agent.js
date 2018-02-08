/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import ImageAnalyze from './ImageAnalyze';
import brain from 'brain';

const fs = require('fs');
const path = require('path');

export default class Agent{
        
    constructor(){
        console.log("create agent ...");
        this.net = new brain.NeuralNetwork();
        this.trainTab= [];
        this.nbrFiles= 0;
        this.trainImages();
    }
    
    
    trainImages(){
        var self= this;
        var imagePath= path.resolve(__dirname, "./images");
        fs.readdir(imagePath, (err, files) => {
            self.nbrFiles = files.length;
            files.forEach(file => {
                ImageAnalyze.findContours(imagePath+"/"+file, self.callbackTrainFindContours, self);
            });
        });
    }
    
    onFinishLoads(){
        this.net.train(this.trainTab);
        console.log("finish train "+this.trainTab.length+" files");
    }
    
    callbackTrainFindContours(imageFile, data, self){
        var typeFile = self.getTrainFileType(imageFile);
        var outputObject = {};
        //console.log(data);
        outputObject[typeFile] = 1;
        //console.log(outputObject);
        self.trainTab.push({input: data, output: outputObject});
        if(self.nbrFiles===self.trainTab.length){
            self.onFinishLoads();
        }
    }
    
    getTrainFileType(imageFile){
        return imageFile.substring(imageFile.lastIndexOf("/")+1,imageFile.indexOf("_"));
    }
    
    runImage(imageFile, callbackResult){
        ImageAnalyze.findContours(imageFile, function(imageFile, data, self){
            var output = self.net.run(data);
            callbackResult(output);
        }, this);
    }
}