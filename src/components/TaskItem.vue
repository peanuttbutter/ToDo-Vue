<template>
  <li class="p-4 bg-gray-100 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <h3 :class="{ 'line-through text-gray-500': task.isCompleted }" class="text-lg font-semibold">
        {{ task.title }}
      </h3>
      <p class="text-sm text-gray-600 task-description max-h-24 overflow-auto">
        {{ task.description }}
      </p>
      <p class="text-sm text-gray-800 mt-2">Срок: {{ formattedDate }}</p>
      <p class="text-sm text-gray-800">Статус: {{ statusLabel }}</p>
    </div>

    <div class="flex items-center gap-4">
      <button class="text-gray-700 hover:text-green-700" @click="onToggleComplete">
        <span class="material-icons">
          {{ task.isCompleted ? 'check_circle' : 'radio_button_unchecked' }}
        </span>
      </button>

      <button class="text-gray-700 hover:text-blue-700" @click="$emit('edit-task', task)">
        <span class="material-icons">edit</span>
      </button>

      <button class="text-gray-700 hover:text-red-700" @click="$emit('delete-task', task.id)">
        <span class="material-icons">delete</span>
      </button>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const { task } = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle-complete', 'edit-task', 'delete-task'])

const formattedDate = computed(() => {
  if (!task.dueDate) {
    return 'Не указано'
  }

  return new Date(task.dueDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const statusLabel = computed(() => {
  switch (task.status) {
    case 'todo':
      return 'Сделать'
    case 'inProgress':
      return 'В процессе'
    case 'done':
      return 'Выполнено'
    default:
      return 'Неизвестно'
  }
})

const onToggleComplete = () => {
  emit('toggle-complete', task.id)
}
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style>
