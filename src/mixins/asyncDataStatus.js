/* Mixins
  Se usan para compartamiento general (no estadio) que esperamos que tenga cada componente.
  -Por convencion, se recomienda dar prefijos a todas las propiedades de un mixin para evitar conflictos con las props de un componente.
    usar esta convencion, en el componente particular habilita a indentificar el componente es un mixin (posiblemente) y facilita la busqueda.
*/
export default {
  data () {
    return {
      asyncDataStatus_ready: false
    }
  },

  methods: {
    // Se hace en un metodo porque se podria querer realizar mas cosas.
    asyncDataStatus_fetched () {
      this.asyncDataStatus_ready = true
    }
  }
}
