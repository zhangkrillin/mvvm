# 如何实现双向绑定mvvm
```
<div id="app">
    <input type="text" v-model="msg.a.b">
    <div>{{name}}</div>
    <p>{{age}}</p>
    <div>
      <span>{{job}}--{{msg.a.b}}</span>
    </div>
  </div>
```
