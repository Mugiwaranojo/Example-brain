import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import ResultPanel from './ResultPanel';
import './App.css';
import { post } from 'axios';

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = { pictures: [],
                       dataPictures: null };
        this.onDrop = this.onDrop.bind(this);
    }
    
    closeOldPictures(){
        var x = document.getElementsByClassName("deleteImage");
        for (var i = 0; i < x.length; i++) {
            x[i].click();
        }   
    }
    
    onDrop(picture) {
        this.closeOldPictures();
        this.setState({
            pictures: picture
        });
        console.log(picture.item(0));
        const url = '/file';
        const formData = new FormData();
        formData.append('file',picture.item(0));
        post(url, formData,  {headers: {'content-type': 'multipart/form-data'}}).then((response)=>{
            console.log(response.data);
            this.setState({
                dataPictures: response.data
            });
        });
    }


    render() {
      
      var chat = this.state.dataPictures===null ? "N/A" : Math.round(this.state.dataPictures.chat*1000)/10+"%";
      var femme = this.state.dataPictures===null ? "N/A" : Math.round(this.state.dataPictures.femme*1000)/10+"%";
      var homme = this.state.dataPictures===null ? "N/A" : Math.round(this.state.dataPictures.homme*1000)/10+"%";
      return (
        <div className="App">
            <h1 className="App-title">Test - Neurones</h1>
            <ResultPanel hide={this.state.dataPictures===null} 
                chat={chat}
                femme={femme}
                homme={homme}/>
            <ImageUploader
                withIcon={true}
                buttonText='Choisissez une images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
            
        </div>
      );
    }
}

export default App;
