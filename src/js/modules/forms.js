import checkNumInputs from "./checkNumInputs";
import { postData } from "../services/requests";

const forms = () => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          upload = document.querySelectorAll('[name="upload"]'),
          uploadBtn = document.querySelectorAll('.upload_button'),
          textArea = document.querySelectorAll('textarea'),
          price = document.querySelector('.calc-price'),
          selects = document.querySelectorAll('select');

    // checkNumInputs('input[name="phone"]');

    const message = {
        loading: "Loading...",
        success: "Thank you! We will contact you soon",
        failure: "Something went wrong...",
        spinner: "assets/img/spinner.gif",
        ok: 'assets/img/ok.png',
        fail: 'assets/img/fail.png'
    };

    const path = {
        designer: 'assets/server.php',
        question: 'assets/question.php'
    }


    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = "";
        })

        textArea.forEach(item => {
            item.value = "";
        })

        upload.forEach(item => {
            item.previousElementSibling.textContent = "File is not selected";
        })

        uploadBtn.forEach(item => {
            item.textContent = 'Load photo';
        })

        price.textContent = 'To calculate, you need to select the size and the material of the painting';

        selects.forEach(select => {
            // Get all the 'option' elements within the 'select' element
            const options = select.querySelectorAll('option');
          
            // Loop through each 'option' element and log its text content
            options.forEach(option => {
                if (option.textContent === "Choose picture size") {
                    option.selected = true;
                }
                if (option.textContent === "Additional services") {
                    option.selected = true;
                }
                if (option.textContent === "Choose picture material") {
                    option.selected = true;
                }

            });
          });

    }

    upload.forEach(item => {
        item.addEventListener('input', () => {
            let dots;
            const arr = item.files[0].name.split('.');
            arr[0].length > 6 ? dots = "..." : dots = ".";
            const name = arr[0].substring(0,6) + dots + arr[1];
            item.previousElementSibling.textContent = name;

            uploadBtn.forEach(btn => {
                btn.textContent = name;
            })

            if (item.closest('.main')) {
                item.closest('.file_upload').style.backgroundColor  = '#f7e7e6';
                const formData = new FormData();
                formData.append('file', item.files[0]);
    
                postData('assets/server.php', formData)
                .then(result => console.log(result))
                .catch(() => console.log('error'))
                .finally(() => setTimeout(() => clearInputs(), 3000));
            }
        })
    })

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.parentNode.appendChild(statusMessage);

            item.classList.add('animated', 'fadeOutUp');
            setTimeout(() => {
                item.style.display = 'none';
            }, 400)

            let statusImg = document.createElement('img');
            statusImg.setAttribute('src', message.spinner);
            statusImg.classList.add('animated', 'fadeInUp');
            statusMessage.appendChild(statusImg);
            
            let textMessage = document.createElement('div');
            textMessage.textContent = message.loading;
            statusMessage.appendChild(textMessage);

            const formData = new FormData(item);

            let api;
            item.closest('.popup-design') || item.classList.contains('calc_form') ? api = path.designer : api = path.question;
            console.log(api);

            if (api == path.designer) {
                formData.append('price', price.textContent);
            }

            for (let key of formData) {
                console.log(key);
            }

            postData(api, formData)
                    .then(res => {
                        console.log(res);
                        statusImg.setAttribute('src', message.ok);
                        textMessage.textContent = message.success;
                    })
                    .catch(() => {
                        statusImg.setAttribute('src', message.fail);
                        textMessage.textContent = message.failure

                    })
                    .finally(() => {
                        clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                            item.style.display = 'block';
                            item.classList.remove('fadeOutUp');
                            item.classList.add('fadeInUp');
                        }, 5000)
                    })
        })
    })
}

export default forms;