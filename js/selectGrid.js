///////////////////////////////////////////////
//多选下拉表
//v 1.0
//creat by miracleren 
//creat date 2018 09 27
//url https://github.com/miracleren/selectGrid
//说明：运行基础 jquery库 layui框架 
//////////////////////////////////////////////
; (function ($) {
    var defaults = {
        id: "",             //
        height: 'full',    //高度
        width: 'auto',     //宽
        key:"",             //行id
        multiple:true,      //多选
        filter:false,       //是否带查询
        table: {
            url: "",
            cols: [[]]
        },
        // data:[]
    };
    var grid;
    var count;

    //初始化下拉框
    $.fn.selectGrid = function (options) {
        options.id = "#" + $(this).attr("id");
        var opts = $.extend(defaults, options);
        var grid = $('<table id="select_grid" lay-filter="select_grid"  ></table>');
        var box = $('<div id="select_grid_box" style="height:48px;position: absolute;z-index: 999999;display:none; background:white;"></div>');
        
        box.css("width", defaults.width);

        if (defaults.filter == true) {
            var search = $('<div id="select_grid_search" class="layui-row"><div class=" layui-col-xs8 col-1"><input type="text" class="layui-input"></div><div class="layui-col-xs4 col-2" style="text-align: center;"><button class="layui-btn layui-btn-sm ">清除</button></div></div>');
            search.css({ padding: "5px", background: "#eee" });
            var sbutton = search.find("button");
            var sinput = search.find("input");
            sbutton.css({ margin: "4px 0px 0 20px" });
            sbutton.click(function(){
                sinput.val("");
                reload();
                return false;
            })
            sinput.on('input',function(){
                reload();
            });
            box.prepend(search);
        }

        $(this).after(box);
        box.append(grid);

        var newcol 
        if(defaults.multiple == true)
            newcol = [{ type: 'checkbox', sort: true }];
        else
            newcol = [{ type: 'radio', sort: true }];

        for (var i = 0; i < defaults.table.cols[0].length; i++) {
            newcol.push(defaults.table.cols[0][i]);
        }
        newcol.push({field: 'isshow', hide:true});
        defaults.table.cols[0] = newcol;

        var setting = $.extend({}, {
            id: "select_grid",
            elem: '#select_grid',
            method: "post",
            height: defaults.height,
            page: false,
            limit: 300,
            response: {
                statusName: "status",
                statusCode: 200,
                dataName: "rows"
            },

            done: function (res, curr, count) {
                box.find(".layui-table-view").css("margin","0px");
                box.find(".layui-table-box").css("background-color","#fdfdfd");

                $("[data-field=isshow]").each(function(){
                    if($(this).find("div").html() == 'false')
                        $(this).parent("tr").css("display","none");
                    else
                        $(this).parent("tr").css("display","block");
                });
            }
        }, defaults.table);

        //初始化下拉grid
        layui.use('table', function () {
            var table = layui.table;
            grid = table.render(setting);
            if (defaults.multiple == true) {
                table.on('checkbox(select_grid)', function(obj){
                  showMsg();
              });}
                else{
                    table.on('radio(select_grid)', function(obj){
                        console.log(obj.checked); 
                        for(var s in obj.data){
                            if(s != "id"){
                                $(defaults.id).val(obj.data[s]);
                                break;
                            }
                        }
                    });
                }
            });

        $('body').click(function (e) {
            if (box.css("display") === 'block') {
                var target = $(e.target);
                if (!target.is(defaults.id) && !target.is('#select_grid_box *') && !((target.attr("class")+"").indexOf('layui-icon')>=0)) {
                    box.setHide();
                } 
            }
        })

        $(this).click(function () {
            if (box.css("display") === 'block')
                box.setHide();
            else
                box.setShow();
        });
    };

    //显示内容
    function showMsg() {
        layui.use('table', function () {
            var table = layui.table;
            var checkStatus = table.checkStatus('select_grid');
            var data = checkStatus.data;
            if(data.length == layui.table.cache["select_grid"].length)
                $(defaults.id).val("已全选，共" + data.length + "条");
            else if(data.length == 0)
                $(defaults.id).val("没有选中数据");
            else
                $(defaults.id).val("已选中" + data.length + "条");
            
            var list = "";
            for (var i = 0; i < data.length; i++) {
                list += data[i][defaults.key] + ",";
            }
            $(defaults.id).attr("value-list", list.substr(0, list.length - 1));
        });
    }

    //重载Grid
    function reload() {
        var key = $("#select_grid_search").find("input").val();
        layui.use('table', function () {

            var newdata = layui.table.cache["select_grid"];
            var checklength = layui.table.checkStatus('select_grid').data.length;
            var indexcheck = 0;
            var indexnocheck = checklength;
            for (var i = 0; i < newdata.length; i++) {
                if (newdata[i].LAY_CHECKED === true) {
                    newdata[i].LAY_TABLE_INDEX = indexcheck;
                    newdata[i].isshow = true;
                    indexcheck++;
                }
                else {
                    newdata[i].LAY_TABLE_INDEX = indexnocheck;
                    if (key == "" || key == null) 
                    {
                        newdata[i].isshow = true;
                    }
                    else{
                        var query = JSON.stringify(newdata[i]);
                        if (fuzzysearch(key,query)) 
                            newdata[i].isshow = true;
                        else
                            newdata[i].isshow = false;
                    }
                    
                    indexnocheck++;
                }

            }
            newdata.sort(function (a, b) {
                return a.LAY_TABLE_INDEX - b.LAY_TABLE_INDEX;
            });

            layui.table.reload('select_grid', {
                url: "",
                data: newdata
            });
        });
    }

    //模糊查询
    function fuzzysearch (query, text) {
        var tlen = text.length;
        var qlen = query.length;
        if (qlen > tlen) {
            return false;
        }
        if (qlen === tlen && query === text) {
            return true;
        }
        outer: for (var i = 0, j = 0; i < qlen; i++) {
            var qch = query.charCodeAt(i);
            while (j < tlen) {
                if (text.charCodeAt(j++) === qch) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    }

    $.fn.selectGridValue = function ()
    {
        return $(defaults.id).attr("value-list");
    }

    $.fn.setHide = function () {
        $(this).css("display", "none");
    }
    $.fn.setShow = function() {
        $(this).css("display", "block");
        reload();
    }
})(jQuery);












