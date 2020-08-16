<template>
  <div class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CatergoryList'

export default {
  name: 'HelloWorld',

  components: {
    CategoryList
  },

  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },

  // Se llama antes de crear la instancia de Vue y setearle toda la configuracion inicial
  beforeCreate () {
    console.log('📡 beforeCreate', this.categories)
  },

  // Realiza la creacion del componente, asi como toda su configuration/options/computed properties.
  created () {
    console.log('📡 Create', this.categories)
  },

  beforeMount () {
    console.log('📡 BeforeMount', this.categories)
  },

  // Mejor analogia: Es como el ready de jQuery. (insertado en el DOM)
  mounted () {
    console.log('📡 Mounted', this.categories, this.$el.innerText)
  },

  // Se entiene, como remover eventos, un ejemplo de uso.
  beforeDestroy () {
    console.log('📡 BeforeDestroy - turn off listeners', this.categories)
  },

  // 1 Hooks mas(destroyed). Destroy: Una instancia es destruida, cuando es removida del DOM. Ejemplo v-if. Cuando no se cumple la condicion, se destruye el componente!
  destroyed () {
    console.log('📡 Destroyed - No tiene acceso a $el(removido del DOM).', this.$el)
  }

  // Vue-router: redireccion a las pagina siguiente, produce la destruccion de componentes de la pag anterior (trigger -> beforeDestroy/destroyed).
}
</script>