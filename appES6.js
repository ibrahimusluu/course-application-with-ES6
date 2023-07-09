// Course Class
class Course {
  constructor(title, instructor, image) {
    this.courseId = Math.floor(Math.random() * 10000); // here will run when this class object created
    this.title = title;
    this.instructor = instructor;
    this.image = image;
  }
}

// UI Class
class UI {
  addCourseToList(course) {
    const list = document.getElementById("course-list");

    // name of data attributes is optional, so we are free whatever we name it.
    var html = `
        <tr>
            <td><img src="img/${course.image}" height="100" width="250"/></td>
            <td>${course.title}</td>
            <td>${course.instructor}</td>
            <td><a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>
  `;

    list.innerHTML += html;
  }

  clearControls() {
    const title = (document.getElementById("title").value = "");
    const instructor = (document.getElementById("instructor").value = "");
    const image = (document.getElementById("image").value = "");
  }

  deleteCourse(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
      return true;
    }
  }

  showAlert(message, className, time) {
    var alert = `
        <div class="alert alert-${className}">
          ${message}
        </div>
  `;

    const row = document.querySelector(".row");
    //   beforeBegin, afterBegin, beforeEnd, afterEnd
    row.insertAdjacentHTML("beforebegin", alert);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, time);
  }
}

// LocalStorage Class is synchronous with "DOM Content Loader Process"
class Storage {
  // static

  static getCourses() {
    // 1. thing to do here is define "courses"
    let courses;

    // 3. thing  to do is here to start after second
    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      // convert from "JSON String" to the "JSON Object" when we "get" from LS
      courses = JSON.parse(localStorage.getItem("courses"));
    }

    // 2. thing to do is return "courses"
    return courses;
  }

  static displayCourses() {
    const courses = Storage.getCourses();

    courses.forEach((course) => {
      const ui = new UI();
      ui.addCourseToList(course);
    });
  }

  static addCourse(course) {
    const courses = Storage.getCourses();
    courses.push(course);
    // convert to "JSON String" from the "JSON Object" when we "save" to LS
    localStorage.setItem("courses", JSON.stringify(courses));
  }

  static deleteCourse(element) {
    // deleting course from LS and get the new list of LS and show in UI
    // or
    // deleting in UI and from LS and then no need to get the new list at that time (and no need to refresh the page also maybe if it needs to be refreshed.)

    // we need to require "id" which is unique for the logic of the application
    if (element.classList.contains("delete")) {
      const id = element.getAttribute("data-id");
      console.log(id);

      const courses = Storage.getCourses();

      courses.forEach((course, index) => {
        if (course.courseId == id) {
          courses.splice(index, 1);
        }
      });

      localStorage.setItem("courses", JSON.stringify(courses));
    }
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayCourses);

document.getElementById("new-course").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value;
  const instructor = document.getElementById("instructor").value;
  const image = document.getElementById("image").value;

  console.log(title, instructor, image);

  //   create course object
  const course = new Course(title, instructor, image);
  console.log(course);

  //   create UI
  const ui = new UI();
  console.log(ui);

  //   save to database

  //   show on the ui

  if (title === "" || instructor === "" || image === "") {
    ui.showAlert("Please complete the form", "warning", 2000);
  } else {
    //   add course to list
    ui.addCourseToList(course);

    // save to LS
    Storage.addCourse(course);

    //   clear controls
    ui.clearControls();

    ui.showAlert("The course has been added", "success", 2000);
  }

  e.preventDefault();
});

document.getElementById("course-list").addEventListener("click", function (e) {
  const ui = new UI();
  //   delete course
  if (ui.deleteCourse(e.target)) {
    //   delete from LS
    Storage.deleteCourse(e.target);

    ui.showAlert("The course has been deleted", "danger", 2000);
  }
});
