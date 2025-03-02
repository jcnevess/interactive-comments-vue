<script setup>
import data from '@/assets/data/data.json'
import { ref, useTemplateRef } from 'vue'
import CommentForm from './components/CommentForm.vue'
import CommentBlock from './components/CommentBlock.vue'

const appData = ref(data)
const comments = ref(appData.value.comments)

const commentForDeletionId = ref()

const deleteModal = useTemplateRef('deleteModal')

// Is this a good practice? Or should I perform a filter in comments?
function upvoteComment(comment) {
  comment.score = comment.score + 1
}

function downvoteComment(comment) {
  comment.score = comment.score - 1
}

function editComment(comment, newText) {
  comment.content = newText
}

function startDeletingComment(comment) {
  deleteModal.value.showModal()
  commentForDeletionId.value = comment.id
}

function cancelDeletion() {
  deleteModal.value.close()
  commentForDeletionId.value = undefined
}

function confirmDeletion() {
  deleteModal.value.close()

  comments.value = comments.value.filter((comment) => comment.id !== commentForDeletionId.value)
  comments.value = comments.value.map((comment) => {
    return {
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== commentForDeletionId.value),
    }
  })

  commentForDeletionId.value = undefined
}

function addComment(comment) {
  comments.value = [...comments.value, comment]
}

function addReply(parentComment, reply) {
  comments.value = comments.value.map((comment) => {
    if (comment.id === parentComment.id) {
      return { ...comment, replies: [reply, ...comment.replies] }
    } else {
      return comment
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="inner-container">
      <div
        v-for="comment in comments.toSorted((a, b) => b.score - a.score)"
        :key="comment.id"
        class="comment-board"
      >
        <CommentBlock
          :comment
          @upvote-comment="upvoteComment(comment)"
          @downvote-comment="downvoteComment(comment)"
          @edit-comment="(newText) => editComment(comment, newText)"
          @start-deleting="startDeletingComment(comment)"
          @add-comment="(newReply) => addReply(comment, newReply)"
        />

        <div v-if="comment.replies.length > 0" class="comment-replies">
          <div v-for="reply in comment.replies" :key="reply.id">
            <CommentBlock
              :comment="reply"
              @upvote-comment="upvoteComment(reply)"
              @downvote-comment="downvoteComment(reply)"
              @edit-comment="(newText) => editComment(reply, newText)"
              @start-deleting="startDeletingComment(reply)"
              @add-comment="(newReply) => addReply(comment, newReply)"
            />
          </div>
        </div>
      </div>

      <CommentForm @add-comment="addComment" />
    </div>
  </div>

  <dialog ref="deleteModal" class="comment-delete-modal">
    <h2 class="modal-heading">Delete comment</h2>
    <p class="modal-text">
      Are you sure you want to delete this comment? This will remove the comment and can't be
      undone.
    </p>
    <div class="modal-controls">
      <button class="modal-control" @click="cancelDeletion">no, cancel</button>
      <button class="modal-control control-delete" autofocus @click="confirmDeletion">
        yes, delete
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.container {
  background-color: var(--color-very-light-gray);
}

.inner-container {
  max-width: 720px;
  margin: auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-delete-modal[open] {
  border: none;
  padding: 1.5rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5px;
}

.comment-delete-modal::backdrop {
  background-color: hsla(0, 0%, 0%, 0.7);
}

.modal-heading {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-dark-blue);
}

.modal-text {
  line-height: 1.4em;
  color: var(--color-grayish-blue);
}

.modal-controls {
  display: flex;
  justify-content: space-between;
}

.modal-control {
  color: var(--color-white);
  background-color: var(--color-grayish-blue);
  text-transform: uppercase;
  border: none;
  border-radius: 10px;
  font-family: 'Rubik';
  font-size: 1rem;
  justify-self: right;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
}

.control-delete {
  background-color: var(--color-soft-red);
}

.comment-replies {
  border-left: 1px solid var(--color-light-gray);
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-board {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .comment-replies {
    margin-left: 2rem;
    padding-left: 2rem;
  }
}
</style>
