

$(document).ready(function(){
    if("carrito" in localStorage) {
      const arrayLiterales = JSON.parse(localStorage.getItem("carrito"));
      for(const literal of arrayLiterales) {
        carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria));
      }
      console.log(carrito);
      carritoFinal(carrito);
    }
    $(".dropdown-menu").click(function(e){
        e.stopPropagation();
    });
    $.get("../data/productos.json", function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == "success") {
          for(const literal of datos){
            productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad));
          }
        }
        console.log(productos);
        productosHtml(productos, '#productosPublicados');
    });
});


selectUI(categorias, "#filtroCategorias");

$('#filtroCategorias').change(function(e) {
  const value = this.value;

  $('#productosPublicados').fadeOut(600, function(){
    if(value == 'TODOS'){
      productosHtml(productos, '#productosPublicados');
    } else {
      const filtrados = productos.filter(producto => producto.categoria == value);
      productosHtml(filtrados, '#productosPublicados');
    }
    $("#productosPublicados").fadeIn();
  })
});
  



$("#btn-combo").click(function(e){
  $("#incluye").toggle();
})

$("#btn-combo1").click(function(e){
  $("#incluye1").toggle();
})

$("#btn-combo2").click(function(e){
  $("#incluye2").toggle();
})

$("#btn-combo3").click(function(e){
  $("#incluye3").toggle();
})