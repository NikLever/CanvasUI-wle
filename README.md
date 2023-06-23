# CanvasUI for Wonderland
The default way to add UI to a Wonderland project is illustrated by the Panel object in the VR template. This uses meshes and multiple materials to support text and buttons. A few years ago I created a VR UI for the WebGL library ThreeJS. CanvasUI for Wonderland is a port of the library.  To preview it open the CanvasUI.wlp project in the Wonderland Editor. To use CanvasUI you need a pipeline duplicated from the Flat Opaque Texture pipeline. 
Make sure ALPHA_MASKED is unchecked. Then create a material using this pipeline.

Create an object to host your UI, add a mesh component and select Primitive Plane for its mesh and the material you’ve just created for its material. Position in the scene. 

To show how to code the UI take a look at the component uiHandler in the js folder. Also notice CanvasUI.js in the same folder. You must add this file to use CanvasUI. Now take a look at the start method in uiHandler. If you want CanvasUI to work with the mouse then the ui object should have the cursor-target component added. CanvasUI also expects the VR Player Object. It uses the CursorLeft and CursorRight objects to handle interactions between the controller ray and the Panel. 

In the uiHandler I do support the mouse so I grab the cursor-target component and add methods for hover, unhover, move, down and up. You will have met this technique with button.js that comes with the VR template. Let’s look at these functions. 

First onHover, notice that the method receives a cursor parameter. We use this to convert the cursor position into a canvas position. A CanvasUI is so named because it uses an off-screen HTML5 canvas element to draw the ui and then passes this as the texture to the ui panels material property. The default size for this canvas is 512x512. The CanvasUI method worldToCanvas takes a scene world position and converts it into a position on the canvas. We pass this to the ui hover method. 

onMove works in the same way. This ensures CanvasUI is informed about which element in the ui the cursor is over. The onDown method just plays a sound.  

onUp calls the ui method select. If the cursor is over a button then its select event will be called. onUnHover calls the hover method without a second parameter value. This deselects a selected element. 

The uiHandler features 5 typical ui panels. The one displayed is set using the panel property. Let’s look at simple.

Notice we create a config and content objects. In the config we create 3 elements. Each are set as type text. We set the position and height in pixels. Set padding for header and footer and background and font colors for the main element. The default values are white text on black. Take a look at the CanvasUI documentation for more details https://github.com/NikLever/CanvasUI . The content object sets the text content of each element. If you run the app you see a panel with a header and footer and main text area.

Let’s move onto the buttons panel. For buttons you can add a onSelect call back. Take the prev button, notice onSelect is set to onPrev. The onPrev method creates a msg string and uses the CanvasUI method updateElement to change the content of the info element to ‘Prev pressed’. Notice also the content uses svg paths for the prev, stop and next buttons. The continue button has default rounded corners as borderRadius default to 6 pixels. If you switch back to Wonderland and switch panel to buttons package and view in the browser. Clicking the buttons updates the top info element. Notice this panel is not square. That’s because panelSize is added to the config. When changing the aspect ratio you should also change the canvas texture size. The default is 512 square we set height to 128, making it a quarter of the width matching the panel size. 

CanvasUI supports scrolling panels. Just add overflow scroll. And images are supported using type img. For images content should be a url.

CanvasUI also includes a virtual keyboard. If you add an element of type input-text and this is selected, a virtual keyboard will be displayed. If you want the keyboard to work with the mouse then grab the cursor-target component and add hover, unhover, move, down and up functions. 
