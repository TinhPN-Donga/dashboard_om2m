let groupLabel = document.getElementById("group-label");
let addElemnt = document.getElementById("add-element");

const addElement = () =>{
    let inputGroup = document.createElement("div");
    inputGroup.setAttribute("class", "input-group");

    let inputElement = document.createElement("input");
    // Thêm các thuộc tính cho phần tử input
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("class", "form-control");
    inputElement.setAttribute("id", "titleTool");
    inputElement.setAttribute("name", "label");
    inputElement.setAttribute("placeholder", "Enter label");

    // Create the remove button
    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "btn btn-danger remove-button");
    removeButton.textContent = "Remove";
    
    // Append input and remove button to the container
    inputGroup.appendChild(inputElement);
    inputGroup.appendChild(removeButton);

    // Thêm phần tử input vào group
    groupLabel.appendChild(inputGroup);
    
    // Add event listener to the remove button
    removeButton.addEventListener("click", () => {
        groupLabel.removeChild(inputGroup);
    });
}

const removeElement = () => {

}

addElemnt.addEventListener("click", (e) => {
    addElement();
});
