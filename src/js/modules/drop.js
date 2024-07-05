import { postData } from "../services/requests";

const drop = () => {
    // drag *
    // dragend *
    // dragenter - обьект над dropArea
    // dragexit *
    // dragleave - обьект за пределами dropArea
    // dragover - обьект зависает над dropArea
    // dragstart *
    // drop - обьект отправлен в dropArea

    const fileInputs = document.querySelectorAll('[name="upload"]');
    const uploadBtn = document.querySelectorAll('.upload_button');

    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach(eventName => {
        fileInputs.forEach(input => {
            input.addEventListener(eventName, preventDefaults, false);
        })
    })

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(item) {
        item.closest('.file_upload').style.border = "5px solid pink";
        item.closest('.file_upload').style.backgroundColor = "rgba(0, 0, 0, .7)";
    }

    function unhighlight(item) {
        item.closest('.file_upload').style.border = 'none';
        if (item.closest('.calc_form')) {
            item.closest('.file_upload').style.backgroundColor = "#fff";
        } else {
            item.closest('.file_upload').style.backgroundColor = "#ededed";
        }
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputs.forEach(input => {
            input.addEventListener(eventName, () => highlight(input), false);
        })
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputs.forEach(input => {
            input.addEventListener(eventName, () => unhighlight(input), false);
        });
    });

    const clearInputs = () => {
        fileInputs.forEach(item => {
            item.value = '';
        })

        uploadBtn.forEach(item => {
            item.textContent = 'Загрузить фотографию';
        }) 
    }

    fileInputs.forEach(input => {
        input.addEventListener('drop', (e) => {
            input.files = e.dataTransfer.files;
            let dots;
            const arr = input.files[0].name.split('.');

            arr[0].length > 6 ? dots = "..." : dots = '.';
            const name = arr[0].substring(0, 6) + dots + arr[1];
            input.previousElementSibling.textContent = name;

            uploadBtn.forEach(btn => {
                btn.textContent = name;
            })

            if (input.closest('.main')) {
                input.closest('.file_upload').style.backgroundColor  = '#f7e7e6';
                const formData = new FormData();
                formData.append('file', input.files[0]);

                postData('assets/server.php', formData)
                .then(result => console.log(result))
                .catch(() => console.log('error'))
                .finally(() => setTimeout(() => clearInputs(), 3000));
            }
        });
    });

};

export default drop;