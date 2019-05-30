# selectGrid
多选、单选模糊查询下拉框

该控件是基于LayUI框架开及jquery库开发的，所以使用前，必需引入这些库（可能部分layui版本会有问题）。
控件支持快速模糊查询，同时所选的内容会排在前面，实现多选模糊查询的功能。

--模糊查询只会把匹配的结果排在前面，不会过滤。
--选的行，查询后或重新弹出，都会初始化排在最前面。

# 初始化方法

## 定义控件
```html
<input class="layui-input" name="selectGrid" id="selectGrid" lay-verify="required" placeholder="请选择">
```

## 初始化控件数据
```javascript
$("#selectGrid").selectGrid({
  //弹出框宽度，默认自动
  width: '500px',               
  //弹出框高度，默认自动
  height:'500px',               
  //数据主键ID，userdata里必须包含该列数据
  key:'id',                     
  //是否开启过滤功能，默认关闭
  filter:true,                  
  //是否开启多选功能，默认单选 
  multiple:true,                
  //初始化Grid数据，结构与layui提供的grid一样，可用url引入数据
  table: {                      
    data: userdata,
    cols: [[
    {field:'username', title:'用户名', width:120 },
    {field:'sex', title:'性别', width:80 },
    {field:'city', title:'城市'},
    ]]
  },
  done:function(){
    console.log('selectGrid is ok!');
  },
  selected:function(val){
    console.log('selected:'+val);
  }
});
```

## 运行效果如下
![image](https://github.com/miracleren/selectGrid/blob/master/pic/pic1.png)
