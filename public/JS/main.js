
// Insert snippet code
const jodit = Jodit.make('.post', {
    "minHeight": 700,
    "useSearch": true,
    "spellcheck": false,
    buttons: [
        ...Jodit.defaultOptions.buttons,
        {
            name: 'CODE',
            tooltip: 'Insert snippet code',
            exec: (editor) => {
                modal('open')
            }
        }]
});

// Set code.
function setCode(){
    let textBox = document.querySelector('#paste-code')
    let modalBox = document.querySelector('.modal-code')


    // main box for copy.
    let mainBox =  `
        <div class="code-block">
            <span class="copybtn">
                <img src="/IMAGES/copy.svg" alt="copy btn">
            </span>
            <code class="codeSpace">
                ${textBox.innerHTML}
            </code>
        </div>
        <br>
    
    `;
    jodit.selection.insertHTML(mainBox)

    modalBox.classList.remove('active')
}



// Create modal box.
function modal(res){
    let modalBox = document.querySelector('.modal-code')
    if(res === 'open'){
        modalBox.classList.add('active') 
        return   
    }else if (res === 'close'){
        let codeSpace =  document.querySelector('#paste-code')
        codeSpace.innerHTML = ''

        modalBox.classList.remove('active')    
        return
    }else{
        return
    }
}


