
window._kd = (function () {
    // 方法集容器
    var Utils = {

    }

    /**
     * rem 适配
     */
    Utils.remAdjust = function () {
        var Width = window.screen.width
        var Height = window.screen.height
        var scaleRatio = Width / 375 // 以iphone6 为基准
        if( scaleRatio > 1.36 ) {
          scaleRatio = 1.36
        }
        // iphone6 font-size 为 100
        document.querySelector('html').style.fontSize = 100 * scaleRatio + 'px'
    }

    /**
     * 设置ios微信页面title
     * @param {string} title 要设置的title
     */
    Utils.setWxTitle = function (title) {
        document.title = title
        if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
            var i = document.createElement('iframe')
            i.src = '/favicon.ico'
            i.style.display = 'none'
            i.onload = function() {
                setTimeout(function(){
                    i.remove()
                }, 9)
            }
            document.body.appendChild(i)
        }
    }

    /**
    *  将长数组拆分为几个短数组
    *  @param {Array} rawArr 要拆分的长数组
    *  @param {Number} several  拆分成几个小数组
    *  @return {Array} shortArrs 二维数组，每一项为拆分后的小数组
    **/
    Utils.arrLong2Short = function (rawArr, several) {
        var shortArrs = []
        var times = Math.ceil(rawArr.length / several)

        for (var i = 0; i < times; i++) {
            var tmpArr = []
            for(var j = i * several; j < i * several + several; j ++) {
                if(!rawArr[j]) {
                    break
                }
                tmpArr.push(rawArr[j])
            }
            shortArrs.push(tmpArr)
            tmpArr = []
        }
        return shortArrs
    }

    /**
     * 时间格式化
     * @param  {number} timestamp
     * @param  {string} type
     * @return {string}
     */
    Utils.timeFormat = function(timestamp, type) {
        var d = new Date(timestamp)
        switch (type) {
            case 'yyyy-mm-dd hh:mm:ss':
                return d.getFullYear() + '-' + this.leadingZero(d.getMonth() + 1, 2) + '-' + this.leadingZero(d.getDate(), 2) + ' ' + d.toTimeString().match(/^\d+:\d+:\d+/)[0]
            case 'yyyy-mm-dd hh:mm':
                return d.getFullYear() + '-' + this.leadingZero(d.getMonth() + 1, 2) + '-' + this.leadingZero(d.getDate(), 2) + ' ' + d.toTimeString().match(/^\d+:\d+/)[0]
            case 'yyyy-mm-dd':
                return d.getFullYear() + '-' + this.leadingZero(d.getMonth() + 1, 2) + '-' + this.leadingZero(d.getDate(), 2)
            case 'hh:mm:ss':
                return d.toTimeString().match(/^\d+:\d+:\d+/)[0]
            case 'hh:mm':
                return d.toTimeString().match(/^\d+:\d+/)[0]
            default:
                return timestamp
        }
    }

    /**
     * 添加前导0
     * @param {String} string  需要操作的字符串
     * @param {Number} howlong 补0后变为多长，决定补几个0
     */
    Utils.leadingZero = function(staff, howlong) {
        var str = (typeof staff == 'string') ? staff : staff.toString(),
            zeroNum = parseInt(howlong) - staff.length
        if(str.length < howlong) {
            for(var i = 0; i < zeroNum; i ++) {
                str = '0' + str
            }
            return str
        }

        return str
    }

    /**
     * 把cookie字符串解析成json对象
     * @return {Object} cookieObj cookie字符串解析后的json对象
     */
    Utils.parseCookie = function () {
        if(document.cookie == '') {
            return console.warn('there is no cookie')
        }
        var cookieObj = {}
        var tempArr = document.cookie.split(';')
        tempArr.forEach(function (item, index) {
            var temArr = item.split('=')
            cookieObj[temArr[0].trim()] = temArr[1].trim()
        })
        return cookieObj
    }


    /**
     * 解析url上的query字符串
     * @return {Object} queryObj
     */
    Utils.parseQueryString = function () {
      var queryObj = {},
          query = location.search
      var arr = query.substr(query.indexOf('?') + 1).split('&')
      arr.forEach(function(item) {
        var temp = item.split('=')
        queryObj[temp[0]] = temp[1]
      })
      return queryObj
    }


    /**
     * 生日转星座
     * @param  {String} birthString 生日，格式 2016-11-14
     * @return {String}
     */
    Utils.birthToConstellation = function (birthString) {
      var birthday = new Date(birthString),
          month = birthday.getMonth(),
          day = birthday.getDate()

      if(!month) {
          console.warn('need month and day')
          return 'wrong'
      }

      var str = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯"
      var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23 ,23, 22, 22]
      return str.substr( month * 2 - ( day < arr[month] ? 2 : 0 ), 2 ) + '座'
    }


    /**
     * json对象转成form格式的数据
     * @param  {Object} json json 对象，如{'name': 'eason', 'sex': 'male'}
     * @param  {Boolean} query 返回值是否带上前缀'？'号  true or false
     * @return {String} formString 返回的form字符串 如 name=eason&sex=male
     */
    Utils.jsonToFormString = function (json, query) {
      var formString = ''
      for(var item in json) {
        var tmp = item + "=" + json[item] + '&'
        formString += tmp
      }
      return query ? '?' + formString : formString
    }

    /**
     * 传入的时间是多久之前
     * @param {Number} paramTimestamp
     * @return {String}
     */
    Utils.timeline = function (paramTimestamp) {
        if (!paramTimestamp) {
            return console.warn('ERROR: filters.timeline');
        }

        // 一分钟、一小时、一天的毫秒数
        var minuteMillisecond = 60 * 1000,
            hourMillisecond = 60 * minuteMillisecond,
            dayMillisecond = 24 * hourMillisecond;

        var curDate = new Date(),
            curDateTimestamp = curDate.getTime(),
            timeInterval = curDateTimestamp - paramTimestamp;

        var howManyDays = parseInt(timeInterval / dayMillisecond);
        if (howManyDays != 0) {
            if (howManyDays == 1) {
                return '昨天';
            }
            if (howManyDays >= 7) {
                return this._timeFormat(timestamp);
            }
            return howManyDays + '\u5929\u524D';
        }

        var howManyHours = parseInt(timeInterval / hourMillisecond);
        if (howManyHours != 0) {
            if (parseInt(curDate.getHours()) - howManyHours < 0) {
                return '昨天';
            }
            return howManyHours + '\u5C0F\u65F6\u524D';
        }

        var howManyMinutes = parseInt(timeInterval / minuteMillisecond);
        if (howManyMinutes != 0) {
            return howManyMinutes + '\u5206\u949F\u524D';
        }

        // 不到一分钟
        if (howManyMinutes == 0) {
            return '刚刚';
        }
    };


    /**
     * 生成随机字符串
     * @param  {Number} n 随机数位数
     * @param  {String} type 随机字符串类型
     * @return {Number} string 随机字符串
     */
    Utils.randomStr = function (n, type) {
      var string = ''

      var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          lowerCase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "z", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
          upperCase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "Z", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
          store = []

      switch (type) {
          case 'number':
              store = store.concat(numbers)
              break;
          case 'char':
              store = store.concat(lowerCase, upperCase)
              break;
          default:
              store = store.concat(numbers, lowerCase, upperCase)
      }

      for(var i = 0; i < n; i ++) {
        string += store[ Math.floor(Math.random() * store.length) ]
      }
      return string
    }

    /**
     * 微信jssdk配置信息注入
     * @param  {String} url 获取配置的url
     * @param  {Array} jsApiList 用到的api list
     */
    Utils.insertWxConfig = function (url, jsApiList) {
        this.mAjax({
            url: url,
            method: 'POST',
            data: {
                url: encodeURIComponent( location.href.split('#')[0] )
            },
            success: function (res) {
                wx.config({
                    debug: false,
                    appId: res.appId,
                    timestamp: res.timestamp,
                    nonceStr: res.nonceStr,
                    signature: res.signature,
                    jsApiList: jsApiList
                })
            }
        })
    }

    Utils.encrypt = function () {
        var param = this.parseQueryString().param

        var decodedParam = decodeURIComponent( param )
        return JSON.parse( decodedParam )
    }

    // 私有函数
    /**
     * ajax 封装
     * @param  {Object} opts ajax配置项
     */
    Utils.mAjax = function (opts) {
      var xhr = new XMLHttpRequest()
      if(opts.timeout) {
        setTimeout(function () {
            xhr.abort()
        }, opts.timeout)
      }
      if(opts.abortCallback) {
          xhr.onabort = opts.abortCallback
      }
      xhr.onreadystatechange = function () {
        if(xhr.readyState != 4) {
          return
        }
        if(xhr.status != 200) {
          opts.failed ? opts.failed(xhr.responseText) : console.log('the ajax has failed, but no a handle function')
          return
        }

        var resText = xhr.responseText,
            response = ''

        // 匹配是否为JSON字符串
        if(/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(resText)) {
            response = JSON.parse(resText)
        }else {
            response = resText
        }
        opts.success(response)
      }

      if(opts.async == undefined) {
          opts.async = true
      }

      if(opts.method.toUpperCase() === 'GET') {
        xhr.open(opts.method, opts.url + this.jsonToFormString(opts.data, true), opts.async)
        xhr.send()
      }

      if(opts.method.toUpperCase() === 'POST') {
        xhr.open(opts.method, opts.url, opts.async)
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;")
        xhr.send(this.jsonToFormString(opts.data))
      }

      return xhr
    }

  return Utils
})()
