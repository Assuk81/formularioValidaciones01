class JSValidator{

    //controlar con status si el formulario se valida correctamente o no
    estado = true;

    errores = [];

    via = 'http';

    constructor(formId){

        //llamamos al metodo desde el constructor
        this.setForm(formId);

        //llamamos desde el constructor al metodo setInputs
        this.setInputs();

        //llamamos al metodo de sacar el padre de cada input y poner un span al final del cada padre, justo antes
        //de su cierre, debajo del input,crea esa etiqueta como si debajo de cada input creamos de forma manual un div,
        //una p, un span para mostrar el error cuando se hacen validaciones en los formularios
        this.parseInputs();

    }


    setForm(formId){
        //creamos variable form y metemos el id del formulario,metodo que accede al id del formulario
        this.form = document.getElementById(formId);
    }


    setInputs(){
        //vamos a sacar todos los inputs, accedemos al id del formulario y luego seleccionamos a la clase jsValidator.
        //todos los elementos que esten dentro del id del formulario y tengan esa clase
        this.inputs = document.querySelectorAll(`#${this.form.id}.jsValidator`); 
    }



    setAjax(){

        this.via = 'ajax';

        return this;

    }



    parseInputs(){
        //iteramos el array inputs para operar con cada input del formulario
        this.inputs.forEach(input=>{
            
            //lamamos al metodo de adjuntar etiquetas de errores y enviamos el input
            //como parametro
            //resumiento,recorremos con foreach y a cada input le asignamos un error
            this.adjuntarEtiquetasError(input);
        });
    }


    //metodo para juntar las etiquetas de error que recoge como parametro el input
    adjuntarEtiquetasError(input){
        

        //vamos a identificar el padre de cada input,un div o la etiqueta que hayamos puesto como padre de un input
        var parent = input.parentNode;

        //creamos una etiqueta llamada span y se mete en la variable span
        var span = document.createElement("span");

        //creamos un atributo para la etiqueta span que hemos creado
        //asignamos un atributo tipo clase y un valor de la clase que se llama
        //error-mensaje
        span.setAttribute("class","error-mensaje");

        //le decimos al elemento padre que la indexe al final
        parent.appendChild(span);
    }


    //metodo que se encarga de la validacion
    validacionFormulario(){
        //tenemos que crear una "escucha" al evento submit
        //evento de escucha necesita 2 parametros:
        //---el primero es el tipo de evento que se efectua sobre el this.form(sobre el formulario) que es el
        //elemento sobre el que esta siendo llamado
        //---el segundo es una funcion anonima que recibe como parametro el evento(e) y se encarga de realizar
        //una accion o una serie de acciones
        this.form.addEventListener('submit',(e)=>{
            //e.preventDefault();
            //reiniciar errores y cambiar estado a true
            this.resetValidacion();
            

            //recorremos todos los input para comprobar que todas las validaciones se realicen correctamente
            //por cada input del foreach vamos a validarlo
            this.inputs.forEach(input=>{
                //validar cada input
                this.validacionInput(input);
            });

            if(!this.estado){
                 //para evitar que se envie formulario cuando hay error, añadimos el evento event default de la siguiente manera
                e.preventDefault();

            }else{

                //cuando el formulario ha tenido exito
                e.preventDefault();
            }

        });
    }

    //validar todos los inputs
    validarInputs(){
        
        this.inputs.forEach(input =>{
            //se añade una escucha para cada input,se escucha al evento input dentro de parentesis y funcion anonima
            input.addEventListener('input', (e) =>{

                this.resetValidacion();

                this.validacionInput(input);

            });
        });
    }




    //este metodo se va a encargar de validar cada uno de nuestros inputs y tiene que recibir como parametro 
    //el input que se esta intentando validar
    validacionInput(input){
        
        //recuperamos los validadores dentro de una variable,con esto accedemos a los data-validators del input
        var validaciones = input.dataset.validaciones;//en este caso required y length,en el input del nombre

        if(validaciones !== undefined){
            validaciones = validaciones.split(' ');//separamos con un espacio los 2 data-validators del input

            //recorremos cada validador
            validaciones.forEach(validaciones =>{

                //si el validador es required => su metodo sería: _required(input)
                //si el validador es length => su metodo sería: _length(input)
                this[`_${validaciones}`](input);


            });
        }
    }

    
    setErrores(input,mensaje){

       // Cambiar el estado a false
	this.status = false;
 
	// Apilar error
	this.setStackError(input, mensaje);
 
	// Mandar un error
	this.setErrorMensaje(input, mensaje); // PENDIENTE: Ver si no existe un msg personalizado con dataset
	
       
    }


    setStackError(input,mensaje){

         //añadir el error al array errores definido arriba
         this.errores.push({input: input,mensaje: mensaje})
    }


    setErrorMensaje(input,mensaje){

         //capturar el span que esta justo despues del input
         var span = input.nextElementSibling;
         //con += se concatenan los errores
         span.innerHTML += (mensaje + '<br/>');
    }


    resetValidacion(){

        this.estado = true;
        this.resetStackError();
        this.resetErrorMensaje();
        
       
       
    }

    resetStackError(){
         //resetear errores
         this.errores = [];
    }

    resetErrorMensaje(){
        var spans = document.querySelectorAll(`#${this.form.id}.error-mensaje`);
        spans.forEach(span =>{
            span.innerHTML = "";
        });
    }



    //metodo init para inicializar todas las escuchas para
    //los envios del formulario, siempre en la ultima parte de la clase
    init(){

        this.validacionFormulario();

        this.validarInputs();
    
        //retornamos la misma clase
        return this;

    }

}

//aqui dentro va toda la logica de validacion de required
JSValidator.prototype._required = function(input){
  var value = input.value;
  var mensaje = "Campo requerido";

  if(value.trim() === "" || value.length < 1){

    this.setErrores(input,mensaje);
  }
};


//aqui dentro va toda la logica de validacion de length
JSValidator.prototype._length = function(input){
    console.log("se valida length");
}