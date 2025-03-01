<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'
import { computed, ref } from 'vue'

const props = defineProps({
  comment: { type: Object, required: true },
})

const emit = defineEmits([
  'upvoteComment',
  'downvoteComment',
  'editComment',
  'startDeleting',
  'openReply',
])

const currentUserStore = useCurrentUserStore()

const isEditing = ref(false)

const localComment = computed(() => JSON.parse(JSON.stringify(props.comment)))

const authorIsCurrentUser = computed(
  () => props.comment.user.username === currentUserStore.username,
)

function startEditing() {
  isEditing.value = true
}

function finishEditing() {
  isEditing.value = false
  emit('editComment', localComment.value.content)
}

function getEllapsedTime(postDate) {
  const now = new Date()
  const fullPostDate = new Date(postDate)
  let ellapsedSeconds = (now - fullPostDate) / 1000

  let labels = [
    { label: 'second', factor: 1 },
    { label: 'minute', factor: 60 },
    { label: 'hour', factor: 60 },
    { label: 'day', factor: 24 },
    { label: 'week', factor: 7 },
    { label: 'month', factor: 5 },
    { label: 'year', factor: 12 },
  ]

  let lastValidPeriod = ellapsedSeconds
  let period = ellapsedSeconds
  let lastValidIndex = 0
  let index = 0
  while (Math.floor(period) > 0) {
    lastValidPeriod = period
    period = period / labels[index].factor
    lastValidIndex = index
    index++
  }

  lastValidIndex = lastValidIndex === 0 ? 0 : lastValidIndex - 1

  return `${Math.floor(lastValidPeriod)} ${labels[lastValidIndex].label}${Math.floor(lastValidPeriod) === 1 ? '' : 's'} ago`
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
      <div v-if="authorIsCurrentUser" class="author-badge">you</div>
      <div class="timestamp">{{ getEllapsedTime(props.comment.createdAt) }}</div>
    </div>

    <div v-if="!isEditing" class="comment-body">
      <span v-if="props.comment.replyingTo !== undefined" class="comment-replyingTo"
        >@{{ `${props.comment.replyingTo} ` }} </span
      >{{ localComment.content }}
    </div>

    <div v-if="!isEditing" class="controls-vote">
      <button
        class="control control-downvote"
        :disabled="authorIsCurrentUser"
        @click="emit('downvoteComment')"
      >
        <img src="@/assets/images/icon-minus.svg" alt="downvote comment" />
      </button>
      <div class="display-vote">
        {{ props.comment.score }}
      </div>
      <button
        class="control control-upvote"
        :disabled="authorIsCurrentUser"
        @click="emit('upvoteComment')"
      >
        <img src="@/assets/images/icon-plus.svg" alt="upvote comment" />
      </button>
    </div>

    <div v-if="!isEditing" class="controls-actions">
      <button v-if="!authorIsCurrentUser" class="action" @click="emit('openReply')">
        <img class="action-icon" src="@/assets/images/icon-reply.svg" />
        <span class="action-name">reply</span>
      </button>
      <div v-if="authorIsCurrentUser" class="actions-author">
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

    <div v-if="isEditing" class="comment-edit-box">
      <textarea
        id="edit-comment"
        v-model="localComment.content"
        name="edit-comment"
        class="comment-edit-input"
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
