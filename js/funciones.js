function productosHtml(productos, id){
    $(id).empty()
    for (const producto of productos) {
      $(id).append(`<div class="card card-produ" style="width: 18rem;">
                      <img src="https://via.placeholder.com/150" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.precio}</p>
                        <span class="categoria">${producto.categoria}</span>
                        <buttom id='${producto.id}' class="botonCompra">COMPRAR</buttom>
                      </div>
                    </div>`);
    }
    $('.botonCompra').on("click", comprarProducto);
}

function comprarProducto(e){
    e.preventDefault();
    e.stopPropagation();
    const idProducto   = e.target.id;
    const seleccionado = carrito.find(p => p.id == idProducto);
    if(seleccionado == undefined){
      carrito.push(productos.find(p => p.id == idProducto));
    } else {
      seleccionado.agregarCantidad(1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    carritoFinal(carrito);
}

function carritoFinal(productos){
    $('#cantidadTotal').html(productos.length);
    $('#productosTotal').empty();
    for (const producto of productos) {
      $('#productosTotal').append(registroCarrito(producto));
    }
    $("#productosTotal").append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);
    $("#productosTotal").append(`<div id="divConfirmar" class="text-center"><button id="btnConfirmar" class="btn btn-success">CONFIRMAR</button></div>`);

    $(".sumarProdu").click(addCantidad);
    $(".eliminarProdu").click(eliminarProductos);
    $(".restarProdu").click(restCantidad);
    $("#btnConfirmar").click(confirmarCompra);
  }
function registroCarrito(producto){
    return `<p> ${producto.nombre} 
          <span class="badge bg-warning"> Pracio unitario: $ ${producto.precio}</span>
          <span class="badge bg-warning">  ${producto.cantidad}</span>
          <span class="badge bg-success"> Precio total: $ ${producto.subtotal()}</span>
          <a id="${producto.id}" class="btn btn-info sumarProdu">+</a>
          <a id="${producto.id}" class="btn btn-warning restarProdu">-</a>
          <a id="${producto.id}" class="btn btn-danger eliminarProdu">x</a>
          </p>`
}


// function renderSelect(lista, id){
//     $(id).empty();
//     for (const item of lista) {
//       $(id).append(`<option value='${item}'>${item}</option>`);
//     }
//   }
function eliminarProductos(e) {
    console.log(e.target.id);
    let posicion = carrito.findIndex(p => p.id == e.target.id);
    carrito.splice(posicion, 1);
    console.log(carrito);
  
    carritoFinal(carrito);
  
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
   
function addCantidad() {
    let producto = carrito.find(p => p.id == this.id);
    producto.agregarCantidad(1);
    $(this).parent().children()[1].innerHTML = producto.cantidad;
    $(this).parent().children()[2].innerHTML = producto.subtotal();
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function restCantidad(){
  let producto = carrito.find(p => p.id == this.id);
  if(producto.cantidad > 1) {
    producto.agregarCantidad(-1);

    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = producto.cantidad;
    registroUI[2].innerHTML = producto.subtotal();
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

function selectUI(lista, selector){
    
    $(selector).empty();
  
    
    lista.forEach(element => {
      $(selector).append(`<option value="${element}">${element}</option>`)
    });
    $(selector).prepend(`<option value="TODOS" selected>TODOS</option>`);
}
  

function totalCarrito(carrito) {
    console.log(carrito);
    let total = 0;
    carrito.forEach(p => total += p.subtotal());
    return total.toFixed(2);
}
  

function confirmarCompra(){
  const URLPOST = 'http://jsonplaceholder.typicode.com/posts';
  const DATA = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
  $.post(URLPOST, DATA, function(respuesta,estado){
    if(estado == 'success'){
      $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show" role="alert">
                  <p class="confirmarCompra"><strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.</p>
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`).fadeIn().delay(2000);
      carrito.splice(0, carrito.length);
      localStorage.setItem("CARRITO",'[]');
      $('#productosTotal').empty();
      $('#cantidadTotal').html(0);
    }
});
}