WL.registerComponent('uiHandler', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        //console.log('init() with param', this.param);
    },
    start: function() {
        //console.log('start() with param', this.param);
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
    },
    update: function(dt) {
        //console.log('update() with delta time', dt);
    },
});
