const items = document.querySelector(".items");
const clear = document.querySelector(".clear")
let selectFilter = document.querySelector("[name='status']");



const filterByStatus = (status) => {
    switch (status) {
        case "completed":
            return todos.filter((v) => v.isDone);
        case "proccess":
            return todos.filter((v) => !v.isDone);
        default:
            return todos;
    }
};

let currentStatus = "all";








let todos = JSON.parse(localStorage.getItem("todos")) || [];



const render = () => {
    localStorage.setItem("todos", JSON.stringify(todos));



    items.innerHTML = "";


    filterByStatus(currentStatus).forEach((v, i) => {




        const checkbox = v.isDone
            ? `<input checked type="checkbox" class="checkbox" />`
            : `<input type="checkbox" class="checkbox" />`;



        const input = v.isDone
            ? ` <input disabled class="todo completed" value="${v.todo}">`
            : `<input disabled class="todo" value="${v.todo}">`;



        const editButton = v.isDone
            ? ""
            : `   <button class="edit material-symbols-outlined">
            edit
            </button>`;


        items.innerHTML += `
        <li  draggable=true class="item" id="${v.id}">
       
        <div class="left__button">
        <span class="order">${i + 1}.</span>

          ${checkbox}
          ${input}
          </div>

          <div class="buttons">

         ${editButton}
         
           <button style="display:none" id="${v.id}" class="cancel  material-symbols-outlined">
           close
           </button>

            <button style="display:none" id="${v.id}" class="save  material-symbols-outlined">
            bookmark
            </button>



            <button id="${v.id}" class="delete  material-symbols-outlined">
            delete
            </button>
            
          </div>
        </li>
      `;
    });

    const list = document.getElementsByClassName("item");

    for (let item of list) {
        item.addEventListener("dragstart", (e) => {
            const currentId = e.target.closest(".item")?.id;
            dragIndex = todos.findIndex((v) => v.id == currentId);
            e.target.closest(
                ".item"
            ).style.cssText = `opacity:0.5;border:2px solid #3498db;background-color:#f1f1f1;transform: scale(1.05);`;

            console.log("start", currentId);
        });

        item.addEventListener("dragend", (e) => {
            e.preventDefault();
            e.target.closest(".item").style.cssText = `opacity:1;border:1px solid #ccc;background-color: #fff;transform: scale(1);`;
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.target.closest(
                ".item"
            ).style.cssText = `border-bottom:2px solid #3498db;transform: scale(1.05);`;
        });

        item.addEventListener("dragleave", (e) => {
            console.log("leave");
            e.target.closest(
                ".item"
            ).style.cssText = `border-bottom:1px solid #ccc;transform: scale(1);`;
        });

        item.addEventListener("drop", (e) => {
            e.preventDefault();
            const currentId = e.target.closest(".item")?.id;
            const dropIndex = todos.findIndex((v) => v.id == currentId);

            let a = todos.splice(dragIndex, 1);
            todos.splice(dropIndex, 0, a[0]);

            // const temp = todos[dragIndex];
            // todos[dragIndex] = todos[dropIndex];
            // todos[dropIndex] = temp;

            render();
        });
    }
}



render();


let form = document.querySelector(".form")
// const inputClass = document.querySelector(".input")

// inputClass.style.boxshadow = "0px 0px 7px red"
// console.log(inputClass);



form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.todo.value;


    if (inputValue) {


        const newTodo = {
            id: "s" + new Date().getTime(),
            todo: inputValue
        };
        todos.unshift(newTodo);
        form.reset();
        render()

    } else {
        const dNone = document.querySelector('.empty__btn')
        const inp = document.querySelector('input')
        inp.classList.add('new__input')
        dNone.style.cssText = `display: inline-block; 
            `
        setTimeout(() => {
            dNone.style.cssText = `display: none
            `
            inp.classList.remove('new__input')
        }, 400)
    }
})


clear.addEventListener("click", () => {

    todos = []
    render()
});





selectFilter.addEventListener("change", (e) => {
    currentStatus = e.target.value;
    render();
});






items.addEventListener("click", (e) => {
    const currentId = e.target.closest(".item")?.id;
    const currentItem = e.target.closest(".item");

    const selector = (classname) => `#${currentId} .${classname} `
    const saveButton = document.querySelector(selector("save"));
    const cancelButton = document.querySelector(selector("cancel"));
    const editButton = document.querySelector(selector("edit"));
    const currentInput = document.querySelector(selector("todo"));
    const deleteButton = document.querySelector(selector("delete"));



    if (e.target.closest(".delete-")) {
        currentItem.classList.add('delete__effect')
    }


    if (e.target.closest(".delete")) {
        todos = todos.filter((v) => v.id != currentId);
        render();
    }


    if (e.target.closest(".edit")) {
        saveButton.style.display = "block";
        cancelButton.style.display = "block";
        editButton.style.display = "none";
        deleteButton.style.display = "none";

        currentInput.removeAttribute("disabled");

        currentInput.focus();

        const value = currentInput.value;
        currentInput.value = "";
        currentInput.value = value;

        deleteButton.classList = 'delete-'


        currentInput.addEventListener("blur", (e) => {
            setTimeout(() => {
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                editButton.style.display = "block";
                console.log('blur');
                render()
            }, 500);
        });
    }
    if (e.target.closest(".save")) {

        saveButton.style.display = "none";
        cancelButton.style.display = "none";
        editButton.style.display = "block";
        currentInput.setAttribute("disabled", "");

        // todos = todos.map((e) =>
        //     e.id === currentId ? { ...e, todo: currentInput.value } : e
        // );

        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === currentId) {
                todos[i].todo = currentInput.value;
            }
        }


        render();
    }


    currentInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            editButton.style.display = "block";
            currentInput.setAttribute("disabled", "");

            // todos = todos.map((e) =>
            //     e.id === currentId ? { ...e, todo: currentInput.value } : e
            // );


            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === currentId) {
                    todos[i].todo = currentInput.value;
                }
            }

            render();
        }
    })

    if (e.target.closest(".cancel")) {
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
        editButton.style.display = "block";
        currentInput.setAttribute("disabled", "");
        render();
    }


    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && saveButton.style.display === "block") {
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            editButton.style.display = "block";
            currentInput.setAttribute("disabled", "");
            render();
        }
    });

    if (e.target.closest(".checkbox")) {
        // todos = todos.map((e) =>
        //     e.id == currentId ? { ...e, isDone: !e.isDone } : e
        // )

        const id = todos.findIndex((v) => v.id === currentId);
        todos[id].isDone = !todos[id].isDone;

        render();
    }



})



// const wrapper = document.getElementById('wrapper');

// var images = ["115.jpg", "116.jpg", "117.jpg"];

// $(function () {
//     var i = 0;
//     wrapper.css("background-image", "url(images/" + images[i] + ")");
//     setInterval(function () {
//         i++;
//         if (i == images.length) {
//             i = 0;
//         }
//         wrapper.fadeOut("slow", function () {
//             $(this).css("background-image", "url(images/" + images[i] + ")");
//             $(this).fadeIn("slow");
//         });
//     }, 5000);
// });

const wrapper = document.getElementById("wrapper");
const images = [
    "1535120110.jpg",
    "118.jpg", "120.jpg",
    "121.jpg",
    "127.jpg",
    "128.jpg"
];
let i = 0;

function changeImage() {
    wrapper.style.transition = `2s`
    wrapper.style.background = `url(images/${images[i]}) no-repeat center center fixed`;
    wrapper.style.mozBackgroundSize = "cover";
    wrapper.style.oBackgroundSize = "cover";
    wrapper.style.backgroundSize = "cover";
    i++;
    if (i == images.length) {
        i = 0;
    }
    setTimeout(changeImage, 10000);
}

changeImage();










