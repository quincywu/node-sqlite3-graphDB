let Node = require('./node');

Array.prototype.contains = function(name) {
    var i = this.length;
    while (i--) {
        if (this[i].name === name) {
            return true;
        }
    }
    return false;
}

Object.arraySize = function(obj) {
    var size = 0, key;
    for (key in obj){
        if(obj.hasOwnProperty(key)) size ++;
    }
    return size;
}

var Graph = function() {
    this.node_list = [];
}

Graph.prototype.addEdge = function ( start, end, relationship = "") {

    var first = this.node_list.contains(start);
    var second = this.node_list.contains(end);
    if(first){
        //get start node
        var i = this.node_list.length;
        while (i--) {
            if (this.node_list[i] && this.node_list[i].name === start) {
                this.node_list[i].addEdge(end, relationship);
                break;
            }
        }
    }

    if( (!first) || (!second) ){
        if( !first ){
            var node = new Node(start);
            node.addEdge(end, relationship);
            this.node_list.push(node);
        }
        if( !second ){
            var node = new Node(end);
            this.node_list.push(node);
        }
    }
}

Graph.prototype.addMultEdge = function( objArray ){ // obj = ['start', 'end', 'relationship']

    for(var  i = 0 ; i < objArray.length; i ++){
        if(objArray[i] && objArray[i][0] && objArray[i][1] && objArray[i][2])
            this.addEdge(objArray[i][0], objArray[i][1], objArray[i][2]);

    }

}

Graph.prototype.deleteEdge = function( start, end, relationship = '' ){

    var first = this.node_list.contains(start);
    var second = this.node_list.contains(end);

    if ( first && second ) {
        var i = this.node_list.length;
        while (i-- && i >= 0 ) {

            if (this.node_list[i] && this.node_list[i].name === start) {
                this.node_list[i].deleteEdge(end, relationship);
            }

        }
    }

}

Graph.prototype.deleteAllEdge = function( start, end, directional = true ){

    var first = this.node_list.contains(start);
    var second = this.node_list.contains(end);

    if ( first && second ) {
        var i = this.node_list.length;
        while (i-- && i >= 0 ) {

            if (this.node_list[i] && this.node_list[i].name === start) {
                this.node_list[i].deleteAllEdge(end);
            }

            if (!directional) {
                if (this.node_list[i] && this.node_list[i].name === end) {
                    this.node_list[i].deleteAllEdge(start);
                }
            }


        }
    }

}

Graph.prototype.deleteNode = function( node ) {
    //delete node and all the relationship with this node

    var first = this.node_list.contains(node);
    if ( first ) {
        var i = this.node_list.length;
        while ( i-- && i >= 0 ) {

            if ( this.node_list[i] ) {
                if ( this.node_list[i].name === node ){
                    delete this.node_list[i];
                } else {
                    this.node_list[i].deleteAllEdge( node );
                }
            }

        }
    }

}

Graph.prototype.clean = function() {
    // delete node where no connections connect to it
    for(var i = 0; i < this.node_list.length; i++){

        if( this.node_list[i] && !Object.arraySize(this.node_list[i].edge_list) ){ //not a subject_node
            var exists_relationship = false;
            for(var j = 0; j < this.node_list.length; j ++){

                if ( j != i && this.node_list[j] ) {
                    for(var key in this.node_list[j].edge_list){
                        if( key === this.node_list[i].name ) {// exists_relationship with this node
                            exists_relationship = true;
                            break;
                        }
                    }
                }

                if(exists_relationship) break; // found relationship

            }
            if(!exists_relationship){
                console.log('delete here = ' + this.node_list[i].name);
                delete this.node_list[i];
            }
        }
    }
}

Graph.prototype.printNodes = function (){
    for(var i = 0;i < this.node_list.length;i++){
        if(this.node_list[i]){
            console.log(this.node_list[i].name +":");
            console.log(this.node_list[i].edge_list);
        }
    }
}

module.exports = Graph;
