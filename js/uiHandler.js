WL.registerComponent('uiHandler', {
    panel: {type: WL.Type.Enum, values:['simple', 'buttons', 'scrolling', 'images', 'input-text'], default: 'simple'},
}, {
    init: function() {
    },
    start: function() {
        this.target = this.object.getComponent('cursor-target');
        this.target.addHoverFunction(this.onHover.bind(this));
        this.target.addUnHoverFunction(this.onUnHover.bind(this));
        this.target.addMoveFunction(this.onMove.bind(this));
        this.target.addDownFunction(this.onDown.bind(this));
        this.target.addUpFunction(this.onUp.bind(this));
        
        this.soundClick = this.object.addComponent('howler-audio-source', {src: 'sfx/click.wav', spatial: true});
        this.soundUnClick = this.object.addComponent('howler-audio-source', {src: 'sfx/unclick.wav', spatial: true});

        switch ( this.panel ){
            case 0://simple
            this.simplePanel();
            break;
            case 1://buttons
            this.buttonsPanel();
            break;
            case 2://scrolling
            this.scrollPanel();
            break;
            case 3://images
            this.imagePanel();
            break;
            case 4://input-text
            this.inputTextPanel();
            break;
        }
    },
    simplePanel: function(){
        const config = {
            header:{
                type: "text",
                position:{ top:0 },
                paddingTop: 30,
                height: 70
            },
            main:{
                type: "text",
                position:{ top:70 },
                height: 372, // default height is 512 so this is 512 - header height (70) - footer height (70)
                backgroundColor: "#bbb",
                fontColor: "#000"
            },
            footer:{
                type: "text",
                position:{ bottom:0 },
                paddingTop: 30,
                height: 70
            }
        }
        
        const content = {
            header: "Header",
            main: "This is the main text",
            footer: "Footer"
        }
        
        this.ui = new CanvasUI( content, config, this.object );
        this.ui.update();
        let ui = this.ui;
    },
    buttonsPanel: function(){
        function onPrev(){
            const msg = "Prev pressed";
            console.log(msg);
            ui.updateElement( "info", msg );
        }
        
        function onStop(){
            const msg = "Stop pressed";
            console.log(msg);
            ui.updateElement( "info", msg );
        }
        
        function onNext(){
            const msg = "Next pressed";
            console.log(msg);
            ui.updateElement( "info", msg );
        }
        
        function onContinue(){
            const msg = "Continue pressed";
            console.log(msg);
            ui.updateElement( "info", msg );
        }
        //console.log('start() with param', this.param);
        const config = {
            panelSize: {
                width: 1,
                height: 0.25
            },
            height: 128,
            info: {
                type: "text",
                position:{ left: 6, top: 6 },
                width: 500,
                height: 58,
                backgroundColor: "#aaa",
                fontColor: "#000"
            },
            prev: {
                type: "button",
                position:{ top: 64, left: 0 }, 
                width: 64,
                fontColor: "#bb0",
                hover: "#ff0",
                onSelect: onPrev
            },
            stop: {
                type: "button",
                position:{ top: 64, left: 64 },
                width: 64,
                fontColor: "#bb0",
                hover: "#ff0",
                onSelect: onStop
            },
            next: {
                type: "button",
                position:{ top: 64, left: 128 },
                width: 64,
                fontColor: "#bb0",
                hover: "#ff0",
                onSelect: onNext
            },
            continue: {
                type: "button",
                position:{ top: 70, right: 10 },
                width: 200,
                height: 52,
                fontColor: "#fff",
                backgroundColor: "#1bf",
                hover: "#3df",
                onSelect: onContinue
            }
        }
        
        const content = {
            info: "",
            prev: "<path>M 10 32 L 54 10 L 54 54 Z</path>",
            stop: "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>",
            next: "<path>M 54 32 L 10 10 L 10 54 Z</path>",
            continue: "Continue"
        }

        this.ui = new CanvasUI( content, config, this.object );
        this.ui.update();
        let ui = this.ui;
    },
    scrollPanel: function(){
        const config = {
            body: {
                backgroundColor: "#666"
            },
            txt: {
                type: "text",
                overflow: "scroll",
                position: { left: 20, top: 20 },
                width: 460,
                height: 400,
                backgroundColor: "#fff",
                fontColor: "#000"
            }
        }
        
        const content = {
            txt: "This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel. This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel."
        }
        
        this.ui = new CanvasUI( content, config, this.object );
        this.ui.update();
        let ui = this.ui;
    },
    imagePanel: function(){
        const config = {
            image: {
                type: "img",
                position: { left: 20, top: 20 },
                width: 472
            },
            info: {
                type: "text",
                position: { top: 300 }
            }
        }
        
        const content = {
            image: "images/promo.png",
            info: "The promo image from the course: Learn to create WebXR, VR and AR, experiences using Wonderland Engine"
        }
        
        
        this.ui = new CanvasUI( content, config, this.object );
        this.ui.update();
        let ui = this.ui;
    }, 
    inputTextPanel: function(){
        function onChanged( txt ){
            console.log( `message changed: ${txt}`);
        }
        
        function onEnter( txt ){
            console.log(`message enter: ${txt}`);
        }
        
        const config = {
            panelSize: { width: 1, height: 0.25 },
            height: 128,
            message: {
                type: "input-text",
                position: { left: 10, top: 8 },
                height: 56,
                width: 492,
                backgroundColor: "#ccc",
                fontColor: "#000",
                onChanged,
                onEnter
            },
            label: {
                type: "text",
                position: { top: 64 }
            }
        }
        
        const content = {
            message: "",
            label: "Select the panel above."
        }
        
        this.ui = new CanvasUI( content, config, this.object );

        const target = this.ui.keyboard.object.getComponent('cursor-target');
        target.addHoverFunction(this.onHoverKeyboard.bind(this));
        target.addUnHoverFunction(this.onUnHoverKeyboard.bind(this));
        target.addMoveFunction(this.onMoveKeyboard.bind(this));
        target.addDownFunction(this.onDown.bind(this));
        target.addUpFunction(this.onUpKeyboard.bind(this));

        this.ui.update();
        let ui = this.ui;
    }, 
    onHover: function(_, cursor) {
        //console.log('onHover');
        const xy = this.ui.worldToCanvas(cursor.cursorPos);
        if (this.ui) this.ui.hover(0, xy);

        if(cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    },

    onMove: function(_, cursor) {
        this.ui.worldToCanvas(cursor.cursorPos);
        const xy = this.ui.worldToCanvas(cursor.cursorPos);
        if (this.ui) this.ui.hover(0, xy);

        this.hapticFeedback(cursor.object, 0.5, 50);
    },

    onDown: function(_, cursor) {
        console.log('onDown');
        this.soundClick.play();

        this.hapticFeedback(cursor.object, 1.0, 20);
    },

    onUp: function(_, cursor) {
        console.log('onUp');
        this.soundUnClick.play();

        if (this.ui) this.ui.select( 0, true );

        this.hapticFeedback(cursor.object, 0.7, 20);
    },

    onUnHover: function(_, cursor) {
        console.log('onUnHover');
        
        if (this.ui) this.ui.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    },

    onHoverKeyboard: function(_, cursor) {
        //console.log('onHover');
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        if(cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    },

    onMoveKeyboard: function(_, cursor) {
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        this.hapticFeedback(cursor.object, 0.5, 50);
    },

    onUpKeyboard: function(_, cursor) {
        console.log('onUpKeyboard');
        this.soundUnClick.play();

        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.select(0);

        this.hapticFeedback(cursor.object, 0.7, 20);
    },

    onUnHoverKeyboard: function(_, cursor) {
        console.log('onUnHoverKeyboard');
        
        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    },

    hapticFeedback: function(object, strength, duration) {
        const input = object.getComponent('input');
        if(input && input.xrInputSource) {
            const gamepad = input.xrInputSource.gamepad;
            if(gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
        }
    },
    
    update: function(dt) {
        //console.log('update() with delta time', dt);
        this.ui.update();
    },
});
