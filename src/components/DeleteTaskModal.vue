<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Вы точно хотите удалить задачу?</h3>


      <p class="text-sm mb-4">Для удаления введите '{{ taskName }}'</p>
      <input
        v-model="taskNameInput"
        type="text"
        class="w-full border rounded px-3 py-2 mb-4"
        :class="{ 'border-red-500': errors.name }"
      />
      <p v-if="errors.name" class="text-red-500 text-sm mb-2">{{ errors.name }}</p>

      <div class="flex justify-end gap-4">
        <button
          type="button"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="closeModal"
        >
          Отмена
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click="deleteTask"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'delete']);

const taskNameInput = ref('');
const errors = ref({
  name: '',
});

const closeModal = () => {
  emit('close');
};

const deleteTask = () => {
  if (taskNameInput.value === props.taskName) {
    emit('delete');
    closeModal();
  } else {
    errors.value.name = 'Название задачи не совпадает';
  }
};
</script>
