<template>
    <div>
        hello vue
        <li v-for="(item,index) in todos" :key="index">{{item}}</li>
    </div>
</template>

<script lang='ts'>
import {Component,Vue} from 'vue-property-decorator'
@Component({
    components: {
        // TODO
    }
})
export default class ToDo extends Vue {
  
   public todos:string[] = ['香蕉','苹果','橘子']
}
</script>
