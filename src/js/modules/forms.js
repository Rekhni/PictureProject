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
        loading: "Загрузка...",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что-то пошло не так...",
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
            item.previousElementSibling.textContent = "Файл не выбран";
        })

        uploadBtn.forEach(item => {
            item.textContent = 'Загрузить фотографию';
        })

        price.textContent = 'Для расчета нужно выбрать размер картины и материал картины';

        selects.forEach(select => {
            // Get all the 'option' elements within the 'select' element
            const options = select.querySelectorAll('option');
          
            // Loop through each 'option' element and log its text content
            options.forEach(option => {
                if (option.textContent === "Выберите размер картины") {
                    option.selected = true;
                }
                if (option.textContent === "Дополнительные услуги") {
                    option.selected = true;
                }
                if (option.textContent === "Выберите материал картины") {
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