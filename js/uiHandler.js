WL.registerComponent('uiHandler', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        //console.log('init() with param', this.param);
    },
    start: function() {
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
    update: function(dt) {
        //console.log('update() with delta time', dt);
    },
});
