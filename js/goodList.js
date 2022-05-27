class goodList {
    constructor() {
        this.getList();
        this.$('.sk_bd ul').addEventListener('click', this.goodsBtn.bind(this))
        window.addEventListener('scroll', this.loading);
        this.num = 1;
    }
    loading = () => {
        let scrollH = document.documentElement.scrollTop;
        let pageH = window.innerHeight;
        let contH = this.$('.sk_container').offsetHeight;
        let res = false;
        if ((scrollH + pageH) > (contH + 400)) {
            if (res) {
                return;
            } else {
                res = true;
                this.getList(++this.num)
                setTimeout(() => {
                    res = false;
                }, 1000)
            }
        }
    }
    goodsBtn(eve) {
        let token = localStorage.getItem('token');
        if (eve.target.classList.contains('sk_goods_buy')) {
            if (token) {
                let goodsId = eve.target.parentNode.dataset.id;
                let userId = localStorage.getItem('user_id');
                this.checkLogin(goodsId, userId);
            } else {
                location.assign('./login.html?ReturnUrl=./list.html')
            }
        } else {
            return
        }
    }
    checkLogin(goodsId, userId) {
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let data = `id=${userId}&goodsId=${goodsId}`
        axios.post('http://localhost:8888/cart/add', data).then((res) => {
            if (res.status == 200 && res.data.code == 1) {
                layer.open({
                    title: '添加成功',
                    btn: ['继续浏览', '购物车结算'],
                    cancel: function () { },
                    btn2: function () { location.assign('./cart.html') },
                });
            }
            else if (res.status == 200 && res.data.code == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                location.assign('./login.html?ReturnUrl=./list.html')
            }
            else if (res.status == 200 && res.data.code == 0) {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                location.assign('./login.html?ReturnUrl=./list.html')
            } else {
                layer.open({
                    title: '失败提示框'
                    , content: '加入购物车失败'
                    , time: 3000
                }
                );
            }

        })
    }
    getList(page = 1) {
        axios.get('http://localhost:8888/goods/list?current=' + page)
            .then((res) => {
                let { status, data } = res;
                let { list } = data;
                let html = '';
                if (status == 200 && data.code == 1) {
                    list.forEach(v => {
                        html += `<li class="sk_goods" data-id=${v.goods_id}>
                        <a href="#none"><img src="${v.img_big_logo}" alt=""></a>
                        <h5 class="sk_goods_title">${v.title}</h5>
                        <p class="sk_goods_price"><em>¥${v.current_price}</em> <del>￥${v.price}</del></p>
                        <div class="sk_goods_progress">
                            打折<i>${((v.price - v.current_price) / v.price).toFixed(2) * 100}%</i>
                            <div class="bar">
                                <div class="bar_in"></div>
                            </div>
                            剩余<em>${v.goods_number}</em>件
                        </div>
                        <a href="#none" class="sk_goods_buy">立即抢购</a>
                    </li>`
                    });
                    //+= 让更多的数据可以一次性的都展示在页面中
                    this.$('.sk_bd ul').innerHTML += html;
                }
            })
    }
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new goodList;