//
function otherRule(retZhiArr)
{
  retZhiArr = otherRule2(retZhiArr, "申子辰", ["申子", "子辰", "申辰"], "合");
  retZhiArr = otherRule2(retZhiArr, "寅午戌", ["寅午", "午戌", "寅戌"], "合");
  retZhiArr = otherRule2(retZhiArr, "亥卯未", ["亥卯", "卯未", "亥未"], "合");
  retZhiArr = otherRule2(retZhiArr, "巳酉丑", ["巳酉", "酉丑", "巳丑"], "合");

  retZhiArr = otherRule2(retZhiArr, "寅卯辰", ["寅辰"], "会");
  retZhiArr = otherRule2(retZhiArr, "巳午未", ["巳未"], "会");
  retZhiArr = otherRule2(retZhiArr, "申酉戌", ["申戌"], "会");
  retZhiArr = otherRule2(retZhiArr, "亥子丑", ["亥丑"], "会");

  retZhiArr = otherRule2(retZhiArr, "寅巳申", ["寅巳", "巳申", "申寅"], "刑");
  retZhiArr = otherRule2(retZhiArr, "丑戌未", ["丑戌", "戌未", "丑未"], "刑");
  return retZhiArr
}
function otherRule2(retZhiArr,  a,  b, flag)
{
    var hasFlag = false;
    for(var tmp in retZhiArr)
    {
        if(retZhiArr[tmp].indexOf(a) > -1) {
            hasFlag = true;
        }
    }
    if(hasFlag)
    {
        var delobj = new Array();
        for (var i = 0; i < retZhiArr.length; i++)
        {
            var tmp = retZhiArr[i];
            for (var j = 0; j < b.length; j ++)
            {
                if(tmp.indexOf(b[j]) > -1 && tmp.indexOf(a) == -1 && tmp.indexOf(flag) > -1)
                    delobj.push(tmp);
            }
        }
        
        var newArr = new Array();
        
        for(var j = 0; j < retZhiArr.length; j ++)
        {
          if(delobj.indexOf(retZhiArr[j]) == -1)
            newArr.push(retZhiArr[j])    
        }

        retZhiArr = newArr;
    }
    return  retZhiArr;
}

function  calculate(data,bz)
{
  //
  //let ly_zhi = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"]
  //let TianGan = ["甲",  "乙",  "丙",  "丁",  "戊",   "己",  "庚",   "辛",  "壬",  "癸"];
  var bzArr = bz.split(" ")

  var GanArr = new Array();
  var ZhiArr = new Array();
  var ret = Array();
  
  for(var i = 0; i < bzArr.length; i ++)
  {
    GanArr.push(bzArr[i][0])
    ZhiArr.push(bzArr[i][1])
  }
  
  var GanChat = new Array();
  for(var i = 0; i < data[0].length; i ++)
  {
    var itemArr= data[0][i].split(",")
    var att = itemArr[2].split("_")
    var item = itemArr[0];
    
    var offArr = new Array()
    for(var x = 0; x < att.length; x ++)
    {
      var tmpoffArr = new Array();
      for(var y = 0; y < GanArr.length; y ++)
      {
        if(att[x] == GanArr[y])
        {
          tmpoffArr.push(y)
        }
      }
      offArr.push(tmpoffArr)
      
    }
    var result = combination(offArr); 
    GanChat.push({'data' : result, 'tips': itemArr[1]})
  }
  
  var ZhiChat = new Array();
  for(var i = 0; i < data[1].length; i ++)
  {
    var itemArr= data[1][i].split(",")
    var att = itemArr[3].split("_")
    var item = itemArr[0];
    
    var offArr = new Array()
    for(var x = 0; x < att.length; x ++)
    {
      var tmpoffArr = new Array();
      for(var y = 0; y < ZhiArr.length; y ++)
      {
        if(att[x] == ZhiArr[y])
        {
          tmpoffArr.push(y)
        }
      }
      offArr.push(tmpoffArr)
    }
    
    var result = combination(offArr); 
    
    ZhiChat.push({'data' : result, 'tips': itemArr[1]})
  }
  //console.log(ZhiChat)
  
  var ganretarr = new Array();
  for(var i = 0; i < GanChat.length; i ++)
  {
    for(var j = 0; j < GanChat[i]['data'].length; j ++)
    {
      var tmp = GanChat[i]['data'][j].split(",")
      var tmpnumArr = new Array()
      var max = 0
      var min = 999
      for(var a in tmp)
      {
        var tmpindex = parseInt(tmp[a])
        
        if(tmpindex > max)
          max = tmpindex
        if(tmpindex < min)
          min = tmpindex

        tmpnumArr.push([tmpindex,GanArr[tmpindex]])
      }
      ganretarr.push([tmpnumArr,GanChat[i]['tips'], min, max - min])
    }
  }
  ganretarr = sortarr(ganretarr,2)
  var newganrearr = new Array();
  for(var i = ganretarr.length - 1; i > -1; i --)
  {
    newganrearr.push(ganretarr[i]);
  }
  ret.push(newganrearr)

  var zhiretarr = new Array();
  for(var i = 0; i < ZhiChat.length; i ++)
  {
    for(var j = 0; j < ZhiChat[i]['data'].length; j ++)
    {
      var tmp = ZhiChat[i]['data'][j].split(",")
      var tmpnumArr = new Array()
      var max = 0
      var min = 999
      for(var a in tmp)
      {
        var tmpindex = parseInt(tmp[a])
        if(tmpindex > max)
          max = tmpindex
        if(tmpindex < min)
          min = tmpindex
        tmpnumArr.push([tmpindex,ZhiArr[tmpindex]])
      }
      zhiretarr.push([tmpnumArr,ZhiChat[i]['tips'], min, max - min])
    }
  }
  //console.log(zhiretarr)
  zhiretarr = sortarr(zhiretarr, 2)
  ret.push(zhiretarr)
  //console.log(zhiretarr)
  return ret;
}

function sortarr(arr, index)
{
  for(var i = 0;i < arr.length - 1; i ++)
  {
    for(var j = i + 1; j < arr.length; j ++)
    {
      if( arr[j][index] <= arr[i][index])
      {
        var tmpobj = arr[i]
        arr[i] = arr[j]
        arr[j] = tmpobj
      }
    }
  }
  return arr
}



function combination(arr) { 
  var sarr = [[]]; 
  var result = []; 
  for (var i = 0; i < arr.length; i++) { 
    var tarr = []; 
    for (var j = 0; j < sarr.length; j++){ 
      for (var k = 0; k < arr[i].length; k++){ 
        tarr.push(sarr[j].concat(arr[i][k])); 
      } 
    } 
    sarr = tarr; 
  } 
  for(var m =0; m < sarr.length;m++) { 
    result.push(sarr[m].join(',')); 
  } 
  var newArr = new Array();
  for(var m = 0; m < result.length; m ++)
  {
    var itemarr = result[m].split(",")
    itemarr = sortarr(itemarr, 0)
    var addflag = 1
    for(var n = 0; n < itemarr.length - 1; n++)
    {
      if(itemarr[n] == itemarr[n+1])
        addflag = 0
    }

    if(addflag == 1)
    {
      for(var n = 0; n < newArr.length; n++)
      {
        var tmpflag = 0
        for(var x = 0; x < newArr[n].length; x ++)
        {
          if(newArr[n][x] != itemarr[x])
            tmpflag = 1;
        }
        if(tmpflag == 0)
        {
          addflag = 0;
          break;
        }
      }
    }

    if(addflag == 1)
      newArr.push(itemarr)
  }
  result = new Array()
  for(var i = 0; i < newArr.length; i ++)
  {

    result.push(newArr[i].join(',')); 
  }
  return result; 
} 

module.exports = {
  calculate: calculate,
  otherRule: otherRule
}
