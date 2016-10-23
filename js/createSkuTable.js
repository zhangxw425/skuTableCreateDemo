/**
 * author:zhangxiaowu
 * date:2016年9月11日
 * version:1.0
 * email:uf_zhangxiaowu@163.com
 */

$(function(){
	//表格创建
	$(document).on("change",'.sku_value',function(){
		var b = true;
		var skuTypeArr =  [];//存放SKU类型的数组
		var totalRow = 1;//总行数
		//获取元素类型
		$(".SKU_TYPE").each(function(){
			//SKU类型节点
			var skuTypeNode = $(this).children("li");
			var skuTypeObj = {};//sku类型对象
			//SKU属性类型标题
			skuTypeObj.skuTypeTitle = $(skuTypeNode).attr("sku-type-name");
			//SKU属性类型主键
			var propid = $(skuTypeNode).attr("propid");
			skuTypeObj.skuTypeKey = propid;
			//是否是必选SKU 0：不是；1：是；
			var is_required = $(skuTypeNode).attr("is_required");
			skuValueArr = [];//存放SKU值得数组
			//SKU相对应的节点
			var skuValNode = $(this).next();
			//获取SKU值
			var skuValCheckBoxs = $(skuValNode).find("input[type='checkbox'][class*='sku_value']");
			var checkedNodeLen = 0 ;//选中的SKU节点的个数
			$(skuValCheckBoxs).each(function(){
				if($(this).is(":checked")){
					var skuValObj = {};//SKU值对象
					skuValObj.skuValueTitle = $(this).val();
					skuValObj.skuValueId = $(this).attr("propvalid");
					skuValueArr.push(skuValObj);
					checkedNodeLen ++ ;
				}
			});
			if(is_required && "1" == is_required){//必选sku
				if(checkedNodeLen <= 0){//有必选的SKU仍然没有选中
					b = false;
					return false;//直接返回
				}
			}
			if(skuValueArr && skuValueArr.length > 0){
				totalRow = totalRow * skuValueArr.length;
				skuTypeObj.skuValues = skuValueArr;//sku值数组
				skuTypeObj.skuValueLen = skuValueArr.length;//sku值长度
				skuTypeArr.push(skuTypeObj);//保存进数组中
			}
		});
		var SKUTableDom = "";//sku表格数据
		//开始创建行
		if(b){//必选的SKU属性已经都选中了
			//调整顺序(少的在前面,多的在后面)
			skuTypeArr.sort(function(skuType1,skuType2){
				return (skuType1.skuValueLen - skuType2.skuValueLen)
			});
			SKUTableDom += "<table class='skuTable'><tr>";
			//创建表头
			for(var t = 0 ; t < skuTypeArr.length ; t ++){
				SKUTableDom += '<th>'+skuTypeArr[t].skuTypeTitle+'</th>';
			}
			SKUTableDom += '<th>价格</th><th>库存</th>';
			SKUTableDom += "</tr>";
			//循环处理表体
			for(var i = 0 ; i < totalRow ; i ++){//总共需要创建多少行
				SKUTableDom += "<tr>"
				var rowCount = 1;//记录行数
				for(var j = 0 ; j < skuTypeArr.length ; j ++){//sku列
					var skuValues = skuTypeArr[j].skuValues;//SKU值数组
					var skuValueLen = skuValues.length;//sku值长度
					rowCount = (rowCount * skuValueLen);//目前的生成的总行数
					var anInterBankNum = (totalRow / rowCount);//跨行数
					if(0  == (i % anInterBankNum)){//需要创建td
						var point = ((i / anInterBankNum) % skuValueLen);
						SKUTableDom += '<td rowspan='+anInterBankNum+'>'+skuValues[point].skuValueTitle+'</td>';
					}
				}
				SKUTableDom += '<td><input type="text"/></td><td><input type="text"/></td></tr>';
			}
			SKUTableDom += "</table>";
		}
		$("#skuTable").html(SKUTableDom);
	});
});