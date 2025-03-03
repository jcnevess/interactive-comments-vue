<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'
import CommentCard from './CommentCard.vue'
import CommentForm from './CommentForm.vue'
import { ref } from 'vue'

defineProps({
  comment: { type: Object, required: true },
})

const emit = defineEmits([
  'upvoteComment',
  'downvoteComment',
  'editComment',
  'startDeleting',
  'addComment',
])

const currentUserStore = useCurrentUserStore()

const isReplying = ref(false)

function addComment(newComment) {
  isReplying.value = false
  emit('addComment', newComment)
}
</script>

<template>
  <div class="comment-block">
    <CommentCard
      :comment
      @upvote-comment="emit('upvoteComment')"
      @downvote-comment="emit('downvoteComment')"
      @edit-comment="(newText) => emit('editComment', newText)"
      @start-deleting="emit('startDeleting')"
      @open-reply="isReplying = !isReplying"
    />
    <CommentForm
      v-if="isReplying && comment.user.username !== currentUserStore.username"
      :reply-user="comment.user.username"
      @add-comment="(newComment) => addComment(newComment)"
    />
  </div>
</template>

<style scoped>
.comment-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
