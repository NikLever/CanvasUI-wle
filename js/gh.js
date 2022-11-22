WL.registerComponent('my-canvas-texture', {
    //mesh: {type: WL.Type.Mesh},
    //material: {type: WL.Type.Material},
  }, {
    start: function() {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
  
      const ctx = canvas.getContext('2d');
      /* Do your 2D drawing here (example from MDN here) */
  
      // White background fill
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Change fill color back to black
      ctx.fillStyle = '#000';
      // Set line width
      ctx.lineWidth = 10;
  
      // Wall
      ctx.strokeRect(75, 140, 150, 110);
  
      // Door
      ctx.fillRect(130, 190, 40, 60);
  
      // Roof
      ctx.beginPath();
      ctx.moveTo(50, 140);
      ctx.lineTo(150, 60);
      ctx.lineTo(250, 140);
      ctx.closePath();
      ctx.stroke();
  
      this.mesh = this.object.getComponent('mesh');
      /* Now wrap the canvas into a Wonderland Engine texture */
      this.canvasTexture = new WL.Texture(canvas);
      this.mesh.material.flatTexture = this.canvasTexture;
    }
  });