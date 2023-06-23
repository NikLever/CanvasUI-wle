import { Texture, Object3D } from "@wonderlandengine/api";
import { vec3, quat } from "gl-matrix";

class CanvasKeyboard{
    constructor( width, canvasui, lang = "EN" ){
        const config = this.getConfig( lang );
        config.panelSize = { width, height: width * 0.5 };
        config.height = 256;
        config.body = { backgroundColor: "#555" };

        const object = WL.scene.addObject();
        object.name = 'keyboard';
        const mesh = object.addComponent('mesh');
        const uimesh = canvasui.object.getComponent('mesh');
        mesh.mesh = uimesh.mesh;
        mesh.material = uimesh.material.clone();
        object.addComponent('cursor-target');

        const content = this.getContent(lang);

        this.keyboard = new CanvasUI( content, config, object, canvasui.engine );

        this.tmpVec = new Float32Array(3);
    }
    
    get object(){
        return this.keyboard.object;
    }
    
    getConfig( lang ){
        //EN
        //keys
        //qwertyuiop - 10 square - btn0-btn9
        //asdfghjkl@ - 10 square buttons - btn10-btn19
        //^zxcvbnm< - 1.5 shift,7 square,1.5 backspace - btn20-btn28
        //[?123],space.[Enter] - 2,1,4,1,2 - btn30-btn34
        //keys shifted
        //QWERTYUIOP - 10 square 
        //ASDFGHJKL@ - 10 square buttons
        //^ZXCVBNM< - 1.5 shift,7 square,1.5 backspace
        //[?123],space.[Enter] - 2,1,4,1,2
        //numbers
        //1234567890 - 10 square
        //@#%&*/-+() - 10 sq
        //^?!"'\:;< - 1.5 shift,7 square,1.5 backspace
        //[ABC],space.[Enter] - 2,1,4,1,2
        //numbers shifted
        //1234567890 - 10 square
        //€£$^=|{}[] - 10 sq
        //^<>_`~:;< - 1.5 shift,7 square,1.5 backspace
        //[ABC],space.[Enter] - 2,1,4,1,2
        const config = {};
        let padding = 10;
        const paddingTop = 20;
        const width = ((512 - 2 * padding) / 10) - padding;
        const height = (( 256 - 2 * padding) / 4) - padding;
        const hover = "#333";
        const backgroundColor = "#000";
        //Top row
        let y = padding;
        let x = padding;
        for (let i=0; i<10; i++){
            const btn = { type: "button", position: { x, y }, width, height, padding, paddingTop, backgroundColor, borderRadius:6, hover, onSelect: this.onSelect.bind( this, i ) }
            config[`btn${i}`] = btn;
            x += (width + padding);
        }
        //2nd row
        y += (height + padding);
        x = padding;
        for (let i=0; i<10; i++){
            const btn = { type: "button", position: { x, y }, width, height, padding, paddingTop, backgroundColor, borderRadius:6, hover, onSelect: this.onSelect.bind( this, i + 10 ) }
            config[`btn${i+10}`] = btn;
            x += (width + padding);
        }
        //3rd row
        y += (height + padding);
        x = padding;
        for (let i=0; i<9; i++){
            const w = (i==0 || i==8) ? (width * 1.5 + padding * 0.5) : width;
            const btn = { type: "button", position: { x, y }, width: w, height, padding, paddingTop, backgroundColor, borderRadius:6, hover, onSelect: this.onSelect.bind( this, i + 20 ) };
            config[`btn${i+20}`] = btn;
            x += ( w + padding );
        }
        //4rd row
        y += (height + padding);
        x = padding;
        for (let i=0; i<5; i++){
            const w = (i==0 || i==4) ? (width * 2 + padding) : (i==2) ? (width * 4 + 3 * padding) : width;
            const btn = { type: "button", position: { x, y }, width: w, height, padding, paddingTop, backgroundColor, borderRadius:6, hover, onSelect: this.onSelect.bind( this, i + 30 ) };
            if (i==0) btn.fontSize = 20;
            config[`btn${i+30}`] = btn;
            x += ( w + padding );
        }
        return config;
    }
    
    getContent( lang, layoutIndex=0 ){
        let content = {};
        let keys;
        
        this.language = lang;
        this.keyboardIndex = layoutIndex;
        
        switch(layoutIndex){
            case 0:
                //EN
                //keys
                //qwertyuiop - 10 square - btn0-btn9
                //asdfghjkl@ - 10 square buttons - btn10-btn19
                //^zxcvbnm< - 1.5 shift,7 square,1.5 backspace - btn20-btn28
                //[?123],space.[Enter] - 1.5,1,4,1,1.5 - btn30-btn34
                keys = [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
                         'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@',
                         '⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⇦', '',
                         '?123', ',', '   ', '.', '↲'];
                for(let i=0; i<keys.length; i++){
                    const key = keys[i];
                    if (key!=='') content[`btn${i}`] = key;
                }
                break;
            case 1:
                //keys shifted
                //QWERTYUIOP - 10 square 
                //ASDFGHJKL@ - 10 square buttons
                //^ZXCVBNM< - 1.5 shift,7 square,1.5 backspace
                //[?123],space.[Enter] - 1.5,1,4,1,1.5
                keys = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
                         'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '@',
                         '⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⇦', '',
                         '?123', ',', '   ', '.', '↲'];
                for(let i=0; i<keys.length; i++){
                    const key = keys[i];
                    if (key!=='') content[`btn${i}`] = key;
                }
                break;
            case 2:
                //numbers
                //1234567890 - 10 square
                //@#%&*/-+() - 10 sq
                //^?!"'\:;< - 1.5 shift,7 square,1.5 backspace
                //[ABC],space.[Enter] - 1.5,1,4,1,1.5
                keys = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
                         '@', '#', '%', '&', '*', '/', '-', '+', '(', ')',
                         '⇧', '?', '!', '"', '\'', '\\', ':', ';', '⇦', '',
                         'abc', ',', '   ', '.', '↲'];
                for(let i=0; i<keys.length; i++){
                    const key = keys[i];
                    if (key!=='') content[`btn${i}`] = key;
                }
                break;
            case 3:
                //numbers shifted
                //1234567890 - 10 square
                //€£$^=|{}[] - 10 sq
                //^<>_`~:;< - 1.5 shift,7 square,1.5 backspace
                //[ABC],space.[Enter] - 1.5,1,5,1,1.5
                keys = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
                         '€', '£', '$', '^', '=', '|', '{', '}', '[', '}',
                         '⇧', '<', '>', '_', '`', '~', ':', ';', '⇦', '',
                         'abc', ',', '   ', '.', '↲'];
                for(let i=0; i<keys.length; i++){
                    const key = keys[i];
                    if (key!=='') content[`btn${i}`] = key;
                }
                break;
        }
        
        return content;
    }
    
    get position(){
        const pos = this.keyboard.object.getTranslationWorld( this.tmpVec );
        return pos;    
    }

    get positionLocal(){
        const pos = this.keyboard.object.getTranslationLocal( this.tmpVec );
        return pos;    
    }
    
    get visible(){
        return this.active;
    }
    
    set visible( value ){
        this.keyboard.object.active = value;  
        this.active = value;  
    }
    
    setKeyboard( index ){
        this.keyboard.content = this.getContent( this.language, index );
        this.keyboard.needsUpdate = true;
    }
    
    onSelect( index ){
        if ( !this.visible ) return
        
        //console.log( `CanvasKeyboard onSelect: key index ${index}`);
        let change = false;
        
        switch(index){
            case 34://Enter
                this.visible = false;
                if ( this.linkedElement.onEnter ) this.linkedElement.onEnter( this.linkedText );
                break;
            case 32://space
                this.linkedText += ' ';
                change = true;
                break;
            case 30://switch keyboard
                this.shift = false;
                if (this.keyboardIndex<2){
                    this.setKeyboard( 2 );
                }else{
                    this.setKeyboard( 0 );
                }
                this.keyboard.needsUpdate = true;
                break;
            case 28://backspace
                this.linkedText = this.linkedText.substring( 0, this.linkedText.length-1 );
                change = true;
                break;
            case 20://shift
                this.shift = !this.shift;
                if (this.keyboardIndex==0){
                    this.setKeyboard( 1 );
                }else if (this.keyboardIndex==1){
                    this.setKeyboard( 0 );
                }else if (this.keyboardIndex==2){
                    this.setKeyboard( 3 );
                }else if (this.keyboardIndex==3){
                    this.setKeyboard( 2 );
                }
                break;
            default:
                const txt = this.keyboard.content[`btn${index}`];
                this.linkedText += txt;
                change = true;
                if (this.keyboardIndex==1) this.setKeyboard( 0 );
                break;
        }
        
        if ( change ){
            this.linkedUI.updateElement( this.linkedName, this.linkedText );
            if ( this.linkedElement.onChanged) this.linkedElement.onChanged( this.linkedText );
        }
    }
    
    update(){
        if (this.keyboard){
            this.keyboard.update();
        }
    }
}


/*An element is defined by 
type: text | button | image | shape
hover: hex
active: hex
position: x, y, left, right, top, bottom
width: pixels, will inherit from body if missing
height: pixels, will inherit from body if missing
overflow: fit | scroll | hidden
textAlign: center | left | right
fontSize: pixels
fontColor: hex
fontFamily: string
padding: pixels
backgroundColor: hex
borderRadius: pixels
clipPath: svg path
border: width color style
*/
class CanvasUI{
	constructor(content, config, object, engine){
        const defaultconfig = {
            width: 512,
            height: 512,
            opacity: 0.7,
            body:{
                fontFamily:'Arial', 
                fontSize:30, 
                padding:20, 
                backgroundColor: '#000', 
                fontColor:'#fff', 
                borderRadius: 6
            }
        }
		this.config = (config===undefined) ? defaultconfig : config;
        
        if (this.config.width === undefined) this.config.width = 512;
        if (this.config.height === undefined) this.config.height = 512;
        if (this.config.body === undefined) this.config.body = {fontFamily:'Arial', size:30, padding:20, backgroundColor: '#000', fontColor:'#fff', borderRadius: 6};
        if (this.config.collisionGroup === undefined ){
            this.collisionGroup = 1;
        }else{
            this.collisionGroup = 1<<this.config.collisionGroup;
        }

        const body = this.config.body;
        if (body.borderRadius === undefined) body.borderRadius = 6;
        if (body.fontFamily === undefined) body.fontFamily = "Arial";
        if (body.padding === undefined) body.padding = 20;
        if (body.fontSize === undefined) body.fontSize = 30;
        if (body.backgroundColor === undefined) body.backgroundColor = '#000';
        if (body.fontColor === undefined) body.fontColor = '#fff';
        
        Object.entries( this.config ).forEach( ( [ name, value]) => {
            if ( typeof(value) === 'object' && name !== 'panelSize'){//} && !(value instanceof WebGLRenderer) && !(value instanceof Scene) ){
                const pos = (value.position!==undefined) ? value.position : { x: 0, y: 0 };
                
                if (pos.left !== undefined && pos.x === undefined ) pos.x = pos.left;
                if (pos.top !== undefined && pos.y === undefined ) pos.y = pos.top;

                const width = (value.width!==undefined) ? value.width : this.config.width;
                const height = (value.height!==undefined) ? value.height : this.config.height;

                if (pos.right !== undefined && pos.x === undefined ) pos.x = this.config.width - pos.right - width;
                if (pos.bottom !== undefined && pos.y === undefined ) pos.y = this.config.height - pos.bottom - height;
                
                if (pos.x === undefined) pos.x = 0;
                if (pos.y === undefined) pos.y = 0;
                
                value.position = pos;
                
                if (value.type === undefined) value.type = 'text';
            }
        })
        
        
        this.canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
        this.context = this.canvas.getContext('2d');
        this.context.save();
        
        const opacity = ( this.config.opacity !== undefined ) ? this.config.opacity : 0.7;
		
        const mesh = object.getComponent('mesh');
        this.material = mesh.material;

        this.canvasTexture = new Texture(engine, this.canvas);
        this.material.flatTexture = this.canvasTexture;

        if (config.panelSize){
            object.resetScaling();
            const scale = [config.panelSize.width, config.panelSize.height, 0.01];
            object.scale( scale );
            this.panelSize = config.panelSize;
        }else{
            this.panelSize = { width: 1, height: 1 };
        }

        this.object = object;
        this.engine = engine;
        this.tmpVec = new Float32Array(3);
        this.tmpVec1 = new Float32Array(3);
        this.tmpQuat = new Float32Array(4);

        const inputs = Object.values( this.config ).filter( ( value )=>{
            return  value.type === "input-text";
        });
        if ( inputs.length > 0 ){
            const width = (config.panelSize) ? config.panelSize.width : 1;
            const height = (config.panelSize) ? config.panelSize.height : 1;
            let halfheight = height/2;
            this.keyboard = new CanvasKeyboard(width, this );
            //Calculate main panel offset
            this.getEuler( this.tmpVec, this.object.rotationWorld );
            let theta = this.tmpVec[1];
            this.tmpVec[0] = 0;
            this.tmpVec[2] = -Math.cos(theta)/halfheight;
            this.tmpVec[1] = Math.sin(theta)/halfheight;
            console.log(`CanvasUI create keyboard 1 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec)}`);
            //Calculate keyboard panel offset
            halfheight = width/4;
            this.getEuler( this.tmpVec1, this.keyboard.keyboard.object.rotationWorld );
            theta += -15 * Math.PI/180;
            this.tmpVec1[0] = 0;
            this.tmpVec1[2] = -Math.cos(theta)/halfheight;
            this.tmpVec1[1] = Math.sin(theta)/halfheight;           
            console.log(`CanvasUI create keyboard 2 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec1)}`); 
            vec3.add( this.tmpVec, this.tmpVec, this.tmpVec1);          
            console.log(`CanvasUI create keyboard 3 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec)}`); 
            const obj = this.keyboard.object;
            quat.fromEuler( this.tmpQuat, -15, 0, 0 );
            obj.rotate( this.tmpQuat );
            obj.translate( this.tmpVec );//[0, -height*12, 12] );
            vec3.divide(this.tmpVec, obj.scalingLocal, object.scalingWorld);
            obj.resetScaling();
            obj.scale(this.tmpVec);
            obj.parent = object;
            obj.setDirty();
            this.keyboard.visible = false;
        }
        
        if (content === undefined){
            this.content = { body: "" };
            this.config.body.type = "text";
        }else{
            this.content = content;
            const btns = Object.values(config).filter( (value) => { return value.type === "button" || value.overflow === "scroll" || value.type === "input-text" });
            if (btns.length>0){
                this.engine.onXRSessionStart.add(this.initControllers.bind(this));
                const extents = new Float32Array(3);
                vec3.copy( extents, this.object.scalingWorld );
                const collision = this.object.addComponent( 'collision', { collider: 2, extents, group: this.collisionGroup });
            }
        }
        
        this.selectedElements = [ undefined, undefined ];
        this.selectPressed = [ false, false ];
        this.scrollData = [ undefined, undefined ];
        this.intersects = [ undefined, undefined ];
        
        this.needsUpdate = true;
        
        this.update();
	}

    vecToStr( v, precision=2){
        let str = "";
         
        if (v){
            for(let i=0; i<v.length; i++){
                str += v[i].toFixed(precision) + ', ';
            }
        }

        return str;
    }
	
    //returns yaw, pitch, roll
    getEuler(out, quat) {
        let x = quat[0],
          y = quat[1],
          z = quat[2],
          w = quat[3],
          x2 = x * x,
          y2 = y * y,
          z2 = z * z,
          w2 = w * w;
        let unit = x2 + y2 + z2 + w2;
        let test = x * w - y * z;
        if (test > 0.499995 * unit) { //TODO: Use glmatrix.EPSILON
          // singularity at the north pole
          out[0] = Math.PI / 2;
          out[1] = 2 * Math.atan2(y, x);
          out[2] = 0;
        } else if (test < -0.499995 * unit) { //TODO: Use glmatrix.EPSILON
          // singularity at the south pole
          out[0] = -Math.PI / 2;
          out[1] = 2 * Math.atan2(y, x);
          out[2] = 0;
        } else {
          out[0] = Math.asin(2 * (x * z - w * y));
          out[1] = Math.atan2(2 * (x * w + y * z), 1 - 2 * (z2 + w2));
          out[2] = Math.atan2(2 * (x * y + z * w), 1 - 2 * (y2 + z2));
        }
        // TODO: Return them as degrees and not as radians
        return out;
      }

    getIntersectY( index ){
        const height = this.config.height || 512;
        const intersect = this.intersects[index];
        if (intersect === undefined ) return 0;
        if ( intersect.xy === undefined ) return 0;
        return intersect.xy[1];
    }
    
    get selectIsPressed(){
        return this.selectPressed[0] || this.selectPressed[1];
    }

    initControllers(s){
        this.session = s;
        //Get rayleft and right
        const root = new Object3D(0);
        root.children.forEach( child => {
            if (child.name == 'Player'){
                const space = child.children[0];
                space.children.forEach( child => {
                    if (child.name == 'CursorLeft') this.rayLeft = child;
                    if (child.name == 'CursorRight') this.rayRight = child;
                });
            }
        });

        if (!(this.rayLeft && this.rayRight)) console.warn( 'Player CursorLeft or Player CursorRight not found');
        
        function onSelect( event ) {     
            const index = (event.inputSource.handedness === 'left') ? 0 : 1;
            const elm = this.selectedElements[index];
            if ( elm !== undefined ){
                if ( elm.type == "button"){
                    this.select( index );
                }else if ( elm.type == "input-text"){
                    if ( this.keyboard ){
                        if ( this.keyboard.visible ){
                            this.keyboard.linkedUI = undefined;
                            this.keyboard.linkedText = undefined;
                            this.keyboard.linkedElement = undefined;
                            this.keyboard.visible = false;
                        }else{
                            this.keyboard.linkedUI = this;
                            let name;
                            Object.entries( this.config ).forEach( ([prop, value]) => {
                                if ( value == elm ) name = prop;
                            });
                            const y = (0.5-((elm.position.y + elm.height + this.config.body.padding )/this.config.height)) * this.panelSize.height;
                            const h = Math.max( this.panelSize.width, this.panelSize.height )/2;
                            //this.keyboard.position.set( [0, h/1.5 - y, -0.1] );
                            this.keyboard.linkedText = this.content[ name ];
                            this.keyboard.linkedName = name;
                            this.keyboard.linkedElement = elm;
                            this.keyboard.visible = true;
                        }
                    }
                }
            }
        };
        
        function onSelectStart( event ){
            const index = (event.inputSource.handedness === 'left') ? 0 : 1;
            this.selectPressed[index] = true;
            if ( this.selectedElements[index] !== undefined && this.selectedElements[index].overflow == "scroll"){
                const elm = this.selectedElements[index];
                this.scrollData[index] = { scrollY: elm.scrollY, rayY: this.getIntersectY(index) };
            }
        }
        
        function onSelectEnd( event ){
            const index = (event.inputSource.handedness === 'left') ? 0 : 1;
            this.selectPressed[index] = false;
            if ( this.selectedElements[index] !== undefined && this.selectedElements[index].overflow == "scroll"){
                this.scrollData[index] = undefined;
            }
        }
        
        s.addEventListener('end', function() {
            this.session = null;
        }.bind(this));
        s.addEventListener( 'select', onSelect.bind(this) );
        s.addEventListener( 'selectstart', onSelectStart.bind(this) );
        s.addEventListener( 'selectend', onSelectEnd.bind(this) );
        
    }

    setClip( elm ){
        const context = this.context;
        
        context.restore();
        context.save();
        
        if (elm.clipPath !== undefined){
            const path = new Path2D( elm.clipPath );
            context.clip( path );
        }else{
            const pos = (elm.position!==undefined) ? elm.position : { x:0, y: 0 };
            const borderRadius = elm.borderRadius || 0;
            const width = elm.width || this.config.width;
            const height = elm.height || this.config.height;
           
            context.beginPath();
            
            if (borderRadius !== 0){
                const angle = Math.PI/2;
                //start top left
                context.moveTo(pos.x + borderRadius, pos.y );
                context.arc( pos.x + borderRadius, pos.y + borderRadius, borderRadius, angle, angle*2, true);
                context.lineTo( pos.x, pos.y + height - borderRadius );
                context.arc( pos.x + borderRadius, pos.y + height - borderRadius, borderRadius, 0, angle, true);
                context.lineTo( pos.x + width - borderRadius, pos.y + height);
                context.arc( pos.x + width - borderRadius, pos.y + height - borderRadius, borderRadius, angle*3, angle*4, true);
                context.lineTo( pos.x + width, pos.y + borderRadius );
                context.arc( pos.x + width - borderRadius, pos.y + borderRadius, borderRadius, angle*2, angle*3, true);
                context.closePath();
                context.clip();
            }else{
                context.rect( pos.x, pos.y, width, height );
                context.clip();
            }
            
            
        }
        
    }

    setPosition(x, y, z){
        if (this.mesh === undefined) return;
        this.mesh.position.set(x, y, z);
    }

    setRotation(x, y, z){
        if (this.mesh === undefined) return;
        this.mesh.rotation.set(x, y, z);
    }

    updateElement( name, content ){
        let elm = this.content[name];
        
        if (elm===undefined){
            console.warn( `CanvasUI.updateElement: No ${name} found`);
            return;
        }
        
        if (typeof elm === 'object'){
            elm.content = content;
        }else{
            elm = content;
        }
        
        this.content[name] = elm;
        
        this.needsUpdate = true;
    }
    
    get panel(){
        return this.mesh;
    }

    getElementAtLocation( x, y ){
        const elms = Object.entries( this.config ).filter( ([ name, elm ]) => {
            if (typeof elm === 'object' && name !== 'panelSize' && name !== 'body'){// && !(elm instanceof WebGLRenderer) && !(elm instanceof Scene)){
                const pos = elm.position;
                const width = (elm.width !== undefined) ? elm.width : this.config.width;
                const height = (elm.height !== undefined) ? elm.height : this.config.height;
                return (x>=pos.x && x<(pos.x+width) && y>=pos.y && y<(pos.y + height));
            }
        });
        const elm = (elms.length==0) ? null : this.config[elms[0][0]];
        //console.log(`selected = ${elm}`);
        return elm;
    }

    updateConfig( name, property, value ){  
        let elm = this.config[name];
        
        if (elm===undefined){
            console.warn( `CanvasUI.updateconfig: No ${name} found`);
            return;
        }
        
        elm[property] = value;
        
        this.needsUpdate = true;
    }

    hover( index = 0, xy ){
        if (xy === undefined){
            if (this.selectedElements[index] !== undefined){
                this.selectedElements[index] = undefined;
                this.needsUpdate = true;
            }
        }else{
            const x = xy[0];
            const y = xy[1];
            //console.log( `hover uv:${uv.x.toFixed(2)},${uv.y.toFixed(2)}>>texturePos:${x.toFixed(0)}, ${y.toFixed(0)}`);
            const elm = this.getElementAtLocation( x, y );
            if (elm===null){
                if ( this.selectedElements[index] !== undefined ){
                    this.selectedElements[index] = undefined;
                    this.needsUpdate = true;
                }
            }else if( this.selectedElements[index] !== elm ){
                this.selectedElements[index] = elm;
                this.needsUpdate = true;
            }
        }
         
    }
    
    select( index = 0, mouse=false ){
        if (this.selectedElements[index] !== undefined){
            const elm = this.selectedElements[index];
            if (elm.onSelect) elm.onSelect();
            if (elm.type === 'input-text'){
                if (mouse){
                    if ( this.keyboard ){
                        if ( this.keyboard.visible ){
                            this.keyboard.linkedUI = undefined;
                            this.keyboard.linkedText = undefined;
                            this.keyboard.linkedElement = undefined;
                            this.keyboard.visible = false;
                        }else{
                            this.keyboard.linkedUI = this;
                            let name;
                            Object.entries( this.config ).forEach( ([prop, value]) => {
                                if ( value == elm ) name = prop;
                            });
                            const y = (0.5-((elm.position.y + elm.height + this.config.body.padding )/this.config.height)) * this.panelSize.height;
                            const h = Math.max( this.panelSize.width, this.panelSize.height )/2;
                            //this.keyboard.position.set( [0, h/1.5 - y, -0.1] );
                            this.keyboard.linkedText = this.content[ name ];
                            this.keyboard.linkedName = name;
                            this.keyboard.linkedElement = elm;
                            this.keyboard.visible = true;
                        }
                    }
                }else{
                    this.keyboard.visible = (this.keyboard.visible) ? false : true;
                }
            }else{
                this.selectedElements[index] = undefined;
            }
        }
    }
    
    scroll( index ){

        if ( this.selectedElements[index] === undefined ){
            if (this.intersectMesh) this.intersectMesh[index].visible = false;
            return;
        } 
        if ( this.selectedElements[index].overflow !== 'scroll') return;
        const elm = this.selectedElements[index];
        if ( this.selectPressed[index] ){ 
            const scrollData = this.scrollData[index];
            if (scrollData !== undefined){
                if (this.intersectMesh){
                    this.intersectMesh[index].visible = true;
                    this.intersectMesh[index].position.copy( this.intersects[index].point );
                }
                const rayY = this.getIntersectY( index );
                const offset = rayY - scrollData.rayY;
                elm.scrollY = Math.min( Math.max( elm.minScrollY, scrollData.scrollY + offset), 0 );
                this.needsUpdate = true;
            }
        }else{
            if (this.intersectMesh) this.intersectMesh[index].visible = false;
        }
    }
        
    worldToCanvas( pos ){
        this.object.transformPointInverseWorld( this.tmpVec, pos );
        vec3.copy( this.tmpVec1, this.object.scalingWorld );
        vec3.div( this.tmpVec, this.tmpVec, this.tmpVec1 );
        const xy = new Float32Array(2);
        xy[0] = ((this.tmpVec[0]+1)/2) * this.config.width;
        xy[1] = (1-(this.tmpVec[1]+1)/2) * this.config.height;
        //obj:${this.tmpVec[0].toFixed(2)},${this.tmpVec[2].toFixed(2)}`;
        //const str = `pos:${pos[0].toFixed(2)},${pos[1].toFixed(2)} xy:${xy[0].toFixed(2)},${xy[1].toFixed(2)}`;
        //this.updateElement('info', str);
        //if (this.selectIsPressed) console.log(`CanvasUI.worldToCanvas ${str}`);
        return xy;
    }
    
    handleController( controller, index ){
        if (controller==null) return;

        controller.getTranslationWorld( this.tmpVec );
        controller.getForward( this.tmpVec1 );

        const intersects = WL.scene.rayCast( this.tmpVec, this.tmpVec1, this.collisionGroup, 100 );

        if (intersects.hitCount>0){
            intersects.xy = this.worldToCanvas( intersects.locations[0] );
            this.hover( index, intersects.xy );
            this.intersects[index] = intersects;
            this.scroll( index );
        }else{
            this.hover( index );
            this.intersects[index] = undefined;
            this.scroll( index );
        }
    }
    
	update(){        
        if ( this.rayLeft ) this.handleController( this.rayLeft, 0 );
        if ( this.rayRight ) this.handleController( this.rayRight, 1 );

        if ( this.keyboard && this.keyboard.visible ) this.keyboard.update();
        
        if ( !this.needsUpdate ) return;
		
		let context = this.context;
		
		context.clearRect(0, 0, this.config.width, this.config.height);
        
        const bgColor = ( this.config.body.backgroundColor ) ? this.config.body.backgroundColor : "#000";
        const fontFamily = ( this.config.body.fontFamily ) ? this.config.body.fontFamily : "Arial";
        const fontColor = ( this.config.body.fontColor ) ? this.config.body.fontColor : "#fff";
        const fontSize = ( this.config.body.fontSize ) ? this.config.body.fontSize : 30;
        this.setClip(this.config.body);
        context.fillStyle = bgColor;
        context.fillRect( 0, 0, this.config.width, this.config.height);
        
        Object.entries(this.content).forEach( ([name, content]) => {
            const config = (this.config[name]!==undefined) ? this.config[name] : this.config.body;
            const display = (config.display !== undefined) ? config.display : 'block';
            
            if (display !== 'none'){
                const pos = (config.position!==undefined) ? config.position : { x: 0, y: 0 };                
                const width = (config.width!==undefined) ? config.width : this.config.width;
                const height = (config.height!==undefined) ? config.height : this.config.height;

                if (config.type == "button" && !content.toLowerCase().startsWith("<path>")){
                    if ( config.borderRadius === undefined) config.borderRadius = 6;
                    if ( config.textAlign === undefined ) config.textAlign = "center";
                }
                
                this.setClip( config );
                
                const svgPath = content.toLowerCase().startsWith("<path>");
                const hover = ((this.selectedElements[0] !== undefined && this.selectedElements[0] === config)||(this.selectedElements[1] !== undefined && this.selectedElements[1] === config));
                
                if ( config.backgroundColor !== undefined){
                    if (hover && config.type== "button" && config.hover !== undefined){
                        context.fillStyle = config.hover;
                    }else{
                        context.fillStyle = config.backgroundColor;
                    }
                    context.fillRect( pos.x, pos.y, width, height );
                }

                if (config.type == "text" || config.type == "button" || config.type == "input-text"){
                    let stroke = false;
                    if (hover){
                        if (!svgPath && config.type == "button"){
                            context.fillStyle = (config.fontColor !== undefined) ? config.fontColor : fontColor;
                        }else{
                            context.fillStyle = (config.hover !== undefined) ? config.hover : ( config.fontColor !== undefined) ? config.fontColor : fontColor;
                        }
                        stroke = (config.hover === undefined);
                    }else{
                        context.fillStyle = (config.fontColor !== undefined) ? config.fontColor : fontColor;
                    }
                    
                    if ( svgPath ){
                        const code = content.toUpperCase().substring(6, content.length - 7);
                        context.save();
                        context.translate( pos.x, pos.y );
                        const path = new Path2D(code);
                        context.fill(path);
                        context.restore();
                    }else{
                        this.wrapText( name, content )
                    }

                    if (stroke){
                        context.beginPath();
                        context.strokeStyle = "#fff";
                        context.lineWidth = 2;
                        context.rect( pos.x, pos.y, width, height);
                        context.stroke();
                    }
                }else if (config.type == "img"){
                    if (config.img === undefined){
                        this.loadImage(content).then(img =>{
                            console.log(`w: ${img.width} | h: ${img.height}`);
                            config.img = img;
                            this.needsUpdate = true;
                            this.update();           
                        }).catch(err => console.error(err));
                    }else{
                        const aspect = config.img.width/config.img.height;
                        const h = width/aspect;
                        context.drawImage( config.img, pos.x, pos.y, width, h );           
                    }
                }
            }
        })
		
        if (this.canvasTexture) this.canvasTexture.update();
        this.needsUpdate = false;
	}
	
    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", err => reject(err));
        img.src = src;
      });
    }

	createOffscreenCanvas(w, h) {
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return canvas;
	}
	
    fillRoundedRect( x, y, w, h, radius ){
        const ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    lookAt( pos ){
        if ( this.mesh === undefined ) return;
        if ( !(pos instanceof Vector3) ){
            console.error( 'CanvasUI lookAt called parameter not a THREE.Vector3');
            return;
        }
        this.mesh.lookAt( pos );
    }
    
    get visible(){
        if (this.mesh === undefined ) return false;
        return this.mesh.active;
    }
    
    set visible(value){
        if (this.mesh){
            this.mesh.active = value;
        }
    }
    
    get position(){
        if (this.object === undefined) return undefined;
        this.object.getTranslationWorld( this.tmpVec );
        return this.tmpVec;
    }
    
    set position(value){
        if (this.object === undefined) return;
        if (!(value instanceof Float32Array) ){
            console.error( 'CanvasUI trying to set the object position using a parameter that is not a Float32Array');
            return;
        }
        this.object.setTranslationWorld( value );
    }
    
    get quaternion(){
        if (this.object === undefined) return undefined;
        this.object.getTranslationWorld( this.tmpVec );
        return this.tmpVec;
    }
    
    set quaternion(value){
        if (this.mesh === undefined) return;
        if (!(value instanceof QUaternion) ){
            console.error( 'CanvasUI trying to set the object quaternion using a parameter that is not a THREE.Quaternion');
            return;
        }
        this.mesh.quaternion.copy( value );
    }
    
	wrapText(name, txt){
        //console.log( `wrapText: ${name}:${txt}`);
		const words = txt.split(' ');
        let line = '';
		const lines = [];
        const config = (this.config[name]!==undefined) ? this.config[name] : this.config.body;
        const width = (config.width!==undefined) ? config.width : this.config.width;
        const height = (config.height!==undefined) ? config.height : this.config.height;
        const pos = (config.position!==undefined) ? config.position : { x:0, y:0 };
        const padding = (config.padding!==undefined) ? config.padding : (this.config.body.padding!==undefined) ? this.config.body.padding : 10;
        const paddingTop = (config.paddingTop!==undefined) ? config.paddingTop : padding;
        const paddingLeft = (config.paddingLeft!==undefined) ? config.paddingLeft : padding;
        const paddingBottom = (config.paddingBottom!==undefined) ? config.paddingBottom : padding;
        const paddingRight = (config.paddingRight!==undefined) ? config.paddingRight : padding;
        const rect = { x:pos.x+paddingLeft, y:pos.y+paddingTop, width: width - paddingLeft - paddingRight, height: height - paddingTop - paddingBottom };
        const textAlign = (config.textAlign !== undefined) ? config.textAlign : (this.config.body.textAlign !== undefined) ? this.config.body.textAlign : "left";
        const fontSize = (config.fontSize !== undefined ) ? config.fontSize : ( this.config.body.fontSize !== undefined) ? this.config.body.fontSize : 30;
        const fontFamily = (config.fontFamily!==undefined) ? config.fontFamily : (this.config.body.fontFamily!==undefined) ? this.config.body.fontFamily : 'Arial';
        const leading = (config.leading !== undefined) ? config.leading : (this.config.body.leading !== undefined) ? this.config.body.leading : 8;
		const lineHeight = fontSize + leading;
        
        const context = this.context;
        
        context.textAlign = textAlign;
        
		context.font = `${fontSize}px '${fontFamily}'`;
		
        words.forEach( function(word){
			let testLine = (words.length>1) ? `${line}${word} ` : word;
        	let metrics = context.measureText(testLine);
        	if (metrics.width > rect.width && word.length>1) {
                if (line.length==0 && metrics.width > rect.width){
                    //word too long
                    while(metrics.width > rect.width){
                        let count = 0;
                        do{
                            count++
                            testLine = word.substr(0, count);
                            metrics = context.measureText(testLine);
                        }while(metrics.width < rect.width && count < (word.length-1));
                        count--;
                        testLine = word.substr(0, count);
                        lines.push( testLine );
                        word = word.substr(count);
                        if (count<=1) break;
                        metrics = context.measureText(word);
                    }
                    if (word != "") lines.push(word);
                }else{
				    lines.push(line);
				    line = `${word} `;
                }
			}else {
				line = testLine;
			}
		});
		
		if (line != '') lines.push(line);
        
        const textHeight = lines.length * lineHeight;
        let scrollY = 0;
        
        if (textHeight>rect.height && config.overflow === 'scroll'){
            //Show a scroll bar
            if ( config.scrollY === undefined ) config.scrollY = 0;
            const fontColor = ( config.fontColor !== undefined ) ? config.fontColor : this.config.body.fontColor;
            context.fillStyle = "#aaa";
            this.fillRoundedRect( pos.x + width - 12, pos.y, 12, height, 6 );
            context.fillStyle = "#666";
            const scale = rect.height / textHeight;
            const thumbHeight = scale * height;
            const thumbY = -config.scrollY * scale;
            this.fillRoundedRect( pos.x + width - 12, pos.y + thumbY, 12, thumbHeight, 6);
            context.fillStyle = fontColor;
            scrollY = config.scrollY;
            config.minScrollY = rect.height - textHeight;
        }
		
		let y = scrollY + rect.y + fontSize/2;
		let x;
        
        switch( textAlign ){
            case "center":
                x = rect.x + rect.width/2;
                break;
            case "right":
                x = rect.x + rect.width;
                break;
            default:
                x = rect.x;
                break;
        }
        
		lines.forEach( (line) => {
            if ((y + lineHeight) > 0) context.fillText(line, x, y);
			y += lineHeight;
		});
	}
}

export { CanvasUI };
