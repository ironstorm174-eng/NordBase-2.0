const translate = require('@iamtraction/google-translate');
translate('Hello world', { to: 'ru' }).then(res => {
    console.log(res.text);
}).catch(err => {
    console.error(err);
});
