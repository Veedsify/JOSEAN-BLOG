// const j=Jodit.make('.post',{minHeight:700,useSearch:!0,spellcheck:!1,buttons:[...Jodit.defaultOptions.buttons,{name:"CODE",tooltip:"Insert snippet code",exec:e=>modal("open")}]});function setCode(){let t=document.querySelector("#paste-code"),n=document.querySelector(".modal-code");j.selection.insertHTML('<div class="code-block"><span class="copybtn"><img src="/IMAGES/copy.svg" alt="copy btn"></span><code class="codeSpace">'+t.innerHTML+"</code></div><br>"),"active"===n.classList[1]&&n.classList.remove("active")}function modal(e){let t=document.querySelector(".modal-code");"open"===e?t.classList.add("active"):"close"===e&&(document.querySelector("#paste-code").innerHTML="",t.classList.remove("active"))}


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