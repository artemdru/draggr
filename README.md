# draggr

[draggr](https://artemdru.github.io/draggr) is a drag-and-drop personal scheduling tool that allows you to easily and quickly lay out a schedule for your day by dropping tasks onto a calendar. You can complete, rearrange, or resize your tasks as your day goes as planned, or not as planned - all in a very visual depiction of your plan for the day, with task sizes corresponding to the time it takes to complete them.

The idea of centering a scheduler around drag-and-drop and resize functionality is to intuitively divide one's day into easily visible and editable chunks - both for organization, and for gamification of productivity.

## Usage

Users create a new task by clicking on the 'plus sign' button to the left of the screen. In the add-task dialog, users will then name a task and assign a rough estimate of time that the task may take them.

Users can then drag the task to the calendar view, dropping it on a time frame and scheduling their day. As time progresses, users are able to complete a task, giving a sense of completion and productivity as they can tasks they have completed today, and previous days. If task completion takes longer than expected, or a more urgent task has come up, users can easily re-schedule any parts of their day with dropping in or resizing tasks, which automatically moves other tasks out of the way if needed. Currently, the entire calendar is in 15 minute segments.

Users are able to browse forward or backward in days on the calendar by clicking the arrows at the top, letting them see all their previous work or schedule a task for days in the future.

## Set up

This project was generated with the [Angular CLI](https://cli.angular.io/), which I recommend to install if you'd like to develop.

Download the repo, open a command line interface in the project folder.

Type `npm install` to install all dependecies listed in package.json.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development

### Task Rendering

Tasks are stored in the `task-service` as an array of `Task` objects, each holding information pertaining to their rendering:
* `time` is how much time, in minutes, the task is estimated to take. This value is always divisible by 15, the size (in minutes) of calendar time increments. For every 15 minutes the task is, 1 time increment is occupied - rendered task height is adjusted accordingly to this.
* `date` is the date and time the task has been assigned to, converted to miliseconds since 1/1/1970 00:00 UTC. Each `time-increment-component` has an assigned `date` as well (which are 15 minute increments of the entire day), stored in the exact same format. If a task's and time increment's `date`s match, the task is rendered at that time increment. If a task's `date` is `0`, it is rendered in the `task-window-component`, and if it's `1`, it's rendered in the `mouse-container`.
* Each task has a unique `id`, which is used for logic in various methods throughout the project, primarily in the `task-service` and in `time-increment-component`s.

### Mouse Container

Clicking on a task sets it's `date` to `1` and renders it in the `mouse-container`, which is an invisibile container that follows the mouse. Upon rendering in the `mouse-container`, the task is positioned at an offset that positions it exactly where it was before being rendered in the `mouse-container`, then smoothly animates the task's position to 0,0 coordinates relative to the `mouse-container`. The effect is a smooth 'sliding' into being appended to the mouse.

When a task is rendered on a time increment, this offset animating and 'sliding' into position is done the same way.

### Time Increment Logic

Most of the logic for moving tasks happens in the `time-increment-service`. Let's run through a scenario of dropping a task on the calendar...

This is triggered by a `mouseup` event on a time increment while there is a task in the `mouse-container-component`, which is stored in the `selectedTask` variable of the `task-service`.

Since tasks on the calendar are rendered by `time-increments`, first we should adress logic in time increment occupation. `moveTask()` is triggered in the `time-increment-service`, which will move any tasks out of the way (by recursively using the same `moveTask()` method), handle unoccupying any previous time increments the moved task occupied, and finally occupy the target time increments.

'Occupying' time increments simply means to assign their `occupantID` to that of the task's `id`, setting their `isOccupied` bool to true, and rendering a task by receiving via the `taskSubscription` (after a task's `date` has been changed to the time increment's `date`). Tasks will only render on the time increment they were dropped on - the other time increments the task occupies won't actually render anything, the task rendered by the time increment will simply overflow atop of them. These time increments, however are accounted for and occupied by logic in the `moveTask()` method, receiving from the `time-increment-service` via `incSubscription`.

Resizing tasks is, essentially, just using the same `moveTask()` method when increasing their size, or just unoccupying time increments when decreasing their size. Resize events are generated by [Angular Resizable Element](https://github.com/mattlewis92/angular-resizable-element).

### Task Storage

The project uses a Firebase to store data in a simple fashion: one task array per user. The task array is loaded through the `auth-service` when users log in.

Each time a task is moved, resized, added, deleted, or completed, the `task-service` or `time-increment-service` will write the array of tasks in `task-service` to the database via the `updateTasks()` method in `task-service`.

### Calendar

The calendar window always has 5 days already rendered - 3 potentially visible days (depending on window size), and 2 days acting as 'margins' to unrendered days so the user can browse calendar days with smoothness. The calendar container's horizontal scroll is handled entirely by jQuery logic in the `app-component`, with users only able to scroll in increments of a day's width (`dateWidth`) with the arrow buttons at the top of the calendar.

For non-webkit browsers, [Malihu Custom Scrollbar](https://github.com/malihu/malihu-custom-scrollbar-plugin) is used to hide the vertical scrollbar on calendar view (and style it in the task list of `task-window` when there's enough tasks for overflow). Browser detection is handled by [browser-detect](https://github.com/DamonOehlman/detect-browser).

## Areas for improvement

* Clicking on an unoccupied time increment opens a task dialog to add a task at that increment.
* Selecting the nearest unoccupied time increment with keybind (down arrow?). Opening a task dialog at selected time increment with keybind (enter?).
* Smooth task completion animation.
* Multiple task selection via shift-select and box dragging. Move, complete, or delete selected tasks.
* Dynamically read tasks from database based on days opened.
* Improve user authentication security (perhaps with tokens).
* Task color selection.
* Find an alternative to jQuery, since it's not recommended with Angular.
* 5 minute time increments rather than 15.

## License

MIT

Refer to [license file.](LICENSE.md)