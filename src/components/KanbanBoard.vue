<template>
  <div class="overflow-hidden mt-2 p-2 bg-transparent flex justify-center">
    <canvas ref="canvas" class="block max-w-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const fabric = window.fabric

const canvas = ref(null)
let fabricCanvas = null
const taskStore = useTaskStore()

const columns = [
  { status: 'todo', title: 'Сделать', color: '#e4e6e6' },
  { status: 'inProgress', title: 'В процессе', color: '#e4e6e6' },
  { status: 'done', title: 'Выполнено', color: '#e4e6e6' },
]

const isMobile = ref(window.innerWidth <= 768)
const columnWidth = ref(isMobile.value ? 140 : 360)
const columnSpacing = ref(isMobile.value ? 5 : 40)
const headerHeight = ref(50)
const taskHeight = ref(isMobile.value ? 60 : 80)
const taskSpacing = ref(isMobile.value ? 8 : 20)
const titleFontSize = ref(isMobile.value ? 10 : 16)
const dueDateFontSize = ref(isMobile.value ? 8 : 14)
const columnHeaderFontSize = ref(isMobile.value ? 14 : 22)
const taskPadding = ref(isMobile.value ? 5 : 10)

const updateDimensions = () => {
  isMobile.value = window.innerWidth <= 768
  columnWidth.value = isMobile.value ? 140 : 360
  columnSpacing.value = isMobile.value ? 5 : 40
  taskHeight.value = isMobile.value ? 60 : 80
  taskSpacing.value = isMobile.value ? 8 : 20
  titleFontSize.value = isMobile.value ? 10 : 16
  dueDateFontSize.value = isMobile.value ? 8 : 14
  columnHeaderFontSize.value = isMobile.value ? 14 : 22
  taskPadding.value = isMobile.value ? 5 : 10
}

const handleResize = () => {
  updateDimensions()
  if (fabricCanvas) {
    const newWidth =
      columns.length * (columnWidth.value + columnSpacing.value) + columnSpacing.value
    fabricCanvas.setWidth(newWidth)

    const maxTasks = Math.max(
      ...columns.map((col) => taskStore.tasks.filter((t) => t.status === col.status).length),
    )
    const newHeight =
      headerHeight.value + maxTasks * (taskHeight.value + taskSpacing.value) + taskSpacing.value
    fabricCanvas.setHeight(newHeight)

    renderBoard()
  }
}

onMounted(() => {
  updateDimensions()
  initCanvas()
  renderBoard()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => taskStore.tasks,
  () => {
    renderBoard()
  },
  { deep: true },
)

function initCanvas() {
  const maxTasks = Math.max(
    ...columns.map((col) => taskStore.tasks.filter((t) => t.status === col.status).length),
  )
  const initialHeight =
    headerHeight.value + maxTasks * (taskHeight.value + taskSpacing.value) + taskSpacing.value

  fabricCanvas = new fabric.Canvas(canvas.value, {
    width: columns.length * (columnWidth.value + columnSpacing.value) + columnSpacing.value,
    height: initialHeight,
    selection: false,
  })

  fabricCanvas.on('mouse:down', function (e) {
    if (e.e.which === 3) {
      e.e.preventDefault()
      e.e.stopPropagation()
    }
  })

  fabricCanvas.on('object:moving', onTaskMoving)
}

function renderBoard() {
  const maxTasks = Math.max(
    ...columns.map((col) => taskStore.tasks.filter((t) => t.status === col.status).length),
  )

  const newHeight =
    headerHeight.value + maxTasks * (taskHeight.value + taskSpacing.value) + taskSpacing.value
  fabricCanvas.setHeight(newHeight)

  const newWidth = columns.length * (columnWidth.value + columnSpacing.value) + columnSpacing.value
  fabricCanvas.setWidth(newWidth)

  fabricCanvas.clear()

  columns.forEach((column, index) => {
    drawColumn(column, index)
  })

  taskStore.tasks.forEach((task) => {
    drawTask(task)
  })

  fabricCanvas.renderAll()
}

function drawColumn(column, index) {
  const left = columnSpacing.value + index * (columnWidth.value + columnSpacing.value)

  const rect = new fabric.Rect({
    left: left,
    top: 0,
    width: columnWidth.value,
    height: fabricCanvas.height,
    fill: column.color,
    selectable: false,
    opacity: 0.4,
  })

  const text = new fabric.Textbox(column.title, {
    left: left + columnWidth.value / 2,
    top: 10,
    fontSize: columnHeaderFontSize.value,
    fontWeight: 'bold',
    selectable: false,
    originX: 'center',
    width: columnWidth.value - 20,
    textAlign: 'center',
  })

  fabricCanvas.add(rect, text)
}

function drawTask(task) {
  const columnIndex = columns.findIndex((col) => col.status === task.status)
  if (columnIndex === -1) return

  const tasksInColumn = taskStore.tasks.filter((t) => t.status === columns[columnIndex].status)
  const taskIndex = tasksInColumn.findIndex((t) => t.id === task.id)

  const left = columnSpacing.value + columnIndex * (columnWidth.value + columnSpacing.value) + 10
  const top =
    headerHeight.value + taskIndex * (taskHeight.value + taskSpacing.value) + taskSpacing.value

  const rect = new fabric.Rect({
    width: columnWidth.value - 20,
    height: taskHeight.value,
    fill: '#fff',
    stroke: '#ccc',
    opacity: 0.4,
    rx: 10,
    ry: 10,
    hasControls: false,
    hasBorders: false,
  })

  const titleText = new fabric.Textbox(task.title, {
    fontSize: titleFontSize.value,
    fontWeight: '600',
    left: taskPadding.value,
    top: taskPadding.value,
    width: columnWidth.value - 40,
    selectable: false,
    originX: 'left',
    originY: 'top',
    textAlign: 'center',
    lineHeight: 1.1,
    splitByGrapheme: true,
  })

  const dueDateText = new fabric.Textbox(
    task.dueDate ? `Срок: ${new Date(task.dueDate).toLocaleDateString('ru-RU')}` : 'Срок не указан',
    {
      fontSize: dueDateFontSize.value,
      left: taskPadding.value,
      top: titleText.height + taskPadding.value + 5,
      width: columnWidth.value - 40,
      selectable: false,
      originX: 'left',
      originY: 'top',
      textAlign: 'center',
      fill: task.status === 'done' ? 'gray' : 'black',
    },
  )

  if (task.status === 'done') {
    titleText.set('textDecoration', 'line-through')
    titleText.set('fill', 'gray')
  }

  const group = new fabric.Group([rect, titleText, dueDateText], {
    left: left,
    top: top,
    hasControls: false,
    hasBorders: false,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: false,
    lockMovementY: false,
    taskId: task.id,
  })

  fabricCanvas.add(group)
}

async function onTaskMoving(event) {
  const obj = event.target
  const pointer = fabricCanvas.getPointer(event.e)
  const columnWidthTotal = columnWidth.value + columnSpacing.value
  const newColumnIndex = Math.floor(pointer.x / columnWidthTotal)
  const newStatus = columns[newColumnIndex]?.status

  if (newStatus && obj.taskId) {
    const task = taskStore.tasks.find((t) => t.id === obj.taskId)
    if (task && task.status !== newStatus) {
      await taskStore.updateTaskStatus(task.id, newStatus)
      renderBoard()
    }
  }
}
</script>
