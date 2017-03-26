如果你对版本更新介绍以及实现没有兴趣，你也可以直接查看 [使用指南](https://github.com/hwaphon/HTML5MusicPlayer/blob/gh-pages/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.md)

---

### 2.1 版本 - 2017 03.26

![image](https://github.com/hwaphon/HTML5MusicPlayer/blob/gh-pages/2.1.png)

这个版本较与上一版本有两个小改动，一是增添了随机播放和顺序播放的功能，二是对正在播放的音乐背景加深显示而且具有 `scrollView` 功能。

先来介绍第一个功能： 其实现起来非常简单，就是利用一个 `div` 容器包含两个 `img` 标签，将 `div` 的 `position` 设置为 `relative`， 将 `img` 的 `position` 设置为 `absolute`，这样两张图片（一个是循环播放的图标，一个是随机播放的图标）就会重叠在一起，然后设置一个 `hidden` 类，用于将指定标签的 `visibility` 设置为 `hidden`，注意这里并没有设置 `display` 为 `none`。既然讲到了这里，就来提一下 `display:none` 和 `visibility: hidden` 的 区别：

  1. 如果设置了 `display: none`，那么元素就不再占用文档中的空间，看上去就好象这个元素并不存在（其实就是不存在了），这样的话，文档中的其它元素就会挤上来占用该元素本该占有的位置。

  2. 如果设置了 `visibility: hidden`，那么该元素只是看上去不存在，其实它还在文档中占有一席之地，意思就是它还处在它应该在的位置，只是看不到了而已。

  3. 看上去使用二者好像没多大区别，其实是有的，使用 `visibility: hidden - visibility: visible` 的时候元素是一个从不可见到可见的过程，这也就意味着我们可以在这个过程中添加一些动画效果，而对于 `display: none - display: *` 的过程是将一个元素添加到文档中，是个突变的过程，所以我们无法在这个过程中使用动画效果。

网上一些文章说，当设置了 `visibility: hideen` 后，该元素是不可见的，但是可以触摸的到。说实话，我不是很明白这个触摸的到是什么意思！它能触发 `click` 事件？我在 `Firefox, Opera, Chrome` 中对此做了测试，事实是当设置了 `visibility: hidden` 后，它不能再触发 `click` 事件。

再来看看第二个功能： 一般我们用 `js` 改变样式的话，都是通过添加或者移除 `class` 来实现的，在这里也不例外，首先我设置了一个 `selected` 的 `class` 样式，以备添加。我们知道音乐的添加顺序决定了其在 `DOM` 中显示的顺序，所以我们完全可以在 `MusicQueue` 中添加一个 `getIndexByName()` 方法，这样就可以直接将 `li` 标签的位置计算出来，还有一点就是要设置一个 `DOM` 缓存列表，因为我们每次都是打开浏览器添加音乐，所以完全可以在将音乐添加到 `DOM` 之前，首先将创建的 `DOM` 元素缓存在一个列表内，目的就是减少对 `DOM` 的请求次数。好了，既然有了 `index`，又有了已经缓存下来的 `DOM`，就可以为其添加样式了，其核心代码如下。

	function setSelected(index) {
		liElementsCache[index].classList.add("selected");
		liElementsCache[index].scrollIntoView();
	}

	function removeSelected(index) {
		liElementsCache[index].classList.remove("selected");
	}
 
 `scrollIntoView()` 是 `HTML5` 新增加的一个方法，可以在所有的 `HTML` 元素上调用，通过滚动浏览器窗口或者其他容器元素，将调用的元素出现在视口中，如果给这个方法传入 `true` 参数，或者可以不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 `false`，那么调用元素会尽可能全部出现在视口中，不过顶部不一定平齐。这个方法的兼容性还不错，除了 `Opera Mini` 不支持，其他浏览器几乎都能用。
 
 值得一提的是 `::selection` 伪元素，用于设置选中元素的属性，由于我们设置了双击列表项播放列表歌曲，所以我们需要利用该元素设置选中元素的背景颜色为透明，不然会很难看。在 [can i use](http://caniuse.com/#search=selection) 可以看到该元素的支持率已经达到了 75%，不过值得注意的是在 `Firefox` 中使用该元素需要添加前缀。我的代码如下所示：
 
     ::selection {
         background-color: transparent;
     }

     ::-moz-selection {
        background-color: transparent;
     }

 
### 2.0 版本 - 2017.03 

![image](https://github.com/hwaphon/HTML5MusicPlayer/blob/gh-pages/2.0.png)

此版本的播放器新增功能如下：

1. 支持音乐队列
2. 支持同时上传多个音乐文件，对于非音乐文件会自动过滤
3. 支持快进功能
4. 支持前一首和下一首功能
5. 界面优化

如果想自定义 `webkit` 浏览器的 `progressbar` 样式 ，可以通过 `progress::-webkit-progress-value { }` 定义已经完成进度的样式，可以通过 `progress::-webkit-progress-bar { }` 定义全部进度的样式。

如果想定义 `Firefox` 浏览器的 `progressbar` 样式，可以通过 `progress::-moz-progress-bar` 定义已完成进度的样式，而其他样式可以直接在 `progress` 中定义，而且值得一提的是，`Firefox` 浏览器支持为 `progress` 设置圆角，而这是其他浏览器不支持的。

可以为除 `Firefox` 以外的浏览器设置 `scrollbar` 的样式，通过 `::-webkit-scrollbar` 设置滚动路径的样式，通过 `::-webkit-scrollbar-thumb` 设置滚动滑块的样式。

如果你想利用比较炫酷的渐变颜色，可以去 [webgradients](https://webgradients.com/)。

关于音乐文件播放时长的获取，由于音乐加载也需要一定的时间，所以千万不要在调用 `player.play()` 方法后就直接获取音乐时长，因为这个时候你很可能获取失败，并返回一个 `NaN`,我就碰到了这个问题，我选择的解决方案是，在 `player.play()` 之后设置一个 `setTimeout`，并提供一个回调函数去获取播放时长，我选择的定时时间是 500ms，我利用这个方案后，就再也没出现获取失败的问题。

仍然存在的问题:

1. 为了不每次打开浏览器的时候都上传音乐，我尝试将获取到的音乐信息利用 `localStorage` 保存下来，不过再打开浏览器的时候，浏览器提示已经没有权限播放音乐，因为浏览器本没有权限播放本地文件，我们也是勉强通过 `URL.createObjectURL()` 让音乐可以播放，我猜测这是动态赋予权限，当浏览器关闭，那个权限就被收回了，所以本音乐播放器还需要其他持久化技术。

2. 经过测试，发现上传的 `mp3` 格式文件无法在 `Opera` 中播放，而 `ogg` 是可以的。当然这我们也无能为力，毕竟各浏览器支持的格式本就不是我们能够左右的。

本音乐播放器将会持续更新完善，可能在不久的将来会添加的功能 ：

1. 随机播放和顺序播放
2. 支持删除音乐
3. 界面优化

---
### 1.0 版本 - 2016.12

![image](https://github.com/hwaphon/HTML5MusicPlayer/blob/gh-pages/1.0.gif)

这是音乐播放器的初始版本，当时此播放器支持以下功能：

1. 支持从本地上传音乐播放
2. 支持直接拖拽音乐到界面直接播放
3. 支持调节音乐的音量

可见，这个版本的播放器还不能称之为音乐播放器，因为它不支持音乐队列，所以它无法完成上一首和下一首的功能，而且最致命的是它不支持快进功能。不过此版本还是有一个不错的特性，就是可以通过鼠标拖拽本地音乐文件直接播放。

要播放本地文件，我们需要利用 `URL.createObjectURL(file)` 对文件地址进行转换，否则浏览器无权播放本地文件。

更多关于这个版本的解释，你可以在 [我的博客](http://hwaphon.site/?p=280) 中看到。
