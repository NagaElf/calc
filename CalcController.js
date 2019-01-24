class CalcController{

    constructor(){



        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora" );
        this._currentDate;
        this.initialize(); 
        this.initiButtonsEvents();
        this.initiKeyboard();
    }

    initialize (){
            //this.displayDate = this.currentDate.toLocaleDateString(this.locale);
            //this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
            this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
    }

    initiKeyboard(){

        document.addEventListener('keyup', e=>{

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            }
        })
    }

    get displayCalc(){
        //console.log('Você chamou método get displaycalc')
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
        //console.log('Você chamou método set displaycalc')
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this.locale,{day:"2-digit",month:"short",year:"numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }
    
    get currentDate(){
            return new Date();
    }

    set currentDate(value){
        this._dateEl.innerHTML = value;
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false)
        })
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        return (['+','-','*','%','/','.'].indexOf(value)>-1);
    }                                                          

    pushOperation(value){
        
        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
        }

    }

    getResult(){
        
        //console.log('getResult', this._operation);
        return eval(this._operation.join(""));

    }

    calc(){
        
        let last = '';

        this._lastOperator = this.getLastItem();//Armazena o último operador
        
        if(this._operation.length < 3){
         
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
            
        }

        if(this._operation.length > 3){
                                   
             last = this._operation.pop();

                 //this._lastOperator = this.getLastItem();

                 this._lastNumber = this.getResult();

             } else if(this._operation.length == 3){

                 //this._lastOperator = this.getLastItem();

                 this._lastNumber = this.getLastItem(false);
                
            }

            //console.log('lastOperator',this._lastOperator);
            //console.log('lastNumber',this._lastNumber);

        let result = this.getResult();//result = String com os valores já calculados(eval)

        if (last == '%'){

            result /= 100;
            this._operation = [result];

        } else {

            this._operation = [result];
            if (last) this._operation.push(last);

 }
        this.setLastNumberToDisplay();
}

    getLastItem(isOperator = true){
                                   
        let lastItem;

        for (let i = this._operation.length-1; i>=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                //this.isOperator(this._operation[i]) == TRUE (default) ou FALSE

                lastItem = this._operation[i];
                break;
            }       

            if (!lastItem){

                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

            }
        }
        return lastItem;
}

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){
        
        //console.log('Ultimo valor digitado: '+value,isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())){
            
            if(this.isOperator(value)){

                this.setLastOperation(value);

            } else {
                
                this.pushOperation(value); 
                this.setLastNumberToDisplay();

            }
            
        } else {
    
            if(this.isOperator(value)){
                
                this.pushOperation(value);

            } else {
                
                let newValue = this.getLastOperation().toString()+value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }
         }
 }

    setError(){
            this.displayCalc = 'Error'
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){//!lastOperation = undefined
            
            this.pushOperation('0.');
            
        } else {
            
            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay()
        /*if(this._operation.length == 0){

            let firstDot = '0.';
            this._operation.push((firstDot));
            this.setLastNumberToDisplay();

        } else if(this._operation.length == 1){

            let DotOperation = '0.'+lastOperation.toString()
            this._operation.pop();
            this._operation.push(parseFloat(DotOperation));

        }

        this.setLastNumberToDisplay();*/
    }

    exectBtn(value){

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;
                
            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    }

    initiButtonsEvents(){
        let buttons = document.querySelectorAll('#buttons >g, #parts >g')
        //Percorre buttons (nodelist), cada item é um botão (btn)
        buttons.forEach(btn =>{
            
            this.addEventListenerAll(btn, 'click drag', e=>{
            let TextBtn = btn.className.baseVal.replace('btn-','')
            this.exectBtn(TextBtn);

            });
            
        this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
            btn.style.cursor = 'pointer'
        })
        })
        
    }
}    
