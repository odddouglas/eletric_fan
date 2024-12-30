// pages/home.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //富文本
        richText_data1: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }],
        richText_data2: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }],
        richText_data3: [{
                name: 'div',
                attrs: { "class": 'big-text' },
                children: [
                    { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] },
                    { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                ]
            }]
    },
    updateRichText: function () {
        var data1 = app.globalData.data1 || 'NULL'; //更新全局数据到本页面
        var data2 = app.globalData.data2 || 'NULL';
        this.setData({
            richText_data1: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: data1 }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }],
            richText_data2: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: data2 }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }],
            richText_data2: [{
                    name: 'div',
                    attrs: { "class": 'big-text' },
                    children: [
                        { name: 'span', attrs: { "class": 'param-name' }, children: [{ type: 'text', text: 'data: ' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: 'data' }] },
                        { name: 'span', attrs: { "class": 'param-value' }, children: [{ type: 'text', text: '' }] }
                    ]
                }]
        });
    },
    onLoad: function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.updateRichText();
        }, 2000); // 每秒更新一次富文本，一般后台更新数据之后，下一秒就可以直接更新富文本了
    }
});