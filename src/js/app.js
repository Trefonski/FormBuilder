require('../scss/style.scss')


var app = app || {};
            app.db = '';
            app.counter = 0;
            app.condtype;
            var ElementFrame = ElementFrame || {};
            ElementFrame.SelectType = '<select><option value="1">Text</option><option value="2">Number</option><option value="3">Yes/NO</option></select>';
            ElementFrame.QuestionLabel = '<label>Question</label>';
            ElementFrame.ConditionLabel = '<label>Condition</label>';
            ElementFrame.TypeLabel = '<label>Type</label>';
            ElementFrame.Buttons = '<button class="nav-right"';
            ElementFrame.SelectConditionType = '<select><option value="1">Text</option><option value="2">Number</option><option value="3">Yes/NO</option></select>';
            var Inputs = [];
            
            
            function Input(number, parent, InputType, Condition, ConditionType){
                this.number = number;
                this.parent = parent;
                this.InputType = InputType;
                this.question = '';
                this.type = 1;
                this.Condition = '';
                this.ConditionType = 1;
            }
            function openDB(){
                var DBOpenRequest = window.indexedDB.open('inputs', 8);
                DBOpenRequest.onerror = function(){
                    alert('Error while opening database! '+ event.target.errorCode);
                }
                DBOpenRequest.onsuccess = function(){
                    console.log('success');
                    app.db = DBOpenRequest.result;
                    console.log(app.db);
                    display();
                };
                DBOpenRequest.onupgradeneeded = function(event){
                    if(event.oldVersion < 6){
                        app.db = DBOpenRequest.result;
                        var db = app.db;
                        var objectStore = db.createObjectStore('inputs', { keyPath: 'number' } );
                        objectStore.createIndex('parent','parent', { unique : false } );
                        objectStore.createIndex('InputType','InputType', { unique : false } );
                        objectStore.createIndex('question','question', { unique : false } );
                        objectStore.createIndex('type','type', { unique : false } );
                        objectStore.createIndex('Condition','Condition', { unique : false } );
                        objectStore.createIndex('ConditionType','ConditionType', { unique : false } );
                    }
                    var db = event.target.result;
                    db.onerror = function(event){
                        alert('error');
                    }  
                }
            }
            Input.prototype.Create = function(){
                var number = app.counter;
                var transaction = app.db.transaction(['inputs'], 'readwrite');           
                transaction.oncomplete = function(event){
                    console.log('transaction completed');
                }
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.add(Inputs[app.counter]);
                dsp(number, this);
            }
            
            function AddInput(){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var objectstore = transaction.objectStore('inputs');
                var requestSecond = objectstore.getAll();
                requestSecond.onsuccess = function(){
                    var objCnt = requestSecond.result.length;
                    if(objCnt> 1){
                        app.counter = requestSecond.result[objCnt-1].number;
                        console.log(app.counter);
                    }
                }
                app.counter++;
                parent = 'form';
                InputType = 'normal';
                Inputs[app.counter] = new Input(app.counter, parent, InputType);
                Inputs[app.counter].Create();
                
            }
            
            function AddSubInput(parent){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var objectstore = transaction.objectStore('inputs');
                var requestSecond = objectstore.getAll();
                requestSecond.onsuccess = function(){
                    var cus = requestSecond.result.length;
                    console.log(cus);
                    console.log(request2.result);
                    app.counter = request2.result[cus-1].number;
                    console.log(app.counter);
                    app.counter++;
                InputType = 'sub';
                Inputs[app.counter] = new Input(app.counter, parent.id, InputType);
                Inputs[app.counter].Create();
                }  
            }
            
            function DeleteInput(identifier){
                var objId = identifier.id;
                var objNum = objId.split('_');
                console.log(objNum[1]);
                var element = document.getElementById(objId);
                element.parentNode.removeChild(element);
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var objectstore = transaction.objectStore('inputs');
                var delObj = objectstore.delete(parseInt(lel[1]));
                function sth(z, data, noo){                  
                    if(data[z].parent == noo){
                        var lel2 = data[z].number;
                        noo = 'sub_'+data[z].number;
                        console.log(noo);
                        var del2 = objectstore.delete(parseInt(lel2));
                        uhh(noo);           
                    }
                }
                var noo = identifier.id;
                console.log(noo);
                uhh(noo);
                function uhh(noo){
                    var request = objectstore.getAll();
                    request.onsuccess = function(){
                        console.log(request.result);
                        app.counter = request.result.length;
                        
                        var data = request.result;
                    
                        console.log(data.length);
                    
                        for(var z = 0; z < data.length; z++){
                            console.log(data[z].number);
                            console.log(data[z].parent);
                            console.log(noo);
                        sth(z, data, noo);
                
                        }
                    } 
                    
                    
                }
                
            }
            
            function display(){
                var db = app.db;
                console.log(app.db);
                var transaction = db.transaction(['inputs'], 'readonly');
                console.log(transaction);
                var objectstore = transaction.objectStore('inputs');
                var request = objectstore.getAll();
                request.onsuccess = function(){
                    console.log(request.result);
                    app.counter = request.result.length;
                    
                    var data = request.result;
                    
                    console.log(data.length);
                    for(var z = 0; z < data.length; z++){
                        var number = parseInt(data[z].number);
                        console.log(number);
                        dsp(number, data[z]);
                        
          
                        
                    }
                }                
            }
            
            function UpdateQuestion(number){
                console.log(number);
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var f = event.target.value;
                console.log(event.target.value);
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(number);
                objectStoreRequest.onsuccess = function(){
                    var x = objectStoreRequest.result;
                    x.question = f;
                    var update = objectstore.put(x);
                }
            }
            function UpdateSelect(select, number){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var f = select.value;
                console.log(event.target.value);
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(number);
                objectStoreRequest.onsuccess = function(){
                    var x = objectStoreRequest.result;
                    console.log(f);
                    var pp = x.parent;
                    console.log(number);
                    x.type = parseInt(f);
                    if(x.InputType == "normal"){
                       var xc = document.getElementById("input_"+number);
                    }else{
                        var xc = document.getElementById("sub_"+number);
                    }
                    console.log(xc);
                    var cc = xc.childNodes;
                    console.log(cc);
                    console.log(cc.length);
                    var update = objectstore.put(x);
                    for(var j = 1; j < cc.length;j++){
                        var zz = cc[j];
                        var l = zz.id;
                        var kh = l.split('_');

                        var removeOldSelect = document.getElementById(l).getElementsByTagName('div')[0];
                        removeOldSelect.removeChild(removeOldSelect.childNodes[0]);
                        var objectStoreRequestSecond = objectstore.get(parseInt(kh[1]));
                        objectStoreRequestSecond.onsuccess = function(){
                            console.log(objectStoreRequestSecond.result);
                            var override = objectStoreRequestSecond.result;
                            override.Condition = "";
                            override.ConditionType = 1;
                            var update = objectstore.put(override);
                            UpdateConditionType(kh[1],  number);
                        }
                        //UpdateConditionType(kh[1],  number);
                    }
                    
                }
            }
            function UpdateCondition(number){
                console.log(number);
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var f = event.target.value;
                console.log(event.target.value);
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(number);
                objectStoreRequest.onsuccess = function(){
                    var x = objectStoreRequest.result;
                    x.Condition = f;
                    var update = objectstore.put(x);
                }
            }
            function UpdateConditionYN(select, number){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var f = select.value;
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(number);
                objectStoreRequest.onsuccess = function(){
                    var x = objectStoreRequest.result;
                    x.Condition = parseInt(f);
                    var update = objectstore.put(x);
                    
                }
            }
            function UpdateConditionType(l, parentNumber){
                
                console.log(parentNumber);
                var transaction = app.db.transaction(['inputs'], 'readonly');
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(parseInt(parentNumber));
                objectStoreRequest.onsuccess = function(){
                    var hm = '<p><label>Condition</label><span>';
                    var ct = objectStoreRequest.result.type;
                    var objectStoreRequestSecond = objectstore.get(parseInt(l));
                    
                    objectStoreRequestSecond.onsuccess = function(){
                        var cs = objectStoreRequestSecond.result.ConditionType;
                        var dspCond = objectStoreRequestSecond.result.Condition;
                        console.log(cs);
                        if(ct==2){
                        hm += '<input type="number" onfocusout="UpdateCondition('+l+')" value="'+dspCond+'"></select><select onchange="saveConditionType(this, '+l+')">';
                        switch(parseInt(cs)){
                            case 1:
                                hm += '<option value="1" selected>Equals</option><option value="2">Greater than</option><option value="3">Less than</option>';
                                break;
                            case 2:
                                hm += '<option value="1" selected>Equals</option><option value="2" selected>Greater than</option><option value="3">Less than</option>';
                                break;
                            case 3:
                                hm += '<option value="1">Equals</option><option value="2">Greater than</option><option value="3"  selected>Less than</option>';
                                break;
                        }
                        
                    }else if(ct==3){
                        if(dspCond == 2){
                            hm+='<select onchange="UpdateConditionYN(this, '+l+')"><option disabled style="display:none;"></option><option value="1" selected>Yes</option><option value="2">No</option></select><select><option>Equals</option></select>';
                        }else if(dspCond == 1){
                            hm+='<select onchange="UpdateConditionYN(this, '+l+')"><option disabled style="display:none;"></option><option value="1">Yes</option><option value="2" selected>No</option></select><select><option>Equals</option></select>';
                        }else{
                            hm+='<select onchange="UpdateConditionYN(this, '+l+')"><option disabled selected style="display:none;"></option><option value="1">Yes</option><option value="2">No</option></select><select><option>Equals</option></select>';
                        }
                        
                    }else{
                        hm += '<input onfocusout="UpdateCondition('+l+')"  value="'+dspCond+'"><select><option>Equals</option></select></span></p>';
                    }
                    
                    var p = 'sub_'+l;
                    console.log(ct);
                    
                    document.getElementById(p).getElementsByTagName('div')[0].insertAdjacentHTML('afterbegin',hm);
                    }
                    
                    
                }
                console.log(app.condtype);
                
            }
            
            function saveConditionType(select, num){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                var objectstore = transaction.objectStore('inputs');
                var objectStoreRequest = objectstore.get(parseInt(num));
                objectStoreRequest.onsuccess = function(){
                    var request = objectStoreRequest.result;
                    request.ConditionType = select.value;
                    console.log(request.ConditionType);
                    var update = objectstore.put(request);
                }
            }
            
            function reset(){
                var transaction = app.db.transaction(['inputs'], 'readwrite');
                transaction.oncomplete = function(event){
                    var objectstore = transaction.objectStore('inputs');
                    var objectStoreRequest = objectstore.clear();
                    objectStoreRequest.onsuccess = function(){
                        alert('Form has been cleared.');
                    }
                    document.getElementById('form').innerHTML = '';
                }   
            }
            function dsp(number, data){
                if(number >= app.counter){
                    app.counter = number;
                    console.log(number);
                }
                        console.log(data);
                        var is = '';
                
                        if(data.InputType == "normal"){
                            var tag = 'input_'+number;
                        }else if(data.InputType == "sub"){
                            var tag = 'sub_'+number;
                            var p = data.parent;
                            var l = p.split('_');
                            
                            UpdateConditionType(number, l[1]);
                            console.log(app.condtype);
                        }
                        is += '<p>'+ElementFrame.QuestionLabel+'<input onfocusout="UpdateQuestion('+number+')" value="'+data.question+'"></p>';
                        is += '<p>'+ElementFrame.TypeLabel;
                        is += '<select onchange="UpdateSelect(this, '+number+')">';
                        switch(data.type){
                            case 1: 
                                is += '<option value="1" selected>Text</option><option value="2">Number</option><option value="3">Yes/NO</option>';
                                break;
                            case 2:
                                is += '<option value="1">Text</option><option value="2" selected>Number</option><option value="3">Yes/NO</option>';
                                break;
                            case 3:
                                is += '<option value="1">Text</option><option value="2">Number</option><option value="3" selected>Yes/NO</option>';
                                break;
                        }
                        is += '</select>';
                        var element = '<div class="block" id="'+tag+'"><div class="x">'+is+'</p>'+ElementFrame.Buttons+'onclick="AddSubInput('+tag+')">Add Sub-Input</button>'+ElementFrame.Buttons+' onclick="DeleteInput('+tag+')">Delete</button></div></div>';
                        document.getElementById(data.parent).insertAdjacentHTML('beforeend',element);
            }
            openDB();