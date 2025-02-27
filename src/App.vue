<script setup>
import data from '@/assets/data/data.json'
import { reactive } from 'vue'
import CommentFormComponent from './components/CommentFormComponent.vue'
import CommentComponent from './components/CommentComponent.vue'

const appData = reactive(data)
const comments = appData.comments
</script>

<template>
  <div class="container">
    <template v-for="comment in comments" :key="comment.id">
      <CommentComponent :comment></CommentComponent>
      <CommentComponent
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
      ></CommentComponent>
    </template>

    <CommentFormComponent></CommentFormComponent>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--color-very-light-gray);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
