(function() {
  var App;
  App = {};
  /*
  	Init 
  */
  App.init = function() {
    App.canvas = document.createElement('canvas');
    App.canvas.height = 400;
    App.canvas.width = 800;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#ECD018";
    App.ctx.lineWidth = 5;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:4000');
    App.socket.on('draw', function(data) {
      return App.draw(data.x, data.y, data.type);
    });
    App.draw = function(x, y, type) {
      if (type === "dragstart") {
        App.ctx.beginPath();
        return App.ctx.moveTo(x, y);
      } else if (type === "drag") {
        App.ctx.lineTo(x, y);
        return App.ctx.stroke();
      } else {
        return App.ctx.closePath();
      }
    };
  };

  /*
  	Draw Events
  */


  $('canvas').live('drag dragstart dragend', function(e) {
    var currentElement, totalOffsetX, totalOffsetY, type, x, y;
    totalOffsetX = 0;
    totalOffsetY = 0;
    currentElement = e.currentTarget;
    type = e.handleObj.type;
    while (true) {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
      if (!(currentElement != null)) {
        break;
      }
    }
    x = e.pageX - totalOffsetX;
    y = e.pageY - totalOffsetY;
    App.draw(x, y, type);
    App.socket.emit('drawClick', {
      x: x,
      y: y,
      type: type
    });
  });
  $(function() {
    return App.init();
  });
}).call(this);
