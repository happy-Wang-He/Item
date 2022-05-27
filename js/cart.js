class Cart {
    constructor() {
        this.getCartList();
        this.$('.cart-body .cart-list').addEventListener('click', this.removeGoods)
        this.$('.cart-body .cart-list').addEventListener('click', this.addBtn)
        this.$('.cart-body .cart-list').addEventListener('click', this.delBtn)
    }
    addBtn = (eve) => {
        if (!eve.target.classList.contains('plus')) return;
        let goodsNumIput = eve.target.previousSibling.previousSibling;
        let goodsNum = goodsNumIput.value - 0;
        let goodsPrice = eve.target.parentNode.parentNode.previousSibling.previousSibling.firstElementChild.innerHTML - 0;
        let totlePrice = eve.target.parentNode.parentNode.nextSibling.nextSibling;
        goodsNum++;
        goodsNumIput.value = goodsNum;
        totlePrice.innerHTML = (goodsNum * parseInt(goodsPrice * 100) / 100).toFixed(2);
        //哎呀,真是6666,不知道啥问题,肯定是class属性丢了
        totlePrice.classList.add('sum');
        this.total();
        let goodsId = eve.target.parentNode.parentNode.parentNode.dataset.id;
        let id = localStorage.getItem('user_id')
        let data = `id=${id}&goodsId=${goodsId}&number=${goodsNum}`
        axios.post('http://localhost:8888/cart/number', data);
    }
    delBtn = (eve) => {
        if (!eve.target.classList.contains('mins')) return;
        let goodsNumIput = eve.target.nextSibling.nextSibling;
        let goodsNum = goodsNumIput.value - 0;
        let goodsPrice = eve.target.parentNode.parentNode.previousSibling.previousSibling.firstElementChild.innerHTML - 0;
        let totlePrice = eve.target.parentNode.parentNode.nextSibling.nextSibling;
        goodsNum--;
        if (goodsNum <= 1) goodsNum = 1;
        goodsNumIput.value = goodsNum;
        totlePrice.innerHTML = (goodsNum * parseInt(goodsPrice * 100) / 100).toFixed(2);
        //哎呀,真是6666,不知道啥问题,猜肯定是class属性丢了
        totlePrice.classList.add('sum');
        this.total();
        let goodsId = eve.target.parentNode.parentNode.parentNode.dataset.id;
        let id = localStorage.getItem('user_id')
        let data = `id=${id}&goodsId=${goodsId}&number=${goodsNum}`
        axios.post('http://localhost:8888/cart/number', data);
    }
    total() {
        let allSum = 0;
        let allNum = 0;
        let ulObj = this.$('.goods-list');
        Array.from(ulObj).forEach(v => {
            if (v.firstElementChild.firstElementChild.checked) {
                allSum += v.querySelector('.sum').innerHTML - 0;
                allNum += v.querySelector('.itxt').value - 0;
            }
        })
        this.$('.summoney span').innerHTML = allSum.toFixed(2);
        this.$('.sumprice-top span strong').innerHTML = allNum;
    }
    allCheck() {
        let allInput = this.$('.cart-th').firstElementChild.firstElementChild;
        let goodsInput = this.$('.good-checkbox');
        let cartThis = this;
        allInput.onclick = function () {
            if (allInput.checked) {
                Array.from(goodsInput).forEach((v) => {
                    v.checked = true;
                    cartThis.total();
                })
            } else {
                Array.from(goodsInput).forEach((v) => {
                    v.checked = false;
                    cartThis.total();
                })
            }
        }
        Array.from(goodsInput).forEach((v) => {
            let cartThis = this;
            v.onclick = function () {
                cartThis.total();
                if (!v.checked) {
                    allInput.checked = false;
                } else {
                    let res = Array.from(goodsInput).find(v => {
                        return !v.checked
                    })
                    if (!res) {
                        allInput.checked = true;
                    }
                }

            }
        })

    }
    removeGoods(eve) {
        if (!eve.target.classList.contains('del1A')) return;
        let id = localStorage.getItem('user_id')
        let goodsId = eve.target.parentNode.parentNode.parentNode.dataset.id;
        let ulObj = eve.target.parentNode.parentNode.parentNode;
        layer.open({
            title: '删除确认',
            btn: ['取消', '确认删除'],
            cancel: function () { },
            btn2: function () {
                axios.get('http://localhost:8888/cart/remove', {
                    params: {
                        id,
                        goodsId
                    }
                }).then((res) => {
                    // console.log(res);
                    if (res.status == 200 && res.data.code == 1) {
                        ulObj.remove();
                    } else {
                        layer.open({
                            title: '删除失败,',
                            time: 3000
                        });
                    }

                })
            },
        });
    }
    getCartList() {
        //请求数据列表必须带有token
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let id = localStorage.getItem('user_id')
        axios.get('http://localhost:8888/cart/list', {
            params: {
                id
            }
        }).then((res) => {
            // console.log(res);
            let { cart } = res.data;
            let html = '';
            if (res.status == 200 && res.data.code == 1) {
                cart.forEach(v => {
                    html += `<ul class="goods-list yui3-g" data-id=${v.goods_id}>
                    <li class="yui3-u-3-8 pr">
                        <input type="checkbox" class="good-checkbox">
                        <div class="good-item">
                            <div class="item-img">
                                <img src="${v.img_small_logo}">
                            </div>
                            <div class="item-msg">${v.title}</div>
                        </div>
                    </li>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <li class="yui3-u-1-8">
                        <span class="price">${v.current_price}</span>
                    </li>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <li class="yui3-u-1-8">
                        <div class="clearfix">
                            <a href="javascript:;" class="increment mins">-</a>
                            <input autocomplete="off" type="text" value="1" minnum="1" class="itxt">
                            <a class="increment plus">+</a>
                        </div>
                    </li>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <li class="yui3-u-1-8">
                        <span class="sum">${v.current_price}</span>
                    </li>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                    <li class="yui3-u-1-8">
                        <div class="del1">
                            <a href="javascript:;" class='del1A'>删除</a>
                        </div>
                    </li>
                </ul>`
                });
                this.$('.cart-body .cart-list').innerHTML = html;
                this.allCheck();

            } else if (res.status == 200 && res.data.code == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                location.assign('./login.html?ReturnUrl=./cart.html')
            }
        })



    }
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Cart;