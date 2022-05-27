class Login {
    constructor() {
        this.$('.over').addEventListener('click', this.loginBtn)
    }
    loginBtn() {
        let form = document.forms[0].elements;
        let username = form[0].value.trim();
        let password = form[1].value.trim();
        if (!username || !password) {
            throw new Error('账号密码不能为空')
        };
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let data = `username=${username}&password=${password}`
        axios.post('http://localhost:8888/users/login', data).then((res) => {
            if (res.status == 200 && res.data.code == 1) {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user_id', res.data.user.id)
                let search = location.search.split('=')[1];
                location.href = search;
            } else {
                alert('账号密码有误')
            }

        })

    }
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Login;