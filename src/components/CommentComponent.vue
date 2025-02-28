<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'
import { ref } from 'vue'

const props = defineProps(['comment'])
const emit = defineEmits(['upvoteComment', 'downvoteComment', 'editComment', 'startDeleting'])

const currentUserStore = useCurrentUserStore()

const isEditing = ref(false)
const commentText = ref(props.comment.content)

function authorIsCurrentUser() {
  return props.comment.user.username === currentUserStore.username
}

function startEditing() {
  isEditing.value = true
}

function finishEditing() {
  isEditing.value = false
  emit('editComment', commentText.value)
}
</script>

<template>
  <div class="comment">
    <div class="comment-info">
      <img
        class="author-photo"
        :src="props.comment.user.image.webp"
        :alt="props.comment.user.username"
      />
      <div class="author-name">{{ props.comment.user.username }}</div>
      <div class="author-badge" v-if="authorIsCurrentUser()">you</div>
      <div class="timestamp">{{ props.comment.createdAt }}</div>
    </div>

    <div class="comment-body" v-if="!isEditing">
      <span class="comment-replyingTo" v-if="props.comment.replyingTo !== undefined"
        >@{{ `${props.comment.replyingTo} ` }} </span
      >{{ commentText }}
    </div>

    <div class="controls-vote" v-if="!isEditing">
      <button class="control control-downvote" @click="emit('downvoteComment')">
        <img src="@/assets/images/icon-minus.svg" alt="downvote comment" />
      </button>
      <div class="display-vote">
        {{ props.comment.score }}
      </div>
      <button class="control control-upvote" @click="emit('upvoteComment')">
        <img src="@/assets/images/icon-plus.svg" alt="upvote comment" />
      </button>
    </div>

    <div class="controls-actions" v-if="!isEditing">
      <button class="action" v-if="!authorIsCurrentUser()">
        <img class="action-icon" src="@/assets/images/icon-reply.svg" />
        <span class="action-name">reply</span>
      </button>
      <div class="actions-author" v-if="authorIsCurrentUser()">
        <button class="action action-delete" @click="emit('startDeleting')">
          <img class="action-icon" src="@/assets/images/icon-delete.svg" />
          <span class="action-name">delete</span>
        </button>
        <button class="action" @click="startEditing">
          <img class="action-icon" src="@/assets/images/icon-edit.svg" />
          <span class="action-name">edit</span>
        </button>
      </div>
    </div>

    <div class="comment-edit-box" v-if="isEditing">
      <textarea
        name="edit-comment"
        id="edit-comment"
        class="comment-edit-input"
        v-model="commentText"
      ></textarea>
      <button class="comment-update" @click="finishEditing">update</button>
    </div>
  </div>
</template>

<style scoped>
.comment {
  background-color: white;
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.author-photo {
  width: 32px;
}

.author-name {
  color: var(--color-dark-blue);
  font-weight: 500;
}

.comment-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  grid-column: 1/3;
}

.author-badge {
  background-color: var(--color-moderate-blue);
  color: var(--color-white);
  font-size: 0.8rem;
  display: flex;
  place-items: center;
  height: 20px;
  line-height: 20px;
  padding-inline: 0.5rem;
  border-radius: 3px;
}

.comment-body {
  line-height: 1.4em;
  grid-column: 1/3;
}

.controls-vote {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-light-gray);
  font-weight: 500;
  color: var(--color-moderate-blue);
  border-radius: 5px;
  padding: 0.6rem;
  justify-self: left;
  align-self: center;
}

.control {
  background-color: transparent;
  border: none;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-light-grayish-blue);
  display: flex;
  cursor: pointer;
}

.display-vote {
  width: 3ch;
  overflow: hidden;
  text-align: center;
}

.controls-actions {
  justify-self: right;
  align-self: center;
}

.action {
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-transform: capitalize;
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: var(--color-moderate-blue);
}

.action:active {
  color: var(--color-light-grayish-blue);
}

.action-delete {
  color: var(--color-soft-red);
}

.action-delete:active {
  color: var(--color-pale-red);
}

.action-icon {
  display: inline-block;
}

.actions-author {
  display: flex;
  gap: 0.5rem;
}

.comment-replyingTo {
  font-weight: 600;
  color: var(--color-moderate-blue);
}

.comment-edit-box {
  grid-column: 1/3;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
}

.comment-edit-input {
  grid-column: 1/3;
  line-height: 1.4em;
  border-radius: 5px;
  border-color: var(--color-light-gray);
  resize: none;
  font-size: 1em;
  font-family: 'Rubik', sans-serif;
  caret-color: var(--color-moderate-blue);
  width: 100%;
  min-height: 5em;
}

.comment-edit-input::placeholder {
  font-size: 1.2em;
  font-family: 'Rubik', sans-serif;
}

.comment-edit-input:focus-visible {
  outline-color: var(--color-moderate-blue);
}

.comment-update {
  color: var(--color-white);
  background-color: var(--color-moderate-blue);
  text-transform: uppercase;
  border: none;
  border-radius: 5px;
  font-family: 'Rubik';
  font-size: 1rem;
  justify-self: right;
  padding: 1rem 2rem;
  cursor: pointer;
}
</style>
