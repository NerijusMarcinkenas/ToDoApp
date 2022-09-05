const addBtn = document.querySelector('#add-btn');
const taskElement = document.querySelector('.task');
let postSuccess = false;
let userTasks = [];
window.onload = () => {
    setUser();
}


addBtn.addEventListener('click', () => {
    addTask();
})


const addTask = () => {
    let addForm = document.querySelector('#add-box');
    if (addForm.style.display === 'block') {
        addForm.style.display = 'none';
        return;
    }
    addForm.style.display = 'block';

    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const type = document.querySelector('#type-inp').value;
        const content = document.querySelector('#content-inp').value;
        const date = document.querySelector('#date').value;

        if (type && content && date) {
            postTask(type, content, date);
        }
    })
}
const postTask = (type, content, date) => {
    return fetch('https://localhost:7171/api/ToDo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": user.id,
            "type": type,
            "content": content,
            "endDate": date
        })
    })
        .then(resp => {
            if (resp.ok) {
                toastr.success("To doo have been added!");
                postSuccess = true;
                printTask(type, content, date);
                return;
            }
            return resp.json();
        })
        .then(data => {
            if (data) {
                console.log(data.error);
            }
        })
        .catch(err => {
            console.log(err);
        })
}
const getUserTasks = (userId) => {
    if (userId) {
        fetch("https://localhost:7171/api/ToDo")
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
            })
            .then(data => {
                user.tasks = [];

                for (i in data) {
                    if (data[i].userId === user.id) {
                        user.tasks.push(data[i]);
                        printTask(data[i]);
                    }
                }
            })
            .catch(err => console.log(err));
    }
}

printTask = (task) => {
    boxCopy = taskElement.cloneNode(true);
    boxCopy.style.display = 'block';
    boxCopy.querySelector('.type').value = task.type;
    boxCopy.querySelector('.content').innerText = task.content;
    boxCopy.querySelector('.date').innerText += task.endDate;
    boxCopy.querySelector('#task-id').innerText = task.id;
    let tasks = document.querySelector('.tasks');

    createTaskBtns(boxCopy);
    tasks.append(boxCopy);
}

const setUser = () => {
    const userTag = document.querySelector('.user');
    user = JSON.parse(sessionStorage.getItem(userKey));
    if (user) {
        userTag.innerText = `Loged in as, ${user.userName} ${user.email}`;
        getUserTasks(user.id);
        return;
    }
    userTag.innerText = `Logged in as Guest`;
}

const createTaskBtns = (boxCopy) => {
    const editBtn = boxCopy.querySelector('.edit-svg');
    const removeBtn = boxCopy.querySelector('.remove-svg');
    const discardBtn = boxCopy.querySelector('.discard-svg');
    const saveBtn = boxCopy.querySelector('.save-svg');

    discardBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    let originalType;
    let originalContent;



    editBtn.addEventListener('click', () => {
        let type = boxCopy.querySelector('.type');
        let content = boxCopy.querySelector('.content');

        originalType = type.value;
        originalContent = content.value;

        removeBtn.style.display = 'none';
        editBtn.style.display = 'none';
        discardBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';

        boxCopy.style.boxShadow = '0px 0px 2px 5px rgba(255, 255, 255, 0.5)'
        type.readOnly = false;
        content.readOnly = false;
    });

    discardBtn.addEventListener('click', () => {
        let type = boxCopy.querySelector('.type');
        let content = boxCopy.querySelector('.content');

        removeBtn.style.display = 'inline-block';
        editBtn.style.display = 'inline-block';
        discardBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        type.value = originalType;
        content.value = originalContent;
        boxCopy.style.boxShadow = 'none';

        type.readOnly = true;
        content.readOnly = true;
        toastr.warning("Card hasn't been updated.");
    });

    saveBtn.addEventListener('click', () => {
        let type = boxCopy.querySelector('.type');
        let content = boxCopy.querySelector('.content');

        removeBtn.style.display = 'inline-block';
        editBtn.style.display = 'inline-block';
        discardBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        boxCopy.style.boxShadow = 'none';
        putTask(boxCopy);
        type.readOnly = true;
        content.readOnly = true;
    });

    removeBtn.addEventListener('click', () => {
        removeCard(index, boxCopy);
    })
}

const putTask = (boxCopy) => {
    let id = boxCopy.querySelector('#task-id').innerText;
    let type = boxCopy.querySelector('.type').value;
    let content = boxCopy.querySelector('.content').value;
    let date = boxCopy.querySelector('.date').value;
    Number(id);
    fetch(`https://localhost:7171/api/ToDo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": user.id,
            "type": type,
            "content": content,
            "endDate": date,
            "id": id
        })

    })
        .then(resp => {
            if (resp.ok) {
                toastr.success('Task updated successfully!');
                return;
            }
            return resp.json();
        })
        .then(data => {
            if (data.error) {
                toastr.error(data.error);
                return;
            }
        })
        .catch(err => console.log(err));
}

