<template>
  <div id="app">
    <h1 class="kanban-title">KANBAN BOARD</h1>

    <div class="kanban-filters">
      <label>Filter:</label>
      <input v-model="filter" />
      <label>Sort By:</label>
      <select v-model="sortKey">
        <option value="title">Title</option>
        <option value="dueDate">Due Date</option>
        <option value="category">Category</option>
      </select>
      <label>Sort Order:</label>
      <select v-model="sortOrder">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <div class="spacer"></div>
    <div class="kanban">
      <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="kanban-column" :style="{ 'background-color': column.color }">
        <div class="kanban-header">
          <input v-model="column.title" placeholder="Column Title" />
          <button @click="openColorPicker(columnIndex)">Choose Color</button>
          <button @click="addTask(columnIndex)">Add Task</button>
          <button @click="deleteColumn(columnIndex)">Delete Column</button>
        </div>
        <draggable v-model="column.tasks" :group="{ name: 'tasks', pull: true, put: true}" @end="onDragEnd">
          <div class="kanban-task" v-for="(task, taskIndex) in filteredTasks(column.tasks)" :key="taskIndex">
            <div class="task-header">
              <input v-model="task.title" placeholder="Task Title" />
              <button @click="editTask(columnIndex, taskIndex)">Edit</button>
              <button @click="deleteTask(columnIndex, taskIndex)">Delete</button>
            </div>
            <textarea v-model="task.description" placeholder="Task Description"></textarea>
            <div class="task-details">
              <input type="date" v-model="task.dueDate" />
              <input v-model="task.category" placeholder="Task Category" />
            </div>
          </div>
        </draggable>
      </div>
      <button @click="addColumn">Add Column</button>
    </div>

    <!-- Modal for Color Picker -->
    <div v-if="showColorPicker" class="color-picker-modal">
      <input type="color" v-model="selectedColor" @input="applySelectedColor" />
      <button @click="closeColorPicker">Close</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      columns: [
        { title: 'Todo', tasks: [], color: '#3498db' },
        { title: 'In Progress', tasks: [], color: '#2ecc71' },
        { title: 'Done', tasks: [], color: '#e74c3c' },
      ],
      filter: '',
      sortKey: 'title',
      sortOrder: 'asc',
      showColorPicker: false,
      selectedColor: '#000000',
      selectedColumnIndex: null,
    };
  },

  methods: {
    addColumn() {
      this.columns.push({ title: 'New Column', tasks: [] });
      this.saveToLocalStorage();
    },
    addTask(columnIndex) {
      const newTask = { title: 'New Task', description: '', dueDate: '', category: '' };
      this.columns[columnIndex].tasks.push(newTask);
      this.saveToLocalStorage();
    },
    editTask(columnIndex, taskIndex) {
      const task = this.columns[columnIndex].tasks[taskIndex];
      const updatedTitle = prompt('Enter new task title:', task.title);
      const updatedDescription = prompt('Enter new task description:', task.description);
      if (updatedTitle !== null) {
        task.title = updatedTitle;
        task.description = updatedDescription || '';
        this.saveToLocalStorage();
      }
    },
    deleteTask(columnIndex, taskIndex) {
      this.columns[columnIndex].tasks.splice(taskIndex, 1);
      this.saveToLocalStorage();
    },
    filteredTasks(tasks) {
      return tasks
        .filter(task => task.title.includes(this.filter) || task.category.includes(this.filter))
        .sort(this.sortTasks);
    },
    sortTasks(a, b) {
      const modifier = this.sortOrder === 'asc' ? 1 : -1;
      const valueA = a[this.sortKey].toLowerCase();
      const valueB = b[this.sortKey].toLowerCase();

      if (valueA < valueB) return -1 * modifier;
      if (valueA > valueB) return 1 * modifier;
      return 0;
    },
    onDragEnd() {
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('kanbanData', JSON.stringify(this.columns));
    },
    loadFromLocalStorage() {
      const data = localStorage.getItem('kanbanData');
      if (data) {
        this.columns = JSON.parse(data);
      }
    },
    deleteColumn(columnIndex) {
      const confirmDelete = confirm('Are you sure you want to delete this column?');
      if (confirmDelete) {
        this.columns.splice(columnIndex, 1);
        this.saveToLocalStorage();
      }
    },
    openColorPicker(columnIndex) {
      this.selectedColumnIndex = columnIndex;
      this.showColorPicker = true;
    },

    applySelectedColor() {
      if (this.selectedColumnIndex !== null) {
        this.columns[this.selectedColumnIndex].color = this.selectedColor;
        this.saveToLocalStorage();
      }
    },

    closeColorPicker() {
      this.selectedColumnIndex = null;
      this.showColorPicker = false;
    },
  },
  created() {
    this.loadFromLocalStorage();
  },
};
</script>

<style>
body {
  margin: 0; 
  background-color: #ece9de; 
  color: #ffffff; 
}

#app {
  text-align: center;
  color: #ffffff; 
  background-color: #ece9de;
  margin-top: 60px;
}

.kanban-title {
  color: #e5a073; 
}

.kanban {
  display: flex;
}

.kanban-column {
  margin: 0 15px;
  padding: 15px;
  background-color: #ecf0f1;
  border-radius: 5px;
}

.kanban-header {
  margin-bottom: 10px;
}

.kanban-task {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.task-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

textarea {
  width: 100%;
  margin-bottom: 10px;
}

button {
  margin-left: 10px;
}

.kanban-filters {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 20px;
}

.kanban-filters label {
  margin-right: 10px;
}

.kanban {
  display: flex;
}

.kanban-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.kanban-column {
  margin: 0 15px;
  padding: 15px;
  background-color: #ecf0f1;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transform: translate(0, 0);

 
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(236, 239, 241, 0.8) 50%,
    rgba(189, 195, 199, 0.8) 100%
  );

  
}

.kanban-column {
  /* ... */
  background-color: #ecf0f1;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translate(0, 0);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(236, 239, 241, 0.8) 50%,
    rgba(189, 195, 199, 0.8) 100%
  );
}

.kanban-header {
  margin-bottom: 10px;
  background-color: column.color; 
  padding: 8px;
  border-radius: 5px;
}

.kanban-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #e5a073;
}

.color-picker-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
