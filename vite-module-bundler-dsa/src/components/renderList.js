export function renderList(container, students) {
  if (!students.length) {
    container.innerHTML = '<p class="empty">No students to show.</p>'
    return
  }

  container.innerHTML = `
    <ul class="student-list">
      ${students
        .map((s) => `<li><span class="name">${s.name}</span><span class="grade">${s.grade}</span></li>`)
        .join('')}
    </ul>
  `
}
