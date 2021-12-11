const express = require("express");
// app will open on this port with localhost
const port = 8080;

const db = require("./config/mongoose");

// Database requiring
const Task = require("./models/tasks");

const app = express();

// set engine for view
app.set("view engine", "ejs");
// giving path of views
app.set("views", "./views");

app.use(express.urlencoded());

//middleware for css styling
app.use(express.static("assets"));

app.get("/", function (req, res) {
  Task.find({}, function (err, tasks) {
    if (err) {
      console.log("Error while fetching tasks from db");
      return;
    }

    return res.render("home", {
      title: "Daily Tasks List",
      task_list: tasks,
    });
  });
});

app.post("/delete-task", function (req, res) {
  // get the id from parameters in url
  let removeList = req.body.check;

  // find the contact in the database using id and delete
  if (typeof removeList === "string") {
    Task.findByIdAndDelete(removeList, function (err) {
      if (err) {
        console.log("error");
        return;
      }
    });
  } else if (typeof removeList === "object") {
    for (var i = 0; i < removeList.length; i++) {
      Task.findByIdAndDelete(removeList[i], function (err) {
        if (err) {
          console.log("error");
          return;
        }
      });
    }
  }

  return res.redirect("back");
});

app.post("/create-task", function (req, res) {
  console.log(req.body);

  Task.create(
    {
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
    },
    function (err, newTask) {
      if (err) {
        console.log("error in creating contact!");
        return;
      }
      console.log("********", newTask);
      return res.redirect("back");
    }
  );
});

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server:${err}`);
  }
  console.log(`Server is running on port : ${port}`);
});
