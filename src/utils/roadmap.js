/* eslint-disable */
/**
 * Instantiate parameters
 *
 * @constructor
 */
function RoadMap(settings, callback) {
  // 是否支持canvas
  this.supportsCanvas = !!document.createElement('canvas').getContext;

  // // 棋牌x坐标偏移
  // this.Xstart = 0;
  // // 棋牌Y坐标偏移
  // this.Ystart = 0;
  // 露珠数据源
  this.datas = [];
  // 开始画的第一个露珠位置
  this.beginTag = 0;
  // 开始画的第一个大路露珠位置
  this.beginBigTag = 0;
  // 大路图
  this.bigData = [];
  // 行列计数,0位置标示列，1位置标示行“逻辑行列”
  this.bigNum0 = 0;
  this.bigNum1 = 0;
  this.offset = [];
  // 缓存上一个元素花色
  this.lastBig = 0;
  // 缓存最后一个元素的位置
  this.lastBigPos = [0, 0];
  // 临界状态标志：当最大行数等于1时起到标示作用
  this.bigFlag = false;

  // 大眼仔路图
  this.bigEyeData = new Array();
  // 行列计数,0位置标示列，1位置标示行
  // this.bigEyeNum = new Array[2];
  this.bigEyeNum0 = 0;
  this.bigEyeNum1 = 0;
  this.totalNum = 0;
  this.bankerNum = 0;
  this.playerNum = 0;
  this.tieNum = 0;
  this.bPairNum = 0;
  this.pPairNum = 0;
  this.shupy = 0; // todo:竖着偏移

  // 骰宝的
  this.sumbig = 0;
  this.sumsmall = 0;
  this.sumdan = 0;
  this.sumshuang = 0;
  this.baozi = 0;
  this.diceDrawCount = 0;

  this.opt = {
    gameType: 'BAC',
    canvas: null,
    canvasWidth: 180,
    canvasHeight: 70,
    // 网格线颜色
    gridColor: '#eeeeee1a',
    // 庄标识颜色
    bankerColor: '#FF6666',
    // 闲标识颜色
    playerColor: '#8095FF',
    // 和标识颜色
    tieColor: '#24b253',
    // 单元格大小。以珠盘路为准
    cellSize: 12,
    // 庄闲边框
    strokeWidth: 1.5,
    lineWidth: 0.5,
    zoom: 1,

    // 珠盘路列数
    // beadColumn: Math.floor(canvasWidth / (cellSize + lineWidth * 2)),
    // 珠盘路行数
    beadRow: 6,
  };

  this.init(settings, callback);
}

function Item() {
  this.status = '0'; // 游戏结果
  this.pair = '0'; // 对子 0:无，1:庄对,2：闲对，3：庄闲对。
  this.maxLine = 6; // 最大行数
  this.isNewLine = false; // 是否新起列
  this.color = []; // color
  for (var i = 0; i < 6; i++) this.color[i] = 0;
  this.tieSize = []; // 和的次数
  for (var i = 0; i < 6; i++) this.tieSize[i] = 0;
  this.position = []; // 大路位置信息
  for (var i = 0; i < 6; i++) this.position[i] = 0;
  this.bigEyeLoc = []; // 大眼仔路位置信息
  for (var i = 0; i < 100; i++) this.tieSize[i] = 0;
  this.smallLoc = []; // 小路位置信息
  for (var i = 0; i < 100; i++) this.smallLoc[i] = 0;
  this.yueyouLoc = []; // yueyou路位置信息
  for (var i = 0; i < 100; i++) this.yueyouLoc[i] = 0;
  this.columnSize = 0; //
  this.size = 0; //
}

function _forEach(items, callback) {
  return Array.prototype.forEach.call(items, (item, idx) => {
    callback(item, idx);
  });
}

/*
    * 画网格
    */
RoadMap.prototype.drawPath = function () {
  const { canvas } = this;
  // console.log(canvas)
  const { opt } = this;
  const mSize = opt.cellSize;

  // mPaintRed.setColor(gridColor);
  // 总列数
  const totalColumn = opt.beadColumn;
  // 总绘制行数
  const totalDrawCol = opt.beadRow;
  // 大路单元大小
  const halfSize = mSize / 2;
  // 总长度
  const totalLength = mSize * opt.totalColumn;
  // 珠盘总长度
  const beadLength = mSize * opt.beadColumn;
  // 画竖线
  // console.log(totalColumn)
  for (var i = 1; i < totalColumn; i++) {
    var _Xstart = (mSize + opt.lineWidth) * i;
    var _Ystart = (mSize + opt.lineWidth) * totalDrawCol;
    this.drawLine(
      [_Xstart, 0],
      [_Xstart, _Ystart],
      opt.lineWidth,
      opt.gridColor,
    );
  }
  for (var i = 1; i < totalDrawCol; i++) {
    var _Xstart = (mSize + opt.lineWidth) * totalColumn;
    var _Ystart = (mSize + opt.lineWidth) * i;
    this.drawLine(
      [0, _Ystart],
      [_Xstart, _Ystart],
      opt.lineWidth,
      opt.gridColor,
    );
  }
};

/**
   * 绘制整个珠盘路 大路
   * @param canvas
   */
RoadMap.prototype.drawBeads = function () {
  // 骰宝
  if (this.opt.gameType == 'SHB') {
    return this.drawBeadsDice();
  }
  // // 轮盘 暂无
  // else if (this.opt.gameType == "ROU") {
  // }
  // // 牛牛 暂无
  // else if (this.opt.gameType == "ROU") {
  // }
  // 百家乐玩法、包括龙虎

  const { bigData } = this;
  // var datas = this.datas;
  // 画珠盘路
  // var begin = 0;
  // var line = -1;
  // var end = datas.length + 1;
  const columnNum = this.opt.beadColumn;

  // 画大路
  let begin = 0;
  const end = bigData.length;
  let line = 0;
  if (end + 1 > columnNum) {
    begin = end - columnNum;
    this.beginBigTag = begin;
  }
  for (; begin < end; begin++) {
    const column = bigData[begin];
    for (let j = 0; j < 6; j++) {
      if (column.tieSize[j] == 0 && column.color[j] == '0') {
        continue;
      }
      this.bigWay(line, j, column.tieSize[j], column.color[j]);
    }
    line++;
  }
};

/**
   * 渲染一个大路单元格，指定位置与颜色信息
   * @param canvas
   * @param x 列数
   * @param y 行数
   * @param color 颜色
   * @param ties  和数目
   * bigWay(canvas, line, j, column.tieSize[j], column.color[j]);
   */
RoadMap.prototype.bigWay = function (x, y, ties, color) {
  const { cellSize } = this.opt;
  const { lineWidth } = this.opt;
  const { strokeWidth } = this.opt;
  const { gridColor } = this.opt;
  const { bankerColor } = this.opt;
  const { playerColor } = this.opt;
  const { tieColor } = this.opt;
  let yoffset;
  let xoffset;
  yoffset = y * (cellSize + lineWidth) + lineWidth;
  xoffset = x * (cellSize + lineWidth) + lineWidth;
  let bob_line = 0; // todo:线条
  let bob_color; // todo:颜色
  // 空心圆
  if (color != 0) {
    var size = cellSize / 2; // todo:控制防止和边框重合的
    // size - strokeWidth 防止与边框重合
    const innerSize = size - strokeWidth;
    // 庄
    if (color == '1') {
      bob_color = 'red';
      this.drawCircle(
        xoffset + size,
        yoffset + size,
        innerSize,
        '#FFF',
        strokeWidth,
        bankerColor,
      );
    }
    // 闲
    if (color == '2') {
      bob_color = 'blue';
      this.drawCircle(
        xoffset + size,
        yoffset + size,
        innerSize,
        '#FFF',
        strokeWidth,
        playerColor,
      );
    }
  }
  // 绿线
  const size1 = cellSize / 2;
  const offset = cellSize * 0.1;
  if (ties != 0 && ties < 4) {
    // todo:一条线
    if (ties == 1) {
      bob_line++;
      this.drawLine(
        [xoffset + offset / 2, yoffset + size1 * 2],
        [xoffset + size1 * 2 - offset / 2, yoffset],
        strokeWidth,
        tieColor,
      );
    } else if (ties == 2) {
      bob_line = 2;
      // todo:第一条线
      this.drawLine(
        [xoffset + offset / 2, yoffset + size1 * 0.7 * 2],
        [xoffset + size1 * 0.7 * 2, yoffset + offset / 2],
        strokeWidth,
        tieColor,
      );
      // todo:第二条线
      this.drawLine(
        [xoffset + size1 * 0.4 + offset / 2, yoffset + size1 * 2 - +offset / 2],
        [xoffset + size1 * 2 - offset / 2, yoffset + size * 0.4 + offset / 2],
        strokeWidth,
        tieColor,
      );
    } else if (ties == 3) {
      bob_line = 3;
      // todo:第一条线
      this.drawLine(
        [xoffset, yoffset + size1 * 1.2 + offset / 2],
        [xoffset + size1 * 0.4 * 2 + offset / 2, yoffset + offset / 2],
        2,
        tieColor,
      );
      // todo:第二条线
      this.drawLine(
        [xoffset + size1 * 0.8 + offset / 2, yoffset + size1 * 2],
        [xoffset + size1 * 2 - offset / 2, yoffset + size1 * 0.4 * 2],
        2,
        tieColor,
      );
      // todo:第3条线
      this.drawLine(
        [xoffset + offset / 2, yoffset + size1 * 2],
        [xoffset + size1 * 2 - offset / 2, yoffset],
        strokeWidth,
        tieColor,
      );
    }
  } else if (ties >= 4) {
    // todo:IE下就不管了 只画3个线
    bob_line = ties;
    // 画字
    // mPaintBlackFont.setTextSize(size1);
    if (ties >= 10) {
      this.showText(
        xoffset + size1 / 1.5 - 2,
        yoffset + size1 + size1 / 2 + offset / 2,
        `${ties}`,
        '8pt Calibri',
        gridColor,
      );
    } else {
      this.showText(
        xoffset + size1 / 1.5 - 0.5,
        yoffset + size1 + size1 / 2 + offset / 2,
        `${ties}`,
        '8pt Calibri',
        gridColor,
      );
    }
  }
};

/**
   * 绘制整个珠盘路 大路 ( 骰宝 )
   * @param canvas
   */
RoadMap.prototype.drawBeadsDice = function () {
  const { datas } = this;
  const { beadColumn } = this.opt;
  const { beadRow } = this.opt;

  // 整个画布左右分两块相同大小
  // 左右两块（大小单双）各留一列空白

  // 左侧（大小）块起始列数
  const beginCol1 = 1;
  // 右侧（单双）块起始列数
  const beginCol2 = Math.ceil(beadColumn / 2);
  // 最多能显示多少格
  const maxNum = (Math.floor(beadColumn / 2) - 1) * beadRow;

  const dataLength = datas.length;

  let { diceDrawCount } = this;
  // console.log(diceDrawCount)

  if (diceDrawCount == 0 || diceDrawCount > maxNum) {
    diceDrawCount = maxNum - beadRow + 1;
  }
  this.diceDrawCount = diceDrawCount;

  let startIndex = dataLength - diceDrawCount;

  startIndex = startIndex < 0 ? 0 : startIndex;
  // console.log(startIndex)

  // 画大小
  for (let count = 0; startIndex < dataLength; startIndex++) {
    const item = datas[startIndex];
    // console.log(item)

    const col1 = beginCol1 - 1 + Math.floor(count / beadRow);
    const row1 = count % beadRow;
    let text1 = '围';
    let color1 = this.opt.tieColor;

    const col2 = beginCol2 + Math.floor(count / beadRow);
    const row2 = count % beadRow;
    let text2 = '围';
    let color2 = this.opt.tieColor;
    // 计数
    count++;

    if (item.bigsmall == '1') {
      text1 = '大';
      color1 = this.opt.bankerColor;
    } else if (item.bigsmall == '2') {
      text1 = '小';
      color1 = this.opt.playerColor;
    }

    if (item.singledouble == '2') {
      text2 = '双';
      color2 = this.opt.bankerColor;
    } else if (item.singledouble == '1') {
      text2 = '单';
      color2 = this.opt.playerColor;
    }

    this.bigWayDice(col1, row1, text1, color1);
    this.bigWayDice(col2, row2, text2, color2);
  }
  this.diceDrawCount++;
};

/**
   * 渲染一个大路单元格，指定位置与颜色信息 ( 骰宝 )
   * @param canvas
   * @param x 列数
   * @param y 行数
   * @param color 颜色
   * @param ties  和数目
   * \           bigWay(canvas, line, j, column.tieSize[j], column.color[j]);
   */
RoadMap.prototype.bigWayDice = function (col, row, text, color) {
  const cxt = this.canvas;
  const { cellSize } = this.opt;
  const r = cellSize / 2;
  const x = col * (cellSize + this.opt.lineWidth) + r;
  const y = row * (cellSize + this.opt.lineWidth) + r;
  const fontsize = r;

  cxt.fillStyle = color;
  cxt?.beginPath?.();
  // x, y, r, 起始弧度, 结束弧度, 顺时针绘制
  cxt.arc(x, y, r, 0, 2 * Math.PI, false);
  cxt.closePath();
  cxt.fill();

  // 填充颜色
  cxt?.beginPath?.();
  cxt.font = `bold ${fontsize}px verdana, sans-serif`;
  cxt.fillStyle = '#FFFFFF';
  cxt.fillText(
    text,
    x - r + fontsize / 2,
    y + fontsize / 2 - this.opt.lineWidth * 2,
  );
  // cxt.textAlign = 'center';
  // cxt.textBaseline = 'middle';
  cxt.closePath();
  cxt.fill();
};

RoadMap.prototype.drawCircle = function (
  start,
  end,
  r,
  fillColor,
  borderWidth,
  borderColor,
) {
  const cxt = this.canvas;
  cxt?.beginPath?.();
  // x, y, r, 起始弧度, 结束弧度, 顺时针绘制
  cxt.arc(start, end, r, 0, 2 * Math.PI, false);
  // 填充颜色
  cxt.fillStyle = fillColor;
  //      cxt.fill();
  // todo 边框
  cxt.lineWidth = borderWidth;
  cxt.strokeStyle = borderColor;
  cxt.stroke();
};
// 绘制线条
RoadMap.prototype.drawLine = function (start, end, width, color) {
  const cxt = this.canvas;
  if (!cxt) {
    return
  }

  cxt.beginPath?.();

  // https://stackoverflow.com/questions/13879322/drawing-a-1px-thick-line-in-canvas-creates-a-2px-thick-line
  // Drawing a 1px thick line in canvas
  // if( width < 1 ){
  //   start[0] = Math.floor(start[0]) + .5;
  //   end[0] = Math.floor(end[0]) + .5;
  //   start[1] = Math.floor(start[1]) + .5;
  //   end[1] = Math.floor(end[1]) + .5;
  //   // console.log(start[1], end[1])
  //   width = 1;
  // }
  cxt?.moveTo(start[0], start[1]);
  cxt?.lineTo(end[0], end[1]);
  cxt.lineWidth = width;
  cxt.strokeStyle = color;
  cxt?.stroke();
};
RoadMap.prototype.showText = function (x, y, text, font, color) {
  const cxt = this.canvas;
  if (!cxt) {
    return
  }

  cxt?.beginPath?.();
  cxt.font = font;
  cxt.fillStyle = color;
  cxt.fillText(text, x, y);
  cxt.stroke();
};

/**
   * 清空画布
   */
RoadMap.prototype.clearDraw = function (canvas, width, height) {
  // console.log(canvas)
  const { zoom } = this.opt;
  if (canvas) {
    canvas.clearRect(0, 0, width * zoom, height * zoom);
  }
};
/** 清除所有数据 */
RoadMap.prototype.removeAll = function () {
  this.datas = [];
  this.removeAllNotDataList();
};
/** 清除data以外的所有数据 */
RoadMap.prototype.removeAllNotDataList = function () {
  this.totalNum = 0;
  this.bankerNum = 0;
  this.playerNum = 0;
  this.tieNum = 0;
  this.bPairNum = 0;
  this.pPairNum = 0;
  this.bigData = [];
  this.lastBig = 0;
  this.lastBigEye = 0;
  this.lastSmall = 0;
  this.lastYueyou = 0;
  this.bigNum0 = 0;
  this.bigNum1 = 0;
  this.lastBigPos0 = 0;
  this.lastBigPos1 = 0;
  this.bigEyeNum0 = 0;
  this.bigEyeNum1 = 0;
  this.smallNum0 = 0;
  this.smallNum1 = 0;
  this.yueyouNum0 = 0;
  this.yueyouNum1 = 0;
  this.isBigEyeInit = false;
  this.isSmallInit = false;
  this.isYueyouInit = false;
  this.bigFlag = false;
  this.smallFlag = false;
  this.bigEyeFlag = false;
  this.yueyouFlag = false;

  // 骰宝的
  // this.sumbig = 0;
  // this.sumsmall = 0;
  // this.sumdan = 0;
  // this.sumshuang = 0;
  // this.baozi = 0;
  // this.diceDrawCount = 0;
  // invalidate();
};

/**
   * 添加集合数据
   * @param list
   */
RoadMap.prototype.setIList = function (data) {
  // var msgJson = {"A001":{"vid":"A001","gameType":"BAC","shoeCode":"3428","dealer":"Abbey","gmcode":"GA001163150R0","roundCount":246,"roundRes":{"GA001163150K1":{"banker_val":"4","player_val":"9","card_num":"4","pair":"0"},"GA001163150K2":{"banker_val":"9","player_val":"9","card_num":"4","pair":"0"}}}};
  // data = {"vid":"A001","gameType":"BAC","shoeCode":"3428","dealer":"Abbey","gmcode":"GA001163150R0","roundCount":246,"roundRes":{"GA001163150K1":{"banker_val":"4","player_val":"9","card_num":"4","pair":"0"},"GA001163150K2":{"banker_val":"9","player_val":"9","card_num":"4","pair":"0"}}}
  // var msgJson = JSON.parse(msg);
  // 解析游戏结果的json数据
  const { roundRes } = data;
  for (const key in roundRes) {
    if (roundRes.hasOwnProperty(key)) {
      const item = this.formatItem(roundRes[key]);
      this.setItem(item);
    }
  }
  // for (var one in data.roundRes) {
  //   var res = msgJson[vid].roundRes[one];
  //   var item = this.formatItem(res);
  //   this.setItem(item);
  // }
};
/**
   * 添加集合数据
   * @param list
   */
RoadMap.prototype.appendIList = function (data) {
  // 重新装载原有数据
  const dataNew = this.datas; // alert("dataNew.length:" + dataNew.length);
  this.datas = new Array();
  for (let i = 0; i < dataNew.length; i++) {
    this.setItem(dataNew[i]);
  }
  // 解析游戏结果的json数据
  const item = this.formatItem(data);
  this.setItem(item);
};

RoadMap.prototype.setItem = function (item) {
  // console.log(datas.length);
  this.checkData(item, this.datas.length);
  this.datas.push(item); // alert("datas.length in setItem:" + datas.length);
};

RoadMap.prototype.formatItem = function (res) {
  const item = new Item();
  // 骰宝
  if (this.opt.gameType == 'SHB') {
    item.bigsmall = res.bigsmall;
    item.singledouble = res.singledouble;
    // var dice = res['dicept'];
    // // 求和，低版本IE不支持（<ie9）
    // var count = dice.reduce(function(a,b){
    //   return a + b;
    // });
    // // 豹子（围）
    // if( dice[0] == dice[1] == dice[2] ){
    //   item.bigsmall = '3'; // 百家乐的和当做围来计数
    //   item.singledouble = '3'; // 百家乐的和当做围来计数
    // }
    // else{
    //   if( count % 2 === 0 ){
    //     item.singledouble = '2'; // 双
    //   }else{
    //     item.singledouble = '1'; // 单
    //   }
    //   // 4-10为小
    //   if( count > 3 && count < 11 ){
    //     item.bigsmall = '2'; // 小
    //   }else{
    //     item.bigsmall = '1'; // 大
    //   }
    // }
  }
  // 轮盘 暂无
  else if (this.opt.gameType == 'ROU') {
    // do something
  }
  // 牛牛 暂无
  else if (this.opt.gameType == 'ROU') {
    // do something
  }
  // 百家乐玩法、包括龙虎
  else {
    if (res.banker_val > res.player_val) item.status = '1';
    // 庄赢
    else if (res.banker_val < res.player_val) item.status = '2';
    // 闲赢
    else item.status = '3'; // 和
    item.pair = res.pair; // pair
  }
  return item;
};
/**
   * 处理原始数据
   * @param item  数据项
   * @param p 在数据数组中的位置
   */
RoadMap.prototype.checkData = function (item, p) {
  this.totalNum++;

  if (this.opt.gameType == 'SHB') {
    if (item.bigsmall == '1') this.sumbig++;
    else if (item.bigsmall == '2') this.sumsmall++;

    if (item.singledouble == '1') this.sumdan++;
    else if (item.singledouble == '2') this.sumshuang++;

    if (item.bigsmall == '3' && item.singledouble == '3') this.baozi++;
    // this.diceDrawCount++;
    // console.log(this.sumbig);
  }
  // 轮盘 暂无
  else if (this.opt.gameType == 'ROU') {
    // do something
  }
  // 牛牛 暂无
  else if (this.opt.gameType == 'ROU') {
    // do something
  }
  // 百家乐玩法、包括龙虎
  else {
    const { status } = item;
    // 统计信息====================================================================
    switch (status) {
      case '3':
        this.tieNum++;
        break;
      case '1':
        this.bankerNum++;
        break;
      case '2':
        this.playerNum++;
        break;
    }
    switch (item.pair) {
      case '1':
        this.bPairNum++;
        break;
      case '2':
        this.pPairNum++;
        break;
      case '3':
        this.bPairNum++;
        this.pPairNum++;
        break;
    }

    const { bigData } = this;
    const { bigEyeData } = this;
    let { lastBig } = this;
    const { lastBigEye } = this;
    const { lastSmall } = this;
    const { lastYueyou } = this;
    let { bigNum0 } = this;
    let { bigNum1 } = this;
    const { lastBigPos } = this;
    const { lastBigPos0 } = this;
    const { lastBigPos1 } = this;
    const { bigEyeNum0 } = this;
    const { bigEyeNum1 } = this;
    const { smallNum0 } = this;
    const { smallNum1 } = this;
    const { yueyouNum0 } = this;
    const { yueyouNum1 } = this;
    let { bigFlag } = this;
    const { isBigEyeInit } = this;
    const { isSmallInit } = this;
    const { isYueyouInit } = this;

    // alert("bigData.length: " + bigData.length);
    // 大路=======================================================================
    if (bigData.length == 0 && status == '3') {
      // 大路第一个和记录并不加步数
      var column;
      if (lastBig == 0) {
        column = new Item();
        bigData.push(column);
      } else {
        column = bigData[0];
      }
      column.tieSize[0] = 1; // alert("column.tieSize[0]:"+column.tieSize[0]);
    } else if (status == '3') {
      // alert("lastBigPos[0]:" + lastBigPos[0]);              //todo:和
      // 和操作,在前一个元素基础上加和
      const column = bigData[lastBigPos[0]];
      if (typeof column !== 'undefined') {
        column.tieSize[lastBigPos[1]] = column.tieSize[lastBigPos[1]] + 1;
      }
    } else if (lastBig == status) {
      // todo:上一个花色是和的话
      // 庄闲操作,同色
      const column = bigData[bigNum0]; // todo:bigNum0列
      column.size += 1;
      // alert("column.color[bigNum1]: " + column.color[bigNum1]);
      if (column.color[bigNum1] == '0') {
        // 当前位置为空，填充该位置。
        column.position[bigNum1] = p;
        column.color[bigNum1] = status;
        lastBigPos[0] = bigNum0;
        lastBigPos[1] = bigNum1;
        // 达到该列最大行号后不再增加行号。
        if (bigNum1 != column.maxLine - 1) {
          bigNum1 += 1;
        }
      } else if (column.size > column.maxLine) {
        // 当前位置不为空，并且已达到最后一行。
        let column1;
        if (bigNum0 + column.size - column.maxLine > bigData.length - 1) {
          // 当前列的下一列超过最大列数,新建一列
          column1 = new Item();
          column1.maxLine = bigNum1;
          bigData.push(column1);
        } else {
          column1 = bigData[bigNum0 + column.size - column.maxLine];
          if (typeof column1 === 'undefined') {
            column1 = new Item();
            bigData.push(column1);
            column1.maxLine = bigNum1 - 1;
          }
        }
        if (bigFlag) {
          column1.position[0] = p;
          column1.color[0] = status;
          lastBigPos[0] = bigNum0 + column.size - column.maxLine;
          lastBigPos[1] = 0;
        } else {
          column1.maxLine = bigNum1;
          column1.position[bigNum1] = p;
          column1.color[bigNum1] = status;
          lastBigPos[0] = bigNum0 + column.size - column.maxLine;
          lastBigPos[1] = bigNum1;
        }
      } else {
        // 当前位置不为空，并且未达到最后一行。获取下一列填充当前行的前一行
        const columnNew = bigData[bigNum0 + 1];
        // alert("bigNum0:"+bigNum0);
        columnNew.maxLine = bigNum1 - 1;
        columnNew.position[bigNum1 - 1] = p;
        columnNew.color[bigNum1 - 1] = status;
        lastBigPos[0] = bigNum0;
        lastBigPos[1] = bigNum1 - 1;
      }
      lastBig = status;
      // 记录大路位置
      item.position[0] = lastBigPos[1];
    } else {
      // 庄闲操作,不同色
      var column;
      if (lastBig != 0) {
        // 初始化不增加列数
        bigNum0 += 1;
      }
      if (lastBig == 0 || bigNum0 > bigData.length - 1) {
        // 初始化，或当前已经是最后一列了创建新列
        column = new Item();
        bigData.push(column);
      }
      column = bigData[bigNum0];
      column.position[0] = p; // todo:什么意思
      column.color[0] = status;
      lastBigPos[0] = bigNum0;
      lastBigPos[1] = 0;
      bigNum1 = 1;
      column.size += 1;
      lastBig = status;
      if (column.maxLine == 1) {
        bigFlag = true;
      } else {
        bigFlag = false;
      }
      // 记录大路位置
      item.position[0] = lastBigPos[1];
    }
    if (status == '3') {
      // 除了大路以外，其他路不处理和的情况
      return;
    }

    this.bigData = bigData;
    this.bigEyeData = bigEyeData;
    this.lastBig = lastBig;
    this.lastBigEye = lastBigEye;
    this.lastSmall = lastSmall;
    this.lastYueyou = lastYueyou;
    this.bigNum0 = bigNum0;
    this.bigNum1 = bigNum1;
    this.lastBigPos0 = lastBigPos0;
    this.lastBigPos1 = lastBigPos1;
    this.bigEyeNum0 = bigEyeNum0;
    this.bigEyeNum1 = bigEyeNum1;
    this.smallNum0 = smallNum0;
    this.smallNum1 = smallNum1;
    this.yueyouNum0 = yueyouNum0;
    this.yueyouNum1 = yueyouNum1;
    this.bigFlag = bigFlag;
    this.isBigEyeInit = isBigEyeInit;
    this.isSmallInit = isSmallInit;
    this.isYueyouInit = isYueyouInit;
  }
};

/**
   * RoadMap initializer
   *
   * @param {Object} settings  Settings for RoadMap
   * @param {function} callback  callback function
   */
RoadMap.prototype.init = function (settings, callback) {
  if (!this.supportsCanvas) {
    alert('对不起，当前浏览器不支持Canvas，无法使用本控件！');
    return;
  }
  const _this = this;
  _forEach(arguments, (item) => {
    if (typeof item === 'object') {
      for (const k in item) {
        if (k === 'callback' && typeof item[k] === 'function') {
          _this.opt.callback = item[k].bind(_this);
        } else {
          k in _this.opt && (_this.opt[k] = item[k]);
        }
      }
    } else if (typeof item === 'function') {
      _this.opt.callback = item.bind(_this);
    }
  });
  _this.opt.cellSize *= _this.opt.zoom;
  _this.opt.strokeWidth *= _this.opt.zoom;
  _this.opt.lineWidth *= _this.opt.zoom;
  _this.opt.beadColumn = Math.floor(
    _this.opt.canvasWidth / (_this.opt.cellSize + _this.opt.lineWidth) * _this.opt.zoom,
  );
  _this.canvas = _this.opt.canvas;
};

// /**
//  * To generate an instance of object
//  *
//  * @param {Object} settings  Settings for RoadMap
//  * @param {function} callback  callback function
//  */
// RoadMap.case = function(settings, callback) {
//   return new RoadMap(settings, callback);
// };

// if (typeof module !== "undefined" && module.exports) {
//   module.exports = RoadMap.case;
//   module.exports.RoadMap = RoadMap;
// } else {
//   window.RoadMap = RoadMap;
// }

export default (settings, callback) => new RoadMap(settings, callback);
