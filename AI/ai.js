const gemini_api_key=Your_Gemini_API_key;
const input=document.getElementById("user-input");
const button=document.getElementById("send-button");
const default_header=document.getElementById("header");
const content_box = document.getElementById("ai-content");

button.addEventListener('click', function () {
    if(input.value.trim()=="") {
        return;
    }
    default_header.remove();
    const user_content = document.createElement("div");
    user_content.className="content-box";
    user_content.innerHTML=`${input.value}`;
    content_box.appendChild(user_content);
    aiResponse()
    input.value="";
})

async function aiResponse() {
    const wait_box=document.createElement("div");
    wait_box.className="wait-box";
    content_box.appendChild(wait_box);
    wait(wait_box);
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini_api_key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'contents': [
                {
                    'parts': [
                        {
                            'text': input.value
                        }
                    ]
                }
            ]
        })
    });
    let data = await response.json();
    wait_box.remove();
    let markedformat = data.candidates[0].content.parts[0].text;
    let result1 = marked.parse(markedformat);
    let result2 = DOMPurify.sanitize(result1);
    render(result2);
}

function render(content) {
    const response_content = document.createElement("div");
    response_content.className="response-box";
    response_content.innerHTML=`${content}`;
    content_box.appendChild(response_content);
}

async function wait(wait_box) {
    let dot="";
    setInterval(()=> {
        dot=dot.length<2 ? dot+"." : "";
        wait_box.innerHTML = `Generating.${dot}`;
    },500)
}
