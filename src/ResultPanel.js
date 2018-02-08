import React, { Component } from 'react';

export default class ResultPanel  extends Component {
        
    render(){
        var className = "ResultPanel";
        
        if(this.props.hide===true){
            className+= " hide";
        }
        
        return(
            <div className={className}>
                <div><span>Chat :</span> {this.props.chat}</div>
                <div><span>Femme :</span> {this.props.femme}</div>
                <div><span>Homme :</span> {this.props.homme}</div>
            </div>
        );
    }
        
}