
<template>
      <van-dialog :title="title" v-model:show="show" show-cancel-button>
        {{message}}
      </van-dialog>
</template>

<script>
import {
  defineProps,
} from 'vue';

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});

</script>
