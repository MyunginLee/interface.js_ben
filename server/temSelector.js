  
  
  var IsoSelector = function (panelName, label, items, faderMin, faderMax, defaultVal, defaultMenu, keyVal, name) {

    var panel = new Interface.Panel({  background:"black", container:document.querySelector(panelName) });

    var label = new Interface.Label({bounds:[.0,.2,.25,1],value:label,});
    var text = new Interface.TextField({ bounds:[.75,.0,.10,1], value:defaultVal,
      onvaluechange:function () { 
        var value = Math.max(faderMin,Math.min(faderMax,parseFloat(this.element.val())));
        this.element.val(value);
        textTemp.setValue(value);
        fader.max = Math.min(faderMax, value + parseFloat(menu.value));
        fader.min = Math.max(faderMin, value - parseFloat(menu.value));
        fader.setValue(value);
      },
      ontouchmousedown:function () {
        focus.setValue(1);
      },
    });

    var menu = new Interface.Menu({ bounds:[.2,.0,.1,1], value:defaultMenu, options:items,
      onvaluechange:function () {
        fader.ontouchmouseup();
      },
    });

    var textTemp = new Interface.TextField({ bounds:[0,0,0,0], value:defaultVal, target:"OSC",  key:keyVal,name:name, 
      onvaluechange:function () {
        text.element.val(Math.round(this.value*100000)/100000);
        text.onvaluechange();
      },
      ontouchmousedown:function () {
        focus.setValue(1);
      },
    });
    
    var focus = new Interface.Button({ bounds:[0,0,0,0], value:0, name:"focus",
    });

    var fader = new Interface.Crossfader({ bounds:[.3,.0,.45,.995], crossfaderWidth:5, min:faderMin, max:faderMax,
      onvaluechange:function () { 
        text.element.val(Math.round(this.value*100000)/100000);
      },
      ontouchmousedown:function () {
        focus.setValue(1);
      },
      ontouchmouseup:function () {
        text.onvaluechange();
      },
      
    });
    
    var go = new Interface.Button({ bounds:[.895,.0,.1,.995], label:'Send', mode:'contact',
      ontouchmouseup:function () {
        textTemp.sendTargetMessage();
        focus.setValue(0);
      }
    });
    var up = new Interface.Button({ bounds:[.85,.0,.045,.5],label:'+', mode:'contact',
      ontouchmousedown:function () {
      text.element.val(Math.round(100000*(parseFloat(text.element.val())+parseFloat(menu.value)))/100000);
        text.onvaluechange();
        focus.setValue(1);
      },
    });
    
    var down = new Interface.Button({ bounds:[.85,.5,.045,.49],  label:'-', mode:'contact',
      ontouchmousedown:function () {
      text.element.val(Math.round(100000*(parseFloat(text.element.val())-parseFloat(menu.value)))/100000);
        text.onvaluechange();
        focus.setValue(1);
      },
    });
    
    panel.add(label, text, fader, go, up, down,textTemp, focus, menu);
  }
  
  
  
  var Selector = function (panelName, label, unit, items, faderMin, faderMax, defaultVal, defaultMenu, negative, keyVal, hardMinMax, name) {
  
    var panel = new Interface.Panel({  background:"black", container:document.querySelector(panelName) });

    var label = new Interface.Label({bounds:[.0,.2,.25,1],value:label,});
    var text = new Interface.TextField({ bounds:[.77,.0,.18,1],value:defaultVal +unit, //target:"OSC", key:keyVal+"_text", 
      onvaluechange:function () { 
        if (!negative){
          this.element.val(Math.max(0,parseFloat(this.element.val()))+ unit);
        }
        if (hardMinMax) {
            this.element.val(Math.max(faderMin,Math.min(faderMax,parseFloat(this.element.val())))+ unit);
        }
        fader.ontouchmouseup();
        fader.sendTargetMessage();
        focus.setValue(0);
      },
      ontouchmousedown:function () {
        focus.setValue(1);
      },
    });
    var fader = new Interface.Crossfader({ key:keyVal, bounds:[.35,.0,.42,.995], crossfaderWidth:5, min:faderMin, max:faderMax, target:"OSC", value:defaultVal, name:name,
      onvaluechange:function () { 
        text.element.val(Math.round(this.value*100000)/100000 + unit);
      },
      
      ontouchmouseup:function () {
        if (!negative){
          this.min = Math.max(parseFloat(text.element.val()) - parseFloat(menu.value), 0);
        } else if (!hardMinMax) {
          this.min = parseFloat(text.element.val()) - parseFloat(menu.value);
        }
        if (hardMinMax) {
            this.max = Math.min(faderMax, parseFloat(text.element.val()) + parseFloat(menu.value));
            this.min = Math.max(faderMin, parseFloat(text.element.val()) - parseFloat(menu.value));
        } else {
            this.max = parseFloat(text.element.val()) + parseFloat(menu.value);
        }
        this.setValue(parseFloat(text.element.val()));
        focus.setValue(0);
      },
      
      ontouchmousedown:function () {
        focus.setValue(1);
      },
      
      });
    
    var menu = new Interface.Menu({ bounds:[.2,.0,.15,1], value:defaultMenu+ unit, options:items,
      onvaluechange:function () {
        fader.ontouchmouseup();
      },
    });
    var up = new Interface.Button({ bounds:[.95,.0,.045,.5], label:'+', mode:'contact',
      onvaluechange:function () { 
        text.element.val(Math.round(100000*(parseFloat(text.element.val())+parseFloat(menu.value)))/100000 + unit);
        text.onvaluechange();
      }
    });
    
    var down = new Interface.Button({ bounds:[.95,.5,.045,.49], label:'-', mode:'contact',
      onvaluechange:function () { 
        text.element.val(Math.round(100000*(parseFloat(text.element.val())-parseFloat(menu.value)))/100000 + unit);  
        text.onvaluechange();
      },
    });
        
    var focus = new Interface.Button({ bounds:[0,0,0,0], value:0, name:"focus",
      
    });
    
    panel.add(label, text, fader, menu, up, down, focus);
  }
  
  
  var ColorSelector = function (panelName, label, faderMin, faderMax, defaultVal, keyVal, name) {
  
    var panel = new Interface.Panel({  background:"black", container:document.querySelector(panelName) });

    var label = new Interface.Label({bounds:[.0,.2,.25,1],value:label,});
    var text = new Interface.TextField({ bounds:[.80,.0,.15,1],value:defaultVal,
      onvaluechange:function () { 
        temp = parseFloat(Math.max(Math.min(faderMax,this.value),faderMin));
        this.element.val(temp);
        fader.setValue(temp);
        fader.sendTargetMessage();
        focus.setValue(0);
      },
      ontouchmousedown:function () {
        focus.setValue(1);
      },
    });
    var fader = new Interface.Slider({ key:keyVal, bounds:[.20,.0,.60,.995], isVertical:false, min:faderMin, max:faderMax, value:defaultVal, target:"OSC", name:name,
      onvaluechange:function () { 
        text.element.val(Math.round(this.value*100000)/100000);
      },
      ontouchmouseup:function () {
        focus.setValue(0);
      },
      
      ontouchmousedown:function () {
        focus.setValue(1);
      },
    });
    
    var up = new Interface.Button({ bounds:[.95,.0,.045,.5], label:'+', mode:'contact',
      onvaluechange:function () { 
        text.setValue(Math.round(100000*(parseFloat(text.element.val())+1))/100000);
        text.onvaluechange(); 
      }
    });
    
    var down = new Interface.Button({ bounds:[.95,.5,.045,.5], label:'-', mode:'contact',
      onvaluechange:function () { 
        text.setValue(Math.round(100000*(parseFloat(text.element.val())-1))/100000);
        text.onvaluechange();
      },
    });
    
        
    var focus = new Interface.Button({ bounds:[0,0,0,0], value:0, name:"focus",
      
    });
    
    panel.add(label, text, fader, up, down, focus);
  }
  
  var CreateDiv = function(name, id, parentDiv) {
    var div1 = document.createElement("div");
    div1.className = name;
    div1.id = id;
    parentDiv.appendChild(div1);
  }

  var CreateHeader = function(elem, text, parentDiv) {
    var header = document.createElement(elem);
    var headerText = document.createTextNode(text);
    header.appendChild(headerText);
    parentDiv.appendChild(header);
   
  }


  var DatasetPosition = function(id, title, div) {
    CreateHeader("h1",title, div);
    CreateHeader("h2","Position", div);
    CreateDiv("rowHeight", "xPanel" + id, div);
    CreateDiv("rowHeight", "yPanel" + id, div);
    CreateDiv("rowHeight", "zPanel" + id, div);
    CreateHeader("h2","Orientation", div);
    CreateDiv("rowHeight", "rollPanel" + id, div);
    CreateDiv("rowHeight", "pitchPanel" + id, div);
    CreateDiv("rowHeight", "yawPanel" + id, div);
  //  CreateHeader("h2","Scale", div);
  //  CreateDiv("rowHeight", "scalePanel" + id, div);

    var a = new Selector("#xPanel" + id, 'X: ', ' nm', ['10.0 nm', '1.0 nm', '0.1 nm', '0.01 nm'], -1, 1,0,10, true,"/" + id + "X", false, "x"+id);
    var b = new Selector("#yPanel" +id, 'Y: ', ' nm', ['10.0 nm', '1.0 nm', '0.1 nm', '0.01 nm'], -1, 1,0,10, true,"/" + id + "Y", false, "y"+id);
    var c = new Selector("#zPanel" +id, 'Z: ', ' nm', ['10.0 nm', '1.0 nm', '0.1 nm', '0.01 nm'], -1, 1,0,10, true,"/" + id + "Z", false, "z"+id);
    var d = new Selector("#rollPanel" + id, 'Roll: ', ' deg', ['100 deg', '10 deg', '1.0 deg', '0.1 deg', '0.01 deg'], -180, 180, 0, 100, true,"/" + id + "Roll", true, "roll"+id);
    var e = new Selector("#pitchPanel" + id, 'Pitch: ', ' deg', ['100 deg', '10 deg', '1.0 deg', '0.1 deg', '0.01 deg'], -90, 90, 0, 100, true,"/" + id + "Pitch", true, "pitch"+id);
    var f = new Selector("#yawPanel" + id, 'Yaw: ', ' deg', ['100 deg', '10 deg', '1.0 deg', '0.1 deg', '0.01 deg'], -180, 180, 0, 100, true,"/" + id + "Yaw", true, "yaw"+id);
  //  var g = new Selector("#scalePanel" +id, '', ' %', ['100 %', '10 %', '1.0 %', '0.1 %', '0.01 %', '0.001 %'], 0, 200, 100, 100, false,"/" + id + "/Scale", false);
    
  }
  
  var DatasetControl = function(id, title, div, toggles) {
    CreateHeader("h1",title, div);
    CreateDiv("rowHeight","visible"+id,div);
    CreateDiv("rowHeight", "rPanel" + id, div);
    CreateDiv("rowHeight", "gPanel" + id, div);
    CreateDiv("rowHeight", "isosurfacePanel" + id, div);
    if (toggles){
        CreateHeader("h2","Toggles", div);
        CreateDiv("rowHeight", "buttonAPanel" + id, div);
        CreateDiv("rowHeight", "ButtonBPanel" + id, div);
    }
    
    d1 = new Interface.Panel({  background:"black", container:document.querySelector("#visible" + id) });
    var d11 = new Interface.Button({ bounds:[.2,0,.7975,.995],  label:'Visible', target:"OSC", value:1, key:"/" + id + 'visible',});
    d1.add(d11);
    
    var d1a = new IsoSelector("#isosurfacePanel" +id, 'Isosurface: ', ['1.0', '0.1', '0.01'], 0, 3,.5,.1,"/" + id + "Isosurface", "iso"+ id);
    
    var d1b = new ColorSelector("#rPanel" +id, 'Hue: ', 0, 255,1,"/" +  id + "R", "hue" +id);
    var d1c = new ColorSelector("#gPanel" +id, 'Alpha: ', 0, 255,255,"/" + id + "G", "alpha"+id);
    
    if (toggles) {
        buttonAPanel = new Interface.Panel({  background:"black", container:document.querySelector("#buttonAPanel" +id) });
        buttonBPanel = new Interface.Panel({  background:"black", container:document.querySelector("#buttonBPanel" +id) });
        var i = new Interface.Button({ bounds:[.2,0,.3975,1],  label:'Bounding Box Toggle', target:"OSC", key:"/" + id + 'BoundingBox',value:1,});
        var j = new Interface.Button({ bounds:[.5975,0,.398,1],  label:'Bounding Box Grid Toggle', target:"OSC", key:"/" + id + 'BoundingBoxGrid',});
        var k = new Interface.Button({ bounds:[.2,0,.3975,1],  label:'Gnomon Toggle', target:"OSC", key:"/" + id + 'Gnomon',value:1,});
        var l = new Interface.Button({ bounds:[.5975,0,.398,1],  label:'Orientation Toggle', target:"OSC", key:"/" + id + 'Orientation',value:1,});
        buttonAPanel.add(i,j);
        buttonBPanel.add(k,l);
    }
  }
  
  
  var WorldControl = function(div) {
    
    CreateHeader("h1","World View", div);
    CreateDiv("rowHeight", "WbuttonPanel", div);
    CreateDiv("rowHeight", "WbuttonPanel2", div);
    CreateDiv("rowHeight", "WbuttonPanel3", div);
 //   CreateHeader("h2","Scale", div);
 //   CreateDiv("rowHeight", "WscalePanel", div);

  //  g = new Selector("#WscalePanel", '', ' %', ['100 %', '10 %', '1.0 %', '0.1 %', '0.01 %', '0.001 %'], 0, 200, 100, 100, false, "/w/Scale");
        
    DatasetPosition("w", "", div);
    
    var buttonPanel = new Interface.Panel({  background:"black", container:document.querySelector("#WbuttonPanel") });
    var h = new Interface.Button({ bounds:[.2,0,.2658,.995],  label:'Ground Plane Toggle', key:'/wPlane', value:1});
    var h0 = new Interface.Button({ bounds:[.4658,0,.2658,.995],  label:'sLerp On', key:'/wSlerp', mode:'contact' });
    var h01 = new Interface.Button({ bounds:[.7316,0,.2658,.995],  label:'Default Pose', key:'/DefaultPose', mode:'contact' });
    buttonPanel.add(h);
    buttonPanel.add(h0);
    buttonPanel.add(h01);
    
    var label1 = new Interface.Label({bounds:[.0,.2,.25,1],value:'Dataset:',});
    var buttonPanel2 = new Interface.Panel({  background:"black", container:document.querySelector("#WbuttonPanel2") });
    var h1 = new Interface.Button({ bounds:[.2,0,.3975,.995],  mode:'contact', label:'0', key:'/Dataset0',});
    var h3 = new Interface.Button({ bounds:[.5975,0,.3975,.995],  mode:'contact', label:'2', key:'/Dataset2',});
    buttonPanel2.add(label1);
    buttonPanel2.add(h1);
    buttonPanel2.add(h3);
    
    var label2 = new Interface.Label({bounds:[.0,.2,.25,1],value:'Key:',});
    var buttonPanel3 = new Interface.Panel({  background:"black", container:document.querySelector("#WbuttonPanel3") });
    var h4 = new Interface.Button({ bounds:[.2,0,.1140,.995],  mode:'contact', label:'1', key:'/Key1',});
    var h5 = new Interface.Button({ bounds:[.3140,0,.1140,.995],  mode:'contact', label:'2', key:'/Key2',});
    var h6 = new Interface.Button({ bounds:[.4280,0,.1140,.995],  mode:'contact', label:'3', key:'/Key3',});
    var h7 = new Interface.Button({ bounds:[.5420,0,.1140,.995],  mode:'contact', label:'4', key:'/Key4',});
    var h8 = new Interface.Button({ bounds:[.6560,0,.1140,.995],  mode:'contact', label:'5', key:'/Key5',});
    var h9 = new Interface.Button({ bounds:[.7700,0,.1140,.995],  mode:'contact', label:'6', key:'/Key6',});
    var h10 = new Interface.Button({ bounds:[.8840,0,.1143,.995],  mode:'contact', label:'7', key:'/Key7',});
    buttonPanel3.add(label2);
    buttonPanel3.add(h4);
    buttonPanel3.add(h5);
    buttonPanel3.add(h6);
    buttonPanel3.add(h7);
    buttonPanel3.add(h8);
    buttonPanel3.add(h9); 
    buttonPanel3.add(h10);

  }
  
