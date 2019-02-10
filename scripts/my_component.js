
Color = function(hexOrObject) {
    var obj;
    if (hexOrObject instanceof Object) {
        obj = hexOrObject;
    } else {
        obj = LinearColorInterpolator.convertHexToRgb(hexOrObject);
    }
    this.r = obj.r;
    this.g = obj.g;
    this.b = obj.b;
}
Color.prototype.asRgbCss = function() {
    return "rgb("+this.r+", "+this.g+", "+this.b+")";
}

var LinearColorInterpolator = {
    // convert 6-digit hex to rgb components;
    // accepts with or without hash ("335577" or "#335577")
    convertHexToRgb: function(hex) {
        match = hex.replace(/#/,'').match(/.{1,2}/g);
        return new Color({
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16)
        });
    },
    // left and right are colors that you're aiming to find
    // a color between. Percentage (0-100) indicates the ratio
    // of right to left. Higher percentage means more right,
    // lower means more left.
    findColorBetween: function(left, right, percentage) {
        newColor = {};
        components = ["r", "g", "b"];
        for (var i = 0; i < components.length; i++) {
            c = components[i];
            newColor[c] = Math.round(left[c] + (right[c] - left[c]) * percentage / 100);
        }
        return new Color(newColor);
    }
}
   
var l = new Color({ r:100, g:100, b:100 });
var r = new Color("#ffaa33");
var backgroundColor = LinearColorInterpolator.findColorBetween(l, r, 50).asRgbCss();
// do something with backgroundColor...
AFRAME.registerComponent('multiVector', {
    schema: {
        radius:{type:'number',default:.1},
        color: {type: 'color', default: '#142efa'},
        vectorType:{
            default:1,
            enumerate: function(value){
                if (value === "sphere"){
                    return 0;
                }else if (value === "vector") {
                    return (1);
                } else if (value === "none"){
                    return(2);
                    
                }
            }
        },
        max:{type:'number',default:1},
        min:{type:'number',default:0},

        magnitude:{type:'number', default:0},
        direction:{type:'vec3', default:{x:1,y:0,z:0}},
        origin:{type:'vec3',default:{x:0,y:0,z:0}},

        startColor: {type:'color',default:'#142efa'},//blue
        endColor:{type:'color', default:'#fa1421'}, //red

    },

    init:function(){
        var data = this.data;
        var el = this.el

        function conVec (aframeVec){
            return (new THREE.Vector3(aframeVec.x,aframeVec.y,aframeVec.z))
        }
        this.arrow = new THREE.ArrowHelper(conVec(data.dir),conVec(data.origin),data.magnitude)

       /* //create geomentry
        var geom = new THREE.Geometry(); 
        var v1 = new THREE.Vector3(0,0,0);
        var v2 = new THREE.Vector3(0,5,0);
        var v3 = new THREE.Vector3(0,5,5);

        geom.vertices.push(v1);
        geom.vertices.push(v2);
        geom.vertices.push(v3);

        geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geom.computeFaceNormals();
        
        this.geometry = geom;*/

        //this.geometry = new THREE.boundingSphere();

        //set mesh on entity
        el.setObject3D('multiVector',this.arrow);

    },

    /*
    *Update mesh in response to property updates
    */
    update:function(oldData){
        var data = this.data;
        var el = this.el
        //if the old data is empty then we dont update
        //this is becuase we are in the initilization phase 
        if(Object.keys(oldData).length == 0){return;}


        //material changed
        if(data.material != oldData.material){
           // el.getObject3D('multi-vector').material.color = data.color;
        }
    },

    //for when we wanna get rid of the box
    remove:function(){
        this.el.removeObject3D('multiVector');
    }
});

AFRAME.registerComponent('box', {
    schema: {
        width: {type: 'number', default: 1},
        height: {type: 'number', default: 1},
        depth: {type: 'number',default: 1},
        color: {type: 'color', default: '#AAA'}
    },

    init:function(){
        var data = this.data;
        var el = this.el

        this.geometry = new THREE.BoxBufferGeometry(data.width,data.height,data.depth);

        //create material
        this.material = new THREE.MeshStandardMaterial({color: data.color});

        //create the mesh itself
        this.mesh = new THREE.Mesh(this.geometry,this.material);

        //set mesh on entity
        el.setObject3D('mesh',this.mesh);

    },

    /*
    *Update mesh in response to property updates
    */
    update:function(oldData){
        var data = this.data;
        var el = this.el
        //if the old data is empty then we dont update
        //this is becuase we are in the initilization phase 
        if(Object.keys(oldData).length == 0){return;}

        //geometry related properties changed
        if(data.width != oldData.width || 
            data.height != oldData.height ||
            data.depth != oldData.depth){
            el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width,data.height,data.depth);
        }

        //material changed
        if(data.material != oldData.material){
            el.getObject3D('mesh').material.color = data.color;
        }
    },

    //for when we wanna get rid of the box
    remove:function(){
        this.el.removeObject3D('mesh');
    }
});
